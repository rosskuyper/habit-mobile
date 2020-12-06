import React from 'react'
import {Layout, Spinner} from '@ui-kitten/components'

export const LoadingSpinner = () => {
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Spinner />
    </Layout>
  )
}
