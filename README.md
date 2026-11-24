# TaskFlow

### Plan your work. See your progress. Keep moving.

A full-stack task manager that brings a Kanban workflow, task priorities, due dates, and progress insights into one workspace. Built with React, Express, Prisma, and PostgreSQL.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[Highlights](#highlights) · [Getting started](#getting-started) · [API](#api) · [Project structure](#project-structure)

## Overview

TaskFlow takes a task from creation to completion with a visual workflow. Sign in to your workspace, add work with a priority and due date, and move it through **To Do → In Progress → Done**. The dashboard summarizes your workload, completion rate, and most recently updated tasks.

## Highlights

| Feature | What it does |
| --- | --- |
| **Drag-and-drop Kanban** | Move tasks between three workflow stages using dnd-kit. |
| **Task management** | Create, edit, and delete tasks with a title, description, priority, status, and optional due date. |
| **Board and list views** | Switch between workflow columns and a grid of task cards. |
| **Search and filtering** | Search task titles and descriptions, then narrow results by priority. |
| **Dashboard insights** | See total tasks, pending tasks, high-priority tasks, completed tasks, and a completion percentage. |
| **Productivity chart** | Compare task counts across the current workflow stages with Recharts. |
| **Recent activity** | See the five most recently updated tasks with relative timestamps. |
| **Due-date view** | Browse tasks that have a due date from the Calendar section. |
| **Authentication** | Register and sign in with bcrypt password hashing and JWT authentication. |
| **Personal workspaces** | Backend ownership checks limit task access to the signed-in user. |
| **Responsive feedback** | Optimistic status updates, rollback on failure, toast notifications, and loading and empty states. |
| **Polished interface** | Tailwind styling, Lucide icons, and animated forms with Framer Motion. |

### Implementation highlights

- **Client and server separation:** a React frontend talks to an Express REST API through Axios.
- **Managed server state:** TanStack Query handles task fetching, cache invalidation, and optimistic Kanban updates.
- **Relational persistence:** Prisma models users and their tasks in PostgreSQL, with a checked-in initial migration.
- **Request validation:** Zod schemas validate authentication and task payloads on the backend.
- **Protected routes:** the frontend gates the workspace, while backend middleware verifies bearer tokens for every task endpoint.

### Current scope

The Team page displays sample members, and Settings displays a read-only profile and preference descriptions. Invitations, editable preferences, and reminder delivery are not implemented. The Calendar section is a view of dated tasks, and Recent Activity reflects each task's latest state rather than a complete audit history.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, React Router |
| Styling and motion | Tailwind CSS, Framer Motion, Lucide React |
| Data and networking | TanStack Query, Axios |
| Workflow and charts | dnd-kit, Recharts, date-fns |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL, Prisma 5 |
| Authentication and validation | JSON Web Tokens, bcrypt, Zod |

```mermaid
flowchart LR
    A[React workspace] -->|Axios · bearer token| B[Express REST API]
    B --> C[JWT authentication and Zod validation]
    C --> D[Prisma ORM]
    D --> E[(PostgreSQL)]
```

## Getting started

### Prerequisites

- Node.js **22.12 or later** and npm.
- A running PostgreSQL database and a connection URL. Use a dedicated local development database for migrations and demo data.

### 1. Clone the repository

```bash
git clone https://github.com/varadagupta20/task-manager.git
cd task-manager
```

### 2. Install dependencies

```bash
cd backend
npm ci
cd ../frontend
npm ci
cd ..
```

### 3. Configure the environment

Create `backend/.env`:

```dotenv
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/taskflow?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Replace the database credentials and JWT secret with your own values. Keep `.env` files out of version control.

Optionally create `frontend/.env` to override the API address:

```dotenv
VITE_API_URL="http://localhost:3000/api"
```

The frontend uses this API address by default when `VITE_API_URL` is unset.

### 4. Initialize the database

Run Prisma commands from `backend/`, where the application's schema and migrations live:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

To add the sample account and tasks:

```bash
npx prisma db seed
```

| Demo email | Demo password |
| --- | --- |
| `demo@test.com` | `password123` |

The seed script is for local development. Running it again adds another set of sample tasks.

### 5. Start the app

In one terminal, from `backend/`:

```bash
npm run dev
```

In another terminal, from `frontend/`:

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)**, register an account, or sign in with the seeded demo account. The backend health endpoint is **[http://localhost:3000/health](http://localhost:3000/health)**.

## Available commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `frontend/` | `npm run dev` | Start the Vite development server. |
| `frontend/` | `npm run build` | Create a production frontend build in `dist/`. |
| `frontend/` | `npm run preview` | Preview the built frontend locally. |
| `frontend/` | `npm run lint` | Run Oxlint. |
| `backend/` | `npm run dev` | Start the API with Nodemon. |
| `backend/` | `npm start` | Start the API with Node.js. |
| `backend/` | `npx prisma db seed` | Populate the development database with demo data. |

## API

The default API base URL is `http://localhost:3000/api`. Send JSON request bodies with `Content-Type: application/json`.

| Method | Endpoint | Purpose | Authentication |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Create an account with `name`, `email`, and `password`. | Public |
| `POST` | `/auth/login` | Sign in with `email` and `password`. | Public |
| `GET` | `/tasks` | List the current user's tasks. Supports `status` and `priority` query filters. | Bearer token |
| `GET` | `/tasks/:id` | Retrieve one owned task. | Bearer token |
| `POST` | `/tasks` | Create a task. | Bearer token |
| `PUT` | `/tasks/:id` | Update fields on an owned task. | Bearer token |
| `DELETE` | `/tasks/:id` | Delete an owned task. | Bearer token |

Registration and login return a `token` and a `user` object. Pass the token to protected endpoints as `Authorization: Bearer <token>`.

Example task body:

```json
{
  "title": "Prepare the next release",
  "description": "Review completed tasks and update the project notes.",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-12-01"
}
```

Statuses: `TODO`, `IN_PROGRESS`, `DONE`. Priorities: `LOW`, `MEDIUM`, `HIGH`. Only `title` is required when creating a task.

## Project structure

```text
task-manager/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # Database migration history
│   │   ├── schema.prisma     # User, Task, Status, and Priority models
│   │   └── seed.js           # Demo account and tasks
│   └── src/
│       ├── controllers/     # Authentication and task handlers
│       ├── lib/             # Prisma client
│       ├── middleware/      # JWT verification
│       ├── routes/          # REST endpoints
│       └── index.js         # Express entry point
├── frontend/
│   └── src/
│       ├── components/      # Kanban, task forms, charts, and workspace views
│       ├── context/         # Authentication state
│       ├── hooks/           # Local storage helper
│       ├── lib/             # Axios API client
│       ├── pages/           # Login, registration, and dashboard
│       └── App.jsx          # App routing
└── README.md
```

The repository also contains a root-level Prisma scaffold. Use the `backend/` schema and migrations for the running API.

## UI Showcase & Screenshots
<img width="1512" height="858" alt="Screenshot 2026-11-24 at 12 07 56 AM" src="https://github.com/user-attachments/assets/8d690bef-88e2-428d-8399-23b95f559a9a" />

<img width="1512" height="858" alt="Screenshot 2026-11-24 at 12 08 20 AM" src="https://github.com/user-attachments/assets/65778d6a-d64c-49a9-b7af-b90c6a7b84ff" />


## Author

Built by **[Varada Gupta](https://github.com/varadagupta20)**.
