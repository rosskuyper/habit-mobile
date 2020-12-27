export type Task = {
  id: string
  completed: boolean
  text: string
}

export type TaskRecord = Record<string, Task>

export type TaskGroup = {
  id: string
  title: string
  tasks: TaskRecord
}

export type TaskGroupRecord = Record<string, TaskGroup>
