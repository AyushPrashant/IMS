import { forwardRef, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { cn } from '../../utils';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  iconRight,
  type = 'text',
  className,
  containerClassName,
  required,
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-secondary">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={cn(
            'input-base',
            icon && 'pl-10',
            (iconRight || isPassword) && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
            disabled && 'opacity-60 cursor-not-allowed',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
          >
            {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
          </button>
        )}
        {iconRight && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
