import * as React from 'react'
import {StyleSheet, Text, useWindowDimensions, View, Button} from 'react-native'
import {useFirebaseAuthOrError} from '../hooks/useFirebaseAuth'

/***********************************************************************************************************************
 * The exported component with a bit of wrapping business logic to happen on mount and during auth state changes
 **********************************************************************************************************************/
export const PrivateNavigation = () => {
  const {height} = useWindowDimensions()
  const {firebaseUser, signOut} = useFirebaseAuthOrError()

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
      <Text style={styles.text}>Hola, {firebaseUser.displayName}</Text>
      <Text style={styles.text}>{firebaseUser.email}</Text>
      <Text style={styles.text}>❤️</Text>

      <Button title="Sign out" onPress={signOut} />
    </View>
  )
}
