import { useState } from 'react';
import { Alert, Table } from 'react-bootstrap';
import { productosApi } from '../../services/api';
import { useCatalogo } from '../../context/CatalogoContext';
import { dinero, plataformaTexto } from '../../utils/format';
import { registrarEvento } from '../../utils/logger';
import Boton from '../atoms/Boton';
import FormularioProducto from './FormularioProducto';

export default function AdminProductos() {
  const { productos, origen, recargar } = useCatalogo();
  const [editando, setEditando] = useState(undefined);
  const [porEliminar, setPorEliminar] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  async function guardar(datos) {
    if (editando) {
      await productosApi.actualizar(editando.productoId, datos);
      setMensaje({ tipo: 'success', texto: `Producto "${datos.titulo}" actualizado.` });
    } else {
      await productosApi.crear(datos);
      setMensaje({ tipo: 'success', texto: `Producto "${datos.titulo}" creado.` });
    }
    setEditando(undefined);
    await recargar();
  }

  async function eliminar(producto) {
    try {
      await productosApi.eliminar(producto.productoId);
      registrarEvento('catalogo', `Producto eliminado: ${producto.titulo}`);
      setMensaje({ tipo: 'success', texto: `Producto "${producto.titulo}" eliminado.` });
      await recargar();
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: err.message });
    } finally {
      setPorEliminar(null);
    }
  }

  if (origen !== 'api') {
    return <Alert variant="warning">No hay conexión con el servidor; el catálogo no se puede administrar.</Alert>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="ayuda mb-0">{productos.length} producto(s) en el catálogo</p>
        <Boton onClick={() => setEditando(null)} registro="Abrir formulario: nuevo producto">
          + Nuevo producto
        </Boton>
      </div>
      {mensaje && (
        <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}
      <div className="table-responsive">
        <Table variant="dark" hover className="tabla-carrito align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Plataforma</th>
              <th>Precio</th>
              <th>Stock</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.productoId}>
                <td>
                  {p.emoji} {p.titulo}
                  <div className="ayuda small">{p.codigo}</div>
                </td>
                <td>{plataformaTexto(p.plataforma)}</td>
                <td>
                  {dinero(p.precio)}
                  {p.oferta && <div className="ayuda small text-decoration-line-through">{dinero(p.precioAnterior)}</div>}
                </td>
                <td className={p.stock === 0 ? 'text-danger fw-bold' : ''}>{p.stock}</td>
                <td className="text-end text-nowrap">
                  {porEliminar === p.productoId ? (
                    <>
                      <span className="me-2 small">¿Eliminar?</span>
                      <Boton size="sm" onClick={() => eliminar(p)} registro={`Confirmar eliminar ${p.titulo}`}>
                        Sí
                      </Boton>{' '}
                      <Boton size="sm" variante="secundario" onClick={() => setPorEliminar(null)} registro="Cancelar eliminación">
                        No
                      </Boton>
                    </>
                  ) : (
                    <>
                      <Boton size="sm" variante="secundario" onClick={() => setEditando(p)} registro={`Editar ${p.titulo}`}>
                        Editar
                      </Boton>{' '}
                      <Boton size="sm" variante="peligro" onClick={() => setPorEliminar(p.productoId)} registro={`Eliminar ${p.titulo}`}>
                        Eliminar
                      </Boton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {editando !== undefined && (
        <FormularioProducto producto={editando} onGuardar={guardar} onCerrar={() => setEditando(undefined)} />
      )}
    </>
  );
}
