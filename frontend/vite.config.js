import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/frontend',
  plugins: [react()],
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: '/src/main.jsx',
      output: {
        manualChunks: undefined,
      }
    }
  }
});



