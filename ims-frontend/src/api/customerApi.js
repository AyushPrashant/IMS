import api from './axios';

export const customerApi = {
  getAll: () => api.get('/api/getAllCustomers'),
  getById: (id) => api.get(`/api/getCustomerById/${id}`),
  create: (data) => api.post('/api/createCustomer', data),
  update: (id, data) => api.put(`/api/updateCustomerById/${id}`, data),
  delete: (id) => api.delete(`/api/updateCustomerById/${id}`),
};
