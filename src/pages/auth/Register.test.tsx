import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Register from "./Register";
import renderWithRouter from "@/test/render";

const { mockRegister, mockLogin, mockNavigate } = vi.hoisted(() => ({
  mockRegister: vi.fn(),
  mockLogin: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    auth: {
      register: mockRegister,
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

describe("Register", () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  it("submits full_name to register and stores token from login", async () => {
    mockRegister.mockResolvedValue({ ok: true });
    mockLogin.mockResolvedValue({ data: { access_token: "jwt-reg", user: { role: "USER" } } });
    const onRegister = vi.fn();

    renderWithRouter({
      route: "/register",
      path: "/register",
      element: <Register onRegister={onRegister} />,
    });

    await userEvent.type(screen.getByPlaceholderText("John"), "Jane");
    await userEvent.type(screen.getByPlaceholderText("Doe"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("john@example.com"), "jane@example.com");
    await userEvent.type(screen.getByPlaceholderText("05X-XXXXXXX"), "0501234567");
    await userEvent.type(screen.getByPlaceholderText("Password"), "StrongPass1");
    await userEvent.click(screen.getByLabelText(/i agree/i));
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Move to OTP step
    await userEvent.type(screen.getAllByRole("textbox")[0], "1");
    await userEvent.type(screen.getAllByRole("textbox")[1], "2");
    await userEvent.type(screen.getAllByRole("textbox")[2], "3");
    await userEvent.type(screen.getAllByRole("textbox")[3], "4");
    await userEvent.click(screen.getByRole("button", { name: /complete setup/i }));

    await waitFor(() => expect(sessionStorage.getItem("mami_token")).toBe("jwt-reg"));
    expect(mockRegister).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "StrongPass1",
      full_name: "Jane Smith",
    });
    expect(onRegister).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/store");
  });
});
