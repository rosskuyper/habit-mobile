// @ts-ignore: untyped mocks
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)

jest.mock('react-native-safe-area-context', () => ({
  // These are just some reasonable defaults
  useSafeAreaInsets: jest.fn(() => ({
    top: 52,
    right: 0,
    bottom: 25,
    left: 0,
  })),
}))

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
