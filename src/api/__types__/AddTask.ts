/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTask
// ====================================================

export interface AddTask_addTask {
  __typename: 'TaskSchema'
  id: string
  text: string
  completedAt: any | null
  createdAt: any
}

export interface AddTask {
  addTask: AddTask_addTask
}

export interface AddTaskVariables {
  taskGroupId: string
  taskId: string
  text: string
}
