import * as eva from '@eva-design/eva'
import {ApplicationProvider as UIComponentProvider} from '@ui-kitten/components'
import React from 'react'
import {FirebaseAuthProvider} from './hooks/useFirebaseAuth'
import Navigation from './navigation/Navigation'
import {AppApolloProvider} from './providers/apollo'

export const App = () => {
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
