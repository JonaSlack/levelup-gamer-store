import { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTienda } from '../context/TiendaContext';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';

function credencialesValidas(usuario, password) {
  if (usuario === 'goku' && password === '1234') return true;
  try {
    const registrados = JSON.parse(localStorage.getItem('levelup_usuarios_demo') || '[]');
    return registrados.some((x) => x.usuario === usuario && x.password === password);
  } catch {
    return false;
  }
}

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion } = useTienda();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  function ingresar(evento) {
    evento.preventDefault();
    const nombre = usuario.trim();
    registrarEvento('sesion', 'Formulario de login enviado', { usuario: nombre, password: '••••' });

    if (!credencialesValidas(nombre, password)) {
      registrarEvento('error', 'Login rechazado: credenciales incorrectas');
      setError('Usuario o contraseña incorrectos. Prueba goku / 1234.');
      return;
    }

    iniciarSesion(nombre);
    const destino = ubicacion.state?.desde || '/';
    registrarEvento('navegacion', `Redirigiendo después del login a ${destino}`);
    navegar(destino, { replace: true });
  }

  return (
    <PlantillaPagina titulo="Iniciar sesión" descripcion="Accede a tu cuenta de demostración." angosto>
      <Form className="tarjeta-form" onSubmit={ingresar} noValidate>
        <h2>Acceso de usuario</h2>
        <p className="ayuda">
          Usuario de prueba: <strong>goku</strong> · Contraseña: <strong>1234</strong>
        </p>
        <CampoFormulario id="usuario" etiqueta="Usuario" valor={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" />
        <CampoFormulario
          id="password"
          etiqueta="Contraseña"
          tipo="password"
          valor={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <Alert variant="danger">{error}</Alert>}
        <Boton type="submit" ancho registro="Ingresar (enviar login)">
          Ingresar
        </Boton>
        <p className="ayuda mt-3">
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta de prueba</Link>
        </p>
        <p className="ayuda">⚠️ Este login se valida en el navegador; no ingreses contraseñas reales.</p>
      </Form>
    </PlantillaPagina>
  );
}
