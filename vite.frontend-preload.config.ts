import { builtinModules } from 'node:module';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: '.vite/build',
    emptyOutDir: false,
    lib: {
      entry: 'src/frontend/preload.ts',
      formats: ['es'],
      fileName: () => 'preload.js',
    },
    rollupOptions: {
      external: ['electron', ...builtinModules, ...builtinModules.map(m => `node:${m}`)],
    },
  },
});
