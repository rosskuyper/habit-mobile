/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSignInOptions
// ====================================================

export interface GetSignInOptions_getSignInOptions {
  __typename: 'SignInOption'
  clientId: string
  authorizeUri: string
  responseType: string
  redirectUri: string
  scope: string
  identityProvider: string
}

export interface GetSignInOptions {
  getSignInOptions: GetSignInOptions_getSignInOptions[]
}
