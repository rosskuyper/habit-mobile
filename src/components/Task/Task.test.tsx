import React from 'react'
import {TestAppStack} from '../../tests/utils'
import {Task, NewTask, NewTaskProps} from './Task'
import {Task as TaskType} from '../../hooks/useTaskState/reducer'
import {CheckBox} from '@ui-kitten/components'

// Note: test renderer must be required after react-native.
import {render, fireEvent} from '@testing-library/react-native'
import '@testing-library/jest-native'

const testTask: TaskType = {
  id: 'task-1',
  text: 'Some test task',
  order: 1,
}

const testNewTask: NewTaskProps = {
  taskGroupId: 'task-group-1',
}

describe('Task', () => {
  it('renders', () => {
    const component = render(
      <TestAppStack>
        <Task task={testTask} />
      </TestAppStack>,
    )

    // Ensure expected elements exist
    component.getByText(testTask.text)

    // Validate against snapshot
    expect(component).toMatchSnapshot()
  })

  it('responds to a user press by checking the checkbox and striking out the text', () => {
    const component = render(
      <TestAppStack>
        <Task task={testTask} />
      </TestAppStack>,
    )

    // Get the checkbox
    const taskCheckbox = component.UNSAFE_getByType(CheckBox)

    // Starts off as false
    expect(taskCheckbox.props.checked).toBe(false)

    // Change the checkbox directly
    fireEvent(taskCheckbox, 'change', true)

    // Validate final state
    expect(taskCheckbox.props.checked).toBe(true)
    expect(component.getByText(testTask.text)).toHaveStyle({textDecorationLine: 'line-through'})
  })

  it('responds to a user pressing the text element', () => {
    const component = render(
      <TestAppStack>
        <Task task={testTask} />
      </TestAppStack>,
    )

    // Get the checkbox
    const taskCheckbox = component.UNSAFE_getByType(CheckBox)

    // Starts off as false
    expect(taskCheckbox.props.checked).toBe(false)

    // Press it
    fireEvent.press(component.getByText(testTask.text))

    // Validate checkbox change
    expect(taskCheckbox.props.checked).toBe(true)
  })
})

describe('NewTask', () => {
  it('renders', () => {
    const component = render(
      <TestAppStack>
        <NewTask {...testNewTask} />
      </TestAppStack>,
    )

    // Validate against snapshot
    expect(component).toMatchSnapshot()
  })
})
