/**
 * @deprecated [2026-01-29] This domain types file has no active consumers and is considered dead code.
 * If you need to revive it, please update documentation and add a consumer.
 */
export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE" | "CUSTOMER";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}
