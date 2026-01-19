const { store, generateId } = require('../lib/store');
const { authenticate } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = authenticate(req);
  if (auth.error) {
    return res.status(auth.error.status).json({
      success: false,
      error: { message: auth.error.message }
    });
  }

  const { userId } = auth;

  try {
    if (req.method === 'GET') {
      // Get all tasks for user
      const { completed } = req.query;
      const tasks = [];

      for (const [, task] of store.tasks) {
        if (task.userId === userId) {
          if (completed === undefined ||
              (completed === 'true' && task.completed) ||
              (completed === 'false' && !task.completed)) {
            tasks.push(task);
          }
        }
      }

      // Sort by createdAt descending
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        data: { tasks, pagination: { total: tasks.length } }
      });
    }

    if (req.method === 'POST') {
      // Create task
      const { title, description, dueDate } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          error: { message: 'Title is required' }
        });
      }

      const taskId = generateId();
      const task = {
        id: taskId,
        title: title.trim(),
        description: description?.trim() || '',
        completed: false,
        dueDate: dueDate || null,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.tasks.set(taskId, task);

      return res.status(201).json({
        success: true,
        data: { task },
        message: 'Task created successfully'
      });
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({ success: false, error: { message: 'Server error' } });
  }
};
