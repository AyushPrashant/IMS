import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiCube, HiOfficeBuilding, HiUsers, HiTag,
  HiShoppingCart, HiTruck, HiChartBar, HiExclamation,
  HiPlus, HiEye,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/dashboardApi';
import { godownApi } from '../../api/godownApi';
import { productApi } from '../../api/productApi';
import { supplierApi } from '../../api/supplierApi';
import { customerApi } from '../../api/customerApi';
import { purchaseApi } from '../../api/purchaseApi';
import { deliveryApi } from '../../api/deliveryApi';
import { QUERY_KEYS, ROUTES, LOW_STOCK_THRESHOLD } from '../../constants';
import StatCard from '../../components/ui/StatCard';
import { SalesAreaChart, OrderQtyBarChart, TopProductsPieChart } from '../../components/charts/DashboardCharts';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations/variants';
import { formatDate, formatCurrency } from '../../utils';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const godownId = user?.godownId;

  // Fetch all dashboard data
  const { data: salesCount, isLoading: loadingSales } = useQuery({
    queryKey: QUERY_KEYS.SALES_COUNT(godownId),
    queryFn: () => dashboardApi.getSalesCount(isAdmin ? null : godownId).then(r => r.data),
  });

  const { data: salesByMonth, isLoading: loadingMonthly } = useQuery({
    queryKey: QUERY_KEYS.SALES_BY_MONTH(godownId || 0),
    queryFn: () => dashboardApi.getSalesByMonth(godownId || 1).then(r => r.data),
    enabled: !!godownId || isAdmin,
  });

  const { data: orderQtyByMonth, isLoading: loadingOrderQty } = useQuery({
    queryKey: QUERY_KEYS.ORDER_QTY_BY_MONTH(godownId || 0),
    queryFn: () => dashboardApi.getOrderQtyByMonth(godownId || 1).then(r => r.data),
    enabled: !!godownId || isAdmin,
  });

  const { data: topSelling, isLoading: loadingTop } = useQuery({
    queryKey: QUERY_KEYS.TOP_SELLING(godownId),
    queryFn: () => productApi.getTopSelling(isAdmin ? null : godownId).then(r => r.data),
  });

  const { data: products } = useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: () => productApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const { data: godownProducts } = useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_BY_GODOWN(godownId),
    queryFn: () => productApi.getByGodown(godownId).then(r => r.data),
    enabled: !isAdmin && !!godownId,
  });

  const { data: godowns } = useQuery({
    queryKey: QUERY_KEYS.GODOWNS,
    queryFn: () => godownApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const { data: suppliers } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIERS,
    queryFn: () => supplierApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const { data: customers } = useQuery({
    queryKey: QUERY_KEYS.CUSTOMERS,
    queryFn: () => customerApi.getAll().then(r => r.data),
  });

  const { data: deliveryOrders } = useQuery({
    queryKey: isAdmin ? QUERY_KEYS.DELIVERY_ORDERS : QUERY_KEYS.DELIVERY_ORDERS_BY_GODOWN(godownId),
    queryFn: () => isAdmin
      ? deliveryApi.getAll().then(r => r.data)
      : deliveryApi.getByGodown(godownId).then(r => r.data),
    enabled: !!godownId || isAdmin,
  });

  const { data: purchaseOrders } = useQuery({
    queryKey: QUERY_KEYS.PURCHASE_ORDERS,
    queryFn: () => purchaseApi.getAll().then(r => r.data),
  });

  const allProducts = isAdmin ? (products || []) : (godownProducts || []);
  const lowStockProducts = allProducts.filter(p => p.totalQuantity <= LOW_STOCK_THRESHOLD);
  const inventoryValue = allProducts.reduce((sum, p) => sum + (p.price || 0) * (p.totalQuantity || 0), 0);

  const stats = isAdmin
    ? [
        { title: 'Total Products', value: allProducts.length, icon: <HiCube size={22} />, index: 0 },
        { title: 'Total Godowns', value: godowns?.length || 0, icon: <HiOfficeBuilding size={22} />, index: 1 },
        { title: 'Total Customers', value: customers?.length || 0, icon: <HiUsers size={22} />, index: 2 },
        { title: 'Total Suppliers', value: suppliers?.length || 0, icon: <HiTag size={22} />, index: 3 },
        { title: 'Purchase Orders', value: purchaseOrders?.length || 0, icon: <HiShoppingCart size={22} />, index: 4 },
        { title: 'Delivery Orders', value: deliveryOrders?.length || 0, icon: <HiTruck size={22} />, index: 5 },
        { title: 'Sales Count', value: salesCount?.saleOrdersCount || 0, icon: <HiChartBar size={22} />, index: 0 },
        { title: 'Units Sold', value: salesCount?.totalQuantitiesSold || 0, icon: <HiCube size={22} />, index: 1 },
      ]
    : [
        { title: 'Products in Godown', value: allProducts.length, icon: <HiCube size={22} />, index: 0 },
        { title: 'Customers', value: customers?.length || 0, icon: <HiUsers size={22} />, index: 2 },
        { title: 'Delivery Orders', value: deliveryOrders?.length || 0, icon: <HiTruck size={22} />, index: 5 },
        { title: 'Purchase Orders', value: purchaseOrders?.length || 0, icon: <HiShoppingCart size={22} />, index: 4 },
        { title: 'Sales Count', value: salesCount?.saleOrdersCount || 0, icon: <HiChartBar size={22} />, index: 0 },
        { title: 'Units Sold', value: salesCount?.totalQuantitiesSold || 0, icon: <HiCube size={22} />, index: 1 },
      ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white"
      >
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="opacity-90">{user?.username}!</span>
          </h2>
          <p className="text-indigo-200 text-sm">
            {isAdmin ? 'Full system access — Admin Dashboard' : `Managing Godown #${godownId}`}
          </p>
        </div>
        <div className="absolute right-6 bottom-4 flex gap-2">
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.DELIVERY_ORDERS)}
            className="!bg-white/20 !text-white hover:!bg-white/30 !border-0 !rounded-xl"
            icon={<HiEye size={14} />}
          >
            View Orders
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="!bg-white/20 !text-white hover:!bg-white/30 !border-0 !rounded-xl"
            icon={<HiPlus size={14} />}
          >
            Add Product
          </Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {stats.map((s, i) => (
          <StatCard key={i} loading={loadingSales} {...s} />
        ))}
      </motion.div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card border-l-4 border-l-amber-500 !rounded-xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <HiExclamation size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low
            </p>
            <p className="text-xs text-muted mt-0.5 truncate">
              {lowStockProducts.slice(0, 3).map(p => p.productName).join(', ')}
              {lowStockProducts.length > 3 && ` +${lowStockProducts.length - 3} more`}
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => navigate(ROUTES.PRODUCTS)}>
            View
          </Button>
        </motion.div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <SalesAreaChart data={salesByMonth} loading={loadingMonthly} />
        </div>
        <TopProductsPieChart data={topSelling} loading={loadingTop} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <OrderQtyBarChart data={orderQtyByMonth} loading={loadingOrderQty} />

        {/* Recent Orders */}
        <Card>
          <CardHeader
            title="Recent Deliveries"
            subtitle="Latest delivery orders"
            action={
              <Button size="xs" variant="ghost" onClick={() => navigate(ROUTES.DELIVERY_ORDERS)}>
                View all
              </Button>
            }
          />
          <div className="space-y-3">
            {(deliveryOrders || []).slice(0, 5).map((order, i) => (
              <motion.div
                key={order.orderId || i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-theme transition-colors cursor-pointer"
                onClick={() => navigate(ROUTES.DELIVERY_ORDERS)}
              >
                <div className="w-8 h-8 rounded-lg gradient-info flex items-center justify-center flex-shrink-0">
                  <HiTruck size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">
                    {order.customer?.customerName || 'Customer'}
                  </p>
                  <p className="text-xs text-muted">{formatDate(order.orderDate)}</p>
                </div>
                <div className="text-right">
                  <Badge status="DELIVERED" dot />
                </div>
              </motion.div>
            ))}
            {(!deliveryOrders || deliveryOrders.length === 0) && (
              <p className="text-center text-sm text-muted py-8">No deliveries yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Inventory value */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="gradient-primary text-white !border-0">
          <p className="text-indigo-200 text-sm mb-1">Inventory Value</p>
          <p className="text-3xl font-bold">{formatCurrency(inventoryValue)}</p>
          <p className="text-indigo-200 text-xs mt-2">{allProducts.length} products total</p>
        </Card>
        <Card>
          <p className="text-muted text-sm mb-1">Low Stock Items</p>
          <p className="text-3xl font-bold text-amber-500">{lowStockProducts.length}</p>
          <p className="text-muted text-xs mt-2">Products need restocking</p>
        </Card>
        <Card>
          <p className="text-muted text-sm mb-1">Active Customers</p>
          <p className="text-3xl font-bold text-primary">{customers?.length || 0}</p>
          <p className="text-muted text-xs mt-2">Total registered customers</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
