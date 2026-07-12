import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiChevronUp, HiChevronDown, HiDownload } from 'react-icons/hi';
import SearchBar from '../ui/SearchBar';
import Pagination from '../ui/Pagination';
import EmptyState from '../ui/EmptyState';
import { SkeletonTable } from '../ui/Skeleton';
import Button from '../ui/Button';
import { ITEMS_PER_PAGE } from '../../constants';
import { exportToCSV, cn } from '../../utils';

const DataTable = ({
  columns,
  data = [],
  loading = false,
  searchable = true,
  searchKeys = [],
  exportable = false,
  exportFilename = 'export.csv',
  actions,
  emptyTitle,
  emptyDescription,
  emptyAction,
  emptyActionLabel,
  itemsPerPage = ITEMS_PER_PAGE,
  stickyHeader = true,
}) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      searchKeys.some(key => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleSearch = (q) => { setSearch(q); setPage(1); };

  const handleExport = () => {
    const exportData = sorted.map(row => {
      const obj = {};
      columns.forEach(col => {
        if (col.key && !col.noExport) obj[col.header] = row[col.key] ?? '';
      });
      return obj;
    });
    exportToCSV(exportData, exportFilename);
  };

  if (loading) return <SkeletonTable rows={5} cols={columns.length} />;

  return (
    <div className="card overflow-hidden p-0">
      {/* Table header bar */}
      {(searchable || exportable || actions) && (
        <div className="px-4 py-3 border-b border-theme flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {searchable && (
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search..."
              className="w-full sm:w-72"
            />
          )}
          <div className="flex-1" />
          {exportable && (
            <Button
              variant="secondary"
              size="sm"
              icon={<HiDownload size={14} />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          )}
          {actions}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {paginated.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            actionLabel={emptyActionLabel}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key || col.header}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(col.sortable && 'cursor-pointer hover:text-primary select-none', col.className)}
                    style={{ width: col.width }}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortKey === col.key && (
                        <span className="text-accent">
                          {sortDir === 'asc' ? <HiChevronUp size={12} /> : <HiChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  {columns.map((col) => (
                    <td key={col.key || col.header} className={col.tdClassName}>
                      {col.render ? col.render(row[col.key], row, i) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {paginated.length > 0 && (
        <div className="px-4 border-t border-theme">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={sorted.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
