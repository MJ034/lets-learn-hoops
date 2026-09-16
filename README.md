# Let's Learn Hoops

Let's Learn Hoops is a full-stack basketball learning platform for beginners who want to understand the rules, positions, and flow of the game. It combines a React learning interface with an Express and PostgreSQL API, covering account creation, lesson browsing, quizzes, and progress tracking.

This project was built as a portfolio piece to demonstrate end-to-end product development: structured database migrations, authenticated API routes, reusable frontend services and hooks, and a polished user experience for guided learning.

## Features

- Basketball lesson library with categories such as basics, rules and violations, fouls, positions, offense, defense, and skills development.
- Suggested learning paths that help users start with fundamentals, understand common calls, or learn team structure.
- Markdown-powered lesson pages with reading time, FIBA rule references, and related quizzes.
- Quiz flow for checking answers as a guest or submitting authenticated quiz results for saved history.
- Account registration, login, logout, and session-based authentication using secure HTTP cookies.
- Protected progress dashboard with lesson completion percentage and quiz history.
- PostgreSQL migrations and seed data for users, sessions, categories, lessons, quizzes, questions, and results.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- React Markdown
- ESLint

### Backend

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- node-pg-migrate
- bcrypt
- cookie-parser
- CORS
- Vitest

## Architecture

```text
frontend/                 React + Vite app
	src/pages/              Route-level pages for home, learning, lessons, auth, and progress
	src/components/         Shared UI such as layout, navigation, lesson lists, and quizzes
	src/hooks/              Data-loading hooks for learning modules and progress
	src/services/           API clients for auth, learning, quizzes, and progress

backend/                  Express API
	src/index.ts            App setup, CORS, cookies, routes, and health check
	src/modules/auth        Registration, login, logout, and current-user routes
	src/modules/learning    Lesson library and lesson detail endpoints
	src/modules/quizzes     Quiz retrieval, review, and authenticated submission
	src/modules/progress    Protected lesson completion and progress summary endpoints
	migrations/             Database schema and seed content
```

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm
- PostgreSQL running locally
- A local database named `lets_learn_hoops`

### 1. Install dependencies

From the project root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Copy the example environment files and adjust values if needed:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend (`backend/.env`):

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/lets_learn_hoops
PORT=3000
CORS_ORIGINS=http://localhost:5173
SESSION_COOKIE_SECURE=false
SESSION_COOKIE_SAME_SITE=lax
SESSION_COOKIE_DOMAIN=
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=/api
VITE_DEV_API_PROXY_TARGET=http://localhost:3000
```

### 3. Set up PostgreSQL

Create the local database:

```bash
createdb lets_learn_hoops
```

Run migrations and seed data:

```bash
cd backend
npm run migrate:up
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:3000`.

### 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

The app runs at `http://localhost:5173`.

## Useful Commands

Backend:

```bash
cd backend
npm run dev
npm run test
npm run migrate:up
npm run migrate:down
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```
