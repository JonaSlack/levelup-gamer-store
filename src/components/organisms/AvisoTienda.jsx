import { Toast, ToastContainer } from 'react-bootstrap';
import { useTienda } from '../../context/TiendaContext';

export default function AvisoTienda() {
  const { aviso, cerrarAviso } = useTienda();
  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed">
      <Toast show={Boolean(aviso)} onClose={cerrarAviso} delay={3000} autohide bg="dark" className="toast-tienda">
        <Toast.Header closeLabel="Cerrar aviso">
          <strong className="me-auto">🛒 LevelUp Store</strong>
        </Toast.Header>
        <Toast.Body>{aviso}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
