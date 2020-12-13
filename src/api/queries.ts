import {gql} from '@apollo/client'

export const GET_SIGNIN_OPTIONS = gql`
  query GetSignInOptions {
    getSignInOptions {
      clientId
      authorizeUri
      responseType
      redirectUri
      scope
      identityProvider
    }
  }
`
