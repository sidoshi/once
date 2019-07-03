module.exports = {
  plugins: ['@typescript-eslint', 'promise'],
  parser: '@typescript-eslint/parser',

  env: {
    jest: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/babel',
  ],

  rules: {
    'no-bitwise': 'off',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-default-export': 'off',

    'no-console': 'off',
    'no-underscore-dangle': 'off',
  },
};
