"use client"

import { useState } from 'react'
import { Task, Priority } from '@/lib/types'
import { TaskForm } from './TaskForm'

interface TaskItemProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  const handleToggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed })
  }

  const handleDelete = () => {
    setIsDeleting(true)
    onDelete(task.id)
  }

  const handleSave = (updatedData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    onUpdate({ ...task, ...updatedData })
    setIsEditing(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  if (isEditing) {
    return (
      <TaskForm
        initialTask={task}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 ${
        task.completed ? 'opacity-60' : ''
      } ${isDeleting ? 'scale-95 opacity-0' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
          }`}
        >
          {task.completed && (
            <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-gray-900 dark:text-white font-medium ${
                task.completed ? 'line-through text-gray-500 dark:text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-4">
            {task.dueDate && (
              <span
                className={`text-xs ${
                  isOverdue
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <svg className="inline-block w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(task.dueDate)}
                {isOverdue && ' (Overdue)'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
