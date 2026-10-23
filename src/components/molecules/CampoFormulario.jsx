import { Form } from 'react-bootstrap';
import { registrarEvento } from '../../utils/logger';

export default function CampoFormulario({
  id,
  etiqueta,
  valor,
  onChange,
  tipo = 'text',
  opciones = [],
  error = '',
  requerido = false,
  textoAyuda,
  className = 'mb-3',
  ...resto
}) {
  function manejarSalida() {
    if (valor === '' || valor === undefined) return;
    const visible = tipo === 'password' || id.toLowerCase().includes('apikey') ? '••••' : valor;
    registrarEvento('formulario', `Campo "${etiqueta}" completado`, visible);
  }

  const comunes = {
    name: id,
    value: valor,
    onChange,
    onBlur: manejarSalida,
    isInvalid: Boolean(error),
    ...resto,
  };

  let control;
  if (tipo === 'select') {
    control = (
      <Form.Select {...comunes}>
        {opciones.map((opcion) => {
          const [valorOpcion, texto] = Array.isArray(opcion) ? opcion : [opcion, opcion];
          return (
            <option key={valorOpcion} value={valorOpcion}>
              {texto}
            </option>
          );
        })}
      </Form.Select>
    );
  } else if (tipo === 'textarea') {
    control = <Form.Control as="textarea" rows={4} {...comunes} />;
  } else {
    control = <Form.Control type={tipo} {...comunes} />;
  }

  return (
    <Form.Group controlId={id} className={className}>
      <Form.Label>
        {etiqueta}
        {requerido && <span className="requerido"> *</span>}
      </Form.Label>
      {control}
      {textoAyuda && <Form.Text className="ayuda">{textoAyuda}</Form.Text>}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
