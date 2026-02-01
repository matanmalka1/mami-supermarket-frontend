import { Navigate } from "react-router";
import type { UserRole } from "@/domains/users/types";

type RoleGuardProps = {
  allowedRoles: UserRole[];
  userRole: UserRole | null;
  children: React.ReactNode;
};

const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  userRole,
  children,
}) => {
  const effectiveRole = userRole;
  if (!effectiveRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(effectiveRole))
    return <Navigate to="/403" replace />;
  return <>{children}</>;
};

export default RoleGuard;
