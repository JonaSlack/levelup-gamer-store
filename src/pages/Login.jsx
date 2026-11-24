import { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  async function ingresar(evento) {
    evento.preventDefault();
    const nombre = usuario.trim();
    registrarEvento('sesion', 'Formulario de login enviado', { usuario: nombre, password: '••••' });

    if (!nombre || !password) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }

    setEnviando(true);
    try {
      const perfil = await iniciarSesion(nombre, password);
      const inicio = perfil.rol === 'ADMIN' ? '/admin' : '/';
      const desde = ubicacion.state?.desde;
      const destino = desde && (perfil.rol === 'ADMIN' || !desde.startsWith('/admin')) ? desde : inicio;
      registrarEvento('navegacion', `Redirigiendo después del login a ${destino}`);
      navegar(destino, { replace: true });
    } catch (err) {
      registrarEvento('error', `Login rechazado: ${err.message}`);
      setError(err.status === 401 ? 'Usuario o contraseña incorrectos.' : err.message);
      setEnviando(false);
    }
  }

  return (
    <PlantillaPagina titulo="Iniciar sesión" descripcion="Accede con tu cuenta de LevelUp Store." angosto>
      <Form className="tarjeta-form" onSubmit={ingresar} noValidate>
        <h2>Acceso de usuario</h2>
        <p className="ayuda">
          Cliente: <strong>goku</strong> / <strong>1234</strong> · Administrador: <strong>admin</strong> / <strong>admin123</strong>
        </p>
        <CampoFormulario id="usuario" etiqueta="Usuario" textoAyuda="También puedes usar tu correo." valor={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" />
        <CampoFormulario
          id="password"
          etiqueta="Contraseña"
          tipo="password"
          valor={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <Alert variant="danger">{error}</Alert>}
        <Boton type="submit" ancho disabled={enviando} registro="Ingresar (enviar login)">
          Ingresar
        </Boton>
        <p className="ayuda mt-3">
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </Form>
    </PlantillaPagina>
  );
}
