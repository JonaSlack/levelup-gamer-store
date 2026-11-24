import { Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import AdminProductos from '../components/organisms/AdminProductos';
import AdminPedidos from '../components/organisms/AdminPedidos';
import AdminUsuarios from '../components/organisms/AdminUsuarios';

export default function Admin() {
  const { perfil } = useAuth();

  return (
    <PlantillaPagina titulo="Panel de administración" descripcion={`Sesión de ${perfil?.nombre ?? ''} · rol ADMIN`}>
      <Tabs
        defaultActiveKey="productos"
        className="mb-4"
        mountOnEnter
        onSelect={(clave) => registrarEvento('ui', `Panel admin → pestaña ${clave}`)}
      >
        <Tab eventKey="productos" title="Productos">
          <AdminProductos />
        </Tab>
        <Tab eventKey="pedidos" title="Pedidos">
          <AdminPedidos />
        </Tab>
        <Tab eventKey="usuarios" title="Usuarios">
          <AdminUsuarios />
        </Tab>
      </Tabs>
    </PlantillaPagina>
  );
}
