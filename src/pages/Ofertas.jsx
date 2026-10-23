import { juegos } from '../data/juegos';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import ListaProductos from '../components/organisms/ListaProductos';

export default function Ofertas() {
  const ofertas = juegos.filter((juego) => juego.precioAnterior);
  return (
    <PlantillaPagina titulo="Ofertas especiales" descripcion="Aprovecha los precios promocionales del catálogo.">
      <p className="ayuda">{ofertas.length} título(s) con descuento</p>
      <ListaProductos productos={ofertas} />
    </PlantillaPagina>
  );
}
