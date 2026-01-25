import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ResetPassword from "./ResetPassword";
import renderWithRouter from "@/test/render";

const { mockReset } = vi.hoisted(() => ({
  mockReset: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    auth: {
      resetPassword: mockReset,
    },
  },
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    mockReset.mockReset();
  });

  it("prefills token from query and submits reset", async () => {
    mockReset.mockResolvedValue({});
    renderWithRouter({
      route: "/reset-password?token=abc123",
      path: "/reset-password",
      element: <ResetPassword />,
    });

    expect(screen.getByPlaceholderText(/token/)).toHaveValue("abc123");
    await userEvent.type(screen.getByPlaceholderText(/name@example/), "user@example.com");
    await userEvent.type(screen.getByPlaceholderText(/strong password/), "Secure123!");
    await userEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() =>
      expect(mockReset).toHaveBeenCalledWith({
        email: "user@example.com",
        token: "abc123",
        new_password: "Secure123!",
      }),
    );
    await waitFor(() => expect(screen.getByText(/Password updated/i)).toBeInTheDocument());
  });

  it("shows error when backend rejects token", async () => {
    mockReset.mockRejectedValue(new Error("Invalid token"));
    renderWithRouter({
      route: "/reset-password",
      path: "/reset-password",
      element: <ResetPassword />,
    });

    await userEvent.type(screen.getByPlaceholderText(/name@example/), "user@example.com");
    await userEvent.type(screen.getByPlaceholderText(/token/), "bad-token");
    await userEvent.type(screen.getByPlaceholderText(/strong password/), "Secure123!");
    await userEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => expect(screen.getByText(/Invalid token/)).toBeInTheDocument());
  });
});
