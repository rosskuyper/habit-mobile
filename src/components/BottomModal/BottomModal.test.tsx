import {Text} from 'react-native'
import React from 'react'
import {TestAppStack} from '../../tests/utils'
import {BottomModal} from './BottomModal'
import Modal from 'react-native-modal'

// Note: test renderer must be required after react-native.
import {render} from '@testing-library/react-native'

describe('BottomModal', () => {
  it('renders', () => {
    const MODAL_TEXT = 'Test Bottom Modal'

    const component = render(
      <TestAppStack>
        <BottomModal closeModal={jest.fn()} isVisible={true}>
          <Text>{MODAL_TEXT}</Text>
        </BottomModal>
      </TestAppStack>,
    )

    // Ensure expected elements exist
    // @ts-ignore: react-native-modal type hackery confusing checker
    component.UNSAFE_getByType(Modal)
    component.UNSAFE_getByType(BottomModal)
    component.getByText(MODAL_TEXT)

    expect(component).toMatchSnapshot()
  })
})
