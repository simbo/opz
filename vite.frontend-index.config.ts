import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  root: 'src/frontend',

  plugins: [vue()],

  publicDir: 'public',

  build: {
    outDir: '../../.vite/frontend/main_window',
    emptyOutDir: true,
    target: 'node20',
    rollupOptions: {
      input: 'src/frontend/index.html',
    },
    chunkSizeWarningLimit: 1000,
  },

  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['src/frontend/styles'],
      },
    },
  },

  clearScreen: false,

  server: {
    strictPort: false,
  },
});
