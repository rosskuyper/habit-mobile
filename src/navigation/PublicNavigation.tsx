import * as React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {SignIn} from '../screens/Auth/SignIn'

const Stack = createStackNavigator()

// For logged out users
export const PublicNavigation = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="SignIn" component={SignIn} />
  </Stack.Navigator>
)
