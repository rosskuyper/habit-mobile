/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTaskGroup
// ====================================================

export interface AddTaskGroup_addTaskGroup_tasks {
  __typename: 'TaskSchema'
  id: string
  text: string
  completedAt: any | null
  createdAt: any
}

export interface AddTaskGroup_addTaskGroup {
  __typename: 'TaskGroupSchema'
  id: string
  version: number
  name: string
  tasks: AddTaskGroup_addTaskGroup_tasks[]
  createdAt: any
  updatedAt: any
}

export interface AddTaskGroup {
  addTaskGroup: AddTaskGroup_addTaskGroup
}

export interface AddTaskGroupVariables {
  taskGroupId: string
  name: string
}
