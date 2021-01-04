import {gql} from '@apollo/client'

export const ADD_TASK_GROUP = gql`
  mutation AddTaskGroup($taskGroupId: String!, $name: String!) {
    addTaskGroup(taskGroupId: $taskGroupId, name: $name) {
      id
      version
      name
      tasks {
        id
        text
        completedAt
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`

export const ADD_TASK = gql`
  mutation AddTask($taskGroupId: String!, $taskId: String!, $text: String!) {
    addTask(taskGroupId: $taskGroupId, taskId: $taskId, text: $text) {
      id
      text
      completedAt
      createdAt
    }
  }
`
