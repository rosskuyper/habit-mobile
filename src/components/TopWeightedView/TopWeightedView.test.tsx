import React from 'react'
import {Text} from 'react-native'
import {TestAppStack} from '../../tests/utils'
import {TopWeightedView} from './TopWeightedView'

// Note: test renderer must be required after react-native.
import {render} from '@testing-library/react-native'

describe('TopWeightedView', () => {
  it('renders', () => {
    const TEXT = 'Test Top Weighted View'

    const component = render(
      <TestAppStack>
        <TopWeightedView>
          <Text>{TEXT}</Text>
        </TopWeightedView>
      </TestAppStack>,
    )

    // Ensure expected elements exist
    component.getByText(TEXT)

    // Validate against snapshot
    expect(component).toMatchSnapshot()
  })
})
