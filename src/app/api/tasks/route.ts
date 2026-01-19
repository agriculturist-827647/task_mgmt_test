import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { handleApiError, ValidationError, UnauthorizedError } from '@/lib/error-handler'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw UnauthorizedError()
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw UnauthorizedError()
    }

    const body = await request.json()
    const { title, description, dueDate, priority } = body

    if (!title?.trim()) {
      throw ValidationError('Title is required')
    }

    if (title.trim().length > 200) {
      throw ValidationError('Title must be 200 characters or less')
    }

    if (description && description.length > 2000) {
      throw ValidationError('Description must be 2000 characters or less')
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH']
    if (priority && !validPriorities.includes(priority)) {
      throw ValidationError('Invalid priority value')
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        userId: session.user.id
      }
    })

    return NextResponse.json({ task })
  } catch (error) {
    return handleApiError(error)
  }
}
