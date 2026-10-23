import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Boton from '../atoms/Boton';
import Icono from '../atoms/Icono';
import ControlCantidad from '../molecules/ControlCantidad';
import { dinero } from '../../utils/format';
import { useTienda } from '../../context/TiendaContext';

export default function Carrito() {
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito, vaciarCarrito } = useTienda();

  if (!carrito.length) {
    return (
      <div className="carrito-vacio">
        <Icono simbolo="🛒" />
        <h2>Tu carrito está vacío</h2>
        <p>Explora el catálogo y agrega tus juegos favoritos.</p>
        <Boton to="/catalogo" registro="Ir al catálogo (carrito vacío)">
          Ir al catálogo
        </Boton>
      </div>
    );
  }

  return (
    <section className="tarjeta-form">
      <div className="seccion-titulo">
        <h2>Productos en tu carrito</h2>
        <Boton variante="secundario" size="sm" onClick={vaciarCarrito}>
          Vaciar carrito
        </Boton>
      </div>
      <Table responsive hover variant="dark" className="tabla-carrito align-middle">
        <caption className="visually-hidden">Lista de videojuegos en el carrito</caption>
        <thead>
          <tr>
            <th>Juego</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((producto) => (
            <tr key={producto.id}>
              <td>
                <Link to={`/producto/${producto.id}`}>{producto.titulo}</Link>
              </td>
              <td>{dinero(producto.precio)}</td>
              <td>
                <ControlCantidad
                  titulo={producto.titulo}
                  cantidad={producto.cantidad}
                  onAumentar={() => aumentarCantidad(producto.id)}
                  onDisminuir={() => disminuirCantidad(producto.id)}
                />
              </td>
              <td>{dinero(producto.precio * producto.cantidad)}</td>
              <td>
                <Boton variante="peligro" onClick={() => eliminarDelCarrito(producto.id)} aria-label={`Eliminar ${producto.titulo}`}>
                  Eliminar
                </Boton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
