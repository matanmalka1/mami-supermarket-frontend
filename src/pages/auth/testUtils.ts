import { vi } from "vitest";

export const mockLoginUser = vi.fn();
export const mockRegisterUser = vi.fn();
export const mockSendRegisterOtp = vi.fn();
export const mockVerifyRegisterOtp = vi.fn();
export const mockRequestPasswordReset = vi.fn();
export const mockResetPassword = vi.fn();
export const mockNavigate = vi.fn();

vi.mock("@/features/auth/hooks/useAuthActions", () => ({
  useAuthActions: () => ({
    loginUser: mockLoginUser,
    registerUser: mockRegisterUser,
    sendRegisterOtp: mockSendRegisterOtp,
    verifyRegisterOtp: mockVerifyRegisterOtp,
    requestPasswordReset: mockRequestPasswordReset,
    resetPassword: mockResetPassword,
  }),
}));

vi.mock("react-router", async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
