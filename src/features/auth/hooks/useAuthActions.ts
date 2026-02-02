import { useCallback } from "react";
import { authService } from "@/domains/auth/service";
import type {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthRegisterVerifyOtpRequest,
  AuthResetPasswordRequest,
} from "@/domains/auth/types";

type AuthPayload = {
  token: string;
  role: string | null;
};

const resolveToken = (response: any) => {
  const token =
    response?.accessToken ||
    response?.access_token ||
    response?.data?.accessToken ||
    response?.data?.access_token ||
    response?.token ||
    response?.data?.token ||
    null;

  if (!token && (import.meta as any).env?.DEV) {
    console.warn("[Auth] No token found in response:", response);
  }

  return token;
};

const resolveRole = (response: any) =>
  response?.data?.user?.role ||
  response?.user?.role ||
  response?.data?.role ||
  response?.role ||
  null;

const normalizeAuthResponse = (response: any): AuthPayload => ({
  token: resolveToken(response) || "",
  role: resolveRole(response),
});

export const useAuthActions = () => {
  const loginUser = useCallback(
    async (payload: AuthLoginRequest): Promise<AuthPayload> => {
      const response = await authService.login(payload);
      return normalizeAuthResponse(response);
    },
    [],
  );

  const registerUser = useCallback(
    (payload: AuthRegisterRequest) => authService.register(payload),
    [],
  );

  const sendRegisterOtp = useCallback(
    (email: string) => authService.sendRegisterOtp(email),
    [],
  );

  const verifyRegisterOtp = useCallback(
    (payload: AuthRegisterVerifyOtpRequest) =>
      authService.verifyRegisterOtp(payload),
    [],
  );

  const requestPasswordReset = useCallback(
    (email: string) => authService.forgotPassword(email),
    [],
  );

  const resetPassword = useCallback(
    (payload: AuthResetPasswordRequest) => authService.resetPassword(payload),
    [],
  );

  return {
    loginUser,
    registerUser,
    sendRegisterOtp,
    verifyRegisterOtp,
    requestPasswordReset,
    resetPassword,
  };
};
