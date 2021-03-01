import {
  setLoading,
  TaskReducerAction,
  TaskState,
  convertToRecord,
  groupAdd,
  TaskAction_GroupAdd,
  TaskAction_TaskAdd,
  taskAdd,
} from './reducer'
import {v4} from 'uuid'
import faker from 'faker'
import R from 'ramda'

const defaultState = (overwites: Partial<TaskState> = {}): TaskState => {
  return {
    groups: convertToRecord([]),
    loading: false,
    localStateInitialised: false,
    ...overwites,
  }
}

describe('useTaskState (reducer)', () => {
  it('should toggle loading', () => {
    const loadingTrueState = setLoading(defaultState(), {
      type: TaskReducerAction.SET_LOADING,
      payload: {
        loading: true,
      },
    })

    const loadingFalseState = setLoading(loadingTrueState, {
      type: TaskReducerAction.SET_LOADING,
      payload: {
        loading: false,
      },
    })

    expect(loadingTrueState.loading).toEqual(true)
    expect(loadingFalseState.loading).toEqual(false)
  })

  it('should create and store a task group', () => {
    const taskGroup = {
      id: v4(),
      name: faker.lorem.words(4),
    }

    const action = {
      type: TaskReducerAction.GROUP_ADD,
      payload: {
        taskGroupId: taskGroup.id,
        loading: true,
        ...R.omit(['id'], taskGroup),
      },
    }

    const state = groupAdd(defaultState(), action as TaskAction_GroupAdd)

    expect(state.groups).toHaveProperty(taskGroup.id)
    expect(state.groups[taskGroup.id]).toEqual(expect.objectContaining(taskGroup))
    expect(state.loading).toBe(true)
  })

  it('should create and store a task', () => {
    const taskGroupId = v4()
    const initialState = defaultState({
      groups: {
        [taskGroupId]: {
          id: taskGroupId,
          name: faker.lorem.words(4),
          tasks: {},
        },
      },
    })

    const task = {
      id: v4(),
      text: faker.lorem.sentence(),
    }

    const action = {
      type: TaskReducerAction.TASK_ADD,
      payload: {
        taskGroupId,
        loading: true,
        taskId: task.id,
        ...R.omit(['id'], task),
      },
    }

    const state = taskAdd(initialState, action as TaskAction_TaskAdd)

    expect(state.groups).toHaveProperty(taskGroupId)
    expect(state.groups[taskGroupId].tasks).toHaveProperty(task.id)
    expect(state.groups[taskGroupId].tasks[task.id]).toEqual(expect.objectContaining(task))
    expect(state.loading).toBe(true)
  })
})

describe('useTaskState (utils)', () => {
  // We have some confidence with this from typescript but a test is always some nice additional assurance.
  it('should convert an array of records with ids into a Record of those items indexed by id', () => {
    const items = Array(50)
      .fill(null)
      .map(() => ({
        id: v4(),
        text: faker.lorem.sentence(),
      }))

    const itemMap = convertToRecord(items)

    for (const item of items) {
      expect(itemMap[item.id]).toBe(item)
    }
  })
})
