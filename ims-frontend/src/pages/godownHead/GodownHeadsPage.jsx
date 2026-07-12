import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiUserGroup, HiPencil } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authApi } from '../../api/authApi';
import { godownHeadApi } from '../../api/godownHeadApi';
import { godownApi } from '../../api/godownApi';
import { QUERY_KEYS } from '../../constants';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

const RegisterForm = ({ onSubmit, loading, godownOptions }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" placeholder="Ramesh Kumar" required
          {...register('godownHeadName', { required: 'Required' })}
          error={errors.godownHeadName?.message} />
        <Input label="Username" placeholder="ramesh" required
          {...register('username', { required: 'Required' })}
          error={errors.username?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Password" type="password" placeholder="Min 8 chars" required
          {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
          error={errors.password?.message} />
        <Input label="Phone Number" placeholder="9876543210"
          {...register('godownHeadNo')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Email" type="email" placeholder="ramesh@example.com"
          {...register('email')} />
        <Select label="Assign Godown" options={godownOptions} required
          {...register('godownId', { required: 'Required' })}
          error={errors.godownId?.message} />
      </div>
      <Input label="Address" placeholder="123 Main St, Pune"
        {...register('address')} />
      <Button type="submit" loading={loading} fullWidth>Register Godown Head</Button>
    </form>
  );
};

// QUERY_KEY for all godown heads — derive by fetching each godown's head
const GodownHeadsPage = () => {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: godowns = [], isLoading: loadingGodowns } = useQuery({
    queryKey: QUERY_KEYS.GODOWNS,
    queryFn: () => godownApi.getAll().then(r => r.data),
  });

  // Build heads list: for each godown, fetch the assigned head
  const { data: heads = [], isLoading: loadingHeads } = useQuery({
    queryKey: ['allGodownHeads'],
    queryFn: async () => {
      const results = await Promise.all(
        godowns.map(g =>
          godownHeadApi.getByGodownId(g.godownId)
            .then(r => r.data?.godownHeadId ? { ...r.data, godownAddress: g.address } : null)
            .catch(() => null)
        )
      );
      return results.filter(Boolean);
    },
    enabled: godowns.length > 0,
  });

  const godownOptions = godowns.map(g => ({ value: g.godownId, label: g.address }));

  const registerMutation = useMutation({
    mutationFn: (data) => authApi.register({ ...data, godownId: Number(data.godownId) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allGodownHeads'] });
      setCreateOpen(false);
      toast.success('Godown Head registered successfully');
    },
    onError: (e) => toast.error(e.response?.data || 'Registration failed'),
  });

  const columns = [
    { header: '#', key: 'godownHeadId', width: 60, sortable: true,
      render: (v) => <span className="text-muted font-mono text-xs">#{v}</span> },
    { header: 'Name', key: 'godownHeadName', sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={v} size="sm" />
          <div>
            <p className="font-medium text-primary">{v}</p>
            <p className="text-xs text-muted">@{row.username}</p>
          </div>
        </div>
      )},
    { header: 'Phone', key: 'godownheadNo', render: (v) => v || '—' },
    { header: 'Email', key: 'email',
      render: (v) => v ? <span className="text-accent text-sm">{v}</span> : '—' },
    { header: 'Assigned Godown', key: 'godownAddress',
      render: (v) => v ? <span className="text-secondary">{v}</span> : '—' },
    { header: 'Role', key: 'role',
      render: (v) => <Badge status={v} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Godown Heads"
        subtitle={`${heads.length} managers registered`}
        actions={
          <Button icon={<HiPlus size={16} />} onClick={() => setCreateOpen(true)}>
            Register Head
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={heads}
        loading={loadingGodowns || loadingHeads}
        searchable
        searchKeys={['godownHeadName', 'username', 'email', 'godownheadNo']}
        exportable
        exportFilename="godown-heads.csv"
        emptyTitle="No godown heads registered"
        emptyDescription="Register a godown head to assign them a warehouse"
        emptyAction={() => setCreateOpen(true)}
        emptyActionLabel="Register Head"
      />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Register Godown Head" size="md">
        <RegisterForm
          onSubmit={registerMutation.mutate}
          loading={registerMutation.isPending}
          godownOptions={godownOptions}
        />
      </Modal>
    </div>
  );
};

export default GodownHeadsPage;
