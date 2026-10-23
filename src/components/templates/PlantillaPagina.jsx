import { Container, Row, Col } from 'react-bootstrap';
import PaginaHero from '../organisms/PaginaHero';

export default function PlantillaPagina({ titulo, descripcion, migas, angosto = false, children }) {
  return (
    <>
      <PaginaHero titulo={titulo} descripcion={descripcion} migas={migas} />
      <section className="seccion">
        <Container>
          {angosto ? (
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={7}>
                {children}
              </Col>
            </Row>
          ) : (
            children
          )}
        </Container>
      </section>
    </>
  );
}
