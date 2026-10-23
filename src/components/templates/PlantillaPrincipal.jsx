import { Outlet } from 'react-router-dom';
import NavbarSuperior from '../organisms/NavbarSuperior';
import Footer from '../organisms/Footer';
import AvisoTienda from '../organisms/AvisoTienda';
import { useRegistroNavegacion } from '../../hooks/useRegistroNavegacion';

export default function PlantillaPrincipal() {
  useRegistroNavegacion();

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <NavbarSuperior />
      <main id="contenido" className="main-app">
        <Outlet />
      </main>
      <Footer />
      <AvisoTienda />
    </>
  );
}
