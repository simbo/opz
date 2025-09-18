import { builtinModules } from 'node:module';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node20',
    outDir: '.vite/build',
    emptyOutDir: false,
    lib: {
      entry: 'src/backend/main.ts',
      formats: ['es'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron', ...builtinModules, ...builtinModules.map(m => `node:${m}`)],
    },
  },
});
