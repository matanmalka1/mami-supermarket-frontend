export type UserRole = 'ADMIN' | 'USER';

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