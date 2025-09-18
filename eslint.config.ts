import { eslintJsConfigs } from '@simbo/eslint-config/eslint-js';
import { jsdocConfigs } from '@simbo/eslint-config/jsdoc';
import { prettierConfigs } from '@simbo/eslint-config/prettier';
import { typescriptEslintConfigs } from '@simbo/eslint-config/typescript-eslint';
import { unicornConfigs } from '@simbo/eslint-config/unicorn';
import { globals, noRestrictedGlobalsRule, parser, setRulesToOff } from '@simbo/eslint-config/utils';
import eslintPluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['**/dist/', '**/coverage/', '**/node_modules/', '**/.vite/'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: {
        parser,
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: ['*.js', '.*.js'],
        extraFileExtensions: ['.vue'],
      },
    },
    extends: [
      eslintJsConfigs.browser.recommended,
      typescriptEslintConfigs.browser.recommended,
      unicornConfigs.browser.recommended,
      eslintPluginVue.configs['flat/recommended'],
      jsdocConfigs.browser.recommended,
      prettierConfigs.browser.recommended,
    ],
    rules: {
      'unicorn/catch-error-name': ['error', { ignore: ['^err(or)?_*$'] }],
      ...noRestrictedGlobalsRule({ ...globals.browser }, ['console', 'window']),
      ...setRulesToOff([
        '@typescript-eslint/require-await',
        'unicorn/prefer-global-this',
        'vue/attributes-order',
        'vue/multi-word-component-names',
      ]),
    },
  },
);
