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

  it("renders the forgot password form", () => {
    mockRequestPasswordReset.mockResolvedValue({});

    renderWithRouter(<ForgotPassword />);

    expect(screen.getByPlaceholderText(/name@example/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });
});
