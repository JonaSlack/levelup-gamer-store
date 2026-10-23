export default function Icono({ simbolo, className = '' }) {
  return (
    <span className={`icono ${className}`} aria-hidden="true">
      {simbolo}
    </span>
  );
}
