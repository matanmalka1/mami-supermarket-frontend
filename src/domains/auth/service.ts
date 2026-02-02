import { apiClient } from "@/services/api-client";
import type { User } from "@/domains/users/types";
import { transformDtoToUser, transformUserToRequest } from "@/utils/user-transformer";
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
} from "@/domains/auth/types";

export const authService = {
  login: async (cred: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const payload: AuthLoginRequest = {
      email: cred.email,
      password: cred.password,
    };

    const res = await apiClient.post<AuthLoginRequest, AuthLoginResponse>(
      "/auth/login",
      payload,
    );
    return res;
  },
  register: async (
    data: AuthRegisterRequest,
  ): Promise<AuthRegisterResponse> => {
    const payload: AuthRegisterRequest = {
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      phone: data.phone,
      ...(data.role ? { role: data.role } : {}),
    };

    const res = await apiClient.post<AuthRegisterRequest, AuthRegisterResponse>(
      "/auth/register",
      payload,
    );

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
    apiClient.post<AuthResetPasswordRequest, void>(
      "/auth/reset-password",
      data,
    ),
  verifyRegisterOtp: (data: AuthRegisterVerifyOtpRequest) =>
    apiClient.post<AuthRegisterVerifyOtpRequest, { message: string }>(
      "/auth/register/verify-otp",
      data,
    ),
  getProfile: () => {
    return apiClient.get<any, User>("/me").then(transformDtoToUser);
  },
  updateProfile: (data: Partial<User>) => {
    return apiClient
      .patch<any, any>("/me", transformUserToRequest(data))
      .then(transformDtoToUser);
  },
  getAddresses: () => apiClient.get<any[], any[]>("/me/addresses"),
  addAddress: (data: any): Promise<any> =>
    apiClient.post("/me/addresses", data),
  updateAddress: (id: number, data: any): Promise<any> =>
    apiClient.put(`/me/addresses/${id}`, data),
  deleteAddress: (id: number) => apiClient.delete(`/me/addresses/${id}`),
  setDefaultAddress: (id: number) =>
    apiClient.patch(`/me/addresses/${id}/default`, {}),
};
