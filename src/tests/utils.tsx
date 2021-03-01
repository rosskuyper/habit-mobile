import React from 'react'
import * as eva from '@eva-design/eva'
import {ApplicationProvider as UIComponentProvider} from '@ui-kitten/components'
import {MockedProvider} from '@apollo/client/testing'

type TestAppStackProps = {
  // Apollo MockProvider needs a single ReactElement and not a ReactNode
  children: React.ReactElement
}

export const TestAppStack = ({children}: TestAppStackProps) => {
  return (
    <UIComponentProvider {...eva} theme={eva.light}>
      <MockedProvider mocks={[]}>{children}</MockedProvider>
    </UIComponentProvider>
  )
}
