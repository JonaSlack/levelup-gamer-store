const COLORES = {
  carrito: '#22c55e',
  navegacion: '#22d3ee',
  sesion: '#f59e0b',
  formulario: '#a78bfa',
  catalogo: '#60a5fa',
  ui: '#9d9dc2',
  ia: '#f472b6',
  api: '#34d399',
  error: '#f43f5e',
};

const enModoTest = () => import.meta.env?.MODE === 'test';

export function registrarEvento(categoria, accion, detalle) {
  if (enModoTest()) return;
  const color = COLORES[categoria] ?? COLORES.ui;
  const hora = new Date().toLocaleTimeString('es-CL');
  const partes = [
    `%c LevelUp · ${categoria.toUpperCase()} %c ${accion} %c${hora}`,
    `background:${color};color:#0f0f1a;font-weight:700;border-radius:4px;padding:1px 4px`,
    'font-weight:600',
    'color:#888;font-size:10px',
  ];
  if (detalle !== undefined) partes.push(detalle);
  const metodo = categoria === 'error' ? console.warn : console.log;
  metodo(...partes);
}

export function registrarTabla(titulo, filas) {
  if (enModoTest()) return;
  registrarEvento('carrito', titulo);
  if (filas.length) console.table(filas);
}
