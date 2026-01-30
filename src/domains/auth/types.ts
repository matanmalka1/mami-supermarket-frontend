import type { User, UserRole } from "@/domains/users/types";
export type { User, UserRole } from "@/domains/users/types";

export interface AuthResponse {
  token: string;
  role: UserRole;
  user: User;
}
