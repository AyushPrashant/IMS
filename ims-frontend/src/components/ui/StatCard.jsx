import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { staggerItem } from '../../animations/variants';
import { cn } from '../../utils';

const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const gradients = ['gradient-primary', 'gradient-success', 'gradient-warning', 'gradient-info', 'gradient-orange', 'gradient-teal'];

const StatCard = ({ title, value, icon, change, changeLabel, gradient, index = 0, prefix = '', suffix = '', loading = false }) => {
  const displayValue = useCountUp(typeof value === 'number' ? value : parseFloat(value) || 0);
  const gradientClass = gradient || gradients[index % gradients.length];
  const isPositive = change != null && parseFloat(change) >= 0;

  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-10 w-10 rounded-xl mb-4" />
        <div className="skeleton h-8 w-24 mb-2" />
        <div className="skeleton h-4 w-32" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card p-6 relative overflow-hidden group"
    >
      {/* Background gradient blob */}
      <div className={cn(
        'absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500',
        gradientClass
      )} />
      <div className={cn(
        'absolute -right-2 -bottom-4 w-16 h-16 rounded-full opacity-5',
        gradientClass
      )} />

      <div className="relative z-10">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg', gradientClass)}>
          {icon}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-primary mb-1"
        >
          {prefix}{displayValue.toLocaleString()}{suffix}
        </motion.p>

        <p className="text-sm text-muted">{title}</p>

        {change != null && (
          <div className={cn(
            'flex items-center gap-1 mt-3 text-xs font-medium',
            isPositive ? 'text-green-500' : 'text-red-500'
          )}>
            {isPositive ? <HiTrendingUp size={14} /> : <HiTrendingDown size={14} />}
            <span>{isPositive ? '+' : ''}{change}%</span>
            {changeLabel && <span className="text-muted font-normal">{changeLabel}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
