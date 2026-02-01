import type { UserRole } from "@/domains/users/types";

export const VALID_ROLES: UserRole[] = [
  "ADMIN",
  "MANAGER",
  "EMPLOYEE",
  "CUSTOMER",
];

export const OPS_ROLES: UserRole[] = ["ADMIN", "MANAGER", "EMPLOYEE"];

export const normalizeRole = (role?: string | null): UserRole | null => {
  if (!role) return null;
  const normalized = role.toUpperCase();
  if (normalized === "USER") return "CUSTOMER";
  if (VALID_ROLES.includes(normalized as UserRole)) {
    return normalized as UserRole;
  }
  return null;
};

export const isOpsRole = (role?: UserRole | null) => {
  return !!role && OPS_ROLES.includes(role);
};
