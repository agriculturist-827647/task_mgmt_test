# Task Management App

A full-stack task management application built with React and Vercel Serverless Functions.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status
- Set due dates
- Responsive design

## Tech Stack

- **Frontend**: React 18 with Context API
- **Backend**: Vercel Serverless Functions
- **Deployment**: Vercel (zero-config)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/task_mgmt_test)

Or deploy manually:

1. Push this repo to GitHub
2. Import to Vercel at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Create React App - just click Deploy

## Project Structure

```
task_mgmt_test/
├── api/                    # Vercel Serverless Functions
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── verify.js
│   ├── tasks/
│   │   ├── index.js       # GET all, POST create
│   │   └── [id].js        # GET, PUT, PATCH, DELETE by id
│   └── lib/
│       ├── auth.js        # Auth middleware
│       └── store.js       # Data store & utilities
├── src/                    # React application
│   ├── components/
│   ├── context/
│   ├── services/
│   └── styles/
├── public/
├── package.json
└── vercel.json
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm start
```

The app runs at http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify` | Verify token |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id` | Toggle complete |
| DELETE | `/api/tasks/:id` | Delete task |

## Environment Variables

For production, set in Vercel dashboard:

```
JWT_SECRET=your-secret-key
```

## Note

This demo uses in-memory storage. Data resets on serverless cold starts. For persistent storage, integrate:
- MongoDB Atlas
- Supabase
- PlanetScale
- Vercel Postgres

## License

MIT
