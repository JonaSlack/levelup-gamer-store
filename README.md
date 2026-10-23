# LevelUp Store

Tienda de videojuegos para PS5 y PC hecha con React + Vite y React-Bootstrap. Versión React del proyecto original en HTML/CSS/JS ([version_final](https://github.com/JonaSlack/version_final)).

## Tecnologías

- React 19, React Router 7
- React-Bootstrap / Bootstrap 5
- Vite
- Vitest, Testing Library, Playwright

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abrir http://localhost:5173

Usuario de prueba: `goku` / `1234`

## Estructura

Los componentes están organizados con Atomic Design:

```
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/
├── routes/
├── context/
├── hooks/
├── data/
└── utils/
```

## Pruebas

```bash
npm run test:run            # unitarias (jsdom)
npm run test:node           # lógica del carrito con node:test
npx playwright install chromium
npm run test:browser:run    # pruebas en Chromium
```

## Despliegue

Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml`: corre las pruebas, hace el build y publica en GitHub Pages.

Para activarlo: Settings → Pages → Source: GitHub Actions.

## Notas

- No hay backend: el carrito y las cuentas se guardan en `localStorage` y la sesión en `sessionStorage`.
- El checkout es una simulación, no hay pagos reales.
- El asistente IA usa la API de Gemini y necesita una API Key propia.
