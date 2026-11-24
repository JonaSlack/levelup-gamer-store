import { useCatalogo } from '../context/CatalogoContext';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import ListaProductos from '../components/organisms/ListaProductos';

export default function Ofertas() {
  const { productos: juegos } = useCatalogo();
  const ofertas = juegos.filter((juego) => juego.precioAnterior);
  return (
    <PlantillaPagina titulo="Ofertas especiales" descripcion="Aprovecha los precios promocionales del catálogo.">
      <p className="ayuda">{ofertas.length} título(s) con descuento</p>
      <ListaProductos productos={ofertas} />
    </PlantillaPagina>
  );
}
