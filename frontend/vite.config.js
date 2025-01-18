import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": import.meta.VITE_BACKEND_URL || "http://localhost:5000/"
    }
  }
});
