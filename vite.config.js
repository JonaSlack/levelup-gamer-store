import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// en desarrollo y en preview las llamadas a /api (y Swagger) se envían al backend Spring Boot
const backend = { target: process.env.API_PROXY || 'http://localhost:8080', changeOrigin: true };
const proxy = {
  '/api': backend,
  '/swagger-ui': backend,
  '/v3/api-docs': backend,
};

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    exclude: [
      'src/**/*.node.test.{js,jsx}',
      'src/**/*.browser.test.{js,jsx}',
      '**/node_modules/**'
    ],
    clearMocks: true
  }
});
