import {gql} from '@apollo/client'

export const QUERY_ME = gql`
  query Me {
    me {
      user {
        sub
      }
    }
  }
`

export const QUERY_TASK_GROUPS = gql`
  query TaskGroups {
    taskGroups {
      id
      version
      name
      createdAt
      updatedAt
      tasks {
        id
        text
        createdAt
        completedAt
      }
    }
  }
`
