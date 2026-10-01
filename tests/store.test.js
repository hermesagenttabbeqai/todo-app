import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createTask, updateTask, deleteTask, toggleDone, saveTasks, loadTasks } from '../public/js/store.js';

// Mock localStorage for Node environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

global.localStorage = localStorageMock;

describe('createTask', () => {
  it('returns correct shape with title and null dueDate', () => {
    const task = createTask('Buy milk', null);
    assert.ok(typeof task.id === 'string' && task.id.length > 0, 'id should be a non-empty string');
    assert.equal(task.title, 'Buy milk');
    assert.equal(task.dueDate, null);
    assert.equal(task.done, false);
  });

  it('throws on empty title', () => {
    assert.throws(() => createTask('', null), /title/i);
  });

  it('throws on whitespace-only title', () => {
    assert.throws(() => createTask('   ', null), /title/i);
  });

  it('returns unique ids', () => {
    const t1 = createTask('Task 1', null);
    const t2 = createTask('Task 2', null);
    assert.notEqual(t1.id, t2.id);
  });

  it('stores provided dueDate', () => {
    const task = createTask('Meeting', '2026-10-15');
    assert.equal(task.dueDate, '2026-10-15');
  });
});

describe('updateTask', () => {
  it('returns array with updated task', () => {
    const tasks = [createTask('Buy milk', null)];
    const id = tasks[0].id;
    const updated = updateTask(tasks, id, { title: 'Buy bread' });
    assert.equal(updated.length, 1);
    assert.equal(updated[0].title, 'Buy bread');
    assert.equal(updated[0].id, id);
  });

  it('does not mutate the original array', () => {
    const tasks = [createTask('Original', null)];
    const id = tasks[0].id;
    updateTask(tasks, id, { title: 'Changed' });
    assert.equal(tasks[0].title, 'Original');
  });

  it('only updates specified fields', () => {
    const tasks = [createTask('Task', '2026-10-15')];
    const id = tasks[0].id;
    const updated = updateTask(tasks, id, { title: 'New Title' });
    assert.equal(updated[0].dueDate, '2026-10-15');
    assert.equal(updated[0].done, false);
  });
});

describe('deleteTask', () => {
  it('returns array without the deleted task', () => {
    const tasks = [createTask('Task A', null), createTask('Task B', null)];
    const id = tasks[0].id;
    const result = deleteTask(tasks, id);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, tasks[1].id);
  });

  it('does not mutate the original array', () => {
    const tasks = [createTask('Task', null)];
    const id = tasks[0].id;
    deleteTask(tasks, id);
    assert.equal(tasks.length, 1);
  });
});

describe('toggleDone', () => {
  it('flips done from false to true', () => {
    const tasks = [createTask('Task', null)];
    const id = tasks[0].id;
    const result = toggleDone(tasks, id);
    assert.equal(result[0].done, true);
  });

  it('flips done from true to false', () => {
    const tasks = [createTask('Task', null)];
    const id = tasks[0].id;
    const toggled = toggleDone(tasks, id);
    const toggled2 = toggleDone(toggled, id);
    assert.equal(toggled2[0].done, false);
  });

  it('does not mutate the original array', () => {
    const tasks = [createTask('Task', null)];
    const id = tasks[0].id;
    toggleDone(tasks, id);
    assert.equal(tasks[0].done, false);
  });
});

describe('saveTasks / loadTasks', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('loadTasks returns empty array when nothing saved', () => {
    const result = loadTasks();
    assert.deepEqual(result, []);
  });

  it('saveTasks writes and loadTasks returns the same array', () => {
    const tasks = [
      createTask('Buy milk', null),
      createTask('Walk dog', '2026-10-10'),
    ];
    saveTasks(tasks);
    const loaded = loadTasks();
    assert.deepEqual(loaded, tasks);
  });

  it('persists done state', () => {
    const tasks = [createTask('Task', null)];
    const toggled = toggleDone(tasks, tasks[0].id);
    saveTasks(toggled);
    const loaded = loadTasks();
    assert.equal(loaded[0].done, true);
  });
});
