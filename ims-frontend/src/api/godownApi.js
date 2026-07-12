import api from './axios';

export const godownApi = {
  getAll: () => api.get('/api/getAllGodown'),
  getById: (id) => api.get(`/api/getGodown/${id}`),
  getCount: () => api.get('/api/getGodwnCount'),
  getCapacity: (id) => api.get(`/api/getCapacity/${id}`),
  create: (data) => api.post('/api/createGodown', data),
  update: (id, data) => api.put(`/api/createGodown/${id}`, data),
  delete: (id) => api.delete(`/api/createGodown/${id}`),
};
