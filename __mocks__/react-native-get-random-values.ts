jest.mock('react-native-get-random-values/getRandomBase64', (arr = 'bla') =>
  Buffer.from(arr, 'base64').toString('ascii'),
)
