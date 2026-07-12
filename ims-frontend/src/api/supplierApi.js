import api from './axios';

export const supplierApi = {
  getAll: () => api.get('/api/getAllSuppliers'),
  create: (data) => api.post('/api/createSupplier', data),
  update: (data) => api.put('/api/updateSuppliers', data),
  updateById: (id, data) => api.put(`/api/updateSuppliers/${id}`, data),
  delete: (id) => api.delete(`/api/updateSuppliers/${id}`),
};
