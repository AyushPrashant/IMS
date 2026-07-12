import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  HiDocumentReport, HiDownload, HiChartBar, HiShoppingCart,
  HiTruck, HiCube, HiUsers, HiTag,
} from 'react-icons/hi';
import { productApi } from '../../api/productApi';
import { supplierApi } from '../../api/supplierApi';
import { customerApi } from '../../api/customerApi';
import { purchaseApi } from '../../api/purchaseApi';
import { deliveryApi } from '../../api/deliveryApi';
import { godownApi } from '../../api/godownApi';
import { QUERY_KEYS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { staggerContainer, staggerItem } from '../../animations/variants';
import { exportToCSV, formatDate, formatCurrency } from '../../utils';

const ReportCard = ({ title, description, icon, color, onExport, count, loading }) => (
  <motion.div variants={staggerItem}>
    <Card hover className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <Badge color="primary">{loading ? '...' : count} records</Badge>
      </div>
      <h3 className="text-base font-semibold text-primary mb-1">{title}</h3>
      <p className="text-xs text-muted mb-4">{description}</p>
      <Button
        variant="secondary"
        size="sm"
        icon={<HiDownload size={14} />}
        onClick={onExport}
        disabled={loading}
        className="w-full"
      >
        Export CSV
      </Button>
    </Card>
  </motion.div>
);

const ReportsPage = () => {
  const { isAdmin, user } = useAuth();

  const { data: products = [], isLoading: lp } = useQuery({
    queryKey: isAdmin ? QUERY_KEYS.PRODUCTS : QUERY_KEYS.PRODUCTS_BY_GODOWN(user?.godownId),
    queryFn: () => isAdmin
      ? productApi.getAll().then(r => r.data)
      : productApi.getByGodown(user?.godownId).then(r => r.data),
  });

  const { data: suppliers = [], isLoading: ls } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIERS,
    queryFn: () => supplierApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const { data: customers = [], isLoading: lc } = useQuery({
    queryKey: QUERY_KEYS.CUSTOMERS,
    queryFn: () => customerApi.getAll().then(r => r.data),
  });

  const { data: purchases = [], isLoading: lpo } = useQuery({
    queryKey: QUERY_KEYS.PURCHASE_ORDERS,
    queryFn: () => purchaseApi.getAll().then(r => r.data),
  });

  const { data: deliveries = [], isLoading: ldo } = useQuery({
    queryKey: isAdmin ? QUERY_KEYS.DELIVERY_ORDERS : QUERY_KEYS.DELIVERY_ORDERS_BY_GODOWN(user?.godownId),
    queryFn: () => isAdmin
      ? deliveryApi.getAll().then(r => r.data)
      : deliveryApi.getByGodown(user?.godownId).then(r => r.data),
    enabled: !!user?.godownId || isAdmin,
  });

  const { data: godowns = [], isLoading: lg } = useQuery({
    queryKey: QUERY_KEYS.GODOWNS,
    queryFn: () => godownApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const exportInventory = () => {
    exportToCSV(
      products.map(p => ({
        ID: p.productId,
        Name: p.productName,
        Category: p.productCategory || '',
        Quantity: p.totalQuantity,
        Price: p.price,
        Volume: p.productVolume,
        Type: p.productType || '',
        Unit: p.unit || '',
        GodownID: p.godownId,
      })),
      'inventory-report.csv'
    );
  };

  const exportSuppliers = () => {
    exportToCSV(
      suppliers.map(s => ({
        ID: s.supplierId,
        Name: s.supplierName,
        Contact: s.contactNumber || '',
        Email: s.email || '',
        Address: s.address || '',
      })),
      'suppliers-report.csv'
    );
  };

  const exportCustomers = () => {
    exportToCSV(
      customers.map(c => ({
        ID: c.customerId,
        Name: c.customerName,
        Phone: c.customerNo || '',
        Email: c.email || '',
        Address: c.customerAddress || '',
      })),
      'customers-report.csv'
    );
  };

  const exportPurchases = () => {
    const rows = [];
    purchases.forEach(po => {
      (po.products || []).forEach(item => {
        rows.push({
          PurchaseID: po.purchaseId,
          Date: formatDate(po.purchaseDate),
          GodownID: po.godownId,
          Product: item.productName,
          Quantity: item.purchaseQuantity,
          UnitPrice: item.unitPrice,
          Total: item.totalPrice,
        });
      });
    });
    exportToCSV(rows, 'purchase-orders-report.csv');
  };

  const exportDeliveries = () => {
    const rows = [];
    deliveries.forEach(d => {
      (d.products || []).forEach(item => {
        rows.push({
          OrderID: d.orderId,
          Date: formatDate(d.orderDate),
          Customer: d.customer?.customerName || '',
          Product: item.productName,
          Quantity: item.orderQuantity,
          SellPrice: item.sellPrice,
          Total: item.totalPrice,
          GrandTotal: d.totalAmount,
          GodownHead: d.godownHeadName || '',
        });
      });
    });
    exportToCSV(rows, 'delivery-orders-report.csv');
  };

  const exportGodowns = () => {
    exportToCSV(
      godowns.map(g => ({
        ID: g.godownId,
        Address: g.address,
        Volume: g.volume,
        UsedVolume: g.usedVolume || 0,
        Available: (g.volume || 0) - (g.usedVolume || 0),
        Usage: `${(((g.usedVolume || 0) / (g.volume || 1)) * 100).toFixed(1)}%`,
      })),
      'godowns-report.csv'
    );
  };

  // Summary stats
  const totalInventoryValue = products.reduce((s, p) => s + (p.price || 0) * (p.totalQuantity || 0), 0);
  const totalRevenue = deliveries.reduce((s, d) => s + (d.totalAmount || 0), 0);
  const totalPurchaseSpend = purchases.reduce((s, p) => s + (p.totalAmount || 0), 0);

  const reports = [
    {
      title: 'Inventory Report',
      description: 'All products with stock levels, prices, and godown assignments',
      icon: <HiCube size={22} />,
      color: 'gradient-primary',
      onExport: exportInventory,
      count: products.length,
      loading: lp,
    },
    {
      title: 'Supplier Report',
      description: 'All registered suppliers with contact information',
      icon: <HiTag size={22} />,
      color: 'gradient-success',
      onExport: exportSuppliers,
      count: suppliers.length,
      loading: ls,
      adminOnly: true,
    },
    {
      title: 'Customer Report',
      description: 'All customers with contact details and addresses',
      icon: <HiUsers size={22} />,
      color: 'gradient-warning',
      onExport: exportCustomers,
      count: customers.length,
      loading: lc,
    },
    {
      title: 'Purchase Report',
      description: 'Complete purchase order history with item breakdown',
      icon: <HiShoppingCart size={22} />,
      color: 'gradient-info',
      onExport: exportPurchases,
      count: purchases.length,
      loading: lpo,
    },
    {
      title: 'Sales Report',
      description: 'Delivery order history with billing and customer details',
      icon: <HiTruck size={22} />,
      color: 'gradient-orange',
      onExport: exportDeliveries,
      count: deliveries.length,
      loading: ldo,
    },
    {
      title: 'Godown Report',
      description: 'Warehouse capacity usage and space availability',
      icon: <HiChartBar size={22} />,
      color: 'gradient-teal',
      onExport: exportGodowns,
      count: godowns.length,
      loading: lg,
      adminOnly: true,
    },
  ].filter(r => !r.adminOnly || isAdmin);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Export data as CSV for analysis and record keeping"
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 gradient-primary !border-0 text-white">
          <p className="text-indigo-200 text-xs mb-1">Inventory Value</p>
          <p className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted text-xs mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-500">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted text-xs mb-1">Total Purchase Spend</p>
          <p className="text-2xl font-bold text-blue-500">{formatCurrency(totalPurchaseSpend)}</p>
        </Card>
      </div>

      {/* Report cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {reports.map((report, i) => (
          <ReportCard key={i} {...report} />
        ))}
      </motion.div>
    </div>
  );
};

export default ReportsPage;
