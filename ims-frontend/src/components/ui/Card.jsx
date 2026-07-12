import { motion } from 'framer-motion';
import { cn } from '../../utils';

const Card = ({ children, className, hover = false, glass = false, onClick, padding = 'p-6', ...props }) => {
  const Component = hover || onClick ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -3, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' },
    transition: { duration: 0.25 },
  } : {};

  return (
    <Component
      onClick={onClick}
      className={cn('card', padding, glass && 'glass', hover && 'cursor-pointer', className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ title, subtitle, action, icon, className }) => (
  <div className={cn('flex items-start justify-between mb-5', className)}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-base font-semibold text-primary">{title}</h3>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default Card;
