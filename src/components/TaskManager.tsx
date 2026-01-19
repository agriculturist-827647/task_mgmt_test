"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Task } from '@/lib/types'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { AuthPrompt } from './AuthPrompt'

type FilterType = 'all' | 'active' | 'completed'

export function TaskManager() {
  const { data: session, status } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tasks from localStorage for guest users
  const loadGuestTasks = useCallback(() => {
    try {
      const stored = localStorage.getItem('guestTasks')
      if (stored) {
        setTasks(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load guest tasks:', e)
    }
    setIsLoading(false)
  }, [])

  // Save tasks to localStorage for guest users
  const saveGuestTasks = useCallback((newTasks: Task[]) => {
    try {
      localStorage.setItem('guestTasks', JSON.stringify(newTasks))
    } catch (e) {
      console.error('Failed to save guest tasks:', e)
    }
  }, [])

  // Fetch tasks from API for authenticated users
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data.tasks)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load tasks on mount or when session changes
  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      fetchTasks()
    } else {
      loadGuestTasks()
    }
  }, [session, status, fetchTasks, loadGuestTasks])

  // Handle creating a new task
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (session) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create task')
        }

        const data = await response.json()
        setTasks((prev) => [data.task, ...prev])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create task')
      }
    } else {
      // Guest mode: save to localStorage
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const newTasks = [newTask, ...tasks]
      setTasks(newTasks)
      saveGuestTasks(newTasks)

      // Show auth prompt after creating a few tasks
      if (newTasks.length === 3 || newTasks.length === 5) {
        setShowAuthPrompt(true)
      }
    }
  }

  // Handle updating a task
  const handleUpdateTask = async (updatedTask: Task) => {
    if (session) {
      try {
        const response = await fetch(`/api/tasks/${updatedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to update task')
        }

        const data = await response.json()
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? data.task : t))
        )
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update task')
      }
    } else {
      // Guest mode: update in localStorage
      const newTasks = tasks.map((t) =>
        t.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : t
      )
      setTasks(newTasks)
      saveGuestTasks(newTasks)
    }
  }

  // Handle deleting a task
  const handleDeleteTask = async (id: string) => {
    if (session) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to delete task')
        }

        setTasks((prev) => prev.filter((t) => t.id !== id))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to delete task')
      }
    } else {
      // Guest mode: delete from localStorage
      const newTasks = tasks.filter((t) => t.id !== id)
      setTasks(newTasks)
      saveGuestTasks(newTasks)
    }
  }

  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {!session && tasks.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-lg text-sm">
          <p>
            <strong>Guest mode:</strong> Your tasks are saved locally. Create an account to sync across devices.
          </p>
        </div>
      )}

      <TaskForm onSave={handleCreateTask} />

      {tasks.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {activeCount} active, {completedCount} completed
          </div>
        </div>
      )}

      <TaskList
        tasks={tasks}
        filter={filter}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      {showAuthPrompt && (
        <AuthPrompt
          onClose={() => setShowAuthPrompt(false)}
          taskCount={tasks.length}
        />
      )}
    </div>
  )
}
