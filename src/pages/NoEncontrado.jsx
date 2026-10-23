import { Container } from 'react-bootstrap';
import Boton from '../components/atoms/Boton';

export default function NoEncontrado() {
  return (
    <section className="seccion">
      <Container>
        <h1>Página no encontrada</h1>
        <p>Comprueba la dirección o vuelve al inicio.</p>
        <Boton to="/" registro="Volver al inicio (404)">
          Volver al inicio
        </Boton>
      </Container>
    </section>
  );
}
