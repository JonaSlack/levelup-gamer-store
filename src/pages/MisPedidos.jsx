import { useEffect, useState } from 'react';
import { Alert, Badge, Spinner, Table } from 'react-bootstrap';
import { pedidosApi } from '../services/api';
import { dinero, fechaCorta, COLOR_ESTADO } from '../utils/format';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import Boton from '../components/atoms/Boton';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    pedidosApi
      .mios()
      .then((datos) => {
        if (!vigente) return;
        setPedidos(datos);
        registrarEvento('carrito', `Mis pedidos cargados: ${datos.length}`);
      })
      .catch((err) => vigente && setError(err.message));
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <PlantillaPagina titulo="Mis pedidos" descripcion="Historial de compras de tu cuenta.">
      {error && <Alert variant="danger">{error}</Alert>}
      {!pedidos && !error && (
        <p role="status">
          <Spinner animation="border" size="sm" /> Cargando pedidos…
        </p>
      )}
      {pedidos && pedidos.length === 0 && (
        <div className="sin-resultados">
          <p>Aún no tienes pedidos.</p>
          <Boton to="/catalogo" registro="Ir al catálogo (sin pedidos)">
            Ir al catálogo
          </Boton>
        </div>
      )}
      {pedidos && pedidos.length > 0 && (
        <div className="table-responsive">
          <Table variant="dark" hover className="tabla-carrito">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Envío</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{fechaCorta(p.fecha)}</td>
                  <td>{p.items.map((i) => `${i.titulo} × ${i.cantidad}`).join(', ')}</td>
                  <td>{p.metodoEnvio === 'TIENDA' ? 'Retiro en tienda' : `${p.direccion}, ${p.comuna}`}</td>
                  <td>{dinero(p.total)}</td>
                  <td>
                    <Badge bg={COLOR_ESTADO[p.estado]}>{p.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </PlantillaPagina>
  );
}
