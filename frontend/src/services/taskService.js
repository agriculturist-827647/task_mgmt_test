import api from './api';

const taskService = {
  // Get all tasks
  async getTasks(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.completed !== undefined) {
      queryParams.append('completed', params.completed);
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    if (params.page) {
      queryParams.append('page', params.page);
    }

    const query = queryParams.toString();
    const endpoint = query ? `/tasks?${query}` : '/tasks';

    return api.get(endpoint);
  },

  // Get a single task
  async getTask(id) {
    return api.get(`/tasks/${id}`);
  },

  // Create a new task
  async createTask(taskData) {
    return api.post('/tasks', taskData);
  },

  // Update a task
  async updateTask(id, taskData) {
    return api.put(`/tasks/${id}`, taskData);
  },

  // Delete a task
  async deleteTask(id) {
    return api.delete(`/tasks/${id}`);
  },

  // Toggle task completion
  async toggleComplete(id) {
    return api.patch(`/tasks/${id}/toggle`);
  }
};

export default taskService;
