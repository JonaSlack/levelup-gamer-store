export default function FilaResumen({ etiqueta, valor, destacado = false }) {
  return (
    <div className="resumen-fila">
      {destacado ? <strong>{etiqueta}</strong> : <span>{etiqueta}</span>}
      <strong className={destacado ? 'acento' : ''}>{valor}</strong>
    </div>
  );
}
