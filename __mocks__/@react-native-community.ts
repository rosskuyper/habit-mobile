jest.mock('@react-native-community/google-signin', () => {
  return {
    GoogleSignin: {
      signIn: jest.fn(() =>
        Promise.resolve({
          idToken: 'my-id-token',
        }),
      ),
      configure: jest.fn(),
    },
  }
})
