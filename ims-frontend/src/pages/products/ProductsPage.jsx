import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HiCube, HiPlus, HiPencil, HiTrash, HiExclamation, HiFilter,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { productApi } from '../../api/productApi';
import { godownApi } from '../../api/godownApi';
import { QUERY_KEYS, LOW_STOCK_THRESHOLD } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { staggerContainer, staggerItem } from '../../animations/variants';
import { formatCurrency } from '../../utils';

const ProductForm = ({ defaultValues, onSubmit, loading, godownOptions }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Product Name" placeholder="Solar Panel 400W" required
          {...register('productName', { required: 'Required' })} error={errors.productName?.message} />
        <Input label="Category" placeholder="Energy"
          {...register('productCategory')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Total Quantity" type="number" placeholder="0"
          {...register('totalQuantity', { min: { value: 0, message: 'Must be ≥ 0' } })}
          error={errors.totalQuantity?.message} />
        <Input label="Price (₹)" type="number" step="0.01" placeholder="0.00"
          {...register('price', { min: { value: 0, message: 'Must be ≥ 0' } })}
          error={errors.price?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Volume (m³/unit)" type="number" step="0.01" placeholder="0.5"
          {...register('productVolume', { min: { value: 0, message: 'Must be ≥ 0' } })}
          error={errors.productVolume?.message} />
        <Input label="Product Type" placeholder="2.2"
          {...register('productType')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Unit" placeholder="piece / kg / litre"
          {...register('unit')} />
        <Select label="Godown" required
          options={godownOptions}
          {...register('godownId', { required: 'Select a godown' })}
          error={errors.godownId?.message} />
      </div>
      <Button type="submit" loading={loading} fullWidth>
        {defaultValues?.productId ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
};

const ProductsPage = () => {
  const qc = useQueryClient();
  const { isAdmin, user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: isAdmin ? QUERY_KEYS.PRODUCTS : QUERY_KEYS.PRODUCTS_BY_GODOWN(user?.godownId),
    queryFn: () => isAdmin
      ? productApi.getAll().then(r => r.data)
      : productApi.getByGodown(user?.godownId).then(r => r.data),
  });

  const { data: godowns = [] } = useQuery({
    queryKey: QUERY_KEYS.GODOWNS,
    queryFn: () => godownApi.getAll().then(r => r.data),
    enabled: isAdmin,
  });

  const godownOptions = godowns.map(g => ({ value: g.godownId, label: g.address }));
  const categories = [...new Set(products.map(p => p.productCategory).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categoryFilter) list = list.filter(p => p.productCategory === categoryFilter);
    if (stockFilter === 'low') list = list.filter(p => p.totalQuantity <= LOW_STOCK_THRESHOLD);
    if (stockFilter === 'out') list = list.filter(p => p.totalQuantity === 0);
    return list;
  }, [products, categoryFilter, stockFilter]);

  const createMutation = useMutation({
    mutationFn: (data) => productApi.create({
      ...data,
      totalQuantity: Number(data.totalQuantity),
      price: Number(data.price),
      productVolume: Number(data.productVolume),
      godownId: Number(data.godownId),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS_BY_GODOWN(user?.godownId) });
      setCreateOpen(false);
      toast.success('Product added');
    },
    onError: (e) => toast.error(e.response?.data || 'Failed to add product'),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => productApi.updateByName({
      productName: data.productName,
      godownId: Number(data.godownId),
      price: Number(data.price),
      productVolume: Number(data.productVolume),
      totalQuantity: Number(data.totalQuantity),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS_BY_GODOWN(user?.godownId) });
      setEditProduct(null);
      toast.success('Product updated');
    },
    onError: (e) => toast.error(e.response?.data || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS_BY_GODOWN(user?.godownId) });
      setDeleteProduct(null);
      toast.success('Product deleted');
    },
    onError: (e) => toast.error(e.response?.data || 'Delete failed'),
  });

  const lowStockCount = products.filter(p => p.totalQuantity <= LOW_STOCK_THRESHOLD && p.totalQuantity > 0).length;
  const outOfStockCount = products.filter(p => p.totalQuantity === 0).length;
  const totalValue = products.reduce((s, p) => s + (p.price || 0) * (p.totalQuantity || 0), 0);

  const columns = [
    { header: '#', key: 'productId', width: 60, sortable: true,
      render: (v) => <span className="text-muted font-mono text-xs">#{v}</span> },
    { header: 'Product', key: 'productName', sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-primary">{v}</p>
          <p className="text-xs text-muted">{row.productType || '—'}</p>
        </div>
      )},
    { header: 'Category', key: 'productCategory', sortable: true,
      render: (v) => v ? <Badge color="primary">{v}</Badge> : <span className="text-muted">—</span> },
    { header: 'Stock', key: 'totalQuantity', sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${v === 0 ? 'text-red-500' : v <= LOW_STOCK_THRESHOLD ? 'text-amber-500' : 'text-primary'}`}>
            {v} {row.unit || ''}
          </span>
          {v === 0 && <Badge color="danger">Out</Badge>}
          {v > 0 && v <= LOW_STOCK_THRESHOLD && <Badge color="warning">Low</Badge>}
        </div>
      )},
    { header: 'Price', key: 'price', sortable: true,
      render: (v) => <span className="font-medium">{formatCurrency(v)}</span> },
    { header: 'Volume/unit', key: 'productVolume',
      render: (v) => <span className="text-muted">{v} m³</span> },
    { header: 'Godown', key: 'godownId', sortable: true,
      render: (v) => <span className="text-muted">#{v}</span> },
    {
      header: 'Actions', key: 'productId', noExport: true,
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEditProduct(row)}
            className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-110 transition-transform"
          ><HiPencil size={13} /></button>
          <button
            onClick={() => setDeleteProduct(row)}
            className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-110 transition-transform"
          ><HiTrash size={13} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle={`${filteredProducts.length} products in inventory`}
        actions={
          <Button icon={<HiPlus size={16} />} onClick={() => setCreateOpen(true)}>
            Add Product
          </Button>
        }
      />

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, color: 'text-indigo-500' },
          { label: 'Inventory Value', value: formatCurrency(totalValue), color: 'text-green-500' },
          { label: 'Low Stock', value: lowStockCount, color: 'text-amber-500' },
          { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-500' },
        ].map((s, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Card className="p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <HiFilter size={16} className="text-muted" />
        <div className="flex gap-2 flex-wrap">
          {['all', 'low', 'out'].map(f => (
            <button
              key={f}
              onClick={() => setStockFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                stockFilter === f
                  ? 'bg-accent text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-card border border-theme text-secondary hover:bg-primary-theme'
              }`}
            >
              {f === 'all' ? 'All Stock' : f === 'low' ? `⚠ Low (≤${LOW_STOCK_THRESHOLD})` : '🔴 Out of Stock'}
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="input-base !h-8 !py-0 !text-xs w-40"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        loading={isLoading}
        searchable
        searchKeys={['productName', 'productCategory', 'productType']}
        exportable
        exportFilename="products.csv"
        emptyTitle="No products found"
        emptyDescription="Add your first product to the inventory"
        emptyAction={() => setCreateOpen(true)}
        emptyActionLabel="Add Product"
      />

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add New Product" size="md">
        <ProductForm
          onSubmit={(d) => createMutation.mutate(d)}
          loading={createMutation.isPending}
          godownOptions={godownOptions}
          defaultValues={!isAdmin ? { godownId: user?.godownId } : undefined}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Edit Product" size="md">
        <ProductForm
          defaultValues={editProduct}
          onSubmit={(d) => updateMutation.mutate(d)}
          loading={updateMutation.isPending}
          godownOptions={godownOptions}
        />
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={() => deleteMutation.mutate(deleteProduct?.productId)}
        loading={deleteMutation.isPending}
        title="Delete Product"
        message={`Delete "${deleteProduct?.productName}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ProductsPage;
