"use client"

import Link from 'next/link'

interface AuthPromptProps {
  onClose: () => void
  taskCount: number
}

export function AuthPrompt({ onClose, taskCount }: AuthPromptProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Great progress!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You have {taskCount} task{taskCount > 1 ? 's' : ''} saved locally. Create an account to access them from anywhere and never lose your work.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/auth/signup"
            className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Create free account
          </Link>
          <Link
            href="/auth/signin"
            className="block w-full py-3 px-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Sign in to existing account
          </Link>
          <button
            onClick={onClose}
            className="block w-full py-2 text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  )
}
