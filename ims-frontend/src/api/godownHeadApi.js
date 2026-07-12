import api from './axios';

export const godownHeadApi = {
  getProfile: () => api.get('/api/getGodownHead'),
  getById: (id) => api.get(`/api/getGodownHead/${id}`),
  getByGodownId: (godownId) => api.get(`/api/getGodownHeadByGodownId/${godownId}`),
  updateProfile: (data) => api.put('/api/updateGodownHead', data),
  updatePassword: (data) => api.put('/api/updatePassword', data),
};
