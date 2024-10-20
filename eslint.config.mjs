import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import cypressPlugin from 'eslint-plugin-cypress';

export default [
  pluginJs.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
        it: 'readonly',  
      },
    },
    plugins: {
      prettier: prettierPlugin,
      cypress: cypressPlugin,
    },
    rules: {
      'prettier/prettier': ['error'],
      'no-unused-vars': ['warn'], 
    },
  },
];
