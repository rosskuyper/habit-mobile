import {NavigationContainer} from '@react-navigation/native'
import * as React from 'react'
import {useFirebaseAuth} from '../hooks/useFirebaseAuth'
import {SplashScreen} from '../screens/SplashScreen/SplashScreen'
import {PrivateNavigation} from './PrivateNavigation'
import {PublicNavigation} from './PublicNavigation'
import {NavigationTheme} from './Theme'

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
  return (
    <NavigationContainer theme={NavigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

function RootNavigator() {
  const {loading, firebaseUser} = useFirebaseAuth()

  // We don't know the user's state yet
  if (loading) {
    return <SplashScreen />
  }

  // The user is logged in through firebase
  if (firebaseUser) {
    return <PrivateNavigation />
  }

  // The user is not logged in at all
  return <PublicNavigation />
}
