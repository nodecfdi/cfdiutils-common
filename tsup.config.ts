import { defineConfig } from 'tsup';

const mainConfig = defineConfig({
  splitting: true,
  clean: true,
  experimentalDts: true,
  name: 'cfdiutils-common',
  globalName: 'cfdiutilsCommon',
  treeshake: true,
  format: ['esm', 'cjs', 'iife'],
  shims: true,
  entry: {
    'cfdiutils-common': 'src/index.ts',
  },
});

export default mainConfig;
