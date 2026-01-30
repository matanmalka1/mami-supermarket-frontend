import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Login from "./Login";
import renderWithRouter from "@/test/render";
import { mockLogin, mockNavigate } from "./testUtils";

describe("Login", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  it("stores token and navigates after successful login", async () => {
    mockLogin.mockResolvedValue({
      data: { access_token: "a.b.c", user: { role: "CUSTOMER" } },
    });
    const onLogin = vi.fn();
    renderWithRouter();

    await userEvent.type(
      screen.getByPlaceholderText(/name@example/),
      "user@mami.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("••••••••"),
      "password123",
    );
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(onLogin).toHaveBeenCalledWith({
        token: "a.b.c",
        role: "CUSTOMER",
        remember: true,
      }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/store");
  });
});
