# TaskFlow - Task Management App

A modern, full-stack task management application built with Next.js 14, featuring user authentication, real-time task management, and a seamless guest-to-user experience.

## Features

- **Guest Mode**: Try the app instantly without registration - tasks are saved locally
- **User Authentication**: Secure email/password authentication with NextAuth.js v5
- **Task Migration**: Guest tasks are automatically migrated when you create an account
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Task Organization**: Priority levels (Low, Medium, High), due dates, and completion status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, React 19
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js v5 with credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task_mgmt_test
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
AUTH_SECRET="your-super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

4. Generate Prisma client and push database schema:
```bash
npm run db:generate
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth.js handlers
│   │   │   └── register/         # User registration endpoint
│   │   └── tasks/
│   │       ├── route.ts          # GET all, POST new task
│   │       └── [id]/route.ts     # GET, PUT, DELETE specific task
│   ├── auth/
│   │   ├── signin/               # Sign in page
│   │   └── signup/               # Sign up page
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthPrompt.tsx            # Guest-to-user prompt
│   ├── AuthProvider.tsx          # NextAuth session provider
│   ├── Header.tsx                # Navigation header
│   ├── TaskForm.tsx              # Task creation/edit form
│   ├── TaskItem.tsx              # Individual task display
│   ├── TaskList.tsx              # Task list with filtering
│   └── TaskManager.tsx           # Main task management logic
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── error-handler.ts          # API error handling utilities
│   ├── prisma.ts                 # Prisma client singleton
│   └── types.ts                  # TypeScript type definitions
└── types/
    └── next-auth.d.ts            # NextAuth type extensions
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/callback/credentials` | Sign in with credentials |
| GET | `/api/auth/session` | Get current session |
| POST | `/api/auth/signout` | Sign out |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for authenticated user |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/[id]` | Get a specific task |
| PUT | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  dueDate     DateTime?
  priority    Priority  @default(MEDIUM)
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT-based session management
- CSRF protection via NextAuth.js
- Input validation on both client and server
- SQL injection prevention via Prisma ORM
- User-task ownership verification on all operations

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
AUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## Future Enhancements

- Task categories and tags
- Due date reminders and notifications
- Task sharing and collaboration
- Mobile app development
- Advanced filtering and search
- Task templates and recurring tasks

## License

MIT
