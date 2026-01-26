import { apiClient } from "./api-client";
import { User } from "../types/auth";
import {
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthChangePasswordRequest,
  AuthResetPasswordRequest,
  AuthRegisterOtpRequest,
  AuthRegisterVerifyOtpRequest,
  AuthRegisterOtpResponse,
} from "../types/auth-service";

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
  sendRegisterOtp: (email: string) =>
    apiClient.post<AuthRegisterOtpRequest, AuthRegisterOtpResponse>(
      "/auth/register/send-otp",
      { email },
    ),
  changePassword: (data: AuthChangePasswordRequest) =>
    apiClient.post<AuthChangePasswordRequest, void>(
      "/auth/change-password",
      data,
    ),
  resetPassword: (data: AuthResetPasswordRequest) =>
    apiClient.post<AuthResetPasswordRequest, void>("/auth/reset-password", data),
  verifyRegisterOtp: (data: AuthRegisterVerifyOtpRequest) =>
    apiClient.post<AuthRegisterVerifyOtpRequest, { message: string }>(
      "/auth/register/verify-otp",
      data,
    ),
  getProfile: () => apiClient.get<any, User>("/me"),
  updateProfile: (data: Partial<User>) =>
    apiClient.patch<any, User>("/me", data),
  getAddresses: () => apiClient.get<any[], any[]>("/me/addresses"),
  addAddress: (data: any) => apiClient.post("/me/addresses", data),
  deleteAddress: (id: string) => apiClient.delete(`/me/addresses/${id}`),
  setDefaultAddress: (id: string) =>
    apiClient.patch(`/me/addresses/${id}/default`, {}),
};
