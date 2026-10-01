/**
 * store.js — Pure functions for task management and localStorage persistence.
 * Covers: BR-01, BR-02, BR-03, BR-04, BR-09
 */

const STORAGE_KEY = 'todo-app-tasks';

/**
 * Create a new task object.
 * @param {string} title - Required non-empty title.
 * @param {string|null} dueDate - ISO date string or null.
 * @returns {{ id: string, title: string, dueDate: string|null, done: boolean }}
 */
export function createTask(title, dueDate) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Task title is required and cannot be empty.');
  }
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    dueDate: dueDate ?? null,
    done: false,
  };
}

/**
 * Update fields on a task identified by id.
 * @param {Array} tasks - Existing tasks array.
 * @param {string} id - Task id to update.
 * @param {Object} changes - Fields to merge in.
 * @returns {Array} New tasks array with the task updated.
 */
export function updateTask(tasks, id, changes) {
  return tasks.map((task) =>
    task.id === id ? { ...task, ...changes } : task
  );
}

/**
 * Delete a task by id.
 * @param {Array} tasks - Existing tasks array.
 * @param {string} id - Task id to remove.
 * @returns {Array} New tasks array without the specified task.
 */
export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

/**
 * Toggle the done state of a task.
 * @param {Array} tasks - Existing tasks array.
 * @param {string} id - Task id to toggle.
 * @returns {Array} New tasks array with the task's done field flipped.
 */
export function toggleDone(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

/**
 * Persist tasks array to localStorage.
 * @param {Array} tasks - Tasks to save.
 */
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Load tasks array from localStorage.
 * @returns {Array} Saved tasks, or empty array if none exist.
 */
export function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
