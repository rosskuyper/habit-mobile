import React from 'react'
import {TestAppStack} from '../../tests/utils'
import {ScreenContainer} from './ScreenContainer'
import {Text} from 'react-native'

// Note: test renderer must be required after react-native.
import {render} from '@testing-library/react-native'

describe('ScreenContainer', () => {
  it('renders', () => {
    const CONTENT = 'Some contained content'
    const component = render(
      <TestAppStack>
        <ScreenContainer>
          <Text>{CONTENT}</Text>
        </ScreenContainer>
      </TestAppStack>,
    )

    // Ensure expected elements exist
    component.getByText(CONTENT)

    // Validate against snapshot
    expect(component).toMatchSnapshot()
  })
})
