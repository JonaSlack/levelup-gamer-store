const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function esEmailValido(email) {
  return REGEX_EMAIL.test(email);
}

export function validarCheckout(datos) {
  const errores = {};
  if (datos.nombre.trim().length < 3) errores.nombre = 'Ingresa tu nombre completo.';
  if (!esEmailValido(datos.email)) errores.email = 'Ingresa un correo electrónico válido.';
  if (datos.telefono.replace(/\D/g, '').length < 9) errores.telefono = 'Ingresa un teléfono válido.';
  if (!datos.fecha) errores.fecha = 'Selecciona una fecha.';
  if (!datos.direccion.trim()) errores.direccion = 'Ingresa la dirección.';
  if (!datos.comuna) errores.comuna = 'Selecciona la comuna.';
  if (!datos.pago) errores.pago = 'Selecciona un método de pago.';
  if (!datos.terminos) errores.terminos = 'Debes aceptar los términos para continuar.';
  return errores;
}

export function validarRegistro(datos) {
  if (datos.usuario.trim().length < 3) return 'El usuario debe tener al menos 3 caracteres.';
  if (!esEmailValido(datos.email)) return 'Escribe un correo válido.';
  if (datos.password.length < 4) return 'La contraseña debe tener al menos 4 caracteres.';
  if (datos.password !== datos.confirmacion) return 'Las contraseñas no coinciden.';
  if (!datos.terminos) return 'Debes aceptar los términos y condiciones.';
  return '';
}
