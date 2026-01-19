"use client"

import { useState } from 'react'
import { Task, Priority } from '@/lib/types'

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  initialTask?: Task
  onCancel?: () => void
}

export function TaskForm({ onSave, initialTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : ''
  )
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || 'MEDIUM')
  const [isExpanded, setIsExpanded] = useState(!!initialTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || null,
      completed: initialTask?.completed || false,
      dueDate: dueDate || null,
      priority
    })

    if (!initialTask) {
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('MEDIUM')
      setIsExpanded(false)
    }
  }

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="w-full px-4 py-3 text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            maxLength={200}
          />
        </div>

        {isExpanded && (
          <>
            <div>
              <textarea
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                rows={3}
                maxLength={2000}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Due:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Priority:</label>
                <div className="flex gap-1">
                  {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        priority === p
                          ? priorityColors[p]
                          : 'bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {(onCancel || !initialTask) && (
                <button
                  type="button"
                  onClick={() => {
                    if (onCancel) {
                      onCancel()
                    } else {
                      setIsExpanded(false)
                      setTitle('')
                      setDescription('')
                      setDueDate('')
                      setPriority('MEDIUM')
                    }
                  }}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {initialTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  )
}
