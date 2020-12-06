import React from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
})

export const ScreenContainer: React.FC = ({children}) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>
}
