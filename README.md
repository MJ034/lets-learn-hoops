# Lets Learn Hoops

A full-stack learning app with a React frontend and an Express + PostgreSQL backend.

## Prerequisites

Before starting the app, make sure you have:

- Node.js 18+ or 20+
- npm
- PostgreSQL running locally
- A database named `lets_learn_hoops`

The backend is configured to connect to:

- `postgres://postgres:postgres@localhost:5432/lets_learn_hoops`

This value is stored in `backend/.env`.

## 1) Install dependencies

From the project root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2) Set up PostgreSQL

If PostgreSQL is installed locally, create the database:

```bash
createdb lets_learn_hoops
```

Then run the backend migrations:

```bash
cd ../backend
npm run migrate:up
```

## 3) Start the backend

From the project root:

```bash
cd backend
npm run dev
```

The API runs at:

- http://localhost:3000
- Health check: http://localhost:3000/health

## 4) Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm run dev
```

The frontend runs at:

- http://localhost:5173

## 5) Open the app

Visit:

```text
http://localhost:5173
```

## Useful commands

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

## Notes

- The backend allows requests from the frontend via CORS at `http://localhost:5173`.
- If the database is not running or credentials are wrong, the backend health route will return an error.
- For local development, the app expects both services to be running at the same time.
