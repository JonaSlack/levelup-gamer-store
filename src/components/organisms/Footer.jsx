import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import { registrarEvento } from '../../utils/logger';

const COLUMNAS = [
  { titulo: 'Tienda', enlaces: [['/catalogo', 'Catálogo completo'], ['/ofertas', 'Ofertas'], ['/carrito', 'Mi carrito']] },
  { titulo: 'Mi cuenta', enlaces: [['/registro', 'Crear cuenta'], ['/login', 'Iniciar sesión'], ['/contacto', 'Ayuda y soporte']] },
];

export default function Footer() {
  const registrar = (ruta) => registrarEvento('navegacion', `Footer → ${ruta}`);

  return (
    <footer className="site-footer">
      <Container>
        <Row className="g-4">
          <Col xs={12} sm={6} lg={3}>
            <Link to="/" onClick={() => registrar('/')}>
              <Logo />
            </Link>
            <p className="mt-2">Tu tienda de videojuegos para PS5 y PC. Catálogo original de LevelUp Store migrado a React.</p>
          </Col>
          {COLUMNAS.map((columna) => (
            <Col xs={12} sm={6} lg={3} key={columna.titulo}>
              <h3>{columna.titulo}</h3>
              {columna.enlaces.map(([ruta, texto]) => (
                <Link key={ruta} to={ruta} onClick={() => registrar(ruta)}>
                  {texto}
                </Link>
              ))}
            </Col>
          ))}
          <Col xs={12} sm={6} lg={3}>
            <h3>Contacto</h3>
            <a href="mailto:contacto@levelupstore.cl" onClick={() => registrar('mailto')}>
              contacto@levelupstore.cl
            </a>
            <span>Lunes a sábado · 9:00–20:00</span>
            <Link to="/asistente" onClick={() => registrar('/asistente')}>
              Asistente IA
            </Link>
          </Col>
        </Row>
        <div className="footer-legal">
          © {new Date().getFullYear()} LevelUp Store · Proyecto académico React + Vite · Sin pagos reales
        </div>
      </Container>
    </footer>
  );
}
