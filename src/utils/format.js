export function dinero(valor) { return new Intl.NumberFormat('es-CL', {style:'currency',currency:'CLP',maximumFractionDigits:0}).format(valor); }
export function plataformaTexto(plataforma) {return plataforma === 'ambas' ? 'PS5 y PC' : plataforma === 'ps5' ? 'PlayStation 5' : 'PC';}

export const COLOR_ESTADO = { PENDIENTE: 'secondary', PAGADO: 'info', ENVIADO: 'primary', ENTREGADO: 'success', CANCELADO: 'danger' };
export function fechaCorta(iso) { return new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }); }
