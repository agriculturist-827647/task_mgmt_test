const api = {
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  async request(endpoint, options = {}) {
    const response = await fetch(endpoint, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers }
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.error?.message || 'Request failed');
      error.response = { data, status: response.status };
      throw error;
    }
    return { data, status: response.status };
  },

  get: (endpoint) => api.request(endpoint),
  post: (endpoint, body) => api.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body = {}) => api.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' })
};

export default api;
