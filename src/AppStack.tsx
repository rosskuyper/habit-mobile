/**
 * This file handles the global wrappers / providers / roots / boundaries that need to be globally added to the app.
 */
import * as eva from '@eva-design/eva'
import {ApplicationProvider as UIComponentProvider} from '@ui-kitten/components'
import React from 'react'
import {App} from './App'
import {FirebaseAuthProvider} from './hooks/useFirebaseAuth'

export const AppStack: React.FC = () => {
  return (
    <UIComponentProvider {...eva} theme={eva.light}>
      <FirebaseAuthProvider>
        <App />
      </FirebaseAuthProvider>
    </UIComponentProvider>
  )
}
