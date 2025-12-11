import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  base: "./"  // مهم جدًا عشان الملفات تظهر صح على Vercel
});
