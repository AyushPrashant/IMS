import { useState, useCallback } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, debounce } from '../../utils';

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  className,
  debounceMs = 300,
  defaultValue = '',
}) => {
  const [value, setValue] = useState(defaultValue);

  const debouncedSearch = useCallback(
    debounce((v) => onSearch?.(v), debounceMs),
    [onSearch, debounceMs]
  );

  const handleChange = (e) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  return (
    <div className={cn('relative', className)}>
      <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-base pl-9 pr-9 h-9 text-sm"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
          >
            <HiX size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
