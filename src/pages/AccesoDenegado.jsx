import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Boton from '../components/atoms/Boton';

export default function AccesoDenegado() {
  const ubicacion = useLocation();
  return (
    <section className="seccion">
      <Container className="exito-panel text-center">
        <h1>⛔ Acceso denegado</h1>
        <p>
          Tu cuenta no tiene permisos para entrar a <strong>{ubicacion.state?.desde ?? 'esta sección'}</strong>.
        </p>
        <Boton to="/" registro="Volver al inicio (403)">
          Volver al inicio
        </Boton>
      </Container>
    </section>
  );
}
