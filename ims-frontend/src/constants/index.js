export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const ROLES = {
  ADMIN: 'ADMIN',
  GODOWN_HEAD: 'GODOWNHEAD',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  GODOWNS: '/godowns',
  GODOWN_HEADS: '/godown-heads',
  PRODUCTS: '/products',
  SUPPLIERS: '/suppliers',
  CUSTOMERS: '/customers',
  PURCHASE_ORDERS: '/purchase-orders',
  DELIVERY_ORDERS: '/delivery-orders',
  REPORTS: '/reports',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  UNAUTHORIZED: '/unauthorized',
};

export const QUERY_KEYS = {
  AUTH_USER: ['auth', 'user'],
  GODOWNS: ['godowns'],
  GODOWN: (id) => ['godowns', id],
  GODOWN_HEAD: (id) => ['godownHead', id],
  GODOWN_HEADS_BY_GODOWN: (id) => ['godownHeads', 'godown', id],
  PRODUCTS: ['products'],
  PRODUCTS_BY_GODOWN: (id) => ['products', 'godown', id],
  PRODUCT_NAMES: ['products', 'names'],
  TOP_SELLING: (id) => ['products', 'topSelling', id],
  SUPPLIERS: ['suppliers'],
  CUSTOMERS: ['customers'],
  PURCHASE_ORDERS: ['purchaseOrders'],
  PURCHASE_ORDER: (id) => ['purchaseOrders', id],
  DELIVERY_ORDERS: ['deliveryOrders'],
  DELIVERY_ORDERS_BY_GODOWN: (id) => ['deliveryOrders', 'godown', id],
  DELIVERY_ORDER: (id) => ['deliveryOrders', id],
  CAPACITY: (id) => ['capacity', id],
  SALES_COUNT: (id) => ['analytics', 'salesCount', id],
  SALES_BY_DATE: (godownId, date) => ['analytics', 'salesByDate', godownId, date],
  SALES_BY_MONTH: (id) => ['analytics', 'salesByMonth', id],
  ORDER_QTY_BY_MONTH: (id) => ['analytics', 'orderQtyByMonth', id],
  SALES_BY_WEEK: ['analytics', 'salesByWeek'],
  PURCHASE_COUNT: ['analytics', 'purchaseCount'],
  PURCHASE_COUNT_BY_GODOWN: (id) => ['analytics', 'purchaseCount', id],
  DELIVERY_COUNT: ['analytics', 'deliveryCount'],
};

export const MONTHS = [
  'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
];

export const MONTH_SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

export const STATUS_COLORS = {
  COMPLETED:  { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-400' },
  DELIVERED:  { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-400' },
  PENDING:    { bg: 'bg-yellow-100 dark:bg-yellow-900/30',text: 'text-yellow-700 dark:text-yellow-400' },
  CANCELLED:  { bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-700 dark:text-red-400' },
  ACTIVE:     { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-400' },
  INACTIVE:   { bg: 'bg-gray-100 dark:bg-gray-900/30',    text: 'text-gray-600 dark:text-gray-400' },
  ADMIN:      { bg: 'bg-purple-100 dark:bg-purple-900/30',text: 'text-purple-700 dark:text-purple-400' },
  GODOWNHEAD: { bg: 'bg-indigo-100 dark:bg-indigo-900/30',text: 'text-indigo-700 dark:text-indigo-400' },
};

export const LOW_STOCK_THRESHOLD = 10;

export const ITEMS_PER_PAGE = 10;

export const CHART_COLORS = {
  primary:  '#6366f1',
  success:  '#22c55e',
  warning:  '#eab308',
  danger:   '#ef4444',
  info:     '#3b82f6',
  purple:   '#a855f7',
  orange:   '#f97316',
  teal:     '#14b8a6',
  pink:     '#ec4899',
  cyan:     '#06b6d4',
};

export const GRADIENT_COLORS = [
  { from: '#667eea', to: '#764ba2' },
  { from: '#11998e', to: '#38ef7d' },
  { from: '#f093fb', to: '#f5576c' },
  { from: '#4facfe', to: '#00f2fe' },
  { from: '#43e97b', to: '#38f9d7' },
  { from: '#fa709a', to: '#fee140' },
];
