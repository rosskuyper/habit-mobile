module.exports = {
  extends: [
    //
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'react-app',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/recommended',
  ],
  plugins: [
    //
    'react-native-globals',
    'testing-library',
    'jest-dom',
  ],
  rules: {
    'no-async-promise-executor': 'error',
    'require-atomic-updates': 'error',
    'array-callback-return': 'error',
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-shadow': 'error',
  },
  parser: '@typescript-eslint/parser',
  env: {
    'react-native-globals/all': true,
    browser: false,
  },
}
