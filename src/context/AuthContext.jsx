import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, borrarSesion, guardarSesion, leerSesion, EVENTO_SESION } from '../services/api';
import { registrarEvento } from '../utils/logger';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);
  const [verificando, setVerificando] = useState(() => Boolean(leerSesion()));

  useEffect(() => {
    const actualizar = (evento) => setSesion(evento.detail);
    window.addEventListener(EVENTO_SESION, actualizar);
    return () => window.removeEventListener(EVENTO_SESION, actualizar);
  }, []);

  // al recargar la página se valida que el token guardado siga sirviendo
  useEffect(() => {
    if (!leerSesion()) return undefined;
    let vigente = true;
    registrarEvento('sesion', 'Sesión encontrada en sessionStorage: validando con /api/auth/me');
    authApi
      .perfil()
      .then((usuario) => {
        if (!vigente) return;
        const actual = leerSesion();
        if (actual) guardarSesion({ ...actual, usuario });
        registrarEvento('sesion', `Sesión restaurada: ${usuario.username} (${usuario.rol})`);
      })
      .catch((error) => {
        if (!vigente) return;
        if (error.status === 401 || error.status === 403) {
          registrarEvento('sesion', 'La sesión guardada ya no es válida, se eliminó');
          borrarSesion();
        }
      })
      .finally(() => {
        if (vigente) setVerificando(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

  async function iniciarSesion(usuario, password) {
    const respuesta = await authApi.login(usuario, password);
    guardarSesion(respuesta);
    registrarEvento('sesion', `Sesión iniciada: ${respuesta.usuario.username} (${respuesta.usuario.rol})`, 'tokens guardados en sessionStorage');
    return respuesta.usuario;
  }

  async function registrar(datos) {
    const respuesta = await authApi.registrar(datos);
    guardarSesion(respuesta);
    registrarEvento('sesion', `Cuenta creada e iniciada: ${respuesta.usuario.username}`);
    return respuesta.usuario;
  }

  function cerrarSesion() {
    const actual = leerSesion();
    registrarEvento('sesion', `Sesión cerrada: ${actual?.usuario?.username ?? ''}`);
    borrarSesion();
    if (actual) authApi.logout(actual.refreshToken).catch(() => {});
  }

  const perfil = sesion?.usuario ?? null;
  const valor = {
    perfil,
    usuario: perfil?.username ?? '',
    rol: perfil?.rol ?? null,
    autenticado: Boolean(perfil),
    esAdmin: perfil?.rol === 'ADMIN',
    verificando,
    iniciarSesion,
    registrar,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const valor = useContext(AuthContext);
  if (!valor) throw new Error('useAuth requiere AuthProvider');
  return valor;
}
