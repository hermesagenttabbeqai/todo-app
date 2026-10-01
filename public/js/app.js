/**
 * app.js — UI logic for todo-app
 * Imports pure functions from ./store.js
 * Covers: BR-01 to BR-08, BR-10, NFR-01 to NFR-06
 */

import {
  createTask,
  updateTask,
  deleteTask,
  toggleDone,
  saveTasks,
  loadTasks,
} from './store.js';

// ── State ──────────────────────────────────────────────────
let tasks = loadTasks();
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

// ── DOM references ─────────────────────────────────────────
const taskList    = document.getElementById('task-list');
const emptyState  = document.getElementById('empty-state');
const activeCount = document.getElementById('active-count');
const addForm     = document.getElementById('add-task-form');
const titleInput  = document.getElementById('task-title');
const dueInput    = document.getElementById('task-due');
const formError   = document.getElementById('form-error');

const modalBackdrop = document.getElementById('modal-backdrop');
const editForm      = document.getElementById('edit-task-form');
const editIdInput   = document.getElementById('edit-task-id');
const editTitleInput = document.getElementById('edit-title');
const editDueInput  = document.getElementById('edit-due');
const editFormError = document.getElementById('edit-form-error');
const modalCancel   = document.getElementById('modal-cancel');

const filterButtons = document.querySelectorAll('.filter-btn');

// ── Helpers ────────────────────────────────────────────────

/**
 * Today's date as YYYY-MM-DD (local time).
 */
function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns true if the task is overdue (has a past due date and is not done).
 */
function isOverdue(task) {
  if (task.done || !task.dueDate) return false;
  return task.dueDate < todayStr();
}

/**
 * Format an ISO date string (YYYY-MM-DD) as a readable label.
 */
function formatDate(dateStr) {
  if (!dateStr) return null;
  // Parse components directly to avoid timezone shifting
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Sort tasks by dueDate ascending; tasks without a date go last.
 */
function sortedTasks(taskArray) {
  return [...taskArray].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
  });
}

/**
 * Return the subset of tasks matching the current filter.
 */
function filteredTasks(taskArray) {
  switch (currentFilter) {
    case 'active':    return taskArray.filter(t => !t.done);
    case 'completed': return taskArray.filter(t => t.done);
    default:          return taskArray;
  }
}

// ── Rendering ──────────────────────────────────────────────

function render() {
  const visible = filteredTasks(sortedTasks(tasks));

  // Update active count
  const activeNum = tasks.filter(t => !t.done).length;
  activeCount.textContent = `${activeNum} task${activeNum !== 1 ? 's' : ''} left`;

  // Empty state
  if (visible.length === 0) {
    taskList.innerHTML = '';
    emptyState.hidden = false;
    const msg = currentFilter === 'active'
      ? 'No active tasks.'
      : currentFilter === 'completed'
        ? 'No completed tasks.'
        : 'No tasks yet. Add one below!';
    emptyState.textContent = msg;
  } else {
    emptyState.hidden = true;
    taskList.innerHTML = '';
    for (const task of visible) {
      taskList.appendChild(createTaskElement(task));
    }
  }
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  if (task.done) li.classList.add('task-item--done');
  if (isOverdue(task)) li.classList.add('task-item--overdue');
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', `Mark "${task.title}" as ${task.done ? 'incomplete' : 'complete'}`);
  checkbox.addEventListener('change', () => handleToggle(task.id));

  // Body
  const body = document.createElement('div');
  body.className = 'task-body';

  const titleEl = document.createElement('span');
  titleEl.className = 'task-title';
  titleEl.textContent = task.title;

  body.appendChild(titleEl);

  if (task.dueDate) {
    const dueEl = document.createElement('span');
    dueEl.className = 'task-due';
    if (isOverdue(task)) dueEl.classList.add('task-due--overdue');
    const label = isOverdue(task) ? '⚠ Overdue · ' : 'Due: ';
    dueEl.textContent = label + formatDate(task.dueDate);
    body.appendChild(dueEl);
  }

  // Actions
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'task-btn task-btn--edit';
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('aria-label', `Edit task: ${task.title}`);
  editBtn.addEventListener('click', () => openEditModal(task));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'task-btn task-btn--delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('aria-label', `Delete task: ${task.title}`);
  deleteBtn.addEventListener('click', () => handleDelete(task.id, task.title));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(actions);

  return li;
}

// ── Event handlers ─────────────────────────────────────────

function handleToggle(id) {
  tasks = toggleDone(tasks, id);
  saveTasks(tasks);
  render();
}

function handleDelete(id, title) {
  if (!window.confirm(`Delete task "${title}"?`)) return;
  tasks = deleteTask(tasks, id);
  saveTasks(tasks);
  render();
}

function openEditModal(task) {
  editIdInput.value     = task.id;
  editTitleInput.value  = task.title;
  editDueInput.value    = task.dueDate || '';
  editFormError.textContent = '';
  modalBackdrop.hidden  = false;
  modalBackdrop.removeAttribute('aria-hidden');
  editTitleInput.focus();
}

function closeEditModal() {
  modalBackdrop.hidden = true;
  modalBackdrop.setAttribute('aria-hidden', 'true');
  editForm.reset();
  editFormError.textContent = '';
}

// Add-task form submit
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formError.textContent = '';
  const title = titleInput.value.trim();
  const due   = dueInput.value || null;
  try {
    const task = createTask(title, due);
    tasks = [...tasks, task];
    saveTasks(tasks);
    titleInput.value = '';
    dueInput.value   = '';
    render();
    titleInput.focus();
  } catch (err) {
    formError.textContent = err.message;
    titleInput.focus();
  }
});

// Edit form submit
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  editFormError.textContent = '';
  const id    = editIdInput.value;
  const title = editTitleInput.value.trim();
  const due   = editDueInput.value || null;
  if (!title) {
    editFormError.textContent = 'Task title is required and cannot be empty.';
    editTitleInput.focus();
    return;
  }
  tasks = updateTask(tasks, id, { title, dueDate: due });
  saveTasks(tasks);
  closeEditModal();
  render();
});

// Cancel / backdrop close
modalCancel.addEventListener('click', closeEditModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeEditModal();
});

// Escape key closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalBackdrop.hidden) closeEditModal();
});

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(b => {
      b.classList.toggle('filter-btn--active', b === btn);
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    render();
  });
});

// ── Init ───────────────────────────────────────────────────
render();
