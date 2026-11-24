import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { registrarEvento } from '../utils/logger';

export default function ProtectedRoute({ children, roles }) {
  const { autenticado, rol, verificando } = useAuth();
  const ubicacion = useLocation();

  if (verificando) {
    return (
      <div className="seccion text-center" role="status">
        <Spinner animation="border" size="sm" /> Verificando sesión…
      </div>
    );
  }

  if (!autenticado) {
    registrarEvento('sesion', `Ruta protegida ${ubicacion.pathname}: sin sesión, redirigiendo a /login`);
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (roles && !roles.includes(rol)) {
    registrarEvento('sesion', `Ruta ${ubicacion.pathname} bloqueada para el rol ${rol}`);
    return <Navigate to="/acceso-denegado" replace state={{ desde: ubicacion.pathname }} />;
  }

  return children;
}
