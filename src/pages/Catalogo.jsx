import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { juegos } from '../data/juegos';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import BarraBusqueda from '../components/molecules/BarraBusqueda';
import FiltrosPlataforma from '../components/molecules/FiltrosPlataforma';
import ListaProductos from '../components/organisms/ListaProductos';
import { registrarEvento } from '../utils/logger';

const FILTROS = [
  ['todos', 'Todos'],
  ['ps5', 'PlayStation 5'],
  ['pc', 'PC'],
  ['oferta', 'En oferta'],
];
const FILTROS_VALIDOS = FILTROS.map(([id]) => id);

function leerParametros(search) {
  const parametros = new URLSearchParams(search);
  const plataforma = parametros.get('plataforma');
  return {
    filtro: FILTROS_VALIDOS.includes(plataforma) ? plataforma : 'todos',
    busqueda: parametros.get('buscar') ?? '',
  };
}

function cumpleFiltro(juego, filtro) {
  if (filtro === 'oferta') return Boolean(juego.precioAnterior);
  if (filtro === 'ps5') return juego.plataforma === 'ps5' || juego.plataforma === 'ambas';
  if (filtro === 'pc') return juego.plataforma === 'pc' || juego.plataforma === 'ambas';
  return true;
}

export default function Catalogo() {
  const ubicacion = useLocation();
  const [busqueda, setBusqueda] = useState(() => leerParametros(ubicacion.search).busqueda);
  const [filtro, setFiltro] = useState(() => leerParametros(ubicacion.search).filtro);

  useEffect(() => {
    const desdeUrl = leerParametros(ubicacion.search);
    setFiltro(desdeUrl.filtro);
    setBusqueda(desdeUrl.busqueda);
  }, [ubicacion.search]);

  const resultados = useMemo(() => {
    const texto = busqueda.toLocaleLowerCase('es').trim();
    return juegos.filter(
      (juego) => juego.titulo.toLocaleLowerCase('es').includes(texto) && cumpleFiltro(juego, filtro),
    );
  }, [busqueda, filtro]);

  function cambiarFiltro(id) {
    setFiltro(id);
    registrarEvento('catalogo', `Filtro aplicado: ${id}`);
  }

  function limpiar() {
    setBusqueda('');
    setFiltro('todos');
    registrarEvento('catalogo', 'Búsqueda y filtros reiniciados');
  }

  return (
    <PlantillaPagina titulo="Catálogo de videojuegos" descripcion="Busca tu juego favorito y filtra por plataforma o descuentos.">
      <BarraBusqueda valor={busqueda} onCambiar={setBusqueda} onLimpiar={limpiar} sugerencias={juegos.map((j) => j.titulo)} />
      <FiltrosPlataforma opciones={FILTROS} activo={filtro} onCambiar={cambiarFiltro} />
      <p className="ayuda" role="status">
        {resultados.length} juego(s) encontrado(s)
      </p>
      {resultados.length ? (
        <ListaProductos productos={resultados} />
      ) : (
        <div className="sin-resultados">😕 No encontramos juegos que coincidan. Intenta otro término o quita los filtros.</div>
      )}
    </PlantillaPagina>
  );
}
