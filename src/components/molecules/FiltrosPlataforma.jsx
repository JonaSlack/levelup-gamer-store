import { ButtonGroup } from 'react-bootstrap';
import Boton from '../atoms/Boton';

export default function FiltrosPlataforma({ opciones, activo, onCambiar }) {
  return (
    <ButtonGroup role="group" aria-label="Filtrar por plataforma" className="filtros flex-wrap mb-3">
      {opciones.map(([id, etiqueta]) => (
        <Boton
          key={id}
          variante="filtro"
          className={activo === id ? 'activo' : ''}
          active={activo === id}
          aria-pressed={activo === id}
          registro={`Filtro: ${etiqueta}`}
          onClick={() => onCambiar(id)}
        >
          {etiqueta}
        </Boton>
      ))}
    </ButtonGroup>
  );
}
