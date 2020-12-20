/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me_user {
  __typename: 'UserSchema'
  sub: string
}

export interface Me_me {
  __typename: 'MeSchema'
  user: Me_me_user
}

export interface Me {
  me: Me_me
}
