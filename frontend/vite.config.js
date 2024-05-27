import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: '/src/main.jsx'
    }
  },
  server: {
    port: 3000,
  },
});



