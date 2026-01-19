import api from './api';

const taskService = {
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(query ? `/api/tasks?${query}` : '/api/tasks');
  },
  getTask: (id) => api.get(`/api/tasks/${id}`),
  createTask: (data) => api.post('/api/tasks', data),
  updateTask: (id, data) => api.put(`/api/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
  toggleComplete: (id) => api.patch(`/api/tasks/${id}`)
};

export default taskService;
