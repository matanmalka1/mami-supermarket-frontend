import { Routes, Route, Navigate } from "react-router";
import StoreLayout from "../layouts/StoreLayout";
import OpsLayout from "../layouts/OpsLayout";
import RequireAuth from "./guards/RequireAuth";
import Dashboard from "../pages/ops/Dashboard";
import PickingInterface from "../pages/ops/PickingInterface";
import Inventory from "../pages/ops/Inventory";
import Storefront from "../pages/store/Storefront";
import AuditLogs from "../pages/ops/AuditLogs";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import CategoryView from "../pages/store/CategoryView";
import SearchResults from "../pages/store/SearchResults";
import ProductDetail from "../pages/store/ProductDetail";
import Checkout from "../pages/store/Checkout";
import OrderSuccess from "../pages/store/OrderSuccess";
import AccountLayout from "../pages/store/AccountLayout";
import OrderHistory from "../pages/store/OrderHistory";
import AddressBook from "../pages/store/AddressBook";
import ProfileSettings from "../pages/store/ProfileSettings";
import Wishlist from "../features/store/wishlist/pages/WishlistPage";
import StaffPerformance from "../pages/ops/StaffPerformance";
import StockRequests from "../pages/ops/StockRequests";
import CatalogManager from "../pages/admin/CatalogManager";
import StockRequestManager from "../pages/admin/StockRequestManager";
import DeliverySlotManager from "../pages/admin/DeliverySlotManager";
import GlobalSettings from "../pages/admin/GlobalSettings";
import ManagerAnalytics from "../pages/admin/ManagerAnalytics";
import ForbiddenPage from "../pages/errors/ForbiddenPage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import type { UserRole } from "@/domains/users/types";
import RoleGuard from "./guards/RoleGuard";
import { OPS_ROLES } from "../utils/roles";

interface RouterProps {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userName: string | null;
  login: (payload: {
    token: string; role?: UserRole | null; remember?: boolean;
  }) => void;
  logout: () => void;
}

export const AppRouter: React.FC<RouterProps> = ({
  isAuthenticated,
  userRole,
  userName,
  login,
  logout,
}) => {
  const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) =>
    isAuthenticated ? <Navigate to="/store" replace /> : children;
  const ProtectedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login onLogin={login} />
          </PublicRoute>
        }
      />
      <Route path="/register" element={<PublicRoute><Register onRegister={login} /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      <Route
        element={
          <ProtectedRoutes>
            <RequireAuth>
              <RoleGuard allowedRoles={OPS_ROLES} userRole={userRole}>
                <OpsLayout userRole={userRole} userName={userName} />
              </RoleGuard>
            </RequireAuth>
          </ProtectedRoutes>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/picking/:id" element={<PickingInterface />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/performance" element={<StaffPerformance />} />
        <Route path="/stock-requests" element={<StockRequests />} />
        <Route path="/admin/analytics" element={<ManagerAnalytics />} />
        <Route path="/admin/catalog" element={<CatalogManager />} />
        <Route path="/admin/requests" element={<StockRequestManager />} />
        <Route path="/admin/delivery" element={<DeliverySlotManager />} />
        <Route path="/admin/settings" element={<GlobalSettings />} />
      </Route>

      <Route path="/403" element={<ProtectedRoutes><ForbiddenPage /></ProtectedRoutes>} />

      <Route
        element={
          <ProtectedRoutes>
            <RequireAuth>
              <StoreLayout />
            </RequireAuth>
          </ProtectedRoutes>
        }
      >
        <Route path="/store" element={<Storefront />} />
        <Route path="/store/category/:id" element={<CategoryView />} />
        <Route path="/store/search" element={<SearchResults />} />
        <Route path="/store/product/:id" element={<ProductDetail />} />
        <Route path="/store/checkout" element={<Checkout />} />
        <Route path="/store/order-success/:id" element={<OrderSuccess />} />
        <Route path="/store/wishlist" element={<Wishlist />} />
        <Route
          path="/store/account"
          element={<AccountLayout onLogout={logout} />}
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="addresses" element={<AddressBook />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          isAuthenticated ? (
            <NotFoundPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
