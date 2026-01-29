import React from "react";
import { Navigate } from "react-router";
import { UserRole } from "@/types/auth";

type RoleGuardProps = {
  allowedRoles: UserRole[];
  userRole: UserRole | null;
  children: React.ReactNode;
};

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, userRole, children }) => {
  const effectiveRole =
    userRole || (localStorage.getItem("mami_role") as UserRole | null);
  if (!effectiveRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(effectiveRole)) return <Navigate to="/403" replace />;
  return <>{children}</>;
};

export default RoleGuard;
