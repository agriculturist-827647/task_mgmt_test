const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateTask, validateTaskUpdate } = require('../middleware/validate');

// All routes require authentication
router.use(auth);

// Task routes
router.get('/', taskController.getTasks);
router.post('/', validateTask, taskController.createTask);
router.get('/:id', taskController.getTask);
router.put('/:id', validateTaskUpdate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/toggle', taskController.toggleComplete);

module.exports = router;
