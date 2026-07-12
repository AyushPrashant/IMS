import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, ROLES } from '../constants';
import { ProtectedRoute, RoleRoute, GuestRoute } from './guards';
import AppLayout from '../components/layout/AppLayout';
import { NotFoundPage, UnauthorizedPage } from '../pages/auth/ErrorPages';

// Lazy load pages
const LoginPage       = lazy(() => import('../pages/auth/LoginPage'));
const Dashboard       = lazy(() => import('../pages/dashboard/Dashboard'));
const GodownsPage     = lazy(() => import('../pages/godown/GodownsPage'));
const GodownHeadsPage = lazy(() => import('../pages/godownHead/GodownHeadsPage'));
const ProductsPage    = lazy(() => import('../pages/products/ProductsPage'));
const SuppliersPage   = lazy(() => import('../pages/suppliers/SuppliersPage'));
const CustomersPage   = lazy(() => import('../pages/customers/CustomersPage'));
const PurchaseOrders  = lazy(() => import('../pages/purchaseOrders/PurchaseOrdersPage'));
const DeliveryOrders  = lazy(() => import('../pages/deliveryOrders/DeliveryOrdersPage'));
const ReportsPage     = lazy(() => import('../pages/reports/ReportsPage'));
const ProfilePage     = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage    = lazy(() => import('../pages/settings/SettingsPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center animate-bounce">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        </svg>
      </div>
      <p className="text-sm text-muted">Loading...</p>
    </div>
  </div>
);

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected app */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

        {/* Admin-only routes */}
        <Route path={ROUTES.GODOWN_HEADS} element={
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <GodownHeadsPage />
          </RoleRoute>
        } />
        <Route path={ROUTES.SUPPLIERS} element={
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <SuppliersPage />
          </RoleRoute>
        } />
        <Route path={ROUTES.REPORTS} element={
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <ReportsPage />
          </RoleRoute>
        } />

        {/* Shared routes */}
        <Route path={ROUTES.GODOWNS}          element={<GodownsPage />} />
        <Route path={ROUTES.PRODUCTS}         element={<ProductsPage />} />
        <Route path={ROUTES.CUSTOMERS}        element={<CustomersPage />} />
        <Route path={ROUTES.PURCHASE_ORDERS}  element={<PurchaseOrders />} />
        <Route path={ROUTES.DELIVERY_ORDERS}  element={<DeliveryOrders />} />
        <Route path={ROUTES.PROFILE}          element={<ProfilePage />} />
        <Route path={ROUTES.SETTINGS}         element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
