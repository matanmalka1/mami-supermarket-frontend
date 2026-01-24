import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Login from "./Login";
import renderWithRouter from "@/test/render";

const { mockLogin, mockNavigate } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    auth: {
      login: mockLogin,
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

describe("Login", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  it("stores token and navigates after successful login", async () => {
    mockLogin.mockResolvedValue({
      data: { access_token: "jwt-token", user: { role: "USER" } },
    });
    const onLogin = vi.fn();
    renderWithRouter({
      route: "/login",
      path: "/login",
      element: <Login onLogin={onLogin} />,
    });

    await userEvent.type(screen.getByPlaceholderText(/name@example/), "user@mami.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(sessionStorage.getItem("mami_token")).toBe("jwt-token"));
    expect(onLogin).toHaveBeenCalledWith("USER");
    expect(mockNavigate).toHaveBeenCalledWith("/store");
  });
});
