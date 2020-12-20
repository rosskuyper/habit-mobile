import React, {useState, useEffect, useContext, createContext} from 'react'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import {GoogleSignin} from '@react-native-community/google-signin'
import {appleAuth} from '@invertase/react-native-apple-authentication'
import {env} from '../Constants'

GoogleSignin.configure({
  webClientId: env.FIREBASE_WEB_CLIENT_ID,
})

/**
 * `loading` is initially false (on app lanuch) and is set to true once we
 * have a definitive answer about the user's state
 */
export type AuthContext = {
  loading: boolean
  inProgress: boolean
  error?: any
  firebaseUser: FirebaseAuthTypes.User | null
  signOut: () => Promise<void>
  initGoogleSignIn: () => Promise<void>
  initAppleSignIn: () => Promise<void>
}

export type GuaranteedAuthContext = AuthContext & {
  firebaseUser: FirebaseAuthTypes.User
}

const defaultAuth: AuthContext = {
  loading: true,
  inProgress: false,
  firebaseUser: null,
  signOut: async () => {
    throw new Error('Incorrect useAuth usage')
  },
  initGoogleSignIn: async () => {
    throw new Error('Incorrect useAuth usage')
  },
  initAppleSignIn: async () => {
    throw new Error('Incorrect useAuth usage')
  },
}

const authContext = createContext<AuthContext>(defaultAuth)

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const FirebaseAuthProvider: React.FC = ({children}) => {
  const authValue = useFirebaseAuthProvider()

  return <authContext.Provider value={authValue}>{children}</authContext.Provider>
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useFirebaseAuth = () => {
  return useContext(authContext)
}

export const useFirebaseAuthOrError = (): GuaranteedAuthContext => {
  // Destructuring helps typescript be happy
  const {firebaseUser, ...hook} = useFirebaseAuth()

  // This hook is intended to be used in places we are guaranteed to have a firebase user
  if (!firebaseUser) {
    throw new Error('Trying to get a guaranteed firebase user before one has been configured.')
  }

  return {
    firebaseUser,
    ...hook,
  }
}

// Provider hook that creates auth object and handles state
function useFirebaseAuthProvider() {
  // These state items would be more performant as a reducer
  const [loading, setLoading] = useState<boolean>(true)
  const [inProgress, setInProgress] = useState<boolean>(false)
  const [error, setError] = useState<any | undefined>()
  const [firebaseUser, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  /*****************************************************
   * Wrap any Firebase methods we want to use
   *****************************************************/
  const signOut = async () => {
    // Kill Firebase
    // This will trigger the onAuthStateChange, updating the local state
    await auth().signOut()
  }

  const initGoogleSignIn = async () => {
    setInProgress(true)

    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn()

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential)

      setInProgress(false)
    } catch (signInError) {
      setError(signInError)
      setInProgress(false)
    }
  }

  const initAppleSignIn = async () => {
    setInProgress(true)

    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned')
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)

      // Sign-in the user with the credential
      await auth().signInWithCredential(appleCredential)

      setInProgress(false)
    } catch (signInError) {
      setError(signInError)
      setInProgress(false)
    }
  }

  /*************************************************************************
   * Subscribe to auth state changes and propagate them through local state
   * Having this in context ensures this only happens once in the app
   *************************************************************************/
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((incomingUser) => {
      if (incomingUser) {
        if (!incomingUser.email) {
          throw new Error('Firebase user does not have an email address set')
        }

        setUser(incomingUser)
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Return the user object and auth methods
  return {
    loading,
    inProgress,
    error,
    firebaseUser,
    signOut,
    initGoogleSignIn,
    initAppleSignIn,
  }
}
