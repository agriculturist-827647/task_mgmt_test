import React, { useState, useEffect } from 'react';
import { taskStorage } from '../services/storage';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTasks(taskStorage.getTasks());
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    const updated = taskStorage.toggleTask(taskId);
    if (updated) handleTaskUpdated(updated);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="task-list-container">
      <TaskForm onTaskCreated={handleTaskCreated} />
      <div className="task-filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({tasks.length})</button>
        <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active ({activeTasks})</button>
        <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Done ({completedTasks})</button>
      </div>
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>{filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}</p>
            <p className="empty-hint">{filter === 'all' ? 'Add your first task above!' : ''}</p>
          </div>
        ) : filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdated} onDelete={handleTaskDeleted} onToggle={handleToggleComplete} />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
