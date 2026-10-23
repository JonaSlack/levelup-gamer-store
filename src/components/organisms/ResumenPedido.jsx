import FilaResumen from '../molecules/FilaResumen';

export default function ResumenPedido({ filas, children }) {
  return (
    <aside className="resumen-pedido">
      <h2>Resumen del pedido</h2>
      {filas.map((fila, indice) =>
        fila === 'separador' ? <hr key={`hr-${indice}`} /> : <FilaResumen key={fila.etiqueta} {...fila} />,
      )}
      {children}
    </aside>
  );
}
