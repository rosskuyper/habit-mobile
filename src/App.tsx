import Bugsnag from '@bugsnag/react-native'
import * as eva from '@eva-design/eva'
import {ApplicationProvider as UIComponentProvider} from '@ui-kitten/components'
import React from 'react'
import 'react-native-get-random-values'
import {FirebaseAuthProvider} from './hooks/useFirebaseAuth/useFirebaseAuth'
import {TaskStateProvider} from './hooks/useTaskState/useTaskStateContext'
import Navigation from './navigation/Navigation'
import {AppApolloProvider} from './providers/apollo'

Bugsnag.start()

export const App = () => {
  return (
    <UIComponentProvider {...eva} theme={eva.light}>
      <FirebaseAuthProvider>
        <AppApolloProvider>
          <TaskStateProvider>
            <Navigation />
          </TaskStateProvider>
        </AppApolloProvider>
      </FirebaseAuthProvider>
    </UIComponentProvider>
  )
}
