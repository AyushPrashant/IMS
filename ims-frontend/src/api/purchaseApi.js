import api from './axios';

export const purchaseApi = {
  getAll: () => api.get('/api/getAllPurchaseOrders'),
  getById: (id) => api.get(`/api/getPurchaseOrderByPurchaseId/${id}`),
  getCountByGodown: (godownId) => api.get(`/api/getPurchasedProductsCountByGodownId/${godownId}`),
  getTotalCount: () => api.get('/api/getPurchasedProductsCount'),
  create: (data) => api.post('/api/createPurchaseOrder', data),
};
