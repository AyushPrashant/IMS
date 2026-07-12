import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';
import { STATUS_COLORS, LOW_STOCK_THRESHOLD } from '../constants';

/** Merge Tailwind classes safely */
export const cn = (...inputs) => twMerge(clsx(inputs));

/** Format currency in INR */
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Format large numbers with K/M suffix */
export const formatNumber = (num) => {
  if (num == null) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

/** Format date string */
export const formatDate = (dateStr, fmt = 'dd MMM yyyy') => {
  if (!dateStr) return '—';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return isValid(date) ? format(date, fmt) : '—';
  } catch {
    return '—';
  }
};

/** Format date-time */
export const formatDateTime = (dateStr) => formatDate(dateStr, 'dd MMM yyyy, hh:mm a');

/** Get status badge classes */
export const getStatusClasses = (status) => {
  const s = (status || '').toUpperCase();
  return STATUS_COLORS[s] || { bg: 'bg-gray-100', text: 'text-gray-600' };
};

/** Check if product is low stock */
export const isLowStock = (qty) => qty != null && qty <= LOW_STOCK_THRESHOLD;

/** Truncate text */
export const truncate = (text, len = 30) => {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '...' : text;
};

/** Capitalize first letter */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/** Download blob as file */
export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/** Export table data as CSV */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data?.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        return typeof val === 'string' && val.includes(',')
          ? `"${val}"` : val;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, filename);
};

/** Get initials from name */
export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

/** Random gradient class for avatars */
const GRADIENTS = [
  'gradient-primary','gradient-success','gradient-warning',
  'gradient-info','gradient-orange','gradient-teal',
];
export const getAvatarGradient = (str) => {
  const idx = (str || '').charCodeAt(0) % GRADIENTS.length;
  return GRADIENTS[idx];
};

/** Debounce function */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/** Parse monthly data for charts — ensure 12 months */
export const parseMonthlyData = (data, valueKey) => {
  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const result = MONTHS_SHORT.map(m => ({ month: m, value: 0 }));
  if (!data?.length) return result;
  data.forEach(item => {
    const monthName = (item.Month || '').toUpperCase();
    const MONTHS_UPPER = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
                          'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    const idx = MONTHS_UPPER.indexOf(monthName);
    if (idx !== -1) result[idx].value = item[valueKey] || 0;
  });
  return result;
};

/** Calculate percentage change */
export const percentChange = (current, previous) => {
  if (!previous) return null;
  return (((current - previous) / previous) * 100).toFixed(1);
};
