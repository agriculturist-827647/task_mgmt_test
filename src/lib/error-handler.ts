import { NextResponse } from 'next/server'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    )
  }

  console.error('Unexpected error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

export const ValidationError = (message: string) => new AppError(message, 400)
export const UnauthorizedError = (message: string = 'Unauthorized') => new AppError(message, 401)
export const NotFoundError = (message: string = 'Not found') => new AppError(message, 404)
export const ForbiddenError = (message: string = 'Forbidden') => new AppError(message, 403)
