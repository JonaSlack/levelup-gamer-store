import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TiendaProvider } from './context/TiendaContext';
import PlantillaPrincipal from './components/templates/PlantillaPrincipal';
import ProtectedRoute from './routes/ProtectedRoute';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Ofertas from './pages/Ofertas';
import DetalleProducto from './pages/DetalleProducto';
import CarritoPage from './pages/CarritoPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Contacto from './pages/Contacto';
import Asistente from './pages/Asistente';
import MisPedidos from './pages/MisPedidos';
import Admin from './pages/Admin';
import AccesoDenegado from './pages/AccesoDenegado';
import NoEncontrado from './pages/NoEncontrado';

export function RutasApp() {
  return (
    <Routes>
      <Route element={<PlantillaPrincipal />}>
        <Route index element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="productos" element={<Catalogo />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="producto/:id" element={<DetalleProducto />} />
        <Route path="productos/:id" element={<DetalleProducto />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute roles={['CLIENTE', 'ADMIN']}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="mis-pedidos"
          element={
            <ProtectedRoute>
              <MisPedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="acceso-denegado" element={<AccesoDenegado />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="asistente" element={<Asistente />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}

// necesario para GitHub Pages (/nombre-repo/)
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <TiendaProvider>
        <RutasApp />
      </TiendaProvider>
    </BrowserRouter>
  );
}
