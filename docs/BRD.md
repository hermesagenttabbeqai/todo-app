# Business Requirements Document — todo-app

| Field       | Value                     |
|-------------|---------------------------|
| Requester   | Leya Kassir               |
| Date        | 2026-10-01                |
| Version     | v1                        |

---

## 1 Summary
A mobile-first, static web todo app for team use. Each team member manages their own tasks in their browser — no login or server required. Users can add, edit, delete and complete tasks with optional due dates.

## 2 Users and Goals
- **Users:** Team members (multiple people), each using the app on their own device/browser.
- **Goal:** Keep track of personal tasks efficiently, see what is due, and stay on top of progress — all from a phone.

## 3 Functional Requirements

| ID    | Requirement |
|-------|-------------|
| BR-01 | The user can add a new task with a title (required) and an optional due date. |
| BR-02 | The user can edit the title and due date of an existing task. |
| BR-03 | The user can delete a task with a confirmation prompt. |
| BR-04 | The user can mark a task as complete or incomplete (toggle). |
| BR-05 | Completed tasks are visually distinguished (e.g. strikethrough). |
| BR-06 | The user can filter tasks by status: All, Active, Completed. |
| BR-07 | Tasks with a due date show the date; overdue tasks are highlighted. |
| BR-08 | Tasks are sorted by due date (earliest first); tasks without a date appear last. |
| BR-09 | All tasks are saved in browser localStorage and persist across page refreshes. |
| BR-10 | The app shows a count of remaining active tasks. |

## 4 Non-Functional Requirements

| ID     | Requirement |
|--------|-------------|
| NFR-01 | Mobile-first responsive layout; fully usable on screens 375 px and wider. |
| NFR-02 | Loads in under 2 seconds on a standard mobile connection. |
| NFR-03 | No external dependencies (no frameworks, no CDN calls). |
| NFR-04 | Works in the latest version of Chrome, Safari and Firefox. |
| NFR-05 | Meets WCAG 2.1 AA contrast standards. |
| NFR-06 | Language: English only. |

## 5 Recommendations Accepted
- **Filter bar (All / Active / Completed):** makes it easy to focus on what still needs doing — accepted (BR-06).
- **Sort by due date with overdue highlight:** helps users see urgent tasks at a glance — accepted (BR-07, BR-08).

## 6 Assumptions
- Each user's tasks are private to their own browser; there is no shared or synced task list across devices.
- The app is a single-page static web app deployed to GitHub Pages (HTML, CSS, vanilla JavaScript).
- No user accounts, authentication or backend of any kind.

## 7 Out of Scope
- User accounts or login
- Shared/synced task lists across devices or users
- Push notifications or reminders
- Attachments, comments or sub-tasks
- Offline PWA / installable app

## 8 Acceptance Checklist
- [ ] Can add a task with title only
- [ ] Can add a task with title and due date
- [ ] Can edit an existing task's title and due date
- [ ] Can delete a task (confirmation shown)
- [ ] Can mark a task done; it appears with strikethrough
- [ ] Filter bar switches between All / Active / Completed correctly
- [ ] Overdue tasks are visually highlighted
- [ ] Tasks are sorted by due date (earliest first)
- [ ] Refreshing the page keeps all tasks (localStorage)
- [ ] Active task count is shown and updates correctly
- [ ] App looks good on a 375 px wide phone screen
