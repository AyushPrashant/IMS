import api from './axios';
import { format } from 'date-fns';

export const dashboardApi = {
  getSalesCount: (godownId) => godownId
    ? api.get(`/api/getTotalSalesCount/${godownId}`)
    : api.get('/api/getTotalSalesCount'),

  getSalesByDate: (godownId, date) => {
    const dateStr = date ? format(new Date(date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    return api.get('/api/getSalesByDate', { params: { godownId, date: dateStr } });
  },

  getSalesByMonth: (godownId) => api.get(`/api/getSalesByMonth/${godownId}`),

  getOrderQtyByMonth: (godownId) => api.get(`/api/getOrderQuantityByMonth/${godownId}`),

  getSalesByWeek: () => api.get('/api/getSalesByWeek'),

  getPurchaseCount: (godownId) => godownId
    ? api.get(`/api/getPurchasedProductsCountByGodownId/${godownId}`)
    : api.get('/api/getPurchasedProductsCount'),

  getTotalDelivered: () => api.get('/api/getTotalDeliveryProducts'),
};
