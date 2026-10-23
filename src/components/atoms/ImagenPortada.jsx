import { useState } from 'react';
import { registrarEvento } from '../../utils/logger';

export default function ImagenPortada({ src, titulo, emoji, grande = false }) {
  const [fallo, setFallo] = useState(!src);

  function manejarError() {
    registrarEvento('error', `No cargó la portada de "${titulo}", se muestra el emoji`);
    setFallo(true);
  }

  return (
    <div className={`portada ${grande ? 'detalle-portada' : ''}`}>
      {!fallo && <img src={src} alt={`Portada de ${titulo}`} loading="lazy" onError={manejarError} />}
      <span className="portada-fondo" aria-hidden="true">
        {emoji}
      </span>
    </div>
  );
}
