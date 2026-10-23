import { Form, InputGroup } from 'react-bootstrap';
import Boton from '../atoms/Boton';
import { registrarEvento } from '../../utils/logger';

export default function BarraBusqueda({ valor, onCambiar, onLimpiar, sugerencias = [] }) {
  function manejarSalida() {
    if (valor.trim()) registrarEvento('catalogo', `Búsqueda escrita: "${valor}"`);
  }

  return (
    <Form.Group controlId="busqueda" className="buscador mb-3">
      <Form.Label>Buscar juego por título</Form.Label>
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="Ej: Minecraft, Cyberpunk, God of War..."
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          onBlur={manejarSalida}
          list="sugerenciasJuegos"
        />
        <Boton variante="secundario" onClick={onLimpiar} registro="Limpiar búsqueda y filtros">
          Limpiar
        </Boton>
      </InputGroup>
      <datalist id="sugerenciasJuegos">
        {sugerencias.map((titulo) => (
          <option key={titulo} value={titulo} />
        ))}
      </datalist>
    </Form.Group>
  );
}
