import { motion } from 'framer-motion';
import { fadeInDown } from '../../animations/variants';
import { cn } from '../../utils';

const PageHeader = ({ title, subtitle, actions, className }) => (
  <motion.div
    variants={fadeInDown}
    initial="hidden"
    animate="visible"
    className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6', className)}
  >
    <div>
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
    </div>
    {actions && (
      <div className="flex items-center gap-3 flex-wrap">
        {actions}
      </div>
    )}
  </motion.div>
);

export default PageHeader;
