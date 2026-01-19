const STORAGE_KEY = 'taskmanager_tasks';

const getStoredTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const taskStorage = {
  getTasks: () => getStoredTasks(),

  createTask: (data) => {
    const tasks = getStoredTasks();
    const newTask = {
      id: generateId(),
      title: data.title,
      description: data.description || '',
      completed: false,
      dueDate: data.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    saveTasks(tasks);
    return newTask;
  },

  updateTask: (id, data) => {
    const tasks = getStoredTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    saveTasks(tasks);
    return tasks[index];
  },

  deleteTask: (id) => {
    const tasks = getStoredTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
    return true;
  },

  toggleTask: (id) => {
    const tasks = getStoredTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index].completed = !tasks[index].completed;
    tasks[index].updatedAt = new Date().toISOString();
    saveTasks(tasks);
    return tasks[index];
  }
};
