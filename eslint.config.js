import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
        // Svelte 5 runes
        $state: 'readonly',
        $derived: 'readonly',
        $effect: 'readonly',
        $props: 'readonly',
        $bindable: 'readonly',
        $inspect: 'readonly',
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      // Enforce soft tabs (spaces instead of tabs)
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-tabs': 'error',
      // Enforce consistent line endings (Unix)
      'linebreak-style': ['error', 'unix'],
      // Disallow trailing whitespace at the end of lines
      'no-trailing-spaces': [
        'error',
        {
          skipBlankLines: false,
          ignoreComments: false,
        },
      ],
      // Ensure newline at end of file
      'eol-last': ['error', 'always'],

      // Prettier integration
      'prettier/prettier': 'error',

      // Import statement best practices
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins
            ['^node:'],
            // External packages
            ['^@?\\w'],
            // Internal packages starting with $app
            ['^\\$app'],
            // Internal packages starting with $lib
            ['^\\$lib'],
            // Internal packages starting with $components
            ['^\\$components'],
            // Internal packages starting with $queries
            ['^\\$queries'],
            // Internal packages starting with $config
            ['^\\$config'],
            // Internal packages starting with $api
            ['^\\$api'],
            // Internal packages starting with $routes
            ['^\\$routes'],
            // Style imports
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-duplicate-imports': 'error',

      // Disallow console statements - use logger instead
      'no-console': 'error',

      // Enforce absolute imports - no relative imports allowed (except CSS)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*.js', '../*.svelte', './*.js', './*.svelte'],
              message:
                'Relative imports are not allowed. Use absolute imports with $lib/, $components/, $config/, $queries/, $api, or $routes aliases instead.',
            },
          ],
        },
      ],

      // Prevent hardcoded route strings - use centralized route constants
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value="/listings"]',
          message:
            'Hardcoded route "/listings" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.LISTINGS instead.',
        },
        {
          selector: 'Literal[value="/contact-us"]',
          message:
            'Hardcoded route "/contact-us" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.CONTACT_US instead.',
        },
        {
          selector: 'Literal[value="/apartments"]',
          message:
            'Hardcoded route "/apartments" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.APARTMENTS instead.',
        },
        {
          selector: 'Literal[value="/neighborhood"]',
          message:
            'Hardcoded route "/neighborhood" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.NEIGHBORHOOD instead.',
        },
      ],
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: js,
      },
    },
    rules: {
      // Enforce Svelte 5 best practices
      'svelte/no-at-html-tags': 'error',
      'svelte/no-at-debug-tags': 'warn',
      'svelte/no-inner-declarations': 'error',
      'svelte/spaced-html-comment': 'warn',

      // Svelte 5 specific rules
      'svelte/valid-compile': 'error',
      'svelte/no-immutable-reactive-statements': 'error',

      // Enforce runes usage in Svelte 5
      'svelte/no-reactive-literals': 'error',
      'svelte/no-reactive-functions': 'error',
      'svelte/require-each-key': 'error',

      // Enforce runes for reactive state (custom rule)
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'Program > VariableDeclaration[declarations.0.init.type!="CallExpression"]:has(VariableDeclarator[id.name=/^(show|is|has|loading|selected|current|edit|preview|upload|generating|saving|new)/])',
          message:
            'Reactive variables should use $state() rune in Svelte 5. Use "let variableName = $state(initialValue)" instead of "let variableName = initialValue"',
        },
        {
          selector:
            'Program > VariableDeclaration[declarations.0.init.type!="CallExpression"]:has(VariableDeclarator[id.name=/Mode$/])',
          message:
            'Mode variables should use $state() rune in Svelte 5. Use "let variableName = $state(false)" instead of "let variableName = false"',
        },
        {
          selector: 'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name]',
          message:
            'Legacy "export let" syntax detected. Use "let { propName } = $props()" instead for Svelte 5.',
        },
        {
          selector: 'CallExpression[callee.name="$:"]',
          message: 'Legacy reactive statement "$:" detected. Use $derived() instead for Svelte 5.',
        },
        {
          selector: 'JSXElement[openingElement.name.name="slot"]',
          message: 'Legacy <slot> detected. Use {@render children()} instead for Svelte 5.',
        },
        {
          selector: 'Literal[value="/listings"]',
          message:
            'Hardcoded route "/listings" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.LISTINGS instead.',
        },
        {
          selector: 'Literal[value="/contact-us"]',
          message:
            'Hardcoded route "/contact-us" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.CONTACT_US instead.',
        },
        {
          selector: 'Literal[value="/apartments"]',
          message:
            'Hardcoded route "/apartments" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.APARTMENTS instead.',
        },
        {
          selector: 'Literal[value="/neighborhood"]',
          message:
            'Hardcoded route "/neighborhood" is not allowed. Import ROUTES from "$lib/config/routes.js" and use ROUTES.NEIGHBORHOOD instead.',
        },
      ],

      // Enforce modern event handlers (onclick instead of on:click)
      'svelte/prefer-style-directive': 'warn',
      'svelte/prefer-class-directive': 'warn',

      // General best practices
      'svelte/no-useless-mustaches': 'warn',
      'svelte/html-quotes': ['warn', { prefer: 'double' }],

      // Disable navigation resolve warning - we're using data-sveltekit-preload-data
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
  {
    // Exception for logger.js - allow console statements
    files: ['**/logger.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'build/',
      '.svelte-kit/',
      'dist/',
      'node_modules/',
      // Ignore shadcn-svelte generated UI components to avoid parsing errors
      'src/lib/components/ui/**/*.svelte',
      // Ignore routes config file - it's allowed to have hardcoded route strings
      'src/lib/config/routes.js',
    ],
  },
  {
    // Exception for CLI scripts - allow console statements
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Exception for shadcn-svelte UI components - they use Svelte 5 syntax
    files: ['src/lib/components/ui/**/*.svelte'],
    rules: {
      // Disable parsing errors for Svelte 5 runes in third-party components
      'no-unused-vars': 'off',
      'svelte/valid-compile': 'off',
    },
  },
  {
    // Exception for routes.js - allow route strings in the routes config file
    // This must come after all other configs to properly override the route restrictions
    files: ['src/lib/config/routes.js', '**/config/routes.js', '**/routes.js'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  // Prettier config should be last to override conflicting rules
  prettierConfig,
];
