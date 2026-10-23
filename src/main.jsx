import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { registrarEvento } from './utils/logger';

registrarEvento('ui', 'Aplicación LevelUp Store iniciada (React + Vite + React-Bootstrap)');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
