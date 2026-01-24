import { apiClient } from "./api-client";
import { User, AuthResponse } from "../types/auth";

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

export const authService = {
  login: async (cred: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const payload: AuthLoginRequest = {
      email: cred.email,
      password: cred.password,
    };
    console.debug("[authService.login] payload:", payload);
    const res = await apiClient.post<AuthLoginRequest, AuthLoginResponse>(
      "/auth/login",
      payload,
    );
    console.debug("[authService.login] response:", res);
    return res;
  },
  register: async (
    data: AuthRegisterRequest,
  ): Promise<AuthRegisterResponse> => {
    const payload: AuthRegisterRequest = {
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      ...(data.role ? { role: data.role } : {}),
    };
    console.debug("[authService.register] payload:", payload);
    const res = await apiClient.post<AuthRegisterRequest, AuthRegisterResponse>(
      "/auth/register",
      payload,
    );
    console.debug("[authService.register] response:", res);
    return res;
  },
  forgotPassword: (email: string) =>
    apiClient.post<{ email: string }, void>("/auth/forgot-password", { email }),
  changePassword: (data: AuthChangePasswordRequest) =>
    apiClient.post<AuthChangePasswordRequest, void>(
      "/auth/change-password",
      data,
    ),
  getProfile: () => apiClient.get<any, User>("/me"),
  updateProfile: (data: Partial<User>) =>
    apiClient.patch<any, User>("/me", data),
  getAddresses: () => apiClient.get<any[], any[]>("/me/addresses"),
  addAddress: (data: any) => apiClient.post("/me/addresses", data),
};
