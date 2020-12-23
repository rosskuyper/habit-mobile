import {useQuery} from '@apollo/client'
import * as React from 'react'
import {StyleSheet, Text, useWindowDimensions, View, Button} from 'react-native'
import {QUERY_ME} from '../api/queries'
import {Me} from '../api/__types__/Me'
import {env} from '../Constants'
import {useFirebaseAuthOrError} from '../hooks/useFirebaseAuth'

/***********************************************************************************************************************
 * The exported component with a bit of wrapping business logic to happen on mount and during auth state changes
 **********************************************************************************************************************/
export const PrivateNavigation = () => {
  const {height} = useWindowDimensions()
  const {firebaseUser, signOut} = useFirebaseAuthOrError()

  useQuery<Me>(QUERY_ME)

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
      <Text style={styles.text}>Hey, {firebaseUser.displayName}</Text>
      <Text style={styles.text}>{firebaseUser.email}</Text>
      <Text style={styles.text}>❤️</Text>

      <Text>GRAPHQL_ENDPOINT: {env.GRAPHQL_ENDPOINT}</Text>
      <Text>FIREBASE_WEB_CLIENT_ID: {env.FIREBASE_WEB_CLIENT_ID}</Text>
      <Text>NODE_ENV: {env.NODE_ENV}</Text>

      <Button title="Sign out" onPress={signOut} />
    </View>
  )
}
