import { Container, Row, Col } from 'react-bootstrap';
import Boton from '../atoms/Boton';
import Insignia from '../atoms/Insignia';

export default function HeroInicio({ totalJuegos }) {
  const datos = [
    ['Juegos disponibles', totalJuegos],
    ['Plataformas', 'PS5 & PC'],
    ['Entrega digital', 'Inmediata*'],
    ['Atención', 'Lun–Sáb'],
  ];

  return (
    <section className="hero">
      <Container>
        <Row className="align-items-center g-5">
          <Col xs={12} lg={7}>
            <Insignia tipo="oferta">🔥 Hasta 30% de descuento esta semana</Insignia>
            <h1>
              Los mejores videojuegos para <span className="acento">PS5</span> y <span className="acento">PC</span>
            </h1>
            <p className="subtitulo">
              Catálogo seleccionado, códigos digitales y despacho a todo Chile. Tu próxima aventura comienza aquí.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
              <Boton to="/catalogo" registro="Hero: Explorar catálogo">
                Explorar catálogo →
              </Boton>
              <Boton variante="secundario" to="/registro" registro="Hero: Crear cuenta gratis">
                Crear cuenta gratis
              </Boton>
            </div>
          </Col>
          <Col xs={12} lg={5}>
            <div className="hero-visual">
              <p className="ayuda">🎮 Esta semana en LevelUp</p>
              <div className="hero-visual-symbol">
                LEVEL<span>UP</span>
              </div>
              <Row as="dl" xs={2} className="stats g-2">
                {datos.map(([titulo, valor]) => (
                  <Col key={titulo}>
                    <dt>{titulo}</dt>
                    <dd>{valor}</dd>
                  </Col>
                ))}
              </Row>
              <div className="d-flex gap-2 mt-3">
                <Boton variante="secundario" to="/catalogo?plataforma=ps5" className="flex-fill" registro="Hero: Juegos PS5">
                  PS5
                </Boton>
                <Boton variante="secundario" to="/catalogo?plataforma=pc" className="flex-fill" registro="Hero: Juegos PC">
                  PC
                </Boton>
                <Boton to="/ofertas" className="flex-fill" registro="Hero: Ver ofertas">
                  Ofertas
                </Boton>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
