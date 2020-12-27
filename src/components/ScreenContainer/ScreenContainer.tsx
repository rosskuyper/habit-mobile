import React from 'react'
import {SafeAreaView, StyleSheet} from 'react-native'
import {Layout, LayoutProps} from '@ui-kitten/components'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  layout: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 16,
  },
})

export const ScreenContainer: React.FC<LayoutProps> = ({style, ...layoutProps}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Layout style={[styles.layout, style]} {...layoutProps} />
    </SafeAreaView>
  )
}
