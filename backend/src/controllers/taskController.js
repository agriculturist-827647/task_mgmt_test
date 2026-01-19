const Task = require('../models/Task');

// Get all tasks for the authenticated user
exports.getTasks = async (req, res, next) => {
  try {
    const { completed, sort = '-createdAt', limit = 50, page = 1 } = req.query;

    // Build query
    const query = { userId: req.userId };

    // Filter by completion status if provided
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tasks = await Task.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single task by ID
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found'
        }
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;

    const task = new Task({
      title,
      description: description || '',
      dueDate: dueDate || null,
      userId: req.userId
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: { task },
      message: 'Task created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, completed, dueDate } = req.body;

    // Build update object with only provided fields
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (completed !== undefined) update.completed = completed;
    if (dueDate !== undefined) update.dueDate = dueDate;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      update,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found'
        }
      });
    }

    res.json({
      success: true,
      data: { task },
      message: 'Task updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found'
        }
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Toggle task completion status
exports.toggleComplete = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found'
        }
      });
    }

    task.completed = !task.completed;
    await task.save();

    res.json({
      success: true,
      data: { task },
      message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`
    });
  } catch (error) {
    next(error);
  }
};
