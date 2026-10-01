# todo-app — Development Plan

Based on BRD version: v1 · Date: 2026-10-01 · Plan version: v1

## Architecture

| File | Purpose |
|---|---|
| public/index.html | App shell: header, filter bar, task list, add-task form |
| public/css/style.css | Mobile-first styles, overdue highlight, completed strikethrough |
| public/js/store.js | Pure functions: CRUD on tasks array + localStorage persistence |
| public/js/app.js | UI logic: render, events, filter state |
| tests/store.test.js | Unit tests for all store.js functions |

## Tasks

### T1: Task storage engine
- **Goal:** Build and test all pure data functions for managing tasks in localStorage.
- **BRD IDs:** BR-01, BR-02, BR-03, BR-04, BR-09
- **Files:** `public/js/store.js`, `tests/store.test.js`
- **Acceptance tests:**
  - `createTask('Buy milk', null)` returns `{ id, title:'Buy milk', dueDate:null, done:false }`
  - `createTask('', null)` throws an error (empty title rejected)
  - `updateTask(tasks, id, { title:'Buy bread' })` returns updated array
  - `deleteTask(tasks, id)` returns array without that task
  - `toggleDone(tasks, id)` flips the `done` field
  - `saveTasks(tasks)` writes to localStorage; `loadTasks()` returns the same array after reload
- **Depends on:** none

### T2: UI — layout, styles and rendering
- **Goal:** Build the full HTML structure and CSS, and implement task rendering + filter bar.
- **BRD IDs:** BR-05, BR-06, BR-07, BR-08, BR-10, NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06
- **Files:** `public/index.html`, `public/css/style.css`, `public/js/app.js`
- **Acceptance tests:**
  - Page loads with header, filter bar (All / Active / Completed), empty state message, and add-task form
  - Completed task shows with strikethrough text
  - Task with a past due date shows the overdue highlight colour
  - Tasks are rendered sorted by due date (earliest first); no-date tasks appear last
  - Active task count in header updates when tasks are added / toggled
  - Filter buttons correctly show only the matching tasks
  - Layout looks correct on a 375 px wide viewport (no horizontal scroll)
- **Depends on:** T1 (imports store.js)

## Coverage

| BRD ID | Task(s) |
|---|---|
| BR-01 | T1, T2 |
| BR-02 | T1, T2 |
| BR-03 | T1, T2 |
| BR-04 | T1, T2 |
| BR-05 | T2 |
| BR-06 | T2 |
| BR-07 | T2 |
| BR-08 | T2 |
| BR-09 | T1 |
| BR-10 | T2 |
| NFR-01 | T2 |
| NFR-02 | T2 |
| NFR-03 | T2 |
| NFR-04 | T2 |
| NFR-05 | T2 |
| NFR-06 | T2 |

## Risks and open questions
- **No test runner pre-installed:** the template uses `node:test` (Node.js built-in ≥ v18); if Node < 18 is on the CI image, tests will fail — CI workflow should pin `node: 20`.
- T2 depends on T1, so they cannot be fully parallelised. T1 must be merged first (or its store.js file must be stubbed so T2 can start the HTML/CSS work independently).
