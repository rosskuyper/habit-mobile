import {useMutation, useQuery} from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {prop, sortBy, values} from 'ramda'
import {useCallback, useEffect, useReducer} from 'react'
import {v4} from 'uuid'
import {ADD_TASK, ADD_TASK_GROUP} from '../../api/mutations'
import {QUERY_TASK_GROUPS} from '../../api/queries'
import {AddTask, AddTaskVariables} from '../../api/__types__/AddTask'
import {AddTaskGroup, AddTaskGroupVariables} from '../../api/__types__/AddTaskGroup'
import {TaskGroups} from '../../api/__types__/TaskGroups'
import {PushGroupPayload, PushTaskPayload, TaskReducerAction, taskStateReducer} from './reducer'

// Utils
const sortGroups = sortBy(prop('order'))

// Types
export type PushTaskHookPayload = Omit<PushTaskPayload, 'taskId'>
export type PushTaskGroupHookPayload = Omit<PushGroupPayload, 'taskGroupId'>

// Core logic for state mgmt
export const useTaskStateProvider = () => {
  /**
   * Local state, kept in a reducer.
   * This is the source of truth for the UI to keep it nippy.
   */
  const [{groups, localStateInitialised, loading}, dispatch] = useReducer(taskStateReducer, {
    groups: {},
    loading: true,
    localStateInitialised: false,
  })

  /**
   * API Mutations and Queries for Sync
   */
  const [addTaskGroup] = useMutation<AddTaskGroup, AddTaskGroupVariables>(ADD_TASK_GROUP)
  const [addTask] = useMutation<AddTask, AddTaskVariables>(ADD_TASK)

  /**
   * Utils
   */
  const setLoading = useCallback(
    (isLoading: boolean) =>
      dispatch({
        type: TaskReducerAction.SET_LOADING,
        payload: {
          loading: isLoading,
        },
      }),
    [dispatch],
  )

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
        loading: true,
      }

      dispatch({
        type: TaskReducerAction.TASK_ADD,
        payload: fullPayload,
      })

      addTask({
        variables: fullPayload,
      })
        .then(() => {
          setLoading(false)
        })
        .catch(() => {
          // todo - handle error
          setLoading(false)
        })
    },
    [dispatch, addTask, setLoading],
  )

  const pushGroup = useCallback(
    (payload: PushTaskGroupHookPayload) => {
      const {name} = payload
      const fullPayload = {
        ...payload,
        name: name.trim(),
        taskGroupId: v4(),
        loading: true,
      }

      dispatch({
        type: TaskReducerAction.GROUP_ADD,
        payload: fullPayload,
      })

      addTaskGroup({
        variables: fullPayload,
      })
        .then(() => {
          setLoading(false)
        })
        .catch(() => {
          // todo - handle error
          setLoading(false)
        })
    },
    [dispatch, addTaskGroup, setLoading],
  )

  /**
   * Initial Query
   */
  useQuery<TaskGroups>(QUERY_TASK_GROUPS, {
    onCompleted: ({taskGroups}: TaskGroups) => {
      dispatch({
        type: TaskReducerAction.GROUP_MERGE,
        payload: {
          taskGroups,
          loading: false,
        },
      })
    },
  })

  // Updating the local storage
  useEffect(() => {
    if (localStateInitialised) {
      AsyncStorage.setItem('groups', JSON.stringify(groups)).catch((error) => {
        console.log('AsyncStorage.setItem.groups.error', error)
      })
    }
  }, [groups, localStateInitialised])

  // Getting the initial value from local storage
  useEffect(() => {
    AsyncStorage.getItem('groups')
      .then((taskGroups) => {
        dispatch({
          type: TaskReducerAction.GROUP_MERGE_LOCAL,
          payload: {
            taskGroups: taskGroups === null ? {} : JSON.parse(taskGroups),
            localStateInitialised: true,
          },
        })
      })
      .catch((error) => {
        console.log('AsyncStorage.getItem.groups.error', error)
      })
  }, [])

  return {
    pushTask,
    pushGroup,
    sortedGroups: sortGroups(values(groups)),
    loading,
  }
}
