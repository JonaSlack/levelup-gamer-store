import { vi } from 'vitest';

export const USUARIOS = {
  goku: { password: '1234', usuario: { id: 2, username: 'goku', nombre: 'Goku', email: 'goku@levelup.cl', rol: 'CLIENTE', activo: true } },
  admin: { password: 'admin123', usuario: { id: 1, username: 'admin', nombre: 'Administrador', email: 'admin@levelup.cl', rol: 'ADMIN', activo: true } },
};

export function respuesta(status, cuerpo) {
  return Promise.resolve(new Response(cuerpo === undefined ? null : JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } }));
}

export function sesionDe(nombre) {
  return { accessToken: `token-${nombre}`, refreshToken: `refresh-${nombre}`, usuario: USUARIOS[nombre].usuario };
}

export function guardarSesionDePrueba(nombre) {
  sessionStorage.setItem('levelup_sesion', JSON.stringify(sesionDe(nombre)));
  sessionStorage.setItem('usuario', nombre);
}

// simula los endpoints de autenticación del backend
export function mockBackend() {
  const fetchMock = vi.fn((url, opciones = {}) => {
    const ruta = String(url);
    if (ruta.endsWith('/auth/login')) {
      const { usuario, password } = JSON.parse(opciones.body);
      const cuenta = USUARIOS[usuario];
      if (!cuenta || cuenta.password !== password) {
        return respuesta(401, { status: 401, mensaje: 'Usuario o contraseña incorrectos' });
      }
      return respuesta(200, { ...sesionDe(usuario), tipo: 'Bearer', expiraEnSegundos: 900 });
    }
    if (ruta.endsWith('/auth/me')) {
      const token = opciones.headers?.Authorization?.replace('Bearer token-', '');
      return USUARIOS[token] ? respuesta(200, USUARIOS[token].usuario) : respuesta(401, { mensaje: 'Token inválido' });
    }
    return respuesta(503, { mensaje: 'Servicio no disponible en la prueba' });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
