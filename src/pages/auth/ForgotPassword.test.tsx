import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ForgotPassword from "./ForgotPassword";
import renderWithRouter from "@/test/render";

const { mockForgot, mockReset } = vi.hoisted(() => ({
  mockForgot: vi.fn(),
  mockReset: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    auth: {
      forgotPassword: mockForgot,
      resetPassword: mockReset,
    },
  },
}));

describe("ForgotPassword", () => {
  beforeEach(() => {
    mockForgot.mockReset();
    mockReset.mockReset();
  });

  it("requests reset token then submits new password", async () => {
    mockForgot.mockResolvedValue({ reset_token: "dev-token" });
    mockReset.mockResolvedValue({});

    renderWithRouter({ route: "/forgot-password", path: "/forgot-password", element: <ForgotPassword /> });

    await userEvent.type(screen.getByPlaceholderText(/name@example/), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => expect(mockForgot).toHaveBeenCalledWith("user@example.com"));
    expect(screen.getByDisplayValue("dev-token")).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/strong password/), "Newpass123!");
    await userEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() =>
      expect(mockReset).toHaveBeenCalledWith({
        email: "user@example.com",
        token: "dev-token",
        new_password: "Newpass123!",
      }),
    );
    await waitFor(() => expect(screen.getByText(/Password updated/i)).toBeInTheDocument());
  });
});
