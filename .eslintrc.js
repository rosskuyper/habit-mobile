module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'react-app'],
  plugins: ['react-native-globals'],
  rules: {
    'no-async-promise-executor': 'error',
    'require-atomic-updates': 'error',
    'array-callback-return': 'error',
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  parser: '@typescript-eslint/parser',
  env: {
    'react-native-globals/all': true,
    browser: false,
  },
}
