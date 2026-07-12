import { motion } from 'framer-motion';
import { HiSun, HiMoon, HiDesktopComputer, HiBell, HiShieldCheck, HiColorSwatch } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { staggerContainer, staggerItem } from '../../animations/variants';
import { cn } from '../../utils';

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      'relative w-10 h-6 rounded-full transition-colors duration-200',
      checked ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
    )}
  >
    <span className={cn(
      'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
      checked ? 'translate-x-5' : 'translate-x-1'
    )} />
  </button>
);

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-theme last:border-0">
    <div>
      <p className="text-sm font-medium text-primary">{label}</p>
      {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
    </div>
    <div>{children}</div>
  </div>
);

const SettingsPage = () => {
  const { isDark, toggleTheme, theme } = useTheme();
  const { user, logout } = useAuth();

  const themes = [
    { key: 'dark', label: 'Dark', icon: <HiMoon size={16} /> },
    { key: 'light', label: 'Light', icon: <HiSun size={16} /> },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Customize your experience" />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">

        {/* Appearance */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader title="Appearance" icon={<HiColorSwatch size={18} />} />
            <div>
              <p className="text-sm text-secondary mb-3">Choose your preferred color theme</p>
              <div className="flex gap-3">
                {themes.map(t => (
                  <button
                    key={t.key}
                    onClick={toggleTheme}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                      theme === t.key
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'border-theme text-secondary hover:border-indigo-300'
                    )}
                  >
                    {t.icon} {t.label}
                    {theme === t.key && <span className="text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">Active</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <SettingRow label="Dark Mode" description="Toggle between dark and light interface">
                <ToggleSwitch checked={isDark} onChange={toggleTheme} />
              </SettingRow>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader title="Notifications" icon={<HiBell size={18} />} />
            <div>
              <SettingRow label="Low Stock Alerts" description="Get notified when products run low">
                <ToggleSwitch checked={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Order Notifications" description="Alerts for new orders and deliveries">
                <ToggleSwitch checked={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="System Updates" description="Important system announcements">
                <ToggleSwitch checked={false} onChange={() => {}} />
              </SettingRow>
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader title="Security" icon={<HiShieldCheck size={18} />} />
            <div className="space-y-3">
              <SettingRow label="Session Info" description={`Logged in as ${user?.username} (${user?.role})`}>
                <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              </SettingRow>
              <div className="pt-2">
                <Button variant="danger" size="sm" onClick={logout} fullWidth>
                  Sign Out of All Sessions
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader title="About" />
            <div className="space-y-2 text-sm text-secondary">
              <div className="flex justify-between">
                <span className="text-muted">Application</span>
                <span className="font-medium text-primary">InventoryMS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Version</span>
                <span className="font-medium text-primary">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Backend</span>
                <span className="font-medium text-primary">Spring Boot 3.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Frontend</span>
                <span className="font-medium text-primary">React 19 + Tailwind CSS</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
