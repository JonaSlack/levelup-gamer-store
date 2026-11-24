import { registrarEvento } from '../utils/logger';

export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export const CLAVE_SESION = 'levelup_sesion';
export const EVENTO_SESION = 'levelup:sesion';

export class ApiError extends Error {
  constructor(status, mensaje, campos) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos || {};
  }
}

export function leerSesion() {
  try {
    const dato = JSON.parse(sessionStorage.getItem(CLAVE_SESION) || 'null');
    return dato && dato.accessToken && dato.refreshToken && dato.usuario ? dato : null;
  } catch {
    return null;
  }
}

export function guardarSesion(respuesta) {
  const sesion = {
    accessToken: respuesta.accessToken,
    refreshToken: respuesta.refreshToken,
    usuario: respuesta.usuario,
  };
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  sessionStorage.setItem('usuario', sesion.usuario.username);
  window.dispatchEvent(new CustomEvent(EVENTO_SESION, { detail: sesion }));
  return sesion;
}

export function borrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem('usuario');
  window.dispatchEvent(new CustomEvent(EVENTO_SESION, { detail: null }));
}

let renovacionEnCurso = null;

async function renovarToken() {
  const sesion = leerSesion();
  if (!sesion) return false;
  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      registrarEvento('api', 'Access token vencido: solicitando uno nuevo con el refresh token');
      const respuesta = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: sesion.refreshToken }),
      });
      if (!respuesta.ok) {
        registrarEvento('error', 'No se pudo renovar la sesión, se cerrará');
        borrarSesion();
        return false;
      }
      guardarSesion(await respuesta.json());
      registrarEvento('api', 'Token renovado correctamente');
      return true;
    })().finally(() => {
      renovacionEnCurso = null;
    });
  }
  return renovacionEnCurso;
}

async function leerCuerpo(respuesta) {
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

export async function solicitar(ruta, { metodo = 'GET', cuerpo, conToken = true, reintento = true } = {}) {
  const headers = {};
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';
  const sesion = leerSesion();
  if (conToken && sesion) headers.Authorization = `Bearer ${sesion.accessToken}`;

  registrarEvento('api', `${metodo} ${API_URL}${ruta}`, cuerpo);

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Intenta nuevamente.');
  }

  if (respuesta.status === 401 && conToken && sesion && reintento) {
    const renovado = await renovarToken();
    if (renovado) return solicitar(ruta, { metodo, cuerpo, conToken, reintento: false });
  }

  const datos = await leerCuerpo(respuesta);
  registrarEvento(respuesta.ok ? 'api' : 'error', `Respuesta ${respuesta.status} de ${metodo} ${ruta}`, datos ?? undefined);

  if (!respuesta.ok) {
    const mensaje = (datos && datos.mensaje) || 'Ocurrió un error al comunicarse con el servidor.';
    throw new ApiError(respuesta.status, mensaje, datos && datos.campos);
  }
  return datos;
}

export const authApi = {
  login: (usuario, password) =>
    solicitar('/auth/login', { metodo: 'POST', cuerpo: { usuario, password }, conToken: false }),
  registrar: (datos) => solicitar('/auth/register', { metodo: 'POST', cuerpo: datos, conToken: false }),
  logout: (refreshToken) =>
    solicitar('/auth/logout', { metodo: 'POST', cuerpo: { refreshToken }, conToken: false }),
  perfil: () => solicitar('/auth/me'),
};

export const productosApi = {
  listar: () => solicitar('/productos', { conToken: false }),
  crear: (producto) => solicitar('/productos', { metodo: 'POST', cuerpo: producto }),
  actualizar: (id, producto) => solicitar(`/productos/${id}`, { metodo: 'PUT', cuerpo: producto }),
  eliminar: (id) => solicitar(`/productos/${id}`, { metodo: 'DELETE' }),
};

export const pedidosApi = {
  crear: (pedido) => solicitar('/pedidos', { metodo: 'POST', cuerpo: pedido }),
  mios: () => solicitar('/pedidos/mios'),
  todos: () => solicitar('/pedidos'),
  cambiarEstado: (id, estado) => solicitar(`/pedidos/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado } }),
};

export const usuariosApi = {
  listar: () => solicitar('/usuarios'),
  actualizar: (id, cambios) => solicitar(`/usuarios/${id}`, { metodo: 'PUT', cuerpo: cambios }),
};
