/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TaskGroups
// ====================================================

export interface TaskGroups_taskGroups_tasks {
  __typename: 'TaskSchema'
  id: string
  text: string
  createdAt: any
  completedAt: any | null
}

export interface TaskGroups_taskGroups {
  __typename: 'TaskGroupSchema'
  id: string
  version: number
  name: string
  createdAt: any
  updatedAt: any
  tasks: TaskGroups_taskGroups_tasks[]
}

export interface TaskGroups {
  taskGroups: TaskGroups_taskGroups[]
}
