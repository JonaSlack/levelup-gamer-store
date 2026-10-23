import { Container } from 'react-bootstrap';
import Migas from '../molecules/Migas';

export default function PaginaHero({ titulo, descripcion, migas }) {
  const items = migas ?? [{ texto: 'Inicio', to: '/' }, { texto: titulo }];
  return (
    <section className="page-hero">
      <Container>
        <Migas items={items} />
        <h1>{titulo}</h1>
        {descripcion && <p>{descripcion}</p>}
      </Container>
    </section>
  );
}
