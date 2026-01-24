import React, { useEffect } from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import StoreLayout from "../components/layout/StoreLayout";
import OpsLayout from "../components/layout/OpsLayout";
import RequireAuth from "./guards/RequireAuth";
import Dashboard from "../pages/Dashboard";
import PickingInterface from "../pages/PickingInterface";
import Inventory from "../pages/Inventory";
import Storefront from "../pages/Storefront";
import Logistics from "../pages/Logistics";
import AuditLogs from "../pages/AuditLogs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import CategoryView from "../pages/CategoryView";
import SearchResults from "../pages/SearchResults";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import AccountLayout from "../pages/AccountLayout";
import OrderHistory from "../pages/OrderHistory";
import AddressBook from "../pages/AddressBook";
import ProfileSettings from "../pages/ProfileSettings";
import StaffPerformance from "../pages/StaffPerformance";
import StockRequests from "../pages/StockRequests";
import WarehouseMap from "../pages/WarehouseMap";
import CatalogManager from "../pages/admin/CatalogManager";
import StockRequestManager from "../pages/admin/StockRequestManager";
import DeliverySlotManager from "../pages/admin/DeliverySlotManager";
import GlobalSettings from "../pages/admin/GlobalSettings";
import FleetTracker from "../pages/admin/FleetTracker";
import ManagerAnalytics from "../pages/admin/ManagerAnalytics";
import { UserRole } from "../types/auth";

interface RouterProps {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (role: UserRole, token: string, remember: boolean) => void;
  logout: () => void;
}

const RoleGuard: React.FC<{
  allowedRoles: UserRole[];
  userRole: UserRole | null;
  children: React.ReactNode;
}> = ({ allowedRoles, userRole, children }) => {
  const effectiveRole =
    userRole || (localStorage.getItem("mami_role") as UserRole);
  if (!effectiveRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(effectiveRole))
    return <Navigate to="/store" replace />;
  return <>{children}</>;
};

export const AppRouter: React.FC<RouterProps> = ({
  isAuthenticated,
  userRole,
  login,
  logout,
}) => {
  const effectiveRole =
    userRole || (localStorage.getItem("mami_role") as UserRole);

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route
            path="/login"
            element={<Login onLogin={(role) => login(role, "mock", true)} />}
          />
          <Route
            path="/register"
            element={
              <Register onRegister={() => login("USER", "mock", true)} />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {/* Internal Portal Branch */}
          <Route
            element={
              <RequireAuth>
                <RoleGuard allowedRoles={["ADMIN"]} userRole={userRole}>
                  <OpsLayout userRole={userRole} />
                </RoleGuard>
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/picking/:id" element={<PickingInterface />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/fleet" element={<FleetTracker />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/performance" element={<StaffPerformance />} />
            <Route path="/stock-requests" element={<StockRequests />} />
            <Route path="/map" element={<WarehouseMap />} />
            <Route path="/admin/analytics" element={<ManagerAnalytics />} />
            <Route path="/admin/catalog" element={<CatalogManager />} />
            <Route path="/admin/requests" element={<StockRequestManager />} />
            <Route path="/admin/delivery" element={<DeliverySlotManager />} />
            <Route path="/admin/settings" element={<GlobalSettings />} />
          </Route>

          {/* Customer Store Branch */}
          <Route element={<StoreLayout />}>
            <Route path="/store" element={<Storefront />} />
            <Route path="/store/category/:id" element={<CategoryView />} />
            <Route path="/store/search" element={<SearchResults />} />
            <Route path="/store/product/:id" element={<ProductDetail />} />
            <Route path="/store/checkout" element={<Checkout />} />
            <Route path="/store/order-success/:id" element={<OrderSuccess />} />

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
              effectiveRole === "ADMIN" ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/store" replace />
              )
            }
          />
        </>
      )}
    </Routes>
  );
};
