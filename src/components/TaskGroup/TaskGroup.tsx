import React from 'react'
import {StyleSheet, View, Text} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export type TaskGroupProps = {
  title: string
}

export const TaskGroup = ({title}: TaskGroupProps) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  )
}
