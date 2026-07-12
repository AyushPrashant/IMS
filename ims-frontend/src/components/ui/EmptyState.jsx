import { motion } from 'framer-motion';
import { HiInbox } from 'react-icons/hi';
import Button from './Button';

const EmptyState = ({
  icon = <HiInbox size={48} />,
  title = 'No data found',
  description = 'There are no items to display here yet.',
  action,
  actionLabel,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-primary-theme flex items-center justify-center text-muted mb-5">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
    <p className="text-sm text-muted max-w-xs mb-6">{description}</p>
    {action && (
      <Button onClick={action} variant="primary">
        {actionLabel || 'Add New'}
      </Button>
    )}
  </motion.div>
);

export default EmptyState;
