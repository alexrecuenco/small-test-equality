const off = 'off';

const warn = 'warn';

const error = 'error';

const TEST_ONLY_IMPORTS = ['fast-check', 'jest', 'eslint', 'prettier'];

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    'import/no-extraneous-dependencies': warn,

    // Temporal?
    'no-console': warn,
    'no-return-await': warn,
    'no-unused-vars': off,
    '@typescript-eslint/no-unused-vars': off,
    eqeqeq: [error, 'smart'],
    'no-else-return': [
      error,
      {
        allowElseIf: true,
      },
    ],
    '@typescript-eslint/unbound-method': [
      error,
      {
        ignoreStatic: true,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: TEST_ONLY_IMPORTS.map((name) => {
          return { name, message: `${name} is only available during testing` };
        }),
        patterns: TEST_ONLY_IMPORTS.map((dep) => `${dep}/*`),
      },
    ],
    camelcase: off,
    '@typescript-eslint/camelcase': off,
    'require-await': off,
    '@typescript-eslint/require-await': off,
    '@typescript-eslint/indent': off,
    '@typescript-eslint/explicit-member-accessibility': warn,
    '@typescript-eslint/no-explicit-any': off,
    '@typescript-eslint/no-unsafe-argument': off,
    '@typescript-eslint/no-unsafe-return': off,
    '@typescript-eslint/no-unsafe-assignment': off,
    '@typescript-eslint/explicit-function-return-type': off,
    '@typescript-eslint/no-var-requires': off,
    '@typescript-eslint/no-empty-function': off,
    '@typescript-eslint/no-object-literal-type-assertion': off,
    '@typescript-eslint/no-floating-promises': error,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      // TESTING CONFIGURATION
      files: [
        '**/*.test.js',
        '**/*.spec.js',
        '**/*.test.ts',
        '**/*.spec.ts',
        'tests/**/*.js',
        'tests/**/*.ts',
        '__tests__/**/*.js',
        '__tests__/**/*.ts',
        'jest.setup.js',
      ],

      // https://eslint.org/docs/user-guide/configuring#specifying-environments
      env: {
        jest: true,
      },

      // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
      // "extends": ["plugin:jest/recommended"]
      plugins: ['jest'],
      rules: {
        'no-restricted-imports': off,
        'jest/no-disabled-tests': warn,
        'jest/no-focused-tests': error,
        'jest/no-identical-title': error,
        'jest/prefer-to-have-length': warn,
        'jest/valid-expect': error,
      },
    },
  ],
};
