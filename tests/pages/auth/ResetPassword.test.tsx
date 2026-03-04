import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPassword from "@/pages/auth/ResetPassword";
import renderWithRouter from "../../render";
import { mockResetPassword } from "@/pages/auth/testUtils";

describe("ResetPassword", () => {
  beforeEach(() => {
    mockResetPassword.mockReset();
  });

  it("renders reset password form with prefilled token", () => {
    mockResetPassword.mockResolvedValue({});
    renderWithRouter(<ResetPassword />, {
      route: "/reset-password?token=abc123",
    });

    expect(screen.getByPlaceholderText(/token/)).toHaveValue("abc123");
    expect(screen.getByPlaceholderText(/name@example/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/strong password/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update password/i }),
    ).toBeInTheDocument();
  });

  it("shows form without token when query param missing", () => {
    mockResetPassword.mockResolvedValue({});
    renderWithRouter(<ResetPassword />, { route: "/reset-password" });

    expect(screen.getByPlaceholderText(/token/)).toHaveValue("");
    expect(screen.getByPlaceholderText(/name@example/)).toBeInTheDocument();
  });
});
