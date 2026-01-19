export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  description?: string | null
  completed: boolean
  dueDate?: string | null
  priority: Priority
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
  priority: Priority
}
