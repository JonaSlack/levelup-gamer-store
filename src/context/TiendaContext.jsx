import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  agregarProducto,
  aumentarProducto,
  disminuirProducto,
  eliminarProducto,
  calcularSubtotal,
  calcularUnidades,
} from '../utils/carrito';
import { obtenerCarrito, guardarCarrito } from '../utils/almacenamiento';
import { registrarEvento, registrarTabla } from '../utils/logger';

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const [carrito, setCarrito] = useState(obtenerCarrito);
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem('usuario') || '');
  const [aviso, setAviso] = useState('');

  // evita log duplicado por StrictMode
  const ultimoRegistro = useRef('');
  useEffect(() => {
    guardarCarrito(carrito);
    const firma = JSON.stringify(carrito);
    if (firma === ultimoRegistro.current) return;
    ultimoRegistro.current = firma;
    registrarTabla(
      `localStorage actualizado · ${calcularUnidades(carrito)} unidad(es) · total $${calcularSubtotal(carrito)}`,
      carrito.map(({ id, titulo, precio, cantidad }) => ({ id, titulo, precio, cantidad, subtotal: precio * cantidad })),
    );
  }, [carrito]);

  function agregarAlCarrito(producto) {
    registrarEvento('carrito', `Agregar al carrito: ${producto.titulo}`, { id: producto.id, precio: producto.precio });
    setCarrito((actual) => agregarProducto(actual, producto));
    setAviso(`${producto.titulo} agregado al carrito`);
  }

  function aumentarCantidad(id) {
    registrarEvento('carrito', `Aumentar cantidad (+1): ${id}`);
    setCarrito((actual) => aumentarProducto(actual, id));
  }

  function disminuirCantidad(id) {
    registrarEvento('carrito', `Disminuir cantidad (−1): ${id}`);
    setCarrito((actual) => disminuirProducto(actual, id));
  }

  function eliminarDelCarrito(id) {
    registrarEvento('carrito', `Eliminar del carrito: ${id}`);
    setCarrito((actual) => eliminarProducto(actual, id));
  }

  function vaciarCarrito() {
    registrarEvento('carrito', 'Vaciar carrito');
    setCarrito([]);
  }

  function iniciarSesion(nombre) {
    registrarEvento('sesion', `Sesión iniciada: ${nombre}`, 'guardado en sessionStorage["usuario"]');
    sessionStorage.setItem('usuario', nombre);
    setUsuario(nombre);
  }

  function cerrarSesion() {
    registrarEvento('sesion', `Sesión cerrada: ${usuario}`);
    sessionStorage.removeItem('usuario');
    setUsuario('');
  }

  function cerrarAviso() {
    registrarEvento('ui', 'Cerrar aviso emergente');
    setAviso('');
  }

  const valor = {
    carrito,
    usuario,
    aviso,
    setAviso,
    cerrarAviso,
    agregarAlCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    iniciarSesion,
    cerrarSesion,
    total: calcularSubtotal(carrito),
    unidades: calcularUnidades(carrito),
  };

  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>;
}

export function useTienda() {
  const valor = useContext(TiendaContext);
  if (!valor) throw new Error('useTienda requiere TiendaProvider');
  return valor;
}
