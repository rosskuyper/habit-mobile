import {values} from 'ramda'
import {useCallback, useReducer} from 'react'
import {v4} from 'uuid'
import * as TaskTypes from '../types/TaskTypes'

type TaskState = {
  groups: TaskTypes.TaskGroupRecord
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

export type PushTaskPayload = TaskAction_TaskPush['payload']
export type PushGroupPayload = TaskAction_GroupPush['payload']

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

      const newTask: TaskTypes.Task = {
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

  const pushTask = useCallback(
    (payload: PushTaskPayload) =>
      dispatch({
        type: 'task.push',
        payload,
      }),
    [dispatch],
  )

  const pushGroup = useCallback(
    (payload: PushGroupPayload) =>
      dispatch({
        type: 'group.push',
        payload,
      }),
    [dispatch],
  )

  return {
    pushTask,
    pushGroup,
    groups,
    sortedGroups: values(groups),
  }
}
