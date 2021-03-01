import {useEffect, useState} from 'react'
import {Keyboard, KeyboardEventListener} from 'react-native'

export function useKeyboardVisibility() {
  const [keyboardShown, setKeyboardShown] = useState(false)

  const handleKeyboardWillShow: KeyboardEventListener = () => {
    setKeyboardShown(true)
  }

  const handleKeyboardWillHide: KeyboardEventListener = () => {
    setKeyboardShown(false)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow)
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide)

    return () => {
      Keyboard.removeListener('keyboardWillShow', handleKeyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', handleKeyboardWillHide)
    }
  }, [])

  return {
    keyboardShown,
  }
}
