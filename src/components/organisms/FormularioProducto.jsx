import { useState } from 'react';
import { Alert, Col, Form, Modal, Row } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import Boton from '../atoms/Boton';
import { registrarEvento } from '../../utils/logger';

const VACIO = {
  codigo: '',
  titulo: '',
  plataforma: 'ps5',
  genero: '',
  precio: '',
  precioAnterior: '',
  stock: '',
  descripcion: '',
  imagen: '',
  emoji: '🎮',
  destacado: false,
};

const PLATAFORMAS = [
  ['ps5', 'PlayStation 5'],
  ['pc', 'PC'],
  ['ambas', 'PS5 y PC'],
];

function desdeProducto(p) {
  if (!p) return VACIO;
  return {
    codigo: p.codigo,
    titulo: p.titulo,
    plataforma: p.plataforma,
    genero: p.genero,
    precio: String(p.precio),
    precioAnterior: p.precioAnterior ? String(p.precioAnterior) : '',
    stock: String(p.stock ?? 0),
    descripcion: p.descripcion ?? '',
    imagen: p.imagen ?? '',
    emoji: p.emoji ?? '',
    destacado: Boolean(p.destacado),
  };
}

export function validarProducto(datos) {
  const errores = {};
  if (!/^[a-z0-9-]+$/.test(datos.codigo)) errores.codigo = 'Usa minúsculas, números y guiones (ej: hollow-knight).';
  if (datos.titulo.trim().length < 2) errores.titulo = 'Ingresa el título.';
  if (!datos.genero.trim()) errores.genero = 'Ingresa el género.';
  if (!(Number(datos.precio) > 0)) errores.precio = 'El precio debe ser mayor a 0.';
  if (datos.precioAnterior && Number(datos.precioAnterior) <= Number(datos.precio)) {
    errores.precioAnterior = 'Debe ser mayor al precio actual.';
  }
  if (datos.stock === '' || Number(datos.stock) < 0 || !Number.isInteger(Number(datos.stock))) {
    errores.stock = 'Ingresa un stock entero desde 0.';
  }
  return errores;
}

export default function FormularioProducto({ producto, onGuardar, onCerrar }) {
  const [datos, setDatos] = useState(() => desdeProducto(producto));
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const editando = Boolean(producto);

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setDatos((anterior) => ({ ...anterior, [name]: type === 'checkbox' ? checked : value }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    const nuevos = validarProducto(datos);
    setErrores(nuevos);
    registrarEvento('formulario', `Formulario de producto enviado (${editando ? 'editar' : 'crear'})`, nuevos);
    if (Object.keys(nuevos).length) return;

    setGuardando(true);
    setError('');
    try {
      await onGuardar({
        ...datos,
        titulo: datos.titulo.trim(),
        genero: datos.genero.trim(),
        precio: Number(datos.precio),
        precioAnterior: datos.precioAnterior ? Number(datos.precioAnterior) : null,
        stock: Number(datos.stock),
      });
    } catch (err) {
      setErrores(err.campos ?? {});
      setError(err.message);
      setGuardando(false);
    }
  }

  const campo = (id, etiqueta, tipo = 'text', extra = {}) => (
    <CampoFormulario id={id} etiqueta={etiqueta} tipo={tipo} valor={datos[id]} onChange={cambiar} error={errores[id]} {...extra} />
  );

  return (
    <Modal show onHide={onCerrar} size="lg" centered data-bs-theme="dark">
      <Form onSubmit={guardar} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? `Editar ${producto.titulo}` : 'Nuevo producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>{campo('codigo', 'Código', 'text', { requerido: true })}</Col>
            <Col md={6}>{campo('titulo', 'Título', 'text', { requerido: true })}</Col>
            <Col md={6}>{campo('plataforma', 'Plataforma', 'select', { opciones: PLATAFORMAS })}</Col>
            <Col md={6}>{campo('genero', 'Género', 'text', { requerido: true })}</Col>
            <Col md={4}>{campo('precio', 'Precio', 'number', { requerido: true, min: 1 })}</Col>
            <Col md={4}>{campo('precioAnterior', 'Precio anterior (oferta)', 'number', { min: 0 })}</Col>
            <Col md={4}>{campo('stock', 'Stock', 'number', { requerido: true, min: 0 })}</Col>
            <Col md={9}>{campo('imagen', 'URL de la imagen')}</Col>
            <Col md={3}>{campo('emoji', 'Emoji')}</Col>
            <Col xs={12}>{campo('descripcion', 'Descripción', 'textarea')}</Col>
          </Row>
          <Form.Check
            id="destacado"
            name="destacado"
            type="switch"
            label="Mostrar en destacados del inicio"
            checked={datos.destacado}
            onChange={cambiar}
          />
          {error && (
            <Alert variant="danger" className="mt-3 mb-0">
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Boton variante="secundario" onClick={onCerrar} registro="Cancelar formulario de producto">
            Cancelar
          </Boton>
          <Boton type="submit" disabled={guardando} registro={editando ? 'Guardar cambios del producto' : 'Crear producto'}>
            {editando ? 'Guardar cambios' : 'Crear producto'}
          </Boton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
