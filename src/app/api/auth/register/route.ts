import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { handleApiError, ValidationError } from '@/lib/error-handler'

interface GuestTask {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, guestTasks } = body

    // Validation
    if (!email?.trim()) {
      throw ValidationError('Email is required')
    }

    if (!password || password.length < 8) {
      throw ValidationError('Password must be at least 8 characters')
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw ValidationError('Invalid email format')
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      throw ValidationError('Email already registered')
    }

    // Hash password with bcrypt (12 salt rounds for security)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name?.trim() || null
      }
    })

    // Migrate guest tasks if provided
    if (guestTasks && Array.isArray(guestTasks) && guestTasks.length > 0) {
      await prisma.task.createMany({
        data: guestTasks.map((task: GuestTask) => ({
          title: task.title,
          description: task.description || null,
          completed: task.completed || false,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          priority: task.priority || 'MEDIUM',
          userId: user.id
        }))
      })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
