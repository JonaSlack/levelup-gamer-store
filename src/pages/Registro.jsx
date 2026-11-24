import { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { validarRegistro } from '../utils/validaciones';
import { registrarEvento } from '../utils/logger';
import { useAuth } from '../context/AuthContext';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';

const CAMPOS = [
  ['nombre', 'Nombre completo', 'text'],
  ['usuario', 'Nombre de usuario', 'text'],
  ['email', 'Correo electrónico', 'email'],
  ['password', 'Contraseña', 'password'],
  ['confirmacion', 'Confirmar contraseña', 'password'],
];

const CAMPOS_API = { username: 'usuario' };

export default function Registro() {
  const [datos, setDatos] = useState({ nombre: '', usuario: '', email: '', password: '', confirmacion: '', terminos: false });
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [creado, setCreado] = useState(null);
  const { registrar } = useAuth();
  const navegar = useNavigate();

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos((anterior) => ({ ...anterior, [name]: type === 'checkbox' ? checked : value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    registrarEvento('formulario', 'Formulario de registro enviado', { usuario: datos.usuario, email: datos.email });
    setErrores({});

    const mensaje = datos.nombre.trim().length < 3 ? 'Ingresa tu nombre completo.' : validarRegistro(datos);
    if (mensaje) {
      registrarEvento('error', `Registro inválido: ${mensaje}`);
      setError(mensaje);
      return;
    }

    setEnviando(true);
    try {
      const perfil = await registrar({
        nombre: datos.nombre.trim(),
        username: datos.usuario.trim(),
        email: datos.email.trim(),
        password: datos.password,
      });
      setError('');
      setCreado(perfil);
    } catch (err) {
      registrarEvento('error', `Registro rechazado: ${err.message}`, err.campos);
      const porCampo = {};
      Object.entries(err.campos ?? {}).forEach(([campo, texto]) => {
        porCampo[CAMPOS_API[campo] ?? campo] = texto;
      });
      setErrores(porCampo);
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (creado) {
    return (
      <section className="seccion">
        <div className="container exito-panel">
          <h1>✅ Cuenta creada</h1>
          <p>
            Bienvenido, <strong>{creado.nombre}</strong>. Ya iniciaste sesión como <strong>{creado.username}</strong>.
          </p>
          <Boton onClick={() => navegar('/catalogo')} registro="Ir al catálogo (registro exitoso)">
            Ir al catálogo
          </Boton>
        </div>
      </section>
    );
  }

  return (
    <PlantillaPagina titulo="Crear cuenta" descripcion="Regístrate para comprar y revisar tus pedidos." angosto>
      <Form className="tarjeta-form" onSubmit={enviar} noValidate>
        <h2>Registro de usuario</h2>
        {CAMPOS.map(([id, etiqueta, tipo]) => (
          <CampoFormulario key={id} id={id} etiqueta={etiqueta} tipo={tipo} valor={datos[id]} onChange={cambiar} error={errores[id]} />
        ))}
        <Form.Check
          id="terminos"
          name="terminos"
          type="checkbox"
          className="mb-3"
          label="Acepto los términos y condiciones de LevelUp Store."
          checked={datos.terminos}
          onChange={cambiar}
        />
        {error && <Alert variant="danger">{error}</Alert>}
        <Boton type="submit" ancho disabled={enviando} registro="Crear cuenta (enviar registro)">
          Crear cuenta
        </Boton>
        <p className="ayuda mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </Form>
    </PlantillaPagina>
  );
}
