import React from 'react'
import {TestAppStack} from '../../tests/utils'
import {TaskGroup} from './TaskGroup'
import {TaskGroup as TaskGroupType} from '../../hooks/useTaskState/reducer'

// Note: test renderer must be required after react-native.
import {render} from '@testing-library/react-native'
import {NewTask, Task} from '../Task/Task'

export const generateTestTaskGroup = (count = 10): TaskGroupType => {
  const orders = Array(count)
    .fill(null)
    .map((_n, idx) => idx)

  const tasks: TaskGroupType['tasks'] = {}

  for (const order of orders) {
    tasks[order] = {
      id: `task-${order}`,
      text: 'Some test task',
      order,
    }
  }

  return {
    id: 'task-group-1',
    name: 'My daily todo list',
    tasks,
  }
}

describe('TaskGroup', () => {
  const testNewTask = generateTestTaskGroup()

  it('renders', () => {
    const component = render(
      <TestAppStack>
        <TaskGroup group={testNewTask} />
      </TestAppStack>,
    )

    // Ensure expected elements exist
    component.getByText(testNewTask.name)

    // In-line adding
    component.UNSAFE_getAllByType(NewTask)

    // Find tasks and check their length
    const tasks = component.UNSAFE_getAllByType(Task)

    expect(tasks.length).toEqual(Object.keys(testNewTask.tasks).length)

    // Validate against snapshot
    expect(component).toMatchSnapshot()
  })
})
