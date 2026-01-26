import { vi } from "vitest";

export const mockLogin = vi.fn();
export const mockRegister = vi.fn();
export const mockSendRegisterOtp = vi.fn();
export const mockVerifyRegisterOtp = vi.fn();
export const mockNavigate = vi.fn();

vi.mock("@/services/api", () => ({
  apiService: {
    auth: {
      login: mockLogin,
      register: mockRegister,
      sendRegisterOtp: mockSendRegisterOtp,
      verifyRegisterOtp: mockVerifyRegisterOtp,
    },
  },
}));

vi.mock("react-router", async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
