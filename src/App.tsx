import Bugsnag from '@bugsnag/react-native'
import * as eva from '@eva-design/eva'
import {ApplicationProvider as UIComponentProvider} from '@ui-kitten/components'
import React, {useEffect} from 'react'
import {Platform} from 'react-native'
import {FirebaseAuthProvider} from './hooks/useFirebaseAuth'
import Navigation from './navigation/Navigation'
import {AppApolloProvider} from './providers/apollo'

Bugsnag.start()

export const App = () => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Bugsnag.notify(new Error('Test error from ios'))
    }
  }, [])

  return (
    <UIComponentProvider {...eva} theme={eva.light}>
      <FirebaseAuthProvider>
        <AppApolloProvider>
          <Navigation />
        </AppApolloProvider>
      </FirebaseAuthProvider>
    </UIComponentProvider>
  )
}
