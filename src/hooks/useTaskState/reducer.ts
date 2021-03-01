import {fromPairs, map, max, mergeDeepLeft, pipe, prop, reduce, values} from 'ramda'
import {TaskGroups} from '../../api/__types__/TaskGroups'

/**
 * Reducer State
 */
type TaskGroupMap = Record<string, TaskGroup>

export type TaskState = {
  groups: TaskGroupMap
  loading: boolean
  localStateInitialised: boolean
}

export type TaskGroup = {
  id: string
  name: string
  tasks: Record<string, Task>
}

export type Task = {
  id: string
  text: string
  order: number
  completedAt?: Date
}

/**
 * Reducer Actions
 */
export enum TaskReducerAction {
  TASK_ADD,
  GROUP_ADD,
  GROUP_MERGE,
  GROUP_MERGE_LOCAL,
  SET_LOADING,
}

export type TaskAction_TaskAdd = {
  type: TaskReducerAction.TASK_ADD
  payload: {
    taskGroupId: string
    taskId: string
    text: string
    loading?: boolean
  }
}

export type TaskAction_GroupAdd = {
  type: TaskReducerAction.GROUP_ADD
  payload: {
    taskGroupId: string
    name: string
    loading?: boolean
  }
}

export type TaskAction_GroupMerge = {
  type: TaskReducerAction.GROUP_MERGE
  payload: {
    taskGroups: TaskGroups['taskGroups']
    loading?: boolean
    localStateInitialised?: boolean
  }
}

export type TaskAction_GroupMergeLocal = {
  type: TaskReducerAction.GROUP_MERGE_LOCAL
  payload: {
    taskGroups: TaskGroupMap
    localStateInitialised: boolean
  }
}

export type TaskAction_SetLoading = {
  type: TaskReducerAction.SET_LOADING
  payload: {
    loading: boolean
  }
}

export type TaskAction =
  | TaskAction_TaskAdd
  | TaskAction_GroupAdd
  | TaskAction_GroupMerge
  | TaskAction_GroupMergeLocal
  | TaskAction_SetLoading

// Exported for client code
export type PushTaskPayload = TaskAction_TaskAdd['payload']
export type PushGroupPayload = TaskAction_GroupAdd['payload']
export type MergeGroupPayload = TaskAction_GroupMerge['payload']

/**
 * The Reducer, which is essentially a mapping to functions using a switch statement
 */
export function taskStateReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case TaskReducerAction.GROUP_MERGE:
      return groupMerge(state, action)

    case TaskReducerAction.GROUP_MERGE_LOCAL:
      return groupMergeLocal(state, action)

    case TaskReducerAction.GROUP_ADD:
      return groupAdd(state, action)

    case TaskReducerAction.TASK_ADD:
      return taskAdd(state, action)

    case TaskReducerAction.SET_LOADING:
      return setLoading(state, action)

    default:
      throw new Error('Invalid reducer action dispatched')
  }
}

/**********************************************************************************
 * The actual reducing functions
 *********************************************************************************/

export function groupMerge(state: TaskState, action: TaskAction_GroupMerge): TaskState {
  const {taskGroups, loading, localStateInitialised} = action.payload

  // Do some re-structuring to get the gql arrays shaped like our state object maps
  const taskGroupsWithConvertedTasks = convertInnerTasksToRecords(taskGroups)
  const taskGroupsRecord = convertToRecord(taskGroupsWithConvertedTasks)

  return {
    ...state,
    loading: loading === undefined ? state.loading : loading,
    localStateInitialised:
      localStateInitialised === undefined ? state.localStateInitialised : localStateInitialised,
    groups: mergeDeepLeft(state.groups, taskGroupsRecord),
  }
}

export function groupMergeLocal(state: TaskState, action: TaskAction_GroupMergeLocal): TaskState {
  const {taskGroups, localStateInitialised} = action.payload

  return {
    ...state,
    localStateInitialised,
    groups: mergeDeepLeft(state.groups, taskGroups),
  }
}

export function groupAdd(state: TaskState, action: TaskAction_GroupAdd): TaskState {
  const {taskGroupId, name, loading} = action.payload

  if (state.groups[taskGroupId]) {
    throw new Error('Task group with ID already exists')
  }

  return {
    ...state,
    loading: loading === undefined ? state.loading : loading,
    groups: {
      ...state.groups,
      [taskGroupId]: {
        id: taskGroupId,
        name,
        tasks: {},
      },
    },
  }
}

export function taskAdd(state: TaskState, action: TaskAction_TaskAdd): TaskState {
  const {taskGroupId, taskId, text, loading} = action.payload
  const group = state.groups[taskGroupId]

  // Error?
  if (!group) {
    throw new Error('Task group does not exist')
  }

  const newTask = {
    id: taskId,
    text,
    order: getMaxOrder(group.tasks) + 1,
  }

  return {
    ...state,
    loading: loading === undefined ? state.loading : loading,
    groups: {
      ...state.groups,
      [taskGroupId]: {
        ...group,
        tasks: {
          ...group.tasks,
          [taskId]: newTask,
        },
      },
    },
  }
}

export function setLoading(state: TaskState, action: TaskAction_SetLoading): TaskState {
  return {
    ...state,
    loading: action.payload.loading,
  }
}

/**********************************************************************************
 * Utils
 *********************************************************************************/

/**
 * Iterate over a tasks record and find the max order
 *
 * This feels more complicated than it needs to be
 * 1. Get the tasks from the Tasks Record / Object as an array
 * 2. Map the items to just get their order value
 * 3. Reduce over the orders to find the max value (or -1)
 */
export const getMaxOrder = pipe<Record<string, Task>, Task[], number[], number>(
  values,
  map<Task, number>(prop('order')),
  reduce<number, number>(max, -1),
)

/**
 * Convert a GQL array structure to an object map
 */
type ItemWithId = {id: string}
type ItemArrayPair<T = ItemWithId> = [string, T]
type ItemRecord<T = ItemWithId> = Record<string, T>

// I don't seem to be able to get the Generics to work how I would like.
// We should be able to just have `convertToRecord` be the function created by `pipe`.
// But the generic T isn't available to properly type the different steps defined within `pipe`.
// So we just define the fn and call it each time.
export function convertToRecord<T extends ItemWithId>(items: T[]): ItemRecord<T> {
  const mapFn = pipe<T[], ItemArrayPair<T>[], ItemRecord<T>>(
    map<T, ItemArrayPair<T>>((item) => [item.id, item]),
    fromPairs,
  )

  return mapFn(items)
}

type ItemWithTasksArray = ItemWithId & {tasks: Array<ItemWithId>}
type ItemWithTasksRecord = ItemWithId & {tasks: ItemRecord}

export const convertInnerTasksToRecords = map<ItemWithTasksArray, ItemWithTasksRecord>((item) => {
  return {
    ...item,
    tasks: convertToRecord(item.tasks),
  }
})
