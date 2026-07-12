import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HiPlus, HiTrash, HiEye, HiTruck, HiDocumentText,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { deliveryApi } from '../../api/deliveryApi';
import { customerApi } from '../../api/customerApi';
import { productApi } from '../../api/productApi';
import { QUERY_KEYS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { formatDate, formatCurrency } from '../../utils';
import { staggerContainer, staggerItem } from '../../animations/variants';

// ── Detail Modal ─────────────────────────────────────────────────────────────
const DeliveryDetailModal = ({ orderId, isOpen, onClose }) => {
  const { data: order, isLoading } = useQuery({
    queryKey: QUERY_KEYS.DELIVERY_ORDER(orderId),
    queryFn: () => deliveryApi.getById(orderId).then(r => r.data),
    enabled: isOpen && !!orderId,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delivery Order #DO-${orderId}`} size="lg">
      {isLoading && <p className="text-center text-muted py-8">Loading...</p>}
      {order && (
        <div className="space-y-5">
          {/* Header info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Order Date', value: formatDate(order.orderDate) },
              { label: 'Status', value: <Badge status={order.status || 'DELIVERED'} dot /> },
              { label: 'Customer', value: order.customer?.customerName || '—' },
              { label: 'Phone', value: order.customer?.customerNo || '—' },
              { label: 'Address', value: order.customer?.customerAddress || '—' },
              { label: 'Godown', value: order.godownAddress || '—' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-primary-theme">
                <p className="text-xs text-muted mb-1">{item.label}</p>
                <div className="text-sm font-medium text-primary">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Products */}
          <div>
            <p className="text-sm font-semibold text-primary mb-3">
              Products ({order.products?.length || 0})
            </p>
            <div className="overflow-x-auto rounded-xl border border-theme">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Sell Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.products || []).map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium text-primary">{item.productName}</td>
                      <td>{item.orderQuantity}</td>
                      <td>{formatCurrency(item.sellPrice)}</td>
                      <td className="font-semibold text-green-500">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bill summary */}
          <div className="p-4 rounded-xl bg-primary-theme space-y-2">
            <div className="flex justify-between text-sm text-secondary">
              <span>Subtotal</span>
              <span>{formatCurrency(order.totalSellPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-secondary">
              <span>CGST ({order.cgstPercent}%)</span>
              <span>{formatCurrency(order.cgstAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-secondary">
              <span>SGST ({order.sgstPercent}%)</span>
              <span>{formatCurrency(order.sgstAmount)}</span>
            </div>
            <div className="border-t border-theme pt-2 flex justify-between font-bold text-primary">
              <span>Grand Total</span>
              <span className="text-green-500">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {order.godownHeadName && (
            <p className="text-xs text-muted text-center">
              Processed by: <span className="font-medium text-secondary">{order.godownHeadName}</span>
            </p>
          )}
        </div>
      )}
    </Modal>
  );
};

// ── Create Delivery Modal ─────────────────────────────────────────────────────
const CreateDeliveryModal = ({ isOpen, onClose, customers, productNames, onSuccess, loading }) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      customerId: '',
      products: [{ productName: '', orderQuantity: 1, sellPrice: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'products' });
  const products = watch('products');
  const subtotal = products.reduce((s, p) => s + (Number(p.orderQuantity) || 0) * (Number(p.sellPrice) || 0), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const customerOptions = customers.map(c => ({ value: c.customerId, label: c.customerName }));
  const productOptions = productNames.map(p => ({ value: p[0], label: p[0] }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Delivery Order" size="lg">
      <form onSubmit={handleSubmit(onSuccess)} className="space-y-5">
        <Select label="Customer" required options={customerOptions}
          {...register('customerId', { required: 'Select a customer' })}
          error={errors.customerId?.message} />

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-primary">Products</p>
            <Button type="button" size="xs" variant="secondary"
              icon={<HiPlus size={12} />}
              onClick={() => append({ productName: '', orderQuantity: 1, sellPrice: 0 })}>
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, i) => (
              <motion.div key={field.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-primary-theme">
                <div className="col-span-5">
                  <Select label={i === 0 ? 'Product' : ''} options={productOptions}
                    {...register(`products.${i}.productName`, { required: 'Required' })}
                    error={errors.products?.[i]?.productName?.message} />
                </div>
                <div className="col-span-3">
                  <Input label={i === 0 ? 'Qty' : ''} type="number" min="1" placeholder="1"
                    {...register(`products.${i}.orderQuantity`, { required: true, min: 1 })} />
                </div>
                <div className="col-span-3">
                  <Input label={i === 0 ? 'Sell Price (₹)' : ''} type="number" min="0" step="0.01" placeholder="0"
                    {...register(`products.${i}.sellPrice`, { required: true, min: 0 })} />
                </div>
                <div className="col-span-1 flex justify-end pb-1">
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)}
                      className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:scale-110 transition-transform">
                      <HiTrash size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bill preview */}
        <div className="p-4 rounded-xl bg-primary-theme border border-theme space-y-2">
          <div className="flex justify-between text-sm text-secondary">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-secondary">
            <span>GST (18%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="border-t border-theme pt-2 flex justify-between font-bold text-primary">
            <span>Total</span>
            <span className="text-green-500">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Place Order</Button>
        </div>
      </form>
    </Modal>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const DeliveryOrdersPage = () => {
  const qc = useQueryClient();
  const { isAdmin, user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOrderId, setViewOrderId] = useState(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: isAdmin ? QUERY_KEYS.DELIVERY_ORDERS : QUERY_KEYS.DELIVERY_ORDERS_BY_GODOWN(user?.godownId),
    queryFn: () => isAdmin
      ? deliveryApi.getAll().then(r => r.data)
      : deliveryApi.getByGodown(user?.godownId).then(r => r.data),
    enabled: !!user?.godownId || isAdmin,
  });

  const { data: customers = [] } = useQuery({
    queryKey: QUERY_KEYS.CUSTOMERS,
    queryFn: () => customerApi.getAll().then(r => r.data),
  });

  const { data: productNames = [] } = useQuery({
    queryKey: QUERY_KEYS.PRODUCT_NAMES,
    queryFn: () => productApi.getNames().then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const customerId = Number(data.customerId);
      const payload = {
        products: data.products.map(p => ({
          productName: p.productName,
          orderQuantity: Number(p.orderQuantity),
          sellPrice: Number(p.sellPrice),
        })),
      };
      return deliveryApi.placeOrder(customerId, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DELIVERY_ORDERS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DELIVERY_ORDERS_BY_GODOWN(user?.godownId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS_BY_GODOWN(user?.godownId) });
      setCreateOpen(false);
      toast.success('Delivery order placed!');
    },
    onError: (e) => toast.error(e.response?.data || 'Failed to place order'),
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalUnits = orders.reduce((s, o) =>
    s + (o.products || []).reduce((ps, p) => ps + (p.orderQuantity || 0), 0), 0);

  const columns = [
    { header: 'DO #', key: 'orderId', sortable: true, width: 90,
      render: (v) => <span className="font-mono font-bold text-accent">DO-{v}</span> },
    { header: 'Date', key: 'orderDate', sortable: true,
      render: (v) => <span className="text-sm">{formatDate(v)}</span> },
    { header: 'Customer', key: 'customer',
      render: (v) => <span className="font-medium text-primary">{v?.customerName || '—'}</span> },
    { header: 'Items', key: 'products',
      render: (v) => <span className="text-secondary">{v?.length || 0} items</span> },
    { header: 'Subtotal', key: 'totalSellPrice', sortable: true,
      render: (v) => <span>{formatCurrency(v)}</span> },
    { header: 'Total', key: 'totalAmount', sortable: true,
      render: (v) => <span className="font-semibold text-green-500">{formatCurrency(v)}</span> },
    { header: 'Status', key: 'status',
      render: (v) => <Badge status={v || 'DELIVERED'} dot /> },
    { header: 'Actions', key: 'orderId', noExport: true,
      render: (v) => (
        <button onClick={() => setViewOrderId(v)}
          className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-110 transition-transform">
          <HiEye size={13} />
        </button>
      )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Orders"
        subtitle={`${orders.length} orders · ${formatCurrency(totalRevenue)} revenue`}
        actions={
          !isAdmin && (
            <Button icon={<HiPlus size={16} />} onClick={() => setCreateOpen(true)}>
              New Order
            </Button>
          )
        }
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-indigo-500' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: 'text-green-500' },
          { label: 'Units Delivered', value: totalUnits, color: 'text-blue-500' },
          { label: 'Avg Order', value: orders.length ? formatCurrency(totalRevenue / orders.length) : '₹0', color: 'text-purple-500' },
        ].map((s, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Card className="p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <DataTable columns={columns} data={orders} loading={isLoading}
        searchable searchKeys={['orderId', 'status']}
        exportable exportFilename="delivery-orders.csv"
        emptyTitle="No delivery orders" emptyDescription="Place your first delivery order"
        emptyAction={!isAdmin ? () => setCreateOpen(true) : undefined}
        emptyActionLabel="Place Order" />

      <CreateDeliveryModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        customers={customers}
        productNames={productNames}
        onSuccess={createMutation.mutate}
        loading={createMutation.isPending}
      />

      <DeliveryDetailModal
        orderId={viewOrderId}
        isOpen={!!viewOrderId}
        onClose={() => setViewOrderId(null)}
      />
    </div>
  );
};

export default DeliveryOrdersPage;
