import { GET, POST } from '@/app/api/tasks/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('returns tasks for authenticated user', async () => {
      const mockTasks = [
        { id: '1', title: 'Test Task', completed: false, priority: 'MEDIUM', userId: 'user1' },
      ]

      mockAuth.mockResolvedValue({
        user: { id: 'user1', email: 'test@example.com' },
        expires: new Date().toISOString(),
      })
      mockPrisma.task.findMany.mockResolvedValue(mockTasks as never)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tasks).toEqual(mockTasks)
    })
  })

  describe('POST', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Task' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('returns 400 when title is missing', async () => {
      mockAuth.mockResolvedValue({
        user: { id: 'user1', email: 'test@example.com' },
        expires: new Date().toISOString(),
      })

      const request = new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Title is required')
    })

    it('creates a task for authenticated user', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: null,
        completed: false,
        dueDate: null,
        priority: 'MEDIUM',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockAuth.mockResolvedValue({
        user: { id: 'user1', email: 'test@example.com' },
        expires: new Date().toISOString(),
      })
      mockPrisma.task.create.mockResolvedValue(mockTask as never)

      const request = new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Task' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.task.title).toBe('Test Task')
    })
  })
})
