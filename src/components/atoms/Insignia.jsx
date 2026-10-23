import { Badge } from 'react-bootstrap';

const COLOR_POR_TIPO = {
  ps5: 'primary',
  pc: 'success',
  ambas: 'info',
  oferta: 'danger',
};

export default function Insignia({ tipo = 'ps5', children, className = '' }) {
  return (
    <Badge pill bg={COLOR_POR_TIPO[tipo] ?? 'secondary'} className={`insignia ${className}`}>
      {children}
    </Badge>
  );
}
