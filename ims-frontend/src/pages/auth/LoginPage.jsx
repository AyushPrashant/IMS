import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCube, HiPhone, HiLockClosed, HiUser, HiArrowRight, HiRefresh } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { ROLES, ROUTES } from '../../constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { fadeInUp, staggerContainer, staggerItem } from '../../animations/variants';
import toast from 'react-hot-toast';

const TABS = ['password', 'otp'];

const LoginPage = () => {
  const { login, loginWithOtp } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('password');
  const [otpStep, setOtpStep] = useState(1); // 1=enter phone, 2=enter otp
  const [phone, setPhone] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { register: regOtp, handleSubmit: handleOtp, formState: { errors: otpErrors } } = useForm();

  const redirectAfterLogin = (role) => {
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const onPasswordLogin = async (data) => {
    const result = await login(data);
    if (result.success) redirectAfterLogin(result.role);
  };

  const onSendOtp = async () => {
    if (!phone.trim()) return toast.error('Enter phone number');
    setOtpSending(true);
    try {
      await authApi.sendOtp(phone.trim());
      toast.success('OTP sent successfully');
      setOtpStep(2);
    } catch (e) {
      toast.error(e.response?.data || 'Failed to send OTP');
    } finally {
      setOtpSending(false);
    }
  };

  const onOtpLogin = async (data) => {
    setOtpVerifying(true);
    try {
      const result = await loginWithOtp(phone, data.otp);
      if (result.success) redirectAfterLogin(result.role);
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <motion.div variants={staggerItem} className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <HiCube size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">InventoryMS</h1>
          <p className="text-slate-400 text-sm">Premium Inventory Management Suite</p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={staggerItem}
          className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
          style={{ background: 'rgba(15, 23, 42, 0.75)' }}
        >
          {/* Tabs */}
          <div className="flex rounded-2xl bg-white/5 p-1 mb-8">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setOtpStep(1); }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'password' ? 'Password Login' : 'OTP Login'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'password' ? (
              <motion.form
                key="password"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit(onPasswordLogin)}
                className="space-y-5"
              >
                <Input
                  label="Username"
                  placeholder="Enter username"
                  icon={<HiUser size={16} />}
                  {...register('username', { required: 'Username is required' })}
                  error={errors.username?.message}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  icon={<HiLockClosed size={16} />}
                  {...register('password', { required: 'Password is required' })}
                  error={errors.password?.message}
                />

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  iconRight={<HiArrowRight size={18} />}
                  className="!rounded-2xl"
                >
                  Sign In
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setTab('otp')}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password? Login with OTP
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <AnimatePresence mode="wait">
                  {otpStep === 1 ? (
                    <motion.div key="step1" variants={fadeInUp} initial="hidden" animate="visible" exit="exit" className="space-y-5">
                      <Input
                        label="Phone Number"
                        placeholder="Enter registered phone number"
                        icon={<HiPhone size={16} />}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        maxLength={10}
                      />
                      <Button
                        variant="gradient"
                        size="lg"
                        fullWidth
                        loading={otpSending}
                        onClick={onSendOtp}
                        className="!rounded-2xl"
                      >
                        Send OTP
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="step2"
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onSubmit={handleOtp(onOtpLogin)}
                      className="space-y-5"
                    >
                      <p className="text-sm text-slate-300">
                        OTP sent to <span className="text-white font-medium">{phone}</span>
                      </p>
                      <Input
                        label="Enter OTP"
                        placeholder="6-digit OTP"
                        {...regOtp('otp', {
                          required: 'OTP is required',
                          minLength: { value: 6, message: 'OTP must be 6 digits' },
                        })}
                        error={otpErrors.otp?.message}
                        maxLength={6}
                      />
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          size="lg"
                          icon={<HiRefresh size={16} />}
                          onClick={() => { setOtpStep(1); }}
                          className="flex-1 !rounded-2xl"
                        >
                          Resend
                        </Button>
                        <Button
                          type="submit"
                          variant="gradient"
                          size="lg"
                          loading={otpVerifying}
                          className="flex-1 !rounded-2xl"
                        >
                          Verify & Login
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p variants={staggerItem} className="text-center mt-6 text-slate-500 text-xs">
          © 2024 InventoryMS · Secure · Reliable · Fast
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
