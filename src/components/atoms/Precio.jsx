import { dinero } from '../../utils/format';

export default function Precio({ valor, anterior = null, grande = false }) {
  return (
    <div className={`precio ${grande ? 'precio-grande' : ''}`}>
      <strong>{dinero(valor)}</strong>
      {anterior && <del>{dinero(anterior)}</del>}
    </div>
  );
}
