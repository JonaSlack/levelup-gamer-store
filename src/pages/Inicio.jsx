import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCatalogo } from '../context/CatalogoContext';
import HeroInicio from '../components/organisms/HeroInicio';
import ListaProductos from '../components/organisms/ListaProductos';
import TarjetaBeneficio from '../components/molecules/TarjetaBeneficio';
import Boton from '../components/atoms/Boton';

const BENEFICIOS = [
  ['🚚', 'Envío rápido', 'Despacho y opciones digitales según el producto.'],
  ['🛡️', 'Compra informada', 'Consulta títulos, precios y detalles fácilmente.'],
  ['🎧', 'Soporte gamer', 'Estamos para ayudarte a elegir un juego.'],
  ['🎮', 'Multiplataforma', 'Encuentra juegos para PS5 y PC.'],
];

export default function Inicio() {
  const { productos: juegos } = useCatalogo();
  const destacados = juegos.filter((juego) => juego.destacado);

  return (
    <>
      <HeroInicio totalJuegos={juegos.length} />

      <section className="seccion">
        <Container>
          <div className="seccion-titulo">
            <h2>¿Por qué comprar en LevelUp Store?</h2>
          </div>
          <Row xs={1} sm={2} lg={4} className="g-4">
            {BENEFICIOS.map(([icono, titulo, texto]) => (
              <Col key={titulo}>
                <TarjetaBeneficio icono={icono} titulo={titulo} texto={texto} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="seccion franja-alterna">
        <Container>
          <div className="seccion-titulo">
            <h2>Juegos destacados</h2>
            <Link to="/catalogo">Ver catálogo completo →</Link>
          </div>
          <ListaProductos productos={destacados} />
        </Container>
      </section>

      <section className="seccion cta text-center">
        <Container>
          <h2>Únete a la comunidad LevelUp</h2>
          <p className="subtitulo mx-auto">Crea tu cuenta y descubre juegos para PS5 y PC.</p>
          <Boton to="/registro" registro="CTA: Crear mi cuenta">
            Crear mi cuenta
          </Boton>
        </Container>
      </section>
    </>
  );
}
