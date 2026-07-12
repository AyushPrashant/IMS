import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiPencil, HiTrash, HiUsers } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { customerApi } from '../../api/customerApi';
import { QUERY_KEYS } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';

const CustomerForm = ({ defaultValues, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Customer Name" placeholder="Suresh Sharma" required
        {...register('customerName', { required: 'Required' })} error={errors.customerName?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Phone Number" placeholder="9876543210"
          {...register('customerNo')} />
        <Input label="Email" type="email" placeholder="customer@gmail.com"
          {...register('email')} />
      </div>
      <Input label="Address" placeholder="12 Gandhi Nagar, Mumbai"
        {...register('customerAddress')} />
      <Button type="submit" loading={loading} fullWidth>
        {defaultValues?.customerId ? 'Update Customer' : 'Add Customer'}
      </Button>
    </form>
  );
};

const CustomersPage = () => {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.CUSTOMERS,
    queryFn: () => customerApi.getAll().then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS }); setCreateOpen(false); toast.success('Customer added'); },
    onError: (e) => toast.error(e.response?.data || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => customerApi.update(editCustomer.customerId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS }); setEditCustomer(null); toast.success('Customer updated'); },
    onError: (e) => toast.error(e.response?.data || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => customerApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS }); setDeleteCustomer(null); toast.success('Customer deleted'); },
    onError: (e) => toast.error(e.response?.data || 'Failed'),
  });

  const columns = [
    { header: '#', key: 'customerId', width: 60, sortable: true,
      render: (v) => <span className="text-muted font-mono text-xs">#{v}</span> },
    { header: 'Customer', key: 'customerName', sortable: true,
      render: (v) => (
        <div className="flex items-center gap-3">
          <Avatar name={v} size="sm" />
          <span className="font-medium text-primary">{v}</span>
        </div>
      )},
    { header: 'Phone', key: 'customerNo', render: (v) => v || '—' },
    { header: 'Email', key: 'email', render: (v) => v ? <span className="text-accent text-sm">{v}</span> : '—' },
    { header: 'Address', key: 'customerAddress', render: (v) => <span className="text-muted text-sm">{v || '—'}</span> },
    { header: 'Actions', key: 'customerId', noExport: true,
      render: (_, row) => (
        <div className="flex gap-1.5">
          <button onClick={() => setEditCustomer(row)}
            className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-110 transition-transform">
            <HiPencil size={13} />
          </button>
          <button onClick={() => setDeleteCustomer(row)}
            className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-110 transition-transform">
            <HiTrash size={13} />
          </button>
        </div>
      )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers registered`}
        actions={<Button icon={<HiPlus size={16} />} onClick={() => setCreateOpen(true)}>Add Customer</Button>}
      />

      <DataTable columns={columns} data={customers} loading={isLoading}
        searchable searchKeys={['customerName', 'customerNo', 'email', 'customerAddress']}
        exportable exportFilename="customers.csv"
        emptyTitle="No customers yet" emptyDescription="Add your first customer"
        emptyAction={() => setCreateOpen(true)} emptyActionLabel="Add Customer" />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Customer" size="sm">
        <CustomerForm onSubmit={createMutation.mutate} loading={createMutation.isPending} />
      </Modal>
      <Modal isOpen={!!editCustomer} onClose={() => setEditCustomer(null)} title="Edit Customer" size="sm">
        <CustomerForm defaultValues={editCustomer} onSubmit={updateMutation.mutate} loading={updateMutation.isPending} />
      </Modal>
      <ConfirmModal isOpen={!!deleteCustomer} onClose={() => setDeleteCustomer(null)}
        onConfirm={() => deleteMutation.mutate(deleteCustomer?.customerId)} loading={deleteMutation.isPending}
        title="Delete Customer" message={`Delete "${deleteCustomer?.customerName}"?`} />
    </div>
  );
};

export default CustomersPage;
