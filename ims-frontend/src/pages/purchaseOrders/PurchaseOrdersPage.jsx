import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus, HiTrash, HiEye, HiShoppingCart, HiChevronDown, HiChevronUp,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { purchaseApi } from '../../api/purchaseApi';
import { supplierApi } from '../../api/supplierApi';
import { godownApi } from '../../api/godownApi';
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

const PurchaseOrderDetailModal = ({ orderId, isOpen, onClose }) => {
  const { data: order, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PURCHASE_ORDER(orderId),
    queryFn: () => purchaseApi.getById(orderId).then(r => r.data),
    enabled: isOpen && !!orderId,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Purchase Order #${orderId}`} size="lg">
      {isLoading && <p className="text-center text-muted py-8">Loading...</p>}
      {order && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-primary-theme">
              <p className="text-xs text-muted mb-1">Purchase Date</p>
              <p className="text-sm font-semibold text-primary">{formatDate(order.purchaseDate)}</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-theme">
              <p className="text-xs text-muted mb-1">Godown ID</p>
              <p className="text-sm font-semibold text-primary">#{order.godownId}</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-theme">
              <p className="text-xs text-muted mb-1">Total Amount</p>
              <p className="text-sm font-semibold text-green-500">{formatCurrency(order.totalAmount)}</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-theme">
              <p className="text-xs text-muted mb-1">Status</p>
              <Badge status={order.status || 'COMPLETED'} dot />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary mb-3">
              Products ({order.products?.length || 0})
            </p>
            <div className="overflow-x-auto rounded-xl border border-theme">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.products || []).map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium text-primary">{item.productName}</td>
                      <td className="text-muted">{item.productCategory || '—'}</td>
                      <td>{item.purchaseQuantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td className="font-semibold text-green-500">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="text-right font-semibold text-primary">Total</td>
                    <td className="font-bold text-green-500">{formatCurrency(order.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

const CreatePurchaseModal = ({ isOpen, onClose, suppliers, godowns, onSuccess }) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { items: [{ productName: '', quantity: 1, unitPrice: 0 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const total = items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);

  const supplierOptions = suppliers.map(s => ({ value: s.supplierId, label: s.supplierName }));
  const godownOptions = godowns.map(g => ({ value: g.godownId, label: g.address }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Purchase Order" size="lg">
      <form onSubmit={handleSubmit(onSuccess)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Supplier" required options={supplierOptions}
            {...register('supplierId', { required: 'Required' })}
            error={errors.supplierId?.message} />
          <Select label="Godown" required options={godownOptions}
            {...register('godownId', { required: 'Required' })}
            error={errors.godownId?.message} />
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-primary">Order Items</p>
            <Button type="button" size="xs" variant="secondary"
              icon={<HiPlus size={12} />}
              onClick={() => append({ productName: '', quantity: 1, unitPrice: 0 })}>
              Add Item
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((field, i) => (
              <motion.div key={field.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-primary-theme">
                <div className="col-span-5">
                  <Input label={i === 0 ? 'Product Name' : ''} placeholder="Solar Panel 400W"
                    {...register(`items.${i}.productName`, { required: 'Required' })}
                    error={errors.items?.[i]?.productName?.message} />
                </div>
                <div className="col-span-3">
                  <Input label={i === 0 ? 'Qty' : ''} type="number" min="1" placeholder="0"
                    {...register(`items.${i}.quantity`, { required: true, min: 1 })} />
                </div>
                <div className="col-span-3">
                  <Input label={i === 0 ? 'Unit Price (₹)' : ''} type="number" min="0" step="0.01" placeholder="0.00"
                    {...register(`items.${i}.unitPrice`, { required: true, min: 0 })} />
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

        {/* Total */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-primary-theme border border-theme">
          <span className="text-sm font-semibold text-secondary">Order Total</span>
          <span className="text-xl font-bold text-green-500">{formatCurrency(total)}</span>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" className="flex-1">Create Order</Button>
        </div>
      </form>
    </Modal>
  );
};

const PurchaseOrdersPage = () => {
  const qc = useQueryClient();
  const { isAdmin, user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOrderId, setViewOrderId] = useState(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.PURCHASE_ORDERS,
    queryFn: () => purchaseApi.getAll().then(r => r.data),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIERS,
    queryFn: () => supplierApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const { data: godowns = [] } = useQuery({
    queryKey: QUERY_KEYS.GODOWNS,
    queryFn: () => godownApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (data) => purchaseApi.create({
      supplierId: Number(data.supplierId),
      godownId: Number(data.godownId),
      items: data.items.map(i => ({
        productName: i.productName,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDERS });
      setCreateOpen(false);
      toast.success('Purchase order created');
    },
    onError: (e) => toast.error(e.response?.data || 'Failed'),
  });

  const totalAmount = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  const columns = [
    { header: 'PO #', key: 'purchaseId', sortable: true, width: 80,
      render: (v) => <span className="font-mono font-bold text-accent">PO-{v}</span> },
    { header: 'Date', key: 'purchaseDate', sortable: true,
      render: (v) => <span className="text-sm">{formatDate(v)}</span> },
    { header: 'Godown', key: 'godownId', sortable: true,
      render: (v) => <span className="text-muted">#{v}</span> },
    { header: 'Items', key: 'products',
      render: (v) => <span className="text-secondary">{v?.length || 0} items</span> },
    { header: 'Total', key: 'totalAmount', sortable: true,
      render: (v) => <span className="font-semibold text-green-500">{formatCurrency(v)}</span> },
    { header: 'Status', key: 'status',
      render: (v) => <Badge status={v || 'COMPLETED'} dot /> },
    { header: 'Actions', key: 'purchaseId', noExport: true,
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
        title="Purchase Orders"
        subtitle={`${orders.length} orders · ${formatCurrency(totalAmount)} total`}
        actions={
          isAdmin && (
            <Button icon={<HiPlus size={16} />} onClick={() => setCreateOpen(true)}>
              New Order
            </Button>
          )
        }
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-indigo-500' },
          { label: 'Total Spend', value: formatCurrency(totalAmount), color: 'text-green-500' },
          { label: 'Avg Order Value', value: orders.length ? formatCurrency(totalAmount / orders.length) : '₹0', color: 'text-blue-500' },
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
        searchable searchKeys={['purchaseId', 'status']}
        exportable exportFilename="purchase-orders.csv"
        emptyTitle="No purchase orders" emptyDescription="Create your first purchase order"
        emptyAction={isAdmin ? () => setCreateOpen(true) : undefined}
        emptyActionLabel="Create Order" />

      <CreatePurchaseModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        suppliers={suppliers}
        godowns={godowns}
        onSuccess={createMutation.mutate}
      />

      <PurchaseOrderDetailModal
        orderId={viewOrderId}
        isOpen={!!viewOrderId}
        onClose={() => setViewOrderId(null)}
      />
    </div>
  );
};

export default PurchaseOrdersPage;
