# Task Management MVP

A full-stack task management application with user authentication built using React, Node.js/Express, and MongoDB.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Organization**: Filter tasks by completion status
- **Due Dates**: Set and track task due dates
- **Responsive Design**: Works on desktop and mobile browsers

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Helmet, CORS, and rate limiting for security

### Frontend
- React.js with Context API
- Custom CSS with responsive design
- Fetch API for HTTP requests

### DevOps
- Docker and Docker Compose
- Nginx for production frontend serving

## Project Structure

```
task_mgmt_test/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   └── server.js       # Application entry point
│   ├── tests/              # Jest test files
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   ├── services/       # API service layer
│   │   └── styles/         # CSS files
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 7+
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task_mgmt_test
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Start MongoDB**
   ```bash
   mongod --dbpath /path/to/data
   ```

### Docker Deployment

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

3. **Stop services**
   ```bash
   docker-compose down
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/verify` | Verify JWT token |
| GET | `/api/auth/profile` | Get user profile |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all user tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get a specific task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task completion |

### Query Parameters (GET /api/tasks)
- `completed`: Filter by completion status (`true` or `false`)
- `sort`: Sort field (default: `-createdAt`)
- `limit`: Number of tasks per page (default: 50)
- `page`: Page number (default: 1)

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskapp
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=/api
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with 24-hour expiration
- Rate limiting on API endpoints
- Input validation and sanitization
- Helmet.js security headers
- CORS configuration
- MongoDB injection prevention

## License

MIT
