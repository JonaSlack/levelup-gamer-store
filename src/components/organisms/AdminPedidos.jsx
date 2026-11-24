import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Form, Spinner, Table } from 'react-bootstrap';
import { pedidosApi } from '../../services/api';
import { useCatalogo } from '../../context/CatalogoContext';
import { dinero, fechaCorta, COLOR_ESTADO } from '../../utils/format';
import { registrarEvento } from '../../utils/logger';

const ESTADOS = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState('');
  const { recargar } = useCatalogo();

  const cargar = useCallback(() => {
    pedidosApi
      .todos()
      .then(setPedidos)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function cambiarEstado(pedido, estado) {
    registrarEvento('ui', `Cambiar estado del pedido #${pedido.id} a ${estado}`);
    setError('');
    try {
      const actualizado = await pedidosApi.cambiarEstado(pedido.id, estado);
      setPedidos((lista) => lista.map((p) => (p.id === actualizado.id ? actualizado : p)));
      if (estado === 'CANCELADO') recargar();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!pedidos && !error) {
    return (
      <p role="status">
        <Spinner animation="border" size="sm" /> Cargando pedidos…
      </p>
    );
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {pedidos && pedidos.length === 0 && <p className="ayuda">Todavía no hay pedidos.</p>}
      {pedidos && pedidos.length > 0 && (
        <div className="table-responsive">
          <Table variant="dark" hover className="tabla-carrito align-middle">
            <thead>
              <tr>
                <th>N°</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.cliente}</td>
                  <td>{fechaCorta(p.fecha)}</td>
                  <td>{p.items.map((i) => `${i.titulo} × ${i.cantidad}`).join(', ')}</td>
                  <td>{dinero(p.total)}</td>
                  <td>
                    {p.estado === 'CANCELADO' ? (
                      <Badge bg={COLOR_ESTADO[p.estado]}>{p.estado}</Badge>
                    ) : (
                      <Form.Select
                        size="sm"
                        aria-label={`Estado del pedido ${p.id}`}
                        value={p.estado}
                        onChange={(e) => cambiarEstado(p, e.target.value)}
                      >
                        {ESTADOS.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
