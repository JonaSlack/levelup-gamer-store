import { useEffect, useState } from 'react';
import { Alert, Form, Spinner, Table } from 'react-bootstrap';
import { usuariosApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { registrarEvento } from '../../utils/logger';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(null);
  const [error, setError] = useState('');
  const { usuario: actual } = useAuth();

  useEffect(() => {
    usuariosApi
      .listar()
      .then(setUsuarios)
      .catch((err) => setError(err.message));
  }, []);

  async function actualizar(u, cambios) {
    registrarEvento('ui', `Actualizar usuario ${u.username}`, cambios);
    setError('');
    try {
      const nuevo = await usuariosApi.actualizar(u.id, cambios);
      setUsuarios((lista) => lista.map((x) => (x.id === nuevo.id ? nuevo : x)));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!usuarios && !error) {
    return (
      <p role="status">
        <Spinner animation="border" size="sm" /> Cargando usuarios…
      </p>
    );
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {usuarios && (
        <div className="table-responsive">
          <Table variant="dark" hover className="tabla-carrito align-middle">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const soyYo = u.username === actual;
                return (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        aria-label={`Rol de ${u.username}`}
                        value={u.rol}
                        disabled={soyYo}
                        onChange={(e) => actualizar(u, { rol: e.target.value })}
                      >
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="ADMIN">ADMIN</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`activo-${u.id}`}
                        aria-label={`Cuenta activa de ${u.username}`}
                        checked={u.activo}
                        disabled={soyYo}
                        onChange={(e) => actualizar(u, { activo: e.target.checked })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
