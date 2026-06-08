import { defineConfig } from 'vite';

// Library mode: single self-contained ES module that bundles Lit + helpers.
// Output is dist/brevia-card.js — the file referenced as a Lovelace resource.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/brevia-card.ts',
      formats: ['es'],
      fileName: () => 'brevia-card.js',
    },
    rollupOptions: {
      // Nothing is external — HA does not share Lit with custom cards.
      external: [],
      output: {
        // A Lovelace resource is a SINGLE file. Inline the lazily-imported
        // editor so there are no sibling chunk files to deploy.
        inlineDynamicImports: true,
      },
    },
    target: 'es2021',
    minify: 'esbuild',
    sourcemap: false,
  },
});
