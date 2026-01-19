import React, { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const params = {};
      if (filter === 'active') params.completed = 'false';
      else if (filter === 'completed') params.completed = 'true';

      const response = await taskService.getTasks(params);
      if (response.data.success) setTasks(response.data.data.tasks);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleTaskCreated = (newTask) => setTasks((prev) => [newTask, ...prev]);
  const handleTaskUpdated = (updatedTask) => setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  const handleTaskDeleted = (taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId));

  const handleToggleComplete = async (taskId) => {
    try {
      const response = await taskService.toggleComplete(taskId);
      if (response.data.success) handleTaskUpdated(response.data.data.task);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update task');
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  if (loading) return <div className="task-list-container"><div className="loading">Loading tasks...</div></div>;

  return (
    <div className="task-list-container">
      <TaskForm onTaskCreated={handleTaskCreated} />
      {error && <div className="error-message">{error}<button className="error-dismiss" onClick={() => setError(null)}>Dismiss</button></div>}
      <div className="task-filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({tasks.length})</button>
        <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active ({activeTasks})</button>
        <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed ({completedTasks})</button>
      </div>
      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found.</p>
            <p className="empty-hint">{filter === 'all' ? 'Create your first task above!' : `No ${filter} tasks.`}</p>
          </div>
        ) : tasks.map((task) => (
          <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdated} onDelete={handleTaskDeleted} onToggle={handleToggleComplete} />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
