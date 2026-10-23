import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
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
