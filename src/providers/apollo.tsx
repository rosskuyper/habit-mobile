import React from 'react'
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache, from} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {onError} from '@apollo/client/link/error'
import {GRAPHQL_ENDPOINT} from '../Constants'
import {useFirebaseAuth} from '../hooks/useFirebaseAuth'

export const AppApolloProvider: React.FC = ({children}) => {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  })

  // We will add the apollo provider here
  const {firebaseUser} = useFirebaseAuth()

  console.log('New Apollo Provider Render')

  // The user token will change over time
  const authLink = setContext(async (_request, {headers}) => ({
    headers: {
      ...headers,
      authorization: firebaseUser ? `Bearer ${await firebaseUser.getIdToken()}` : '',
    },
  }))

  // Error Handling
  const errorLink = onError((error) => {
    console.log('GQL Error', {
      error,
      context: error.operation.getContext(),
    })
  })

  const prodApolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      //
      errorLink,
      authLink,
      httpLink,
    ]),
  })

  return <ApolloProvider client={prodApolloClient}>{children}</ApolloProvider>
}
