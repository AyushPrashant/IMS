import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiUser, HiLockClosed, HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { godownHeadApi } from '../../api/godownHeadApi';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { staggerContainer, staggerItem } from '../../animations/variants';

const ProfilePage = () => {
  const { user, persistUser } = useAuth();
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => godownHeadApi.getProfile().then(r => r.data),
    enabled: user?.role !== 'ADMIN',
  });

  const displayProfile = user?.role === 'ADMIN'
    ? { godownHeadName: 'Administrator', username: 'admin', role: 'ADMIN', email: 'admin@inventory.com' }
    : profile;

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: pe } } = useForm({
    values: {
      godownHeadName: displayProfile?.godownHeadName || '',
      email: displayProfile?.email || '',
      address: displayProfile?.address || '',
      phoneNumber: displayProfile?.phoneNumber || displayProfile?.godownheadNo || '',
    },
  });

  const { register: regPass, handleSubmit: handlePass, reset: resetPass, formState: { errors: pwe } } = useForm();

  const updateMutation = useMutation({
    mutationFn: godownHeadApi.updateProfile,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    },
    onError: (e) => toast.error(e.response?.data || 'Update failed'),
  });

  const passwordMutation = useMutation({
    mutationFn: godownHeadApi.updatePassword,
    onSuccess: () => { resetPass(); toast.success('Password changed successfully'); },
    onError: (e) => toast.error(e.response?.data || 'Password change failed'),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="My Profile" subtitle="Manage your account information and security" />

      {/* Profile header card */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={staggerItem}>
          <Card className="p-6">
            <div className="flex items-center gap-5">
              <Avatar name={displayProfile?.godownHeadName || displayProfile?.username} size="2xl" />
              <div>
                <h2 className="text-xl font-bold text-primary">
                  {displayProfile?.godownHeadName || displayProfile?.username || 'Loading...'}
                </h2>
                <p className="text-secondary">@{displayProfile?.username || user?.username}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge status={displayProfile?.role || user?.role} />
                  {displayProfile?.godownId && (
                    <span className="text-xs text-muted">Godown #{displayProfile.godownId}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Edit profile */}
        {user?.role !== 'ADMIN' && (
          <motion.div variants={staggerItem} className="mt-5">
            <Card>
              <CardHeader
                title="Personal Information"
                icon={<HiUser size={18} />}
              />
              <form onSubmit={handleProfile(updateMutation.mutate)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" placeholder="Your name"
                    {...regProfile('godownHeadName')} error={pe.godownHeadName?.message} />
                  <Input label="Phone Number" placeholder="9876543210"
                    {...regProfile('phoneNumber')} />
                </div>
                <Input label="Email" type="email" placeholder="your@email.com"
                  {...regProfile('email')} />
                <Input label="Address" placeholder="Your address"
                  {...regProfile('address')} />
                <div className="flex justify-end">
                  <Button type="submit" loading={updateMutation.isPending} icon={<HiSave size={15} />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Change password */}
        {user?.role !== 'ADMIN' && (
          <motion.div variants={staggerItem} className="mt-5">
            <Card>
              <CardHeader title="Change Password" icon={<HiLockClosed size={18} />} />
              <form onSubmit={handlePass(passwordMutation.mutate)} className="space-y-4">
                <Input label="Current Password" type="password" placeholder="Current password"
                  {...regPass('oldPassword', { required: 'Required' })}
                  error={pwe.oldPassword?.message} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="New Password" type="password" placeholder="Min 6 characters"
                    {...regPass('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                    error={pwe.newPassword?.message} />
                  <Input label="Confirm Password" type="password" placeholder="Repeat new password"
                    {...regPass('confirmPassword', {
                      required: 'Required',
                      validate: (v, fv) => v === fv.newPassword || 'Passwords do not match',
                    })}
                    error={pwe.confirmPassword?.message} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" loading={passwordMutation.isPending} icon={<HiLockClosed size={15} />}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Account info */}
        <motion.div variants={staggerItem} className="mt-5">
          <Card>
            <CardHeader title="Account Information" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Username', value: user?.username },
                { label: 'Role', value: user?.role },
                { label: 'Godown ID', value: user?.godownId ? `#${user.godownId}` : 'All Godowns (Admin)' },
                { label: 'Godown Head ID', value: user?.godownHeadId ? `#${user.godownHeadId}` : '—' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-primary-theme">
                  <p className="text-xs text-muted mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-primary">{item.value || '—'}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
