import { useState } from 'react';
import { Container, Nav, Navbar, Badge } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../atoms/Logo';
import Boton from '../atoms/Boton';
import { useTienda } from '../../context/TiendaContext';
import { useAuth } from '../../context/AuthContext';
import { registrarEvento } from '../../utils/logger';

const ENLACES = [
  ['/', 'Inicio'],
  ['/catalogo', 'Catálogo'],
  ['/ofertas', 'Ofertas'],
  ['/carrito', 'Carrito'],
  ['/contacto', 'Contacto'],
  ['/asistente', '🤖 Asistente IA'],
];

export default function NavbarSuperior() {
  const { unidades } = useTienda();
  const { usuario, autenticado, esAdmin, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const navegar = useNavigate();

  const enlaces = [...ENLACES];
  if (autenticado) enlaces.push(['/mis-pedidos', 'Mis pedidos']);
  if (esAdmin) enlaces.push(['/admin', '⚙️ Admin']);

  function alternarMenu(valor) {
    registrarEvento('ui', valor ? 'Abrir menú ☰' : 'Cerrar menú ☰');
    setAbierto(valor);
  }

  function clicEnlace(ruta, nombre) {
    registrarEvento('navegacion', `Menú → ${nombre}`, { ruta });
    setAbierto(false);
  }

  function salir() {
    cerrarSesion();
    setAbierto(false);
    navegar('/login');
  }

  return (
    <Navbar expand="lg" sticky="top" expanded={abierto} onToggle={alternarMenu} className="site-header" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => clicEnlace('/', 'Logo')}>
          <Logo />
        </Navbar.Brand>

        <Link
          to="/carrito"
          className="carrito-link ms-auto me-3 order-lg-last ms-lg-3 me-lg-0"
          aria-label={`Ver carrito de compras: ${unidades} unidades`}
          onClick={() => clicEnlace('/carrito', 'Ícono carrito')}
        >
          🛒 <Badge bg="danger" pill className="carrito-badge">{unidades}</Badge>
        </Link>

        <Navbar.Toggle aria-controls="menu-principal" label="Abrir menú de navegación" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-lg-center gap-lg-2" aria-label="Menú principal">
            {enlaces.map(([ruta, nombre]) => (
              <Nav.Link key={ruta} as={NavLink} to={ruta} end={ruta === '/'} onClick={() => clicEnlace(ruta, nombre)}>
                {nombre}
              </Nav.Link>
            ))}
            {autenticado ? (
              <Boton variante="secundario" size="sm" className="ms-lg-2 mt-2 mt-lg-0" onClick={salir} registro="Cerrar sesión">
                Salir ({usuario})
              </Boton>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/registro" onClick={() => clicEnlace('/registro', 'Crear cuenta')}>
                  Crear cuenta
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" onClick={() => clicEnlace('/login', 'Iniciar sesión')}>
                  Iniciar sesión
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
