import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };

// Library build: one self-contained ES module for HACS / Lovelace resources.
export default defineConfig({
  define: { __VERSION__: JSON.stringify(version) },
  build: {
    target: 'es2021',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: 'src/ha-start-dashboard.ts',
      formats: ['es'],
      fileName: () => 'ha-start-dashboard.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
  test: { environment: 'node', include: ['test/**/*.test.ts'] },
});
