import { useState } from 'react';
import { Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTienda } from '../context/TiendaContext';
import { useAuth } from '../context/AuthContext';
import { useCatalogo } from '../context/CatalogoContext';
import { pedidosApi } from '../services/api';
import { calcularEnvio } from '../utils/carrito';
import { dinero } from '../utils/format';
import { validarCheckout } from '../utils/validaciones';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import CampoFormulario from '../components/molecules/CampoFormulario';
import ResumenPedido from '../components/organisms/ResumenPedido';
import Boton from '../components/atoms/Boton';

export { validarCheckout };

const CAMPOS_INICIALES = {
  nombre: '',
  email: '',
  telefono: '',
  fecha: '',
  direccion: '',
  comuna: '',
  envio: 'domicilio',
  pago: '',
  color: '#8b5cf6',
  ofertas: '4',
  notas: '',
  terminos: false,
};

const COMUNAS = [['', 'Selecciona tu comuna'], 'Santiago Centro', 'Providencia', 'Las Condes', 'Valparaíso', 'Concepción', 'Otra'];
const PAGOS = [
  ['', 'Selecciona un método de pago'],
  ['tarjeta', 'Tarjeta de débito o crédito'],
  ['transferencia', 'Transferencia bancaria'],
  ['efectivo', 'Efectivo al retirar'],
];

export default function Checkout() {
  const { carrito, total, vaciarCarrito } = useTienda();
  const { perfil } = useAuth();
  const { buscarPorCodigo, recargar } = useCatalogo();
  const [datos, setDatos] = useState(() => ({ ...CAMPOS_INICIALES, nombre: perfil?.nombre ?? '', email: perfil?.email ?? '' }));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [finalizado, setFinalizado] = useState(null);
  const navegar = useNavigate();
  const envio = calcularEnvio(carrito, datos.envio);

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos((anterior) => ({ ...anterior, [name]: type === 'checkbox' ? checked : value }));
    if (type === 'radio' || type === 'checkbox' || type === 'range' || type === 'color') {
      registrarEvento('formulario', `Checkout · ${name} = ${type === 'checkbox' ? checked : value}`);
    }
  }

  async function confirmar(evento) {
    evento.preventDefault();
    const nuevos = validarCheckout(datos);
    setErrores(nuevos);
    setErrorServidor('');
    registrarEvento('formulario', 'Formulario de checkout enviado', { errores: Object.keys(nuevos).length ? nuevos : 'ninguno' });
    if (Object.keys(nuevos).length || !carrito.length) return;

    const items = carrito.map((x) => ({
      productoId: x.productoId ?? buscarPorCodigo(x.id)?.productoId,
      cantidad: x.cantidad,
    }));
    if (items.some((x) => !x.productoId)) {
      setErrorServidor('No pudimos validar los productos con el servidor. Recarga la página e inténtalo nuevamente.');
      return;
    }

    const pedido = {
      items,
      metodoEnvio: datos.envio === 'tienda' ? 'TIENDA' : 'DOMICILIO',
      direccion: datos.direccion.trim(),
      comuna: datos.comuna,
      telefono: datos.telefono.trim(),
      metodoPago: datos.pago,
    };

    setEnviando(true);
    try {
      const creado = await pedidosApi.crear(pedido);
      registrarEvento('carrito', `Pedido #${creado.id} registrado en el servidor`, creado);
      setFinalizado(creado);
      vaciarCarrito();
      recargar();
      window.scrollTo?.(0, 0);
    } catch (err) {
      registrarEvento('error', `No se pudo registrar el pedido: ${err.message}`);
      setErrorServidor(err.message);
    } finally {
      setEnviando(false);
    }
  }

  const campo = (id, etiqueta, tipo = 'text', extra = {}) => (
    <CampoFormulario id={id} etiqueta={etiqueta} tipo={tipo} valor={datos[id]} onChange={cambiar} error={errores[id]} requerido {...extra} />
  );

  if (finalizado) {
    return (
      <section className="seccion">
        <div className="container exito-panel">
          <h1>✅ Pedido registrado</h1>
          <p>
            Tu número de pedido es <strong>#{finalizado.id}</strong> y quedó en estado <strong>{finalizado.estado}</strong>.
          </p>
          <p>
            Subtotal {dinero(finalizado.subtotal)} · Envío {finalizado.envio === 0 ? 'gratis' : dinero(finalizado.envio)} · Total{' '}
            <strong>{dinero(finalizado.total)}</strong>
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Boton to="/mis-pedidos" registro="Ver mis pedidos (pedido listo)">
              Ver mis pedidos
            </Boton>
            <Boton variante="secundario" onClick={() => navegar('/')} registro="Volver al inicio (pedido listo)">
              Volver al inicio
            </Boton>
          </div>
        </div>
      </section>
    );
  }

  if (!carrito.length) {
    return (
      <section className="seccion">
        <div className="container">
          <h1>No tienes productos para comprar</h1>
          <Boton to="/catalogo">Ir al catálogo</Boton>
        </div>
      </section>
    );
  }

  return (
    <PlantillaPagina titulo="Finalizar compra" descripcion="Completa tus datos para confirmar el pedido.">
      <Row className="g-4">
        <Col xs={12} lg={8}>
          <Form className="tarjeta-form" onSubmit={confirmar} noValidate>
            <h2>Datos del pedido</h2>
            <Row>
              <Col xs={12} md={6}>{campo('nombre', 'Nombre completo')}</Col>
              <Col xs={12} md={6}>{campo('email', 'Correo electrónico', 'email')}</Col>
              <Col xs={12} md={6}>{campo('telefono', 'Teléfono', 'tel', { placeholder: '+56 9 1234 5678' })}</Col>
              <Col xs={12} md={6}>{campo('fecha', 'Fecha deseada', 'date')}</Col>
              <Col xs={12}>{campo('direccion', 'Dirección de despacho')}</Col>
              <Col xs={12} md={6}>{campo('comuna', 'Región / Comuna', 'select', { opciones: COMUNAS })}</Col>
              <Col xs={12} md={6}>{campo('pago', 'Método de pago', 'select', { opciones: PAGOS })}</Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label as="legend" className="fs-6">
                Método de envío
              </Form.Label>
              <div>
                <Form.Check inline type="radio" id="envio-domicilio" name="envio" value="domicilio" label="Despacho a domicilio" checked={datos.envio === 'domicilio'} onChange={cambiar} />
                <Form.Check inline type="radio" id="envio-tienda" name="envio" value="tienda" label="Retiro en tienda" checked={datos.envio === 'tienda'} onChange={cambiar} />
              </div>
            </Form.Group>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="color" className="mb-3">
                  <Form.Label>Color de skin (opcional)</Form.Label>
                  <Form.Control type="color" name="color" value={datos.color} onChange={cambiar} />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="ofertas" className="mb-3">
                  <Form.Label>Ofertas por correo al mes: {datos.ofertas}</Form.Label>
                  <Form.Range name="ofertas" min="0" max="10" value={datos.ofertas} onChange={cambiar} />
                </Form.Group>
              </Col>
            </Row>

            <CampoFormulario id="notas" etiqueta="Notas (opcional)" tipo="textarea" valor={datos.notas} onChange={cambiar} />

            <Form.Check
              id="terminos"
              name="terminos"
              type="checkbox"
              className="mb-3"
              label="Acepto los términos y condiciones de compra."
              checked={datos.terminos}
              onChange={cambiar}
              isInvalid={Boolean(errores.terminos)}
              feedback={errores.terminos}
              feedbackType="invalid"
            />
            {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}
            <Boton type="submit" ancho disabled={enviando} registro="Confirmar pedido">
              {enviando ? 'Enviando pedido…' : 'Confirmar pedido'}
            </Boton>
          </Form>
        </Col>

        <Col xs={12} lg={4}>
          <ResumenPedido
            filas={[
              ...carrito.map((x) => ({ etiqueta: `${x.titulo} × ${x.cantidad}`, valor: dinero(x.precio * x.cantidad) })),
              'separador',
              { etiqueta: 'Subtotal', valor: dinero(total) },
              { etiqueta: 'Envío', valor: envio === 0 ? 'Gratis' : dinero(envio) },
              'separador',
              { etiqueta: 'Total', valor: dinero(total + envio), destacado: true },
            ]}
          >
            <p className="ayuda">Despacho gratis desde $30.000, retiro en tienda o pedidos completamente digitales.</p>
          </ResumenPedido>
        </Col>
      </Row>
    </PlantillaPagina>
  );
}
