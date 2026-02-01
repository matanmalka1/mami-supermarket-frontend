import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPassword from "@/pages/auth/ResetPassword";
import renderWithRouter from "../../render";
import { mockResetPassword } from "@/pages/auth/testUtils";

describe("ResetPassword", () => {
  beforeEach(() => {
    mockResetPassword.mockReset();
  });

  it("prefills token from query and submits reset", async () => {
    mockResetPassword.mockResolvedValue({});
    renderWithRouter(<ResetPassword />, { route: "/reset-password?token=abc123" });

    expect(screen.getByPlaceholderText(/token/)).toHaveValue("abc123");
    await userEvent.type(
      screen.getByPlaceholderText(/name@example/),
      "user@example.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText(/strong password/),
      "Secure123!",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /update password/i }),
    );

    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        token: "abc123",
        new_password: "Secure123!",
      }),
    );
    await waitFor(() =>
      expect(screen.getByText(/Password updated/i)).toBeInTheDocument(),
    );
  });

  it("shows error when backend rejects token", async () => {
    mockResetPassword.mockRejectedValue(new Error("Invalid token"));
    renderWithRouter(<ResetPassword />, { route: "/reset-password" });

    await userEvent.type(
      screen.getByPlaceholderText(/name@example/),
      "user@example.com",
    );
    await userEvent.type(screen.getByPlaceholderText(/token/), "bad-token");
    await userEvent.type(
      screen.getByPlaceholderText(/strong password/),
      "Secure123!",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /update password/i }),
    );

    await waitFor(() =>
      expect(screen.getByText(/Invalid token/)).toBeInTheDocument(),
    );
  });
});
