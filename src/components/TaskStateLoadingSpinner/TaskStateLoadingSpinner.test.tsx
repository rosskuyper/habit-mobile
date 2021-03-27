import React from 'react'
import {TestAppStack} from '../../tests/utils'
import {TaskStateLoadingSpinner} from './TaskStateLoadingSpinner'
import {TaskStateProvider} from '../../hooks/useTaskState/useTaskStateContext'

// Note: test renderer must be required after react-native.
import {render, waitFor} from '@testing-library/react-native'
import {Spinner} from '@ui-kitten/components'

describe('TaskStateLoadingSpinner', () => {
  it('renders', () => {
    const component = render(
      <TestAppStack>
        <TaskStateProvider>
          <TaskStateLoadingSpinner />
        </TaskStateProvider>
      </TestAppStack>,
    )

    // Validate against snapshot
    expect(component).toMatchSnapshot()

    // The StateProvider should update and then unmount the spinner
    waitFor(() => component.UNSAFE_queryAllByType(Spinner).length === 0)
  })
})
