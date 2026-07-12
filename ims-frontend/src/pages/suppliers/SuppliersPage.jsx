import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiPencil, HiTrash, HiTag } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { supplierApi } from '../../api/supplierApi';
import { QUERY_KEYS } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';

const SupplierForm = ({ defaultValues, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Supplier Name" placeholder="SolarTech Pvt Ltd" required
        {...register('supplierName', { required: 'Required' })} error={errors.supplierName?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Contact Number" placeholder="9123456789"
          {...register('contactNumber')} />
        <Input label="Email" type="email" placeholder="supplier@company.com"
          {...register('email')} />
      </div>
      <Input label="Address" placeholder="Industrial Area, Nashik"
        {...register('address')} />
      <Button type="submit" loading={loading} fullWidth>
        {defaultValues?.supplierId ? 'Update Supplier' : 'Add Supplier'}
      </Button>
    </form>
  );
};

const SuppliersPage = () => {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [deleteSupplier, setDeleteSupplier] = useState(null);

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIERS,
    queryFn: () => supplierApi.getAll().then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: supplierApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIERS }); setCreateOpen(false); toast.success('Supplier added'); },
    onError: (e) => toast.error(e.response?.data || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => supplierApi.update({ ...data, supplierId: editSupplier.supplierId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIERS }); setEditSupplier(null); toast.success('Supplier updated'); },
    onError: (e) => toast.error(e.response?.data || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => supplierApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIERS }); setDeleteSupplier(null); toast.success('Supplier deleted'); },
    onError: (e) => toast.error(e.response?.data || 'Failed'),
  });

  const columns = [
    { header: '#', key: 'supplierId', width: 60, sortable: true,
      render: (v) => <span className="text-muted font-mono text-xs">#{v}</span> },
    { header: 'Supplier', key: 'supplierName', sortable: true,
      render: (v) => (
        <div className="flex items-center gap-3">
          <Avatar name={v} size="sm" />
          <span className="font-medium text-primary">{v}</span>
        </div>
      )},
    { header: 'Contact', key: 'contactNumber', render: (v) => v || '—' },
    { header: 'Email', key: 'email', render: (v) => v ? <span className="text-accent">{v}</span> : '—' },
    { header: 'Address', key: 'address', render: (v) => <span className="text-muted">{v || '—'}</span> },
    { header: 'Actions', key: 'supplierId', noExport: true,
      render: (_, row) => (
        <div className="flex gap-1.5">
          <button onClick={() => setEditSupplier(row)}
            className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-110 transition-transform">
            <HiPencil size={13} />
          </button>
          <button onClick={() => setDeleteSupplier(row)}
            className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-110 transition-transform">
            <HiTrash size={13} />
          </button>
        </div>
      )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        subtitle={`${suppliers.length} suppliers registered`}
        actions={<Button icon={<HiPlus size={16} />} onClick={() => setCreateOpen(true)}>Add Supplier</Button>}
      />

      <DataTable columns={columns} data={suppliers} loading={isLoading}
        searchable searchKeys={['supplierName', 'email', 'contactNumber']}
        exportable exportFilename="suppliers.csv"
        emptyTitle="No suppliers yet" emptyDescription="Add your first supplier"
        emptyAction={() => setCreateOpen(true)} emptyActionLabel="Add Supplier" />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Supplier" size="sm">
        <SupplierForm onSubmit={createMutation.mutate} loading={createMutation.isPending} />
      </Modal>
      <Modal isOpen={!!editSupplier} onClose={() => setEditSupplier(null)} title="Edit Supplier" size="sm">
        <SupplierForm defaultValues={editSupplier} onSubmit={updateMutation.mutate} loading={updateMutation.isPending} />
      </Modal>
      <ConfirmModal isOpen={!!deleteSupplier} onClose={() => setDeleteSupplier(null)}
        onConfirm={() => deleteMutation.mutate(deleteSupplier?.supplierId)} loading={deleteMutation.isPending}
        title="Delete Supplier" message={`Delete "${deleteSupplier?.supplierName}"?`} />
    </div>
  );
};

export default SuppliersPage;
