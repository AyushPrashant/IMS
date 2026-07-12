import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { ROLES } from '../constants';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ims_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const persistUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('ims_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('ims_user');
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(credentials);
      persistUser(data);
      toast.success(`Welcome back, ${data.username}!`);
      return { success: true, role: data.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const loginWithOtp = useCallback(async (godownheadNo, otp) => {
    setLoading(true);
    try {
      const { data } = await authApi.loginWithOtp({ godownheadNo, otp });
      persistUser(data);
      toast.success(`Welcome, ${data.username}!`);
      return { success: true, role: data.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP login failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    persistUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  }, [persistUser]);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isGodownHead = user?.role === ROLES.GODOWN_HEAD;
  const isAuthenticated = !!user?.cookie;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      isGodownHead,
      isAuthenticated,
      login,
      loginWithOtp,
      logout,
      persistUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
