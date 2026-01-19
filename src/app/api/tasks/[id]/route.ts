import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, ValidationError, UnauthorizedError, NotFoundError, ForbiddenError } from '@/lib/error-handler'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw UnauthorizedError()
    }

    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id }
    })

    if (!task) {
      throw NotFoundError('Task not found')
    }

    if (task.userId !== session.user.id) {
      throw ForbiddenError('You do not have access to this task')
    }

    return NextResponse.json({ task })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw UnauthorizedError()
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, completed, dueDate, priority } = body

    // Find existing task
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })

    if (!existingTask) {
      throw NotFoundError('Task not found')
    }

    if (existingTask.userId !== session.user.id) {
      throw ForbiddenError('You do not have access to this task')
    }

    // Validation
    if (title !== undefined && !title?.trim()) {
      throw ValidationError('Title cannot be empty')
    }

    if (title && title.trim().length > 200) {
      throw ValidationError('Title must be 200 characters or less')
    }

    if (description && description.length > 2000) {
      throw ValidationError('Description must be 2000 characters or less')
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH']
    if (priority && !validPriorities.includes(priority)) {
      throw ValidationError('Invalid priority value')
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? (description?.trim() || null) : undefined,
        completed: completed !== undefined ? completed : undefined,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        priority: priority !== undefined ? priority : undefined
      }
    })

    return NextResponse.json({ task })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw UnauthorizedError()
    }

    const { id } = await params

    // Find existing task
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })

    if (!existingTask) {
      throw NotFoundError('Task not found')
    }

    if (existingTask.userId !== session.user.id) {
      throw ForbiddenError('You do not have access to this task')
    }

    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
