import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  pluginJs.configs.recommended,

  // Custom configuration
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error'],
    },
  },
];
