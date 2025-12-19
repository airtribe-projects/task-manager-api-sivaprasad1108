// In-memory 'database' for tasks. Keep functions here to keep controllers thin.
const path = require('path');
const fs = require('fs');

// Seed using task.json (existing seed data) to align with tests.
const seedPath = path.resolve(__dirname, '../../task.json');
let tasks = [];
try {
    const raw = fs.readFileSync(seedPath, 'utf8');
    const parsed = JSON.parse(raw);
    tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map(t => ({
        id: Number(t.id),
        title: t.title,
        description: t.description,
        completed: Boolean(t.completed),
        priority: t.priority || 'medium',
        createdAt: t.createdAt || new Date().toISOString(),
        updatedAt: t.updatedAt || new Date().toISOString(),
    })) : [];
} catch (err) {
    tasks = [];
}


let lastId = tasks.reduce((acc, t) => Math.max(acc, Number(t.id || 0)), 0);
function createTask({ title, description, completed = false, priority = 'medium' }) {
    const task = {
        id: ++lastId,
        title,
        description,
        completed: Boolean(completed),
        priority: priority || 'medium', // low | medium | high
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    saveTasksToDisk();
    return task;
}


function getAllTasks({ completed, sort }) {
    let result = tasks.slice();
    if (completed !== undefined) {
        const boolVal = (completed === 'true' || completed === true) ? true : false;
        result = result.filter(t => t.completed === boolVal);
    }
    if (sort) {
        if (sort.toLowerCase() === 'asc') {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sort.toLowerCase() === 'desc') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }
    return result;
}


function getTaskById(id) {
    const numId = Number(id);
    return tasks.find(t => Number(t.id) === numId);
}


function updateTask(id, patch) {
    const task = getTaskById(id);
    if (!task) return null;
    if (patch.title !== undefined) task.title = patch.title;
    if (patch.description !== undefined) task.description = patch.description;
    if (patch.completed !== undefined) task.completed = Boolean(patch.completed);
    if (patch.priority !== undefined) task.priority = patch.priority;
    task.updatedAt = new Date().toISOString();
    saveTasksToDisk();
    return task;
}


function deleteTask(id) {
    const numId = Number(id);
    const idx = tasks.findIndex(t => Number(t.id) === numId);
    if (idx === -1) return false;
    tasks.splice(idx, 1);
    saveTasksToDisk();
    return true;
}


function getByPriority(level) {
    return tasks.filter(t => t.priority === level);
}


function saveTasksToDisk() {
    // Do not persist to disk when running tests to avoid polluting seed data
    if (process.env.NODE_ENV === 'test' || process.env.TAP) return;
    try {
        fs.writeFileSync(seedPath, JSON.stringify({ tasks }, null, 2), 'utf8');
    } catch (err) {
        // we intentionally don't throw; avoid failing requests due to disk write
        console.error('Failed to persist tasks to disk', err);
    }
}


module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getByPriority,
    // exported for testing/debugging
    _tasks: tasks,
};