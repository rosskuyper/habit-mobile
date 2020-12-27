import {useReducer} from 'react'
import {v4} from 'uuid'

export type Task = {
  id: string
  completed: boolean
  text: string
}

export type TaskRecord = Record<string, Task>

export type TaskGroup = {
  id: string
  title: string
  tasks: TaskRecord
}

export type TaskGroupRecord = Record<string, TaskGroup>

type TaskState = {
  groups: TaskGroupRecord
}

type TaskAction_TaskPush = {
  type: 'task.push'
  payload: {
    groupId: string
    text: string
  }
}

type TaskAction_GroupPush = {
  type: 'group.push'
  payload: {
    title: string
  }
}

type TaskAction = TaskAction_TaskPush | TaskAction_GroupPush

function reducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'group.push': {
      const id = v4()

      return {
        ...state,
        groups: {
          ...state.groups,
          [id]: {
            id,
            title: action.payload.title,
            tasks: {},
          },
        },
      }
    }

    case 'task.push': {
      const {groupId, text} = action.payload
      const id = v4()
      const group = state.groups[groupId]

      const newTask: Task = {
        id,
        text,
        completed: false,
      }

      // Error?
      if (!group) {
        throw new Error('Task group does not exist')
      }

      return {
        ...state,
        groups: {
          ...state.groups,
          [groupId]: {
            ...group,
            tasks: {
              ...group.tasks,
              [id]: newTask,
            },
          },
        },
      }
    }

    default:
      throw new Error('Invalid reducer action dispatched')
  }
}

export const useTaskState = () => {
  const [{groups}, dispatch] = useReducer(reducer, {
    groups: {},
  })

  const pushTask = (payload: TaskAction_TaskPush['payload']) =>
    dispatch({
      type: 'task.push',
      payload,
    })

  const pushGroup = (payload: TaskAction_GroupPush['payload']) =>
    dispatch({
      type: 'group.push',
      payload,
    })

  return {
    pushTask,
    pushGroup,
    groups,
  }
}
