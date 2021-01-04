import {useMutation, useQuery} from '@apollo/client'
import {values, sortBy, prop} from 'ramda'
import {useCallback, useReducer} from 'react'
import {v4} from 'uuid'
import {ADD_TASK, ADD_TASK_GROUP} from '../../api/mutations'
import {QUERY_TASK_GROUPS} from '../../api/queries'
import {AddTask, AddTaskVariables} from '../../api/__types__/AddTask'
import {AddTaskGroup, AddTaskGroupVariables} from '../../api/__types__/AddTaskGroup'
import {TaskGroups} from '../../api/__types__/TaskGroups'
import {PushGroupPayload, PushTaskPayload, TaskReducerAction, taskStateReducer} from './reducer'

const sortGroups = sortBy(prop('order'))

export type PushTaskHookPayload = Omit<PushTaskPayload, 'taskId'>
export type PushTaskGroupHookPayload = Omit<PushGroupPayload, 'taskGroupId'>

export const useTaskState = () => {
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
    (payload) => {
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
    groups,
    sortedGroups: sortGroups(values(groups)),
  }
}
