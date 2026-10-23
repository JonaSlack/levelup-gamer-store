import { Link } from 'react-router-dom';

export default function Migas({ items }) {
  return (
    <nav aria-label="Ruta de navegación">
      <p className="migas">
        {items.map((item, indice) => (
          <span key={item.texto}>
            {indice > 0 && ' / '}
            {item.to ? <Link to={item.to}>{item.texto}</Link> : item.texto}
          </span>
        ))}
      </p>
    </nav>
  );
}
