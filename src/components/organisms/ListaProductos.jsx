import { Row, Col } from 'react-bootstrap';
import Producto from './Producto';

export default function ListaProductos({ productos }) {
  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {productos.map((producto) => (
        <Col key={producto.id}>
          <Producto producto={producto} />
        </Col>
      ))}
    </Row>
  );
}
