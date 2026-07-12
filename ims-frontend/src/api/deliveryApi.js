import api from './axios';

export const deliveryApi = {
  getAll: () => api.get('/api/getDeliveryOrders'),
  getByGodown: (godownId) => api.get(`/api/getDeliveryOrdersByGodownId/${godownId}`),
  getById: (id) => api.get(`/api/getDeliveryOrdersById/${id}`),
  getTotalCount: () => api.get('/api/getTotalDeliveryProducts'),
  placeOrder: (customerId, data) => api.post(`/api/placeOrder/${customerId}`, data),
};
