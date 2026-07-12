import api from './axios';

export const productApi = {
  getAll: () => api.get('/api/listAllProducts'),
  getByGodown: (godownId) => api.get(`/api/listProducts/${godownId}`),
  getNames: () => api.get('/api/getAllProduct'),
  getById: (id) => api.get(`/api/getAllProduct/${id}`),
  getTopSelling: (godownId) => godownId
    ? api.get(`/api/getTopSellingProducts/${godownId}`)
    : api.get('/api/getTopSellingProducts'),
  create: (data) => api.post('/api/addProduct', data),
  updateByName: (data) => api.patch('/api/updateProduct', data),
  updateById: (id, data) => api.put(`/api/updateProduct/${id}`, data),
  delete: (id) => api.delete(`/api/updateProduct/${id}`),
};
