jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: jest.fn(() => ({
    Operation: {
      IMPLICIT: 0,
      LOGIN: 1,
      REFRESH: 2,
      LOGOUT: 3,
    },
    Scope: {
      EMAIL: 0,
      FULL_NAME: 1,
    },

    performRequest: jest.fn(() =>
      Promise.resolve({
        identityToken: 'my-id-token',
        nonce: 'my-nonce',
      }),
    ),
  })),
}))
