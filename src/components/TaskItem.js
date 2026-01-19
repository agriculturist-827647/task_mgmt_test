import React, { useState } from 'react';
import taskService from '../services/taskService';

function TaskItem({ task, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setIsLoading(true);
    setError('');
    try {
      const response = await taskService.updateTask(task.id, { title: title.trim(), description: description.trim(), dueDate: dueDate || null });
      if (response.data.success) { onUpdate(response.data.data.task); setIsEditing(false); }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setIsLoading(true);
    try {
      const response = await taskService.deleteTask(task.id);
      if (response.data.success) onDelete(task.id);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete task');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title); setDescription(task.description || ''); setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setError(''); setIsEditing(false);
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const isOverdue = () => task.dueDate && !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  if (isEditing) {
    return (
      <div className="task-item editing">
        {error && <div className="error-message small">{error}</div>}
        <div className="form-group"><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" disabled={isLoading} /></div>
        <div className="form-group"><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" disabled={isLoading} rows={2} /></div>
        <div className="form-group"><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={isLoading} /></div>
        <div className="task-actions">
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
          <button className="btn btn-secondary btn-sm" onClick={handleCancel} disabled={isLoading}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} disabled={isLoading} id={`task-${task.id}`} />
        <label htmlFor={`task-${task.id}`}></label>
      </div>
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        {task.dueDate && <span className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>Due: {formatDate(task.dueDate)}</span>}
      </div>
      <div className="task-actions">
        <button className="btn btn-icon btn-edit" onClick={() => setIsEditing(true)} disabled={isLoading}>Edit</button>
        <button className="btn btn-icon btn-delete" onClick={handleDelete} disabled={isLoading}>Delete</button>
      </div>
      {error && <div className="error-message small">{error}</div>}
    </div>
  );
}

export default TaskItem;
