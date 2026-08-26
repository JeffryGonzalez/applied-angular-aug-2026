// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

const sheriff = require('@softarc/eslint-plugin-sheriff');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    plugins: { '@softarc/sheriff': sheriff },

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Decorator[expression.callee.name="Service"]',
          message: 'The @Service() decorator is not allowed. Register the service using a provider',
        },
      ],
      '@softarc/sheriff/dependency-rule': 'error',
      'no-console': 'warn',
      'no-magic-numbers': 'warn',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
