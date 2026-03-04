import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Login from "@/pages/auth/Login";
import renderWithRouter from "../../render";
import { mockLoginUser, mockNavigate } from "@/pages/auth/testUtils";

describe("Login", () => {
  beforeEach(() => {
    mockLoginUser.mockReset();
    mockNavigate.mockReset();
  });

  it("renders login form with email and password fields", () => {
    mockLoginUser.mockResolvedValue({
      data: { access_token: "a.b.c", user: { role: "CUSTOMER" } },
    });
    const onLogin = vi.fn();
    renderWithRouter(<Login onLogin={onLogin} />);

    expect(screen.getByPlaceholderText(/name@example/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
