import React, {FC} from 'react'
import {StyleSheet, useWindowDimensions, View} from 'react-native'

export const TopWeightedView: FC = ({children}) => {
  const {height} = useWindowDimensions()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: height * 0.25,
    },
  })

  return <View style={styles.container}>{children}</View>
}
