import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiHome, HiArrowLeft, HiShieldExclamation } from 'react-icons/hi';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-theme px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-9xl font-black gradient-text mb-4"
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold text-primary mb-3">Page Not Found</h1>
        <p className="text-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" icon={<HiArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button icon={<HiHome size={16} />} onClick={() => navigate(ROUTES.DASHBOARD)}>
            Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-theme px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-3xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6"
        >
          <HiShieldExclamation size={48} className="text-red-500" />
        </motion.div>
        <h1 className="text-2xl font-bold text-primary mb-3">Access Denied</h1>
        <p className="text-muted mb-8">You don't have permission to view this page. Contact your administrator.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" icon={<HiArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button icon={<HiHome size={16} />} onClick={() => navigate(ROUTES.DASHBOARD)}>
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
