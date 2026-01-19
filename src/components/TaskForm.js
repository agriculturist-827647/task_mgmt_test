import React, { useState } from 'react';
import taskService from '../services/taskService';

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Task title is required'); return; }

    setIsLoading(true);
    try {
      const response = await taskService.createTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null
      });
      if (response.data.success) {
        onTaskCreated(response.data.data.task);
        setTitle(''); setDescription(''); setDueDate(''); setIsExpanded(false);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {error && <div className="error-message small">{error}</div>}
      <div className="task-form-main">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a new task..." disabled={isLoading} className="task-title-input" />
        <button type="button" className="btn btn-icon" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? '−' : '+'}</button>
        <button type="submit" className="btn btn-primary" disabled={isLoading || !title.trim()}>{isLoading ? 'Adding...' : 'Add'}</button>
      </div>
      {isExpanded && (
        <div className="task-form-expanded">
          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea id="task-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description (optional)" disabled={isLoading} rows={3} />
          </div>
          <div className="form-group">
            <label htmlFor="task-due-date">Due Date</label>
            <input id="task-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={isLoading} />
          </div>
        </div>
      )}
    </form>
  );
}

export default TaskForm;
