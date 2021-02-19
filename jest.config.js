module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    './__mocks__/@react-native-firebase.ts',
    './__mocks__/react-native-get-random-values.ts',
    './__mocks__/@react-native-community.ts',
    './__mocks__/@invertase-react-native-apple-authentication.ts',
    './__mocks__/@react-native-async-storage.ts',
  ],
  testEnvironment: 'jsdom',
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
