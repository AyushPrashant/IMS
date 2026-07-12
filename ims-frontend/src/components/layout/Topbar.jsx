import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HiMenuAlt2, HiBell, HiSun, HiMoon, HiLogout, HiUser, HiCog,
  HiChevronDown, HiSearch,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import { dropdownVariants } from '../../animations/variants';
import { ROUTES } from '../../constants';
import { cn } from '../../utils';

const BREADCRUMB_MAP = {
  '/dashboard': 'Dashboard',
  '/godowns': 'Godowns',
  '/godown-heads': 'Godown Heads',
  '/products': 'Products',
  '/suppliers': 'Suppliers',
  '/customers': 'Customers',
  '/purchase-orders': 'Purchase Orders',
  '/delivery-orders': 'Delivery Orders',
  '/reports': 'Reports',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const pageTitle = BREADCRUMB_MAP[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center px-4 lg:px-6 gap-4 bg-card border-b border-theme">
      {/* Mobile menu button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenuClick}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary hover:bg-primary-theme transition-colors lg:hidden"
      >
        <HiMenuAlt2 size={20} />
      </motion.button>

      {/* Page title */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-primary">{pageTitle}</h1>
        <p className="text-xs text-muted">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary hover:bg-primary-theme transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-secondary hover:bg-primary-theme transition-colors relative"
          >
            <HiBell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 top-12 w-80 card !rounded-2xl z-50 overflow-hidden shadow-xl"
                >
                  <div className="px-4 py-3 border-b border-theme flex items-center justify-between">
                    <span className="font-semibold text-primary text-sm">Notifications</span>
                    <span className="badge bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                      3 new
                    </span>
                  </div>
                  {[
                    { title: 'Low Stock Alert', body: 'Solar Panel 400W is running low', time: '2m ago', dot: 'bg-red-500' },
                    { title: 'Order Delivered', body: 'Delivery #DO-1024 completed', time: '1h ago', dot: 'bg-green-500' },
                    { title: 'New Purchase', body: 'Purchase Order #PO-2048 created', time: '3h ago', dot: 'bg-blue-500' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-primary-theme transition-colors cursor-pointer border-b border-theme last:border-0">
                      <div className="flex items-start gap-3">
                        <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.dot)} />
                        <div>
                          <p className="text-sm font-medium text-primary">{n.title}</p>
                          <p className="text-xs text-muted mt-0.5">{n.body}</p>
                          <p className="text-xs text-indigo-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-3 text-center">
                    <button className="text-xs text-accent hover:underline font-medium">View all notifications</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-primary-theme transition-colors"
          >
            <Avatar name={user?.username} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-primary leading-none">{user?.username}</p>
              <p className="text-xs text-muted mt-0.5">{user?.role}</p>
            </div>
            <HiChevronDown size={14} className={cn('text-muted transition-transform', profileOpen && 'rotate-180')} />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 top-12 w-52 card !rounded-2xl z-50 overflow-hidden shadow-xl py-1"
                >
                  <button
                    onClick={() => { navigate(ROUTES.PROFILE); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-primary-theme hover:text-primary transition-colors"
                  >
                    <HiUser size={16} /> My Profile
                  </button>
                  <button
                    onClick={() => { navigate(ROUTES.SETTINGS); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-primary-theme hover:text-primary transition-colors"
                  >
                    <HiCog size={16} /> Settings
                  </button>
                  <div className="border-t border-theme my-1" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <HiLogout size={16} /> Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
