import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiCube, HiUsers, HiShoppingCart, HiTruck, HiChartBar,
  HiCog, HiUser, HiOfficeBuilding, HiUserGroup, HiTag, HiDocumentReport,
  HiX, HiChevronRight,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../constants';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils';

const adminNav = [
  { label: 'Dashboard', icon: <HiHome size={18} />, to: ROUTES.DASHBOARD },
  { label: 'Godowns', icon: <HiOfficeBuilding size={18} />, to: ROUTES.GODOWNS },
  { label: 'Godown Heads', icon: <HiUserGroup size={18} />, to: ROUTES.GODOWN_HEADS },
  { label: 'Products', icon: <HiCube size={18} />, to: ROUTES.PRODUCTS },
  { label: 'Suppliers', icon: <HiTag size={18} />, to: ROUTES.SUPPLIERS },
  { label: 'Customers', icon: <HiUsers size={18} />, to: ROUTES.CUSTOMERS },
  { label: 'Purchase Orders', icon: <HiShoppingCart size={18} />, to: ROUTES.PURCHASE_ORDERS },
  { label: 'Delivery Orders', icon: <HiTruck size={18} />, to: ROUTES.DELIVERY_ORDERS },
  { label: 'Reports', icon: <HiDocumentReport size={18} />, to: ROUTES.REPORTS },
];

const godownHeadNav = [
  { label: 'Dashboard', icon: <HiHome size={18} />, to: ROUTES.DASHBOARD },
  { label: 'My Godown', icon: <HiOfficeBuilding size={18} />, to: ROUTES.GODOWNS },
  { label: 'Products', icon: <HiCube size={18} />, to: ROUTES.PRODUCTS },
  { label: 'Customers', icon: <HiUsers size={18} />, to: ROUTES.CUSTOMERS },
  { label: 'Purchase Orders', icon: <HiShoppingCart size={18} />, to: ROUTES.PURCHASE_ORDERS },
  { label: 'Delivery Orders', icon: <HiTruck size={18} />, to: ROUTES.DELIVERY_ORDERS },
];

const bottomNav = [
  { label: 'Profile', icon: <HiUser size={18} />, to: ROUTES.PROFILE },
  { label: 'Settings', icon: <HiCog size={18} />, to: ROUTES.SETTINGS },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { user, isAdmin } = useAuth();
  const navItems = isAdmin ? adminNav : godownHeadNav;

  const SidebarContent = () => (
    <div className="h-full flex flex-col gradient-sidebar">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <HiCube size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">InventoryMS</p>
              <p className="text-indigo-300 text-xs mt-0.5">Management Suite</p>
            </div>
          </div>
          {isMobile && (
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
            >
              <HiX size={14} />
            </motion.button>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
          <Avatar name={user?.username} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.username}</p>
            <p className="text-indigo-300 text-xs truncate">{user?.role}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 pulse-green" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) => cn('nav-item group', isActive && 'active')}
          >
            {({ isActive }) => (
              <>
                <span className={cn('transition-colors', isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-white')}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 py-3 border-t border-white/10 space-y-0.5">
        {bottomNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) => cn('nav-item group', isActive && 'active')}
          >
            <span className="text-slate-400 group-hover:text-white transition-colors">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>
        <motion.aside
          variants={sidebarVariants}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
        >
          <SidebarContent />
        </motion.aside>
      </>
    );
  }

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
