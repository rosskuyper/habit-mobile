jest.mock('@react-native-firebase/auth', () => ({
  signOut: jest.fn(),
  signInWithCredential: jest.fn(),
  onAuthStateChanged: jest.fn(),

  AppleAuthProvider: jest.fn(() => ({
    credential: jest.fn(),
  })),
  GoogleAuthProvider: jest.fn(() => ({
    credential: jest.fn(),
  })),
}))
