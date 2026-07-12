import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { cn } from '../../utils';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const range = [];
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i);
  }
  if (currentPage - delta > 2) range.unshift('...');
  if (currentPage + delta < totalPages - 1) range.push('...');
  pages.push(1);
  range.forEach(r => pages.push(r));
  if (totalPages > 1) pages.push(totalPages);

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1 py-3">
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-primary">{start}–{end}</span> of{' '}
        <span className="font-medium text-primary">{totalItems}</span> results
      </p>
      <div className="flex items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-theme text-secondary hover:bg-primary-theme disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <HiChevronLeft size={16} />
        </motion.button>

        {pages.map((page, i) => (
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-muted text-sm">
              •••
            </span>
          ) : (
            <motion.button
              key={page}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                page === currentPage
                  ? 'bg-accent text-white shadow-lg shadow-indigo-500/25'
                  : 'border border-theme text-secondary hover:bg-primary-theme'
              )}
            >
              {page}
            </motion.button>
          )
        ))}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-theme text-secondary hover:bg-primary-theme disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <HiChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;
