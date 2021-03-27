import React from 'react'
import {TestAppStack} from '../../tests/utils'
import {LoadingSpinner} from './LoadingSpinner'
import {Spinner} from '@ui-kitten/components'

// Note: test renderer must be required after react-native.
import {render} from '@testing-library/react-native'

describe('LoadingSpinner', () => {
  it('renders', () => {
    const component = render(
      <TestAppStack>
        <LoadingSpinner />
      </TestAppStack>,
    )

    // Discouraged by RNTL but the only meaningful way to query the element
    component.UNSAFE_getByType(Spinner)

    expect(component).toMatchSnapshot()
  })
})
