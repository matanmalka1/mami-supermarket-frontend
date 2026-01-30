// Bridge re-export for auth API types
export type {
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthChangePasswordRequest,
  AuthResetPasswordRequest,
  AuthRegisterOtpRequest,
  AuthRegisterVerifyOtpRequest,
  AuthRegisterOtpResponse,
} from "@/domains/auth/types-api";
