const { store } = require('../lib/store');
const { authenticate } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
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
  const { id } = req.query;

  try {
    const task = store.tasks.get(id);

    if (!task || task.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: { message: 'Task not found' }
      });
    }

    if (req.method === 'GET') {
      return res.json({ success: true, data: { task } });
    }

    if (req.method === 'PUT') {
      const { title, description, completed, dueDate } = req.body;

      if (title !== undefined) {
        if (!title.trim()) {
          return res.status(400).json({
            success: false,
            error: { message: 'Title cannot be empty' }
          });
        }
        task.title = title.trim();
      }
      if (description !== undefined) task.description = description.trim();
      if (completed !== undefined) task.completed = Boolean(completed);
      if (dueDate !== undefined) task.dueDate = dueDate;
      task.updatedAt = new Date().toISOString();

      store.tasks.set(id, task);

      return res.json({
        success: true,
        data: { task },
        message: 'Task updated successfully'
      });
    }

    if (req.method === 'PATCH') {
      // Toggle completion
      task.completed = !task.completed;
      task.updatedAt = new Date().toISOString();
      store.tasks.set(id, task);

      return res.json({
        success: true,
        data: { task },
        message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`
      });
    }

    if (req.method === 'DELETE') {
      store.tasks.delete(id);
      return res.json({ success: true, message: 'Task deleted successfully' });
    }

    res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  } catch (error) {
    console.error('Task error:', error);
    res.status(500).json({ success: false, error: { message: 'Server error' } });
  }
};
