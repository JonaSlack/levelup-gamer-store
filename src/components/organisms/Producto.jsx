import { Card } from 'react-bootstrap';
import Boton from '../atoms/Boton';
import Insignia from '../atoms/Insignia';
import Precio from '../atoms/Precio';
import ImagenPortada from '../atoms/ImagenPortada';
import { plataformaTexto } from '../../utils/format';
import { useTienda } from '../../context/TiendaContext';

export default function Producto({ producto }) {
  const { agregarAlCarrito } = useTienda();

  return (
    <Card className="tarjeta-juego h-100" as="article">
      <div className="position-relative">
        <ImagenPortada src={producto.imagen} titulo={producto.titulo} emoji={producto.emoji} />
        <div className="etiquetas">
          <Insignia tipo={producto.plataforma}>{plataformaTexto(producto.plataforma)}</Insignia>
          {producto.precioAnterior && <Insignia tipo="oferta">Oferta</Insignia>}
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h3">{producto.titulo}</Card.Title>
        <p className="genero">{producto.genero}</p>
        <Precio valor={producto.precio} anterior={producto.precioAnterior} />
        <div className="acciones mt-auto">
          <Boton variante="secundario" to={`/producto/${producto.id}`} registro={`Ver detalle de ${producto.titulo}`}>
            Ver detalle
          </Boton>
          <Boton variante="primario" onClick={() => agregarAlCarrito(producto)} registro={`Agregar ${producto.titulo}`}>
            Agregar al carrito
          </Boton>
        </div>
      </Card.Body>
    </Card>
  );
}
