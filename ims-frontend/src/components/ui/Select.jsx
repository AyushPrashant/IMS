import { forwardRef } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { cn } from '../../utils';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select option',
  className,
  required,
  disabled,
  ...props
}, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-secondary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative">
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          'input-base appearance-none pr-10 cursor-pointer',
          error && 'border-red-500',
          disabled && 'opacity-60 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
    </div>
    {error && <p className="text-xs text-red-500">⚠ {error}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;
