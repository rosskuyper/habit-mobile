import React, {createContext, useContext} from 'react'
import {TaskGroup} from './reducer'
import {PushTaskGroupHookPayload, PushTaskHookPayload, useTaskStateProvider} from './useTaskState'

// Context Setup
export type TaskStateContextType = {
  pushTask: (payload: PushTaskHookPayload) => void
  pushGroup: (payload: PushTaskGroupHookPayload) => void
  sortedGroups: TaskGroup[]
  loading: boolean
}

const defaultTaskContext: TaskStateContextType = {
  pushTask: async () => {
    throw new Error('Incorrect useTaskState usage')
  },
  pushGroup: async () => {
    throw new Error('Incorrect useTaskState usage')
  },
  sortedGroups: [],
  loading: true,
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
export const useTaskStateContext = () => {
  return useContext(TaskStateContext)
}
