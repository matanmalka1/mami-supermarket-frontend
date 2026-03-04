import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  mockLoginUser,
  mockNavigate,
  mockRegisterUser,
  mockSendRegisterOtp,
  mockVerifyRegisterOtp,
} from "@/pages/auth/testUtils";
import renderWithRouter from "../../render";
import Register from "@/pages/auth/Register";

describe("Register", () => {
  beforeEach(() => {
    mockRegisterUser.mockReset();
    mockLoginUser.mockReset();
    mockSendRegisterOtp.mockReset();
    mockVerifyRegisterOtp.mockReset();
    mockNavigate.mockReset();
  });

  it("renders register form with name, email, phone fields", () => {
    mockRegisterUser.mockResolvedValue({ ok: true });
    const onRegister = vi.fn();

    renderWithRouter(<Register onRegister={onRegister} />);

    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("john@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText(/Israeli Phone Number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeInTheDocument();
  });
});
