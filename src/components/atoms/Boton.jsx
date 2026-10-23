import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { registrarEvento } from '../../utils/logger';

const VARIANTES = {
  primario: { variant: 'primary', className: 'btn-primario' },
  secundario: { variant: 'outline-light', className: 'btn-secundario' },
  peligro: { variant: 'link', className: 'btn-enlace-peligro' },
  filtro: { variant: 'outline-secondary', className: 'filtro-btn' },
};

export default function Boton({
  children,
  variante = 'primario',
  to,
  ancho = false,
  registro,
  onClick,
  className = '',
  ...resto
}) {
  const estilo = VARIANTES[variante] ?? VARIANTES.primario;

  function manejarClick(evento) {
    const texto = registro || resto['aria-label'] || (typeof children === 'string' ? children : 'botón');
    registrarEvento(to ? 'navegacion' : 'ui', `Clic en "${texto}"`, to ? { destino: to } : undefined);
    onClick?.(evento);
  }

  const clases = [estilo.className, ancho ? 'w-100' : '', className].filter(Boolean).join(' ');

  // si tiene "to" se renderiza como Link
  if (to) {
    const { size, ...propsEnlace } = resto;
    const claseTamano = size ? `btn-${size}` : '';
    return (
      <Link to={to} className={`btn btn-${estilo.variant} ${claseTamano} ${clases}`} onClick={manejarClick} {...propsEnlace}>
        {children}
      </Link>
    );
  }

  return (
    <Button variant={estilo.variant} className={clases} onClick={manejarClick} {...resto}>
      {children}
    </Button>
  );
}
