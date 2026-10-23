export default function ControlCantidad({ titulo, cantidad, onAumentar, onDisminuir }) {
  return (
    <div className="cantidad-control">
      <button type="button" aria-label={`Disminuir ${titulo}`} onClick={onDisminuir}>
        −
      </button>
      <span aria-label={`Cantidad de ${titulo}`}>{cantidad}</span>
      <button type="button" aria-label={`Aumentar ${titulo}`} onClick={onAumentar}>
        +
      </button>
    </div>
  );
}
