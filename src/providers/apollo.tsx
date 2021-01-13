import React from 'react'
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache, from} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'
import {onError} from '@apollo/client/link/error'
import {env} from '../Constants'
import {useFirebaseAuth} from '../hooks/useFirebaseAuth'

export const AppApolloProvider: React.FC = ({children}) => {
  const httpLink = new HttpLink({
    uri: env.GRAPHQL_ENDPOINT,
  })

  // We will add the apollo provider here
  const {firebaseUser} = useFirebaseAuth()

  // The user token will change over time
  const authLink = setContext(async (_request, {headers}) => {
    const authorization = firebaseUser ? `Bearer ${await firebaseUser.getIdToken()}` : ''

    return {
      headers: {
        ...headers,
        authorization,
      },
    }
  })

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
