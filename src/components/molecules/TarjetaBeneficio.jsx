import { Card } from 'react-bootstrap';
import Icono from '../atoms/Icono';

export default function TarjetaBeneficio({ icono, titulo, texto }) {
  return (
    <Card as="article" className="tarjeta-beneficio h-100">
      <Card.Body>
        <Icono simbolo={icono} className="fs-2 d-block mb-2" />
        <Card.Title as="h3">{titulo}</Card.Title>
        <Card.Text>{texto}</Card.Text>
      </Card.Body>
    </Card>
  );
}
