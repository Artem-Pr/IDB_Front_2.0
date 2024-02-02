module.exports = {
  env: {
    es6: true,
    amd: true,
    browser: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
  ],
  settings: {
    react: {
      pragma: 'React', // Pragma to use, default to "React"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
    },
  },
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],

    'react/jsx-props-no-spreading': 'off',

    // Disallow reassigning function parameters
    'no-param-reassign': 'off',

    // Disallow dangling underscores in identifiers https://eslint.org/docs/latest/rules/no-underscore-dangle
    'no-underscore-dangle': 'off',

    // Disallow the unary operators ++ and -- https://eslint.org/docs/latest/rules/no-plusplus
    'no-plusplus': 'off',

    // Disallow the use of variables before they are defined. https://typescript-eslint.io/rules/no-use-before-define/
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    // allow parens in arrow function arguments as-needed https://eslint.org/docs/rules/arrow-parens
    'arrow-parens': ['error', 'as-needed'],

    // Require or disallow initialization in variable declarations https://eslint.org/docs/rules/init-declarations
    'init-declarations': ['error', 'always'],

    // Enforce consistent linebreak style https://eslint.org/docs/latest/rules/linebreak-style
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],

    // DEPRECATED Enforce a maximum line length https://eslint.org/docs/latest/rules/max-len
    'max-len': ['error', {
      code: 125,
      ignoreUrls: true,
      ignoreStrings: true,
      ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
    },
    ],

    // Require a newline after each call in a method chain https://eslint.org/docs/rules/newline-per-chained-call
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],

    // Enforce newlines between operands of ternary expressions https://eslint.org/docs/rules/multiline-ternary
    'multiline-ternary': ['error', 'always-multiline'],

    // Disallow assigning to imported bindings https://eslint.org/docs/rules/no-import-assign
    'no-import-assign': 'error',

    // allow use of void operator as statement
    'no-void': ['error', { allowAsStatement: true }], // https://eslint.org/docs/rules/no-void

    // Disallow the use of console https://eslint.org/docs/rules/no-console
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

    // Prevent usage of Array index in keys https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
    'react/no-array-index-key': 'off',

    // Enforce a specific function type for function components https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],

    // Enforce a defaultProps definition for every prop that is not a required prop https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
    'react/require-default-props': 0,

    // not require onClick be accompanied by onKeyUp/onKeyDown/onKeyPress
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
    'jsx-a11y/click-events-have-key-events': 'off',

    // Enforce consistent indentation https://typescript-eslint.io/rules/indent
    indent: 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    '@typescript-eslint/indent': ['error', 2],

    // Disallow unused variables. https://typescript-eslint.io/rules/no-unused-vars/
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],

    // An unused expression which has no effect on the state of the program indicates a logic error.
    // https://eslint.org/docs/latest/rules/no-unused-expressions
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

    // Enforce consistent spacing inside braces https://eslint.org/docs/rules/object-curly-spacing
    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],

    // Disallow the any type. https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
    '@typescript-eslint/no-explicit-any': ['off', { ignoreRestArgs: true }],

    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.{ts,tsx,js,jsx}', '**/*.stories.tsx'] }],

    // When there is only a single export from a module, prefer using default export over named export.
    'import/prefer-default-export': 'off', // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md

    // Enforce a convention in module import order
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#groups-array
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
        order: 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
        caseInsensitive: false, /* ignore case. Options: [true, false] */
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
    // Configuration for custom labels and/or input so label don't require associated control
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
    'jsx-a11y/label-has-associated-control': [2, {
      labelComponents: ['CustomInputLabel'],
      labelAttributes: ['label'],
      controlComponents: ['CustomInput'],
      depth: 3,
    }],
  },
  ignorePatterns: [
    '.babelrc.js',
    'dev-backend',
    'setupProxy.js',
    'jest.config.js',
    'coverage',
    'node_modules',
    'build',
    'webpack',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
}
