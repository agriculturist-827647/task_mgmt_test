import React, { useState } from 'react';
import { taskStorage } from '../services/storage';

function TaskItem({ task, onUpdate, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');

  const handleSave = () => {
    if (!title.trim()) return;

    const updated = taskStorage.updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null
    });

    if (updated) {
      onUpdate(updated);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    taskStorage.deleteTask(task.id);
    onDelete(task.id);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    return task.dueDate && !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="form-group">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" autoFocus />
        </div>
        <div className="form-group">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} />
        </div>
        <div className="form-group">
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="task-actions">
          <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
          <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          id={`task-${task.id}`}
        />
        <label htmlFor={`task-${task.id}`}></label>
      </div>
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        {task.dueDate && (
          <span className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
      <div className="task-actions">
        <button className="btn btn-icon btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
        <button className="btn btn-icon btn-delete" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default TaskItem;
