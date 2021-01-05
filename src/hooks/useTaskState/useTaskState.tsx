import {useMutation, useQuery} from '@apollo/client'
import {values, sortBy, prop} from 'ramda'
import React, {createContext, useCallback, useContext, useReducer} from 'react'
import {v4} from 'uuid'
import {ADD_TASK, ADD_TASK_GROUP} from '../../api/mutations'
import {QUERY_TASK_GROUPS} from '../../api/queries'
import {AddTask, AddTaskVariables} from '../../api/__types__/AddTask'
import {AddTaskGroup, AddTaskGroupVariables} from '../../api/__types__/AddTaskGroup'
import {TaskGroups} from '../../api/__types__/TaskGroups'
import {
  PushGroupPayload,
  PushTaskPayload,
  TaskGroup,
  TaskReducerAction,
  taskStateReducer,
} from './reducer'

// Utils
const sortGroups = sortBy(prop('order'))

// Types
export type PushTaskHookPayload = Omit<PushTaskPayload, 'taskId'>
export type PushTaskGroupHookPayload = Omit<PushGroupPayload, 'taskGroupId'>

// Context Setup
export type TaskStateContextType = {
  pushTask: (payload: PushTaskHookPayload) => void
  pushGroup: (payload: PushTaskGroupHookPayload) => void
  sortedGroups: TaskGroup[]
}

const defaultTaskContext: TaskStateContextType = {
  sortedGroups: [],
  pushTask: async () => {
    throw new Error('Incorrect useTaskState usage')
  },
  pushGroup: async () => {
    throw new Error('Incorrect useTaskState usage')
  },
}

const TaskStateContext = createContext<TaskStateContextType>(defaultTaskContext)

// Provider component that wraps your app and makes context object ...
// ... available to any child component that calls useTaskState().
export const TaskStateProvider: React.FC = ({children}) => {
  return (
    <TaskStateContext.Provider value={useTaskStateProvider()}>{children}</TaskStateContext.Provider>
  )
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useTaskState = () => {
  return useContext(TaskStateContext)
}

// Core logic for state mgmt
const useTaskStateProvider = () => {
  /**
   * Local state, kept in a reducer.
   * This is the source of truth for the UI to keep it nippy.
   */
  const [{groups}, dispatch] = useReducer(taskStateReducer, {
    groups: {},
  })

  /**
   * API Mutations and Queries for Sync
   */
  const [addTaskGroup] = useMutation<AddTaskGroup, AddTaskGroupVariables>(ADD_TASK_GROUP)
  const [addTask] = useMutation<AddTask, AddTaskVariables>(ADD_TASK)

  /**
   * Client code functions for actions they can dispatch
   */
  const pushTask = useCallback(
    (payload: PushTaskHookPayload) => {
      const {text} = payload
      const fullPayload = {
        ...payload,
        text: text.trim(),
        taskId: v4(),
      }

      dispatch({
        type: TaskReducerAction.TASK_ADD,
        payload: fullPayload,
      })

      addTask({
        variables: fullPayload,
      })
    },
    [dispatch, addTask],
  )

  const pushGroup = useCallback(
    (payload: PushTaskGroupHookPayload) => {
      const {name} = payload
      const fullPayload = {
        ...payload,
        name: name.trim(),
        taskGroupId: v4(),
      }

      dispatch({
        type: TaskReducerAction.GROUP_ADD,
        payload: fullPayload,
      })

      addTaskGroup({
        variables: fullPayload,
      })
    },
    [dispatch, addTaskGroup],
  )

  /**
   * Query
   */
  useQuery<TaskGroups>(QUERY_TASK_GROUPS, {
    onCompleted: (taskResponse: TaskGroups) => {
      dispatch({
        type: TaskReducerAction.GROUP_MERGE,
        payload: taskResponse,
      })
    },
  })

  return {
    pushTask,
    pushGroup,
    sortedGroups: sortGroups(values(groups)),
  }
}
