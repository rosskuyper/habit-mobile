import React from 'react'
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native'

export default function App() {
  const {height} = useWindowDimensions()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingTop: height / 3,
    },
    text: {
      fontSize: 18,
      marginBottom: 14,
    },
  })

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hola, Rou</Text>
      <Text style={styles.text}>Does this count?</Text>
      <Text style={styles.text}>❤️</Text>
    </View>
  )
}
