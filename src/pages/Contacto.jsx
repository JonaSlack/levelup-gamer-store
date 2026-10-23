import { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';

const CAMPOS = [
  ['nombre', 'Nombre', 'text'],
  ['email', 'Correo electrónico', 'email'],
  ['asunto', 'Asunto', 'text'],
  ['mensaje', 'Mensaje', 'textarea'],
];

export default function Contacto() {
  const [datos, setDatos] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [listo, setListo] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos((anterior) => ({ ...anterior, [name]: value }));
  }

  function enviar(evento) {
    evento.preventDefault();
    registrarEvento('formulario', 'Formulario de contacto enviado', datos);
    setListo(true);
  }

  return (
    <PlantillaPagina titulo="Contacto" descripcion="¿Necesitas ayuda? Déjanos tus dudas sobre juegos y compras." angosto>
      <Form className="tarjeta-form" onSubmit={enviar}>
        <h2>Escríbenos</h2>
        {CAMPOS.map(([id, etiqueta, tipo]) => (
          <CampoFormulario key={id} id={id} etiqueta={etiqueta} tipo={tipo} valor={datos[id]} onChange={cambiar} required />
        ))}
        <Boton type="submit" ancho registro="Enviar mensaje de contacto">
          Enviar mensaje (demo)
        </Boton>
        {listo && (
          <Alert variant="success" className="mt-3 mb-0">
            Mensaje validado en el navegador. En esta demo no se envía al servidor.
          </Alert>
        )}
      </Form>
    </PlantillaPagina>
  );
}
