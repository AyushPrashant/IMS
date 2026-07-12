import { cn } from '../../utils';

const Skeleton = ({ className, width, height, rounded = 'md' }) => {
  const roundedMap = { sm: 'rounded', md: 'rounded-lg', lg: 'rounded-xl', full: 'rounded-full' };
  return (
    <div
      className={cn('skeleton', roundedMap[rounded], className)}
      style={{ width, height: height || '1rem' }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton width={48} height={48} rounded="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} className="w-1/2" />
        <Skeleton height={12} className="w-3/4" />
      </div>
    </div>
    <Skeleton height={80} rounded="lg" />
    <div className="flex gap-3">
      <Skeleton height={36} className="flex-1" rounded="lg" />
      <Skeleton height={36} className="flex-1" rounded="lg" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="card overflow-hidden p-0">
    <div className="p-4 border-b border-theme">
      <Skeleton height={20} className="w-1/4" />
    </div>
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <Skeleton height={12} className="w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j}>
                  <Skeleton height={14} className={j === 0 ? 'w-32' : 'w-20'} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="card p-6">
    <div className="flex items-start justify-between mb-4">
      <Skeleton width={48} height={48} rounded="xl" />
      <Skeleton width={60} height={20} rounded="full" />
    </div>
    <Skeleton height={32} className="w-24 mb-2" />
    <Skeleton height={14} className="w-32" />
  </div>
);

export const SkeletonChart = () => (
  <div className="card p-6 h-80">
    <div className="flex items-center justify-between mb-6">
      <Skeleton height={20} className="w-40" />
      <Skeleton height={32} className="w-28" rounded="lg" />
    </div>
    <Skeleton height={200} className="w-full" rounded="lg" />
  </div>
);

export default Skeleton;
