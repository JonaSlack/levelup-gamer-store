import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { juegos } from '../data/juegos';
import { productosApi } from '../services/api';
import { registrarEvento } from '../utils/logger';

const CatalogoContext = createContext(null);

const CATALOGO_LOCAL = juegos.map((juego) => ({ ...juego, productoId: null, stock: null }));

// el front usa el código como id para mantener las URLs /producto/minecraft
export function adaptarProducto(producto) {
  return { ...producto, id: producto.codigo, productoId: producto.id };
}

export function CatalogoProvider({ children }) {
  const [productos, setProductos] = useState(CATALOGO_LOCAL);
  const [origen, setOrigen] = useState('local');
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await productosApi.listar();
      setProductos(datos.map(adaptarProducto));
      setOrigen('api');
      registrarEvento('catalogo', `Catálogo cargado desde la API: ${datos.length} producto(s)`);
    } catch {
      registrarEvento('error', 'No se pudo cargar el catálogo desde la API, se muestra el catálogo local');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const buscarPorCodigo = useCallback((codigo) => productos.find((p) => p.id === codigo), [productos]);

  const valor = { productos, origen, cargando, recargar, buscarPorCodigo };
  return <CatalogoContext.Provider value={valor}>{children}</CatalogoContext.Provider>;
}

export function useCatalogo() {
  const valor = useContext(CatalogoContext);
  if (!valor) throw new Error('useCatalogo requiere CatalogoProvider');
  return valor;
}
