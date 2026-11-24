import { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useCatalogo } from '../context/CatalogoContext';
import { useAuth } from '../context/AuthContext';
import { plataformaTexto } from '../utils/format';
import { useTienda } from '../context/TiendaContext';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import ImagenPortada from '../components/atoms/ImagenPortada';
import Insignia from '../components/atoms/Insignia';
import Precio from '../components/atoms/Precio';
import Boton from '../components/atoms/Boton';

export default function DetalleProducto() {
  const { id } = useParams();
  const { buscarPorCodigo, cargando } = useCatalogo();
  const { esAdmin } = useAuth();
  const juego = buscarPorCodigo(id);
  const { agregarAlCarrito } = useTienda();

  useEffect(() => {
    registrarEvento('catalogo', juego ? `Detalle abierto: ${juego.titulo}` : `Producto inexistente: ${id}`, { idDesdeUrl: id });
  }, [id, juego]);

  if (!juego) {
    return (
      <section className="seccion">
        <div className="container">
          <h1>Producto no encontrado</h1>
          {cargando && <p className="ayuda">Buscando en el catálogo actualizado…</p>}
          <Boton to="/catalogo" registro="Volver al catálogo (producto no encontrado)">
            Volver al catálogo
          </Boton>
        </div>
      </section>
    );
  }

  return (
    <PlantillaPagina titulo={juego.titulo} migas={[{ texto: 'Catálogo', to: '/catalogo' }, { texto: juego.titulo }]}>
      <Row className="g-4 align-items-start">
        <Col xs={12} lg={6}>
          <ImagenPortada src={juego.imagen} titulo={juego.titulo} emoji={juego.emoji} grande />
        </Col>
        <Col xs={12} lg={6}>
          <article className="tarjeta-form">
            <div className="d-flex gap-2 mb-2">
              <Insignia tipo={juego.plataforma}>{plataformaTexto(juego.plataforma)}</Insignia>
              {juego.precioAnterior && <Insignia tipo="oferta">Oferta</Insignia>}
            </div>
            <h2>{juego.titulo}</h2>
            <p className="genero">{juego.genero}</p>
            <p>{juego.descripcion}</p>
            <Precio valor={juego.precio} anterior={juego.precioAnterior} grande />
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Boton
                onClick={() => agregarAlCarrito(juego)}
                disabled={juego.stock === 0}
                registro={`Agregar ${juego.titulo} (detalle)`}
              >
                {juego.stock === 0 ? 'Agotado' : '🛒 Agregar al carrito'}
              </Boton>
              {esAdmin && (
                <Boton variante="secundario" to="/admin" registro="Ir al panel admin (detalle)">
                  ⚙️ Editar en el panel
                </Boton>
              )}
              <Boton variante="secundario" to="/catalogo" registro="Volver al catálogo (detalle)">
                ← Volver al catálogo
              </Boton>
            </div>
            <div className="especificaciones">
              <h3>Ficha del videojuego</h3>
              <dl>
                <div>
                  <dt>ID recibido desde la URL</dt>
                  <dd>{id}</dd>
                </div>
                <div>
                  <dt>Plataforma</dt>
                  <dd>{plataformaTexto(juego.plataforma)}</dd>
                </div>
                <div>
                  <dt>Género</dt>
                  <dd>{juego.genero}</dd>
                </div>
                {typeof juego.stock === 'number' && (
                  <div>
                    <dt>Stock disponible</dt>
                    <dd>{juego.stock}</dd>
                  </div>
                )}
              </dl>
            </div>
          </article>
        </Col>
      </Row>
    </PlantillaPagina>
  );
}
