export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE" | "CUSTOMER";

export interface User {
  id: number;
  email: string;
  fullName?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}
