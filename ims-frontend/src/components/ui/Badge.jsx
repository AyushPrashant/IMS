import { cn } from '../../utils';
import { getStatusClasses } from '../../utils';

const colorMap = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  info:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  purple:  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
};

const Badge = ({ children, color = 'default', status, dot = false, className }) => {
  let classes;
  if (status) {
    const s = getStatusClasses(status);
    classes = `${s.bg} ${s.text}`;
  } else {
    classes = colorMap[color] || colorMap.default;
  }

  return (
    <span className={cn('badge', classes, className)}>
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5 inline-block',
          color === 'success' || status === 'COMPLETED' || status === 'DELIVERED' || status === 'ACTIVE' ? 'bg-green-500' :
          color === 'warning' || status === 'PENDING' ? 'bg-yellow-500' :
          color === 'danger' || status === 'CANCELLED' ? 'bg-red-500' :
          'bg-blue-500'
        )} />
      )}
      {children || status}
    </span>
  );
};

export default Badge;
