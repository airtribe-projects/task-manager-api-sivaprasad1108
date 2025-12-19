# Task Manager API

This is a small, example Task Manager REST API built using Express and an in-memory model seeded from `task.json`. It includes input validation, filtering, sorting, a priority field, and optional file persistence (disabled during test runs).

---

## Features
- CRUD endpoints for tasks (GET, POST, PUT, DELETE)
- Input validation for creating & updating tasks
- Filtering by completion (`completed=true|false`)
- Sorting by creation date (`sort=asc|desc`)
- Priority attribute: `low | medium | high`
- Tasks persisted to `task.json` for simplicity (disabled during tests)

---

## Quick start

Prerequisites
- Node.js 18+ installed

Install:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

Run tests:

```bash
npm test
```

Note: Tests are run using `tap` and `supertest`. The application prevents writes to `task.json` while tests are running so that seed data remains stable.

---

## Task resource schema

Example task (this API uses numeric IDs):

```json
{
  "id": 2,
  "title": "Create a new project",
  "description": "Create a new project using Magic",
  "completed": false,
  "priority": "medium",
  "createdAt": "2025-11-24T21:00:00.000Z",
  "updatedAt": "2025-11-24T21:00:00.000Z"
}
```

Fields
- id (number): numeric id of the task
- title (string): non-empty
- description (string): non-empty
- completed (boolean)
- priority (string): one of `low`, `medium`, `high` — default is `medium` when omitted
- createdAt, updatedAt (ISO 8601 timestamps)

---

## Endpoints and Examples

Base URL: http://localhost:3000

GET /tasks
- Description: List all tasks. Supports filtering and sorting.
- Query string options:
  - `completed=true|false` — filter by completion
  - `sort=asc|desc` — sort by `createdAt` ascending or descending
- Response: 200 OK — JSON array of task objects

Example:

```bash
curl "http://localhost:3000/tasks?completed=true&sort=desc"
```

GET /tasks/:id
- Description: Retrieve a single task by ID
- Response:
  - 200 OK — task JSON on success
  - 404 Not Found — when id doesn't exist

Example:

```bash
curl http://localhost:3000/tasks/1
```

POST /tasks
- Description: Create a new task
- Required body: `title` (string), `description` (string). `completed` (boolean) optional; defaults to `false` if omitted. `priority` optional (`low|medium|high`).
- Responses:
  - 201 Created — returns created task as JSON
  - 400 Bad Request — when validation fails

Example:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description","completed":false, "priority": "high"}'
```

PUT /tasks/:id
- Description: Update an existing task. Accepts the same fields as `POST` but all optional for partial updates.
- Responses:
  - 200 OK — returns updated task as JSON
  - 400 Bad Request — when validation fails (e.g., `completed` not boolean)
  - 404 Not Found — when id doesn't exist

Example:

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","completed":true}'
```

DELETE /tasks/:id
- Description: Delete a task
- Responses:
  - 200 OK — returns `{ success: true }` for test compatibility
  - 404 Not Found — when id doesn't exist

Example:

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

GET /tasks/priority/:level
- Description: Retrieve tasks for a given priority. Valid levels are `low`, `medium`, `high`.
- Response: 200 OK — array of tasks at that priority

Example:

```bash
curl http://localhost:3000/tasks/priority/high
```

---

## Validation rules
- `title` and `description` are required for create (non-empty strings)
- `completed` must be a boolean when supplied
The following table documents the available endpoints, parameters, request body, and typical responses.

| Method | Path | Query / Body | Success Response | Error Responses |
|---|---|---|---:|---|
| GET | `/tasks` | Query: `completed=true|false`, `sort=asc|desc` | `200` — Array of tasks | `400` — invalid query (rare) |
| GET | `/tasks/:id` | — | `200` — Task object | `404` — Task not found |
| POST | `/tasks` | Body JSON: `title` *(string, required)*, `description` *(string, required)*, `completed` *(boolean, optional)*, `priority` *(optional: `low|medium|high`)* | `201` — Created task object | `400` — Validation failed |
| PUT | `/tasks/:id` | Body JSON: any of `title`, `description`, `completed`, `priority` | `200` — Updated task object | `400` — Validation failed; `404` — Not found |
| DELETE | `/tasks/:id` | — | `200` — `{ "success": true }` | `404` — Not found |
| GET | `/tasks/priority/:level` | `:level` = `low|medium|high` | `200` — Array of tasks with that priority | `400` — Invalid priority level |


- Logging: Structured logging via `src/utils/loggerUtil.js`, the tests print logs; you can change verbosity by updating logging calls.

---


# Task Manager API

Simple task manager REST API with endpoints to create, read, update, and delete tasks.

Features:
- CRUD endpoints: GET /tasks, GET /tasks/:id, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- Filtering: GET /tasks?completed=true|false
- Sorting: GET /tasks?sort=asc|desc (sorts by createdAt)
- Priority: tasks have a priority attribute ("low", "medium", "high"). Use GET /tasks/priority/:level to filter.
- Input validation for create/update requests
- Persistence to `task.json` on create/update/delete (disabled during tests)

Getting started:
1. Install dependencies: `npm install`
2. Run the app: `npm start` (or `npm run dev` for nodemon)
3. Run tests: `npm test` (tests run using `tap` and disabled persistence during tests)

Endpoints:
- GET /tasks
  - Query params: `completed` (boolean), `sort` (asc|desc)
- GET /tasks/:id
- POST /tasks
  - JSON body: `{ "title": "string", "description": "string", "completed": boolean, "priority": "low|medium|high" }`
- PUT /tasks/:id
  - JSON body accepts fields for updating
- DELETE /tasks/:id
- GET /tasks/priority/:level

Notes:
- The app loads seed tasks from `task.json` at startup. During normal usage, create/update/delete operations will persist back to `task.json`.
- Persistence is intentionally disabled when running tests to keep the seed file stable.
