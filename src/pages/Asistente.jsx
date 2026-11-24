import { useState } from 'react';
import { Alert, Form, Spinner } from 'react-bootstrap';
import { useCatalogo } from '../context/CatalogoContext';
import { registrarEvento } from '../utils/logger';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';

const MODELOS = ['gemini-2.5-flash', 'gemini-2.5-pro'];

export default function Asistente() {
  const { productos: juegos } = useCatalogo();
  const [apiKey, setApiKey] = useState('');
  const [modelo, setModelo] = useState(MODELOS[0]);
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  async function consultar(evento) {
    evento.preventDefault();
    registrarEvento('ia', 'Consulta enviada al asistente', { modelo, pregunta, apiKey: apiKey ? '(ingresada)' : '(vacía)' });

    if (!pregunta.trim()) return setRespuesta('Escribe una pregunta primero.');
    if (!apiKey.trim()) return setRespuesta('Para llamar a Gemini debes ingresar tu propia API Key de prueba. La clave no se guarda.');

    setCargando(true);
    setRespuesta('');
    try {
      const catalogo = juegos.map((x) => `${x.titulo} (${x.plataforma}, $${x.precio})`).join(', ');
      const prompt = `Eres un asistente gamer. Responde en español y con brevedad. Catálogo: ${catalogo}. Consulta del usuario: ${pregunta}`;
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const json = await r.json();
      if (!r.ok) throw Error(json?.error?.message || 'No se pudo conectar con Gemini.');
      const texto = json?.candidates?.[0]?.content?.parts?.map((x) => x.text || '').join('\n') || 'Gemini no devolvió texto.';
      registrarEvento('ia', 'Respuesta recibida de Gemini', `${texto.slice(0, 120)}…`);
      setRespuesta(texto);
    } catch (err) {
      registrarEvento('error', `Error al consultar Gemini: ${err.message}`);
      setRespuesta(`Error de conexión: ${err.message}`);
    } finally {
      setCargando(false);
    }
  }

  return (
    <PlantillaPagina
      titulo="🤖 Asistente Gamer IA"
      descripcion="Pregunta por juegos, plataformas y recomendaciones con una clave de Gemini propia."
      angosto
    >
      <Form onSubmit={consultar} className="tarjeta-form">
        <h2>Pregúntale a la IA</h2>
        <Alert variant="warning" className="small">
          Actividad educativa: ingresa una API Key de prueba. Nunca publiques la clave. Para producción debe usarse un backend que proteja el acceso a la API.
        </Alert>
        <CampoFormulario
          id="apiKeyIA"
          etiqueta="API Key de Gemini"
          tipo="password"
          valor={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Pega aquí tu API Key de prueba"
          autoComplete="off"
        />
        <CampoFormulario
          id="modeloIA"
          etiqueta="Modelo"
          tipo="select"
          opciones={MODELOS}
          valor={modelo}
          onChange={(e) => {
            setModelo(e.target.value);
            registrarEvento('ia', `Modelo seleccionado: ${e.target.value}`);
          }}
        />
        <CampoFormulario
          id="preguntaIA"
          etiqueta="Pregúntale sobre videojuegos"
          tipo="textarea"
          valor={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="¿Qué juego de mundo abierto me recomiendas para PS5?"
        />
        <Boton type="submit" ancho disabled={cargando} registro="Preguntar al asistente">
          {cargando ? (
            <>
              <Spinner size="sm" animation="border" /> Consultando a Gemini…
            </>
          ) : (
            '🤖 Preguntar al asistente'
          )}
        </Boton>
        {respuesta && (
          <div className="respuesta-ia mt-3" role="status">
            {respuesta}
          </div>
        )}
      </Form>
    </PlantillaPagina>
  );
}
