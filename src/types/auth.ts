export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE" | "CUSTOMER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  role: UserRole;
  user: User;
}
