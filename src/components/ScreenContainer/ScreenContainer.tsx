import React from 'react'
import {SafeAreaView, StyleProp, StyleSheet, ViewStyle} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
})

type ScreenContainerProps = {
  style?: StyleProp<ViewStyle>
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({children, style}) => {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
}
