const TaskModel = require('../models/taskModel');


async function listTasks(req, res, next) {
    try {
        const { completed, sort } = req.query;
        const tasks = TaskModel.getAllTasks({ completed, sort });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
}


async function getTask(req, res, next) {
    try {
        const { id } = req.params;
        const task = TaskModel.getTaskById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        next(err);
    }
}


async function createTask(req, res, next) {
    try {
        const { title, description, completed, priority } = req.body;
        const task = TaskModel.createTask({ title, description, completed, priority });
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}


async function updateTask(req, res, next) {
    try {
        const { id } = req.params;
        const patch = req.body;
        const updated = TaskModel.updateTask(id, patch);
        if (!updated) return res.status(404).json({ error: 'Task not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
}


async function removeTask(req, res, next) {
    try {
        const { id } = req.params;
        const ok = TaskModel.deleteTask(id);
        if (!ok) return res.status(404).json({ error: 'Task not found' });
        // return 200 to match tests' expectations
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}


async function tasksByPriority(req, res, next) {
    try {
        const { level } = req.params;
        const valid = ['low', 'medium', 'high'];
        if (!valid.includes(level)) return res.status(400).json({ error: 'Invalid priority level' });
        const tasks = TaskModel.getByPriority(level);
        res.json(tasks);
    } catch (err) {
        next(err);
    }
}


module.exports = {
    listTasks,
    getTask,
    createTask,
    updateTask,
    removeTask,
    tasksByPriority,
};