import { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { validarRegistro } from '../utils/validaciones';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';

const CAMPOS = [
  ['usuario', 'Nombre de usuario', 'text'],
  ['email', 'Correo (de prueba)', 'email'],
  ['password', 'Contraseña (no real)', 'password'],
  ['confirmacion', 'Confirmar contraseña', 'password'],
];

export default function Registro() {
  const [datos, setDatos] = useState({ usuario: '', email: '', password: '', confirmacion: '', terminos: false });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navegar = useNavigate();

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos((anterior) => ({ ...anterior, [name]: type === 'checkbox' ? checked : value }));
  }

  function registrar(evento) {
    evento.preventDefault();
    registrarEvento('formulario', 'Formulario de registro enviado', { usuario: datos.usuario, email: datos.email });

    const mensaje = validarRegistro(datos);
    if (mensaje) {
      registrarEvento('error', `Registro inválido: ${mensaje}`);
      return setError(mensaje);
    }

    try {
      const usuarios = JSON.parse(localStorage.getItem('levelup_usuarios_demo') || '[]');
      if (usuarios.some((u) => u.usuario === datos.usuario.trim())) {
        registrarEvento('error', 'Registro inválido: usuario repetido');
        return setError('Este nombre de usuario ya está registrado.');
      }
      localStorage.setItem(
        'levelup_usuarios_demo',
        JSON.stringify([...usuarios, { usuario: datos.usuario.trim(), password: datos.password }]),
      );
      registrarEvento('sesion', `Cuenta creada: ${datos.usuario.trim()}`, 'guardada en localStorage["levelup_usuarios_demo"]');
      setError('');
      setExito(true);
    } catch {
      setError('No es posible guardar la cuenta en este navegador.');
    }
  }

  if (exito) {
    return (
      <section className="seccion">
        <div className="container exito-panel">
          <h1>✅ Cuenta de demostración creada</h1>
          <p>Ya puedes ingresar con el usuario que registraste.</p>
          <Boton onClick={() => navegar('/login')} registro="Ir al login (registro exitoso)">
            Ir al login
          </Boton>
        </div>
      </section>
    );
  }

  return (
    <PlantillaPagina titulo="Crear cuenta" descripcion="Registro local para practicar formularios controlados y validaciones en React." angosto>
      <Form className="tarjeta-form" onSubmit={registrar} noValidate>
        <h2>Registro de usuario</h2>
        <Alert variant="warning" className="small">
          Solo para fines académicos: los datos se guardan localmente y NO están protegidos por un servidor. Usa datos inventados.
        </Alert>
        {CAMPOS.map(([id, etiqueta, tipo]) => (
          <CampoFormulario key={id} id={id} etiqueta={etiqueta} tipo={tipo} valor={datos[id]} onChange={cambiar} />
        ))}
        <Form.Check
          id="terminos"
          name="terminos"
          type="checkbox"
          className="mb-3"
          label="Acepto usar únicamente datos ficticios."
          checked={datos.terminos}
          onChange={cambiar}
        />
        {error && <Alert variant="danger">{error}</Alert>}
        <Boton type="submit" ancho registro="Crear cuenta (enviar registro)">
          Crear cuenta
        </Boton>
        <p className="ayuda mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </Form>
    </PlantillaPagina>
  );
}
