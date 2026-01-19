import React, { useState } from 'react';
import { taskStorage } from '../services/storage';

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = taskStorage.createTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null
    });

    onTaskCreated(newTask);
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-main">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="task-title-input"
          autoFocus
        />
        <button type="button" className="btn btn-icon" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '−' : '+'}
        </button>
        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
          Add
        </button>
      </div>
      {isExpanded && (
        <div className="task-form-expanded">
          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details (optional)"
              rows={2}
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-due-date">Due Date</label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default TaskForm;
