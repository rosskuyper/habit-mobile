import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, useWindowDimensions, Button} from 'react-native'
import {GoogleSignin, GoogleSigninButton, statusCodes, User} from '@react-native-community/google-signin'

GoogleSignin.configure()

export default function App() {
  const {height} = useWindowDimensions()
  const [signinState, setSigninState] = useState('LOADING')
  const [userInfo, setUserInfo] = useState<User | undefined>()

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

  const initSignIn = async () => {
    setSigninState('IN_PROGRESS')

    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      setUserInfo(userInfo)
    } catch (error) {
      console.log('error', error)

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  const logout = async () => {
    await GoogleSignin.signOut()

    setUserInfo(undefined)
    setSigninState('LOGGED_OUT')
  }

  useEffect(() => {
    const doMountingSignin = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently()
        setUserInfo(userInfo)
        setSigninState('LOGGED_IN')
      } catch (error) {
        console.log('doMountingSigninError', error)
        setSigninState('LOGGED_OUT')

        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          // user has not signed in yet
        } else {
          // some other error
        }
      }
    }

    doMountingSignin()
  }, [])

  if (signinState === 'LOADING') {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (signinState === 'LOGGED_OUT' || !userInfo) {
    return (
      <View style={styles.container}>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={initSignIn}
          disabled={signinState === 'IN_PROGRESS'}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hola, {userInfo.user.givenName}</Text>
      <Text style={styles.text}>{userInfo.user.email}</Text>
      <Text style={styles.text}>❤️</Text>

      <Button title="Logout" onPress={logout} />
    </View>
  )
}
