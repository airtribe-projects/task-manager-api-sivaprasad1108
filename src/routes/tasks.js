const express = require('express');
const router = express.Router();
const controller = require('../controllers/tasksController');
const validator = require('../middlewares/validator');


// GET /tasks?completed=true&sort=asc|desc
router.get('/', controller.listTasks);


// GET /tasks/priority/:level (place before :id to avoid route conflicts)
router.get('/priority/:level', controller.tasksByPriority);

// GET /tasks/:id
router.get('/:id', controller.getTask);


// POST /tasks
router.post('/', validator.validateCreate, controller.createTask);


// PUT /tasks/:id
router.put('/:id', validator.validateUpdate, controller.updateTask);


// DELETE /tasks/:id
router.delete('/:id', controller.removeTask);




module.exports = router;