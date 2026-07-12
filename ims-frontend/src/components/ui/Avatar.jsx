import { cn, getInitials, getAvatarGradient } from '../../utils';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const Avatar = ({ name, src, size = 'md', className, online }) => {
  const initials = getInitials(name);
  const gradientClass = getAvatarGradient(name);

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white select-none',
        sizes[size],
        !src && gradientClass,
      )}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {online !== undefined && (
        <span className={cn(
          'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900',
          online ? 'bg-green-500' : 'bg-gray-400'
        )} />
      )}
    </div>
  );
};

export default Avatar;
