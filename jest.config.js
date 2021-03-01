module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    //
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/src/tests/jestSetup.ts',
  ],
  moduleFileExtensions: [
    //
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
}
