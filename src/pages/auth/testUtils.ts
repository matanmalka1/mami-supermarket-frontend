import { vi } from "vitest";

export const mockLogin = vi.fn();
export const mockRegister = vi.fn();
export const mockNavigate = vi.fn();

vi.mock("@/services/api", () => ({
  apiService: {
    auth: {
      login: mockLogin,
      register: mockRegister,
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
