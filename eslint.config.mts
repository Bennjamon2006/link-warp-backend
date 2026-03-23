import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, prettier },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  tseslint.configs.recommended,
]);
