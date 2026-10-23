import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { registrarEvento } from '../utils/logger';

export function useRegistroNavegacion() {
  const ubicacion = useLocation();
  const ultimaRuta = useRef('');

  useEffect(() => {
    const ruta = ubicacion.pathname + ubicacion.search;
    if (ultimaRuta.current === ruta) return;
    ultimaRuta.current = ruta;
    registrarEvento('navegacion', `Página visitada: ${ruta}`);
  }, [ubicacion]);
}
