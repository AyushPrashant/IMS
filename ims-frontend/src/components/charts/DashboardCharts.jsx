import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { CHART_COLORS, MONTH_SHORT } from '../../constants';
import { parseMonthlyData } from '../../utils';
import Card, { CardHeader } from '../ui/Card';
import { SkeletonChart } from '../ui/Skeleton';

const useChartColors = () => {
  const { isDark } = useTheme();
  return {
    grid: isDark ? '#1e293b' : '#f1f5f9',
    text: isDark ? '#94a3b8' : '#64748b',
    tooltip: {
      bg: isDark ? '#0f172a' : '#ffffff',
      border: isDark ? '#1e293b' : '#e2e8f0',
      text: isDark ? '#f8fafc' : '#0f172a',
    },
  };
};

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  const { tooltip } = useChartColors();
  if (!active || !payload?.length) return null;
  return (
    <div className="card !rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {prefix}{p.value?.toLocaleString()}{suffix}
        </p>
      ))}
    </div>
  );
};

export const SalesAreaChart = ({ data, loading }) => {
  const { grid, text } = useChartColors();
  if (loading) return <SkeletonChart />;
  const chartData = parseMonthlyData(data, 'salesCount');
  return (
    <Card className="h-80">
      <CardHeader title="Monthly Sales" subtitle="Order count per month" />
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: text }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: text }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke={CHART_COLORS.primary} strokeWidth={2.5}
            fill="url(#salesGrad)" dot={false} activeDot={{ r: 5, fill: CHART_COLORS.primary }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const OrderQtyBarChart = ({ data, loading }) => {
  const { grid, text } = useChartColors();
  if (loading) return <SkeletonChart />;
  const chartData = parseMonthlyData(data, 'orderQuantity');
  return (
    <Card className="h-80">
      <CardHeader title="Monthly Order Quantity" subtitle="Units ordered per month" />
      <ResponsiveContainer width="100%" height="75%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: text }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: text }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={CHART_COLORS.success} radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const TopProductsPieChart = ({ data, loading }) => {
  const COLORS = [
    CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning,
    CHART_COLORS.info, CHART_COLORS.purple, CHART_COLORS.orange,
  ];
  if (loading) return <SkeletonChart />;
  const chartData = (data || []).slice(0, 6).map(([name, val]) => ({
    name: name?.substring(0, 14) || 'Unknown',
    value: Number(val) || 0,
  }));
  if (!chartData.length) return (
    <Card className="h-72 flex items-center justify-center">
      <p className="text-muted text-sm">No sales data yet</p>
    </Card>
  );
  return (
    <Card className="h-72">
      <CardHeader title="Top Products" subtitle="By units sold" />
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
            paddingAngle={3} dataKey="value">
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const MiniLineChart = ({ data = [], color = CHART_COLORS.primary, height = 50 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2}
        dot={false} />
    </LineChart>
  </ResponsiveContainer>
);
