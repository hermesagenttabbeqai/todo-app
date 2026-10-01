# todo-app

A mobile-first static web todo app. Add, edit, delete and complete tasks with optional due dates. Overdue tasks are highlighted. All data is saved in your browser — no server, no login required.

**🔗 Live app:** https://hermesagenttabbeqai.github.io/todo-app/

---

## Features
- Add tasks with a title and optional due date
- Edit or delete tasks (delete requires confirmation)
- Mark tasks done / undone — completed tasks shown with strikethrough
- Overdue tasks highlighted in red
- Tasks sorted by due date (earliest first)
- Filter by: All / Active / Completed
- Active task count shown at the top
- Data persists in browser localStorage across refreshes
- Mobile-first layout (375 px and up), no external dependencies

## File structure
```
public/
  index.html        App shell (HTML structure)
  css/style.css     Mobile-first styles, WCAG AA contrast
  js/
    store.js        Pure data functions (CRUD + localStorage)
    app.js          UI logic: rendering, events, filter state
tests/
  store.test.js     Unit tests for store.js (node:test, 17 tests)
docs/
  BRD.md            Business Requirements Document (v1)
  PLAN.md           Development Plan (v1)
  USER_GUIDE.md     End-user guide
  approvals.md      Approval log (G1, G2, G3)
```

## Running the tests
Requires Node.js 18 or later.

```bash
npm test
```

All 17 tests should pass.

## Running locally
No build step needed — just open `public/index.html` in a browser, or serve the `public/` folder with any static file server:

```bash
npx serve public
```
