import { Row, Col } from 'react-bootstrap';
import { useTienda } from '../context/TiendaContext';
import { dinero } from '../utils/format';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import Carrito from '../components/organisms/Carrito';
import ResumenPedido from '../components/organisms/ResumenPedido';
import Boton from '../components/atoms/Boton';

export default function CarritoPage() {
  const { carrito, total, unidades, usuario } = useTienda();

  return (
    <PlantillaPagina titulo="Tu carrito de compras" descripcion="Revisa tus juegos seleccionados y continúa al checkout educativo.">
      <Row className="g-4">
        <Col xs={12} lg={carrito.length ? 8 : 12}>
          <Carrito />
        </Col>
        {carrito.length > 0 && (
          <Col xs={12} lg={4}>
            <ResumenPedido
              filas={[
                { etiqueta: 'Unidades', valor: unidades },
                { etiqueta: 'Subtotal', valor: dinero(total) },
                'separador',
                { etiqueta: 'Total parcial', valor: dinero(total), destacado: true },
              ]}
            >
              <p className="ayuda">El envío se calcula al confirmar tus datos.</p>
              <Boton to="/checkout" ancho className="mb-2" registro="Ir al checkout">
                {usuario ? 'Finalizar compra' : 'Iniciar sesión para comprar'}
              </Boton>
              <Boton variante="secundario" to="/catalogo" ancho registro="Seguir comprando">
                Seguir comprando
              </Boton>
            </ResumenPedido>
          </Col>
        )}
      </Row>
    </PlantillaPagina>
  );
}
