import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HiOfficeBuilding, HiPlus, HiPencil, HiTrash, HiEye,
  HiLightningBolt, HiChevronDown, HiChevronUp,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { godownApi } from '../../api/godownApi';
import { godownHeadApi } from '../../api/godownHeadApi';
import { QUERY_KEYS, ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card, { CardHeader } from '../../components/ui/Card';
import { staggerContainer, staggerItem } from '../../animations/variants';
import { formatCurrency } from '../../utils';

const GodownForm = ({ defaultValues, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Address"
        placeholder="Enter godown address"
        required
        {...register('address', { required: 'Address is required' })}
        error={errors.address?.message}
      />
      <Input
        label="Total Volume (cubic meters)"
        type="number"
        placeholder="e.g. 50000"
        required
        {...register('volume', {
          required: 'Volume is required',
          min: { value: 1, message: 'Volume must be positive' },
        })}
        error={errors.volume?.message}
      />
      <Button type="submit" loading={loading} fullWidth>
        {defaultValues ? 'Update Godown' : 'Create Godown'}
      </Button>
    </form>
  );
};

const GodownDetailsModal = ({ godown, isOpen, onClose }) => {
  const { data: head } = useQuery({
    queryKey: QUERY_KEYS.GODOWN_HEADS_BY_GODOWN(godown?.godownId),
    queryFn: () => godownHeadApi.getByGodownId(godown.godownId).then(r => r.data),
    enabled: isOpen && !!godown?.godownId,
  });

  const { data: detail } = useQuery({
    queryKey: QUERY_KEYS.GODOWN(godown?.godownId),
    queryFn: () => godownApi.getById(godown.godownId).then(r => r.data),
    enabled: isOpen && !!godown?.godownId,
  });

  const used = godown?.usedVolume || 0;
  const total = godown?.volume || 1;
  const pct = Math.min(100, (used / total) * 100);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Godown Details — #${godown?.godownId}`} size="lg">
      {godown && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-primary-theme">
              <p className="text-xs text-muted mb-1">Address</p>
              <p className="text-sm font-medium text-primary">{godown.address}</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-theme">
              <p className="text-xs text-muted mb-1">Godown Head</p>
              <p className="text-sm font-medium text-primary">{head?.godownHeadName || 'Not assigned'}</p>
            </div>
          </div>

          {/* Capacity bar */}
          <div className="p-4 rounded-xl bg-primary-theme">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-muted">Capacity Usage</p>
              <p className="text-xs font-semibold text-primary">{pct.toFixed(1)}%</p>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`progress-fill ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted">Used: {used.toLocaleString()} m³</span>
              <span className="text-xs text-muted">Total: {total.toLocaleString()} m³</span>
            </div>
          </div>

          {/* Products list */}
          <div>
            <p className="text-sm font-semibold text-primary mb-3">
              Products ({detail?.productList?.length || 0})
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(detail?.productList || []).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-primary-theme">
                  <div>
                    <p className="text-sm font-medium text-primary">{p.productName}</p>
                    <p className="text-xs text-muted">{p.productCategory}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{p.totalQuantity} units</p>
                    <p className="text-xs text-muted">{formatCurrency(p.price)} each</p>
                  </div>
                </div>
              ))}
              {(!detail?.productList || detail.productList.length === 0) && (
                <p className="text-sm text-muted text-center py-4">No products in this godown</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

const GodownsPage = () => {
  const qc = useQueryClient();
  const { isAdmin } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editGodown, setEditGodown] = useState(null);
  const [deleteGodown, setDeleteGodown] = useState(null);
  const [viewGodown, setViewGodown] = useState(null);

  const { data: godowns = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.GODOWNS,
    queryFn: () => godownApi.getAll().then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => godownApi.create({ ...data, volume: Number(data.volume) }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GODOWNS });
      setCreateOpen(false);
      // Response is plain string "Godown created with ID X"
      const msg = typeof res.data === 'string' ? res.data : 'Godown created';
      toast.success(msg);
    },
    onError: (e) => toast.error(e.response?.data || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => godownApi.update(id, { ...data, volume: Number(data.volume) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GODOWNS });
      setEditGodown(null);
      toast.success('Godown updated');
    },
    onError: (e) => toast.error(e.response?.data || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => godownApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GODOWNS });
      setDeleteGodown(null);
      toast.success('Godown deleted');
    },
    onError: (e) => toast.error(e.response?.data || 'Delete failed'),
  });

  const columns = [
    { header: '#', key: 'godownId', sortable: true, width: 60,
      render: (v) => <span className="text-muted font-mono text-xs">#{v}</span> },
    { header: 'Address', key: 'address', sortable: true,
      render: (v) => <span className="font-medium text-primary">{v}</span> },
    { header: 'Volume (m³)', key: 'volume', sortable: true,
      render: (v) => <span className="font-medium">{v?.toLocaleString()}</span> },
    { header: 'Used (m³)', key: 'usedVolume', sortable: true,
      render: (v) => <span>{v?.toLocaleString() || 0}</span> },
    {
      header: 'Capacity',
      key: 'volume',
      noExport: true,
      render: (_, row) => {
        const pct = Math.min(100, ((row.usedVolume || 0) / (row.volume || 1)) * 100);
        return (
          <div className="w-28">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">{pct.toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      key: 'godownId',
      noExport: true,
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewGodown(row)}
            className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-110 transition-transform"
            title="View details"
          >
            <HiEye size={13} />
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setEditGodown(row)}
                className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-110 transition-transform"
                title="Edit"
              >
                <HiPencil size={13} />
              </button>
              <button
                onClick={() => setDeleteGodown(row)}
                className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-110 transition-transform"
                title="Delete"
              >
                <HiTrash size={13} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Godowns"
        subtitle={`${godowns.length} warehouses registered`}
        actions={
          isAdmin && (
            <Button
              icon={<HiPlus size={16} />}
              onClick={() => setCreateOpen(true)}
            >
              New Godown
            </Button>
          )
        }
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Godowns', value: godowns.length, color: 'text-indigo-500' },
          { label: 'Total Capacity', value: godowns.reduce((s, g) => s + (g.volume || 0), 0).toLocaleString() + ' m³', color: 'text-blue-500' },
          { label: 'Used Capacity', value: godowns.reduce((s, g) => s + (g.usedVolume || 0), 0).toLocaleString() + ' m³', color: 'text-amber-500' },
          { label: 'Avg Usage', value: godowns.length ? (godowns.reduce((s, g) => s + ((g.usedVolume || 0) / (g.volume || 1)) * 100, 0) / godowns.length).toFixed(1) + '%' : '0%', color: 'text-green-500' },
        ].map((s, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Card className="p-4">
              <p className="text-xs text-muted mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <DataTable
        columns={columns}
        data={godowns}
        loading={isLoading}
        searchable
        searchKeys={['address', 'godownId']}
        exportable={isAdmin}
        exportFilename="godowns.csv"
        emptyTitle="No godowns found"
        emptyDescription="Create your first godown to get started"
        emptyAction={isAdmin ? () => setCreateOpen(true) : undefined}
        emptyActionLabel="Add Godown"
      />

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Godown" size="sm">
        <GodownForm
          onSubmit={(d) => createMutation.mutate(d)}
          loading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editGodown} onClose={() => setEditGodown(null)} title="Edit Godown" size="sm">
        <GodownForm
          defaultValues={editGodown}
          onSubmit={(d) => updateMutation.mutate({ id: editGodown.godownId, data: d })}
          loading={updateMutation.isPending}
        />
      </Modal>

      {/* Details Modal */}
      <GodownDetailsModal
        godown={viewGodown}
        isOpen={!!viewGodown}
        onClose={() => setViewGodown(null)}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteGodown}
        onClose={() => setDeleteGodown(null)}
        onConfirm={() => deleteMutation.mutate(deleteGodown?.godownId)}
        loading={deleteMutation.isPending}
        title="Delete Godown"
        message={`Delete godown at "${deleteGodown?.address}"? This cannot be undone.`}
      />
    </div>
  );
};

export default GodownsPage;
