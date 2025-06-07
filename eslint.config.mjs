import tseslint from 'typescript-eslint'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  {
    ignores: [
      '.git',
      '.idea',
      '.vscode',
      'node_modules',
      '.babelrc.js',
      'dev-backend',
      'setupProxy.js',
      'jest.config.js',
      'lint-staged.config.js',
      'coverage',
      'build',
      'webpack',
      'rspack',
      'test',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      import: eslintPluginImport,
      'jsx-a11y': eslintPluginJsxA11y,
    },
    settings: {
      react: {
        pragma: 'React', // Specify pragma for React (defaults to 'React')
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      // Allow arrow function parameters to omit parentheses when not needed https://eslint.org/docs/rules/arrow-parens
      'arrow-parens': ['error', 'as-needed'],

      // Always initialize variables when declared https://eslint.org/docs/rules/init-declarations
      'init-declarations': ['error', 'always'],

      // Enforce consistent linebreak style depending on the OS https://eslint.org/docs/rules/linebreak-style
      'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],

      // Limit maximum line length https://eslint.org/docs/rules/max-len
      'max-len': ['error', {
        code: 125,
        ignoreUrls: true,
        ignoreStrings: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
      }],

      // Require newlines after chained method calls to improve readability https://eslint.org/docs/rules/newline-per-chained-call
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],

      // Use multiline formatting for ternary expressions https://eslint.org/docs/rules/multiline-ternary
      'multiline-ternary': ['error', 'always-multiline'],

      // Disallow console usage except for warn, error and info https://eslint.org/docs/rules/no-console
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

      // Disallow reassigning function parameters https://eslint.org/docs/rules/no-param-reassign
      'no-param-reassign': 'off',

      // Allow the use of ++ and -- https://eslint.org/docs/rules/no-plusplus
      'no-plusplus': 'off',

      // Allow identifiers with dangling underscores https://eslint.org/docs/rules/no-underscore-dangle
      'no-underscore-dangle': 'off',

      // Disallow use of void except as statements https://eslint.org/docs/rules/no-void
      'no-void': ['error', { allowAsStatement: true }],

      // Disable base indent rules and use TypeScript-specific rule https://typescript-eslint.io/rules/indent
      'indent': ['error', 2],
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',

      // Disallow usage of variables before they are defined https://typescript-eslint.io/rules/no-use-before-define
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',

      // Disallow unused expressions except for short-circuiting and ternary expressions https://typescript-eslint.io/rules/no-unused-expressions
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

      // Disallow unused variables with TypeScript-specific rule https://typescript-eslint.io/rules/no-unused-vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],

      // Allow use of 'any' type (should be avoided when possible) https://typescript-eslint.io/rules/no-explicit-any
      '@typescript-eslint/no-explicit-any': ['off', { ignoreRestArgs: true }],

      // Disallow empty lines between class members except after single-line members https://typescript-eslint.io/rules/lines-between-class-members
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

      // Enforce consistent spacing inside curly braces https://eslint.org/docs/rules/object-curly-spacing
      'object-curly-spacing': ['error', 'always'],

      // Enforce default function component style in React https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
      'react/function-component-definition': ['error', {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      }],

      // Allow props spreading in JSX https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
      'react/jsx-props-no-spreading': 'off',

      // Do not enforce defaultProps for non-required props https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
      'react/require-default-props': 'off',

      // Allow usage of array index as keys in React lists https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
      'react/no-array-index-key': 'off',

      // Allow nested ternary expressions https://eslint.org/docs/rules/no-nested-ternary
      'no-nested-ternary': 'off',

      // Allow click events without keyboard events for accessibility https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
      'jsx-a11y/click-events-have-key-events': 'off',

      // Custom input label configuration for accessibility checks https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
      'jsx-a11y/label-has-associated-control': [2, {
        labelComponents: ['CustomInputLabel'],
        labelAttributes: ['label'],
        controlComponents: ['CustomInput'],
        depth: 3,
      }],

      // Allow named exports even when only one is exported https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md
      'import/prefer-default-export': 'off',

      // Allow importing devDependencies in any file https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
      'import/no-extraneous-dependencies': [
        'error', { devDependencies: true },
      ],

      // Enforce import order and grouping for readability https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
      'import/order': ['error', {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        pathGroups: [
          {
            pattern: 'react*',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'src/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '*.+(scss|css|json)',
            group: 'index',
            patternOptions: { matchBase: true },
            position: 'after',
          },
        ],
        warnOnUnassignedImports: true,
        pathGroupsExcludedImportTypes: ['builtin'],
      }],

      // Disable core semi rule, enable TypeScript-specific semi rule instead https://typescript-eslint.io/rules/semi
      'semi': ['error', 'never'],
    },
  },
)