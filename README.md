# LevelUp Store

Tienda de videojuegos para PS5 y PC hecha con React + Vite y React-Bootstrap. Versión React del proyecto original en HTML/CSS/JS ([version_final](https://github.com/JonaSlack/version_final)).

## Tecnologías

- React 19, React Router 7
- React-Bootstrap / Bootstrap 5
- Vite
- Vitest, Testing Library, Playwright

## Backend

Esta app consume la API REST de [levelup-store-backend](https://github.com/JonaSlack/levelup-store-backend) (Spring Boot + JWT + MySQL). Las llamadas se hacen a `/api` y Vite las redirige al backend (`http://localhost:8080` por defecto).

Si el backend está en otra dirección:

```bash
API_PROXY=http://IP_DEL_BACKEND:8080 npm run dev
```

O bien definir `VITE_API_URL` con la URL completa de la API (ver `.env.example`).

## Cómo ejecutar

1. Levantar el backend (`mvn spring-boot:run` en el proyecto del backend).
2. En este proyecto:

```bash
npm install
npm run dev
```

Abrir http://localhost:5173

Usuarios de prueba:

| Usuario | Contraseña | Rol |
|---|---|---|
| goku | 1234 | CLIENTE |
| admin | admin123 | ADMIN |

## Sesión y roles

- Al iniciar sesión el backend entrega un **access token** (JWT, 15 min) y un **refresh token** (7 días). Ambos se guardan en `sessionStorage`, por eso la sesión se mantiene al recargar la página.
- `src/services/api.js` agrega `Authorization: Bearer <token>` a cada petición. Si la API responde 401, pide un token nuevo con el refresh token y repite la petición; si no puede renovarlo, cierra la sesión.
- Al recargar, `AuthContext` valida el token con `GET /api/auth/me`.
- `ProtectedRoute` bloquea rutas sin sesión (`/checkout`, `/mis-pedidos`) y por rol (`/admin` solo ADMIN → si no, `/acceso-denegado`).
- El menú muestra "Mis pedidos" con sesión y "Admin" solo al rol ADMIN.

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
├── context/      # AuthContext, CatalogoContext, TiendaContext (carrito)
├── services/     # api.js: cliente REST con JWT
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

Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml`: corre las pruebas, hace el build y publica en GitHub Pages (solo la parte visual; la API corre en la instancia EC2).

Para activarlo: Settings → Pages → Source: GitHub Actions.

## Notas

- El catálogo, los pedidos y las cuentas viven en el backend. Si la API no responde, el catálogo muestra los datos base de `src/data/juegos.js` sin stock.
- El carrito se guarda en `localStorage`.
- No hay pagos reales.
- El asistente IA usa la API de Gemini y necesita una API Key propia.
