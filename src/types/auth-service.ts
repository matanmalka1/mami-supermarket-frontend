// Auth API request/response types
export interface AuthRegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}
export interface AuthRegisterResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
  access_token: string;
  refresh_token: string | null;
  expires_at: string;
}
export interface AuthLoginRequest {
  email: string;
  password: string;
}
export type AuthLoginResponse = AuthRegisterResponse;

export interface AuthChangePasswordRequest {
  current_password: string;
  new_password: string;
}
export interface AuthResetPasswordRequest {
  email: string;
  token: string;
  new_password: string;
}
