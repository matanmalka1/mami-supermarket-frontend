import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import renderWithRouter from "../../render";
import {
  mockRequestPasswordReset,
  mockResetPassword,
} from "@/pages/auth/testUtils";

describe("ForgotPassword", () => {
  beforeEach(() => {
    mockRequestPasswordReset.mockReset();
    mockResetPassword.mockReset();
  });

  it("lets user enter token manually when none returned", async () => {
    mockRequestPasswordReset.mockResolvedValue({});
    mockResetPassword.mockResolvedValue({});

    renderWithRouter(<ForgotPassword />);

    await userEvent.type(
      screen.getByPlaceholderText(/name@example/),
      "user@example.com",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset link/i }),
    );

    await waitFor(() =>
      expect(mockRequestPasswordReset).toHaveBeenCalledWith("user@example.com"),
    );
    const tokenInput = await screen.findByPlaceholderText(/Paste token/i);

    await userEvent.type(tokenInput, "manual-token");
    await userEvent.type(
      screen.getByPlaceholderText(/strong password/),
      "Newpass123!",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /update password/i }),
    );

    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        token: "manual-token",
        new_password: "Newpass123!",
      }),
    );
    await waitFor(() =>
      expect(screen.getByText(/Password updated/i)).toBeInTheDocument(),
    );
  });
});
