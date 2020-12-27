import {useEffect, useRef} from 'react'
import {Keyboard, KeyboardEvent} from 'react-native'
import Animated, {Easing} from 'react-native-reanimated'

export const useKeyboardPaddingBottom = () => {
  const paddingBottom = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateKeyboard = (show: boolean) => (event: KeyboardEvent) => {
      const height = show ? event.endCoordinates.height : 0

      const timingConfig = {
        toValue: height,
        duration: 175,
        easing: Easing.inOut(Easing.inOut(Easing.quad)),
      }

      Animated.timing(paddingBottom, timingConfig).start()
    }

    const hideKeyboard = animateKeyboard(false)
    const showKeyboard = animateKeyboard(true)
    const refreshKeyboard = animateKeyboard(true) // recreated for removelistener compat

    Keyboard.addListener('keyboardWillHide', hideKeyboard)
    Keyboard.addListener('keyboardWillShow', showKeyboard)
    Keyboard.addListener('keyboardWillChangeFrame', refreshKeyboard)

    return () => {
      Keyboard.removeListener('keyboardWillHide', hideKeyboard)
      Keyboard.removeListener('keyboardWillShow', showKeyboard)
      Keyboard.removeListener('keyboardWillChangeFrame', refreshKeyboard)
    }
  })

  return {
    paddingBottom,
  }
}
