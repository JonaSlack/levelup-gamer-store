import { Navigate, useLocation } from 'react-router-dom';
import { useTienda } from '../context/TiendaContext';
import { registrarEvento } from '../utils/logger';

export default function ProtectedRoute({ children }) {
  const { usuario } = useTienda();
  const ubicacion = useLocation();

  if (usuario) return children;

  registrarEvento('sesion', `Ruta protegida ${ubicacion.pathname}: sin sesión, redirigiendo a /login`);
  return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
}
