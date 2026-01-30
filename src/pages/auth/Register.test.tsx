import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  mockLogin,
  mockNavigate,
  mockRegister,
  mockSendRegisterOtp,
  mockVerifyRegisterOtp,
} from "./testUtils";
import renderWithRouter from "@/test/render";
import Register from "./Register";

describe("Register", () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockLogin.mockReset();
    mockSendRegisterOtp.mockReset();
    mockVerifyRegisterOtp.mockReset();
    mockNavigate.mockReset();
  });

  it("submits full_name to register and stores token from login", async () => {
    mockRegister.mockResolvedValue({ ok: true });
    mockLogin.mockResolvedValue({ data: { access_token: "a.b.c", user: { role: "CUSTOMER" } } });
    mockSendRegisterOtp.mockResolvedValue({ message: "OTP sent" });
    mockVerifyRegisterOtp.mockResolvedValue({ message: "OTP verified" });
    const onRegister = vi.fn();

    renderWithRouter();

    await userEvent.type(screen.getByPlaceholderText("John"), "Jane");
    await userEvent.type(screen.getByPlaceholderText("Doe"), "Smith");
    await userEvent.type(screen.getByPlaceholderText("john@example.com"), "jane@example.com");
    await userEvent.type(screen.getByPlaceholderText("05X-XXXXXXX"), "0501234567");
    await userEvent.type(screen.getByPlaceholderText("Password"), "StrongPass1");
    await userEvent.click(screen.getByLabelText(/i agree/i));
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() =>
      expect(mockSendRegisterOtp).toHaveBeenCalledWith("jane@example.com"),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /complete setup/i }),
      ).toBeInTheDocument(),
    );

    // Move to OTP step
    await userEvent.type(screen.getAllByRole("textbox")[0], "1");
    await userEvent.type(screen.getAllByRole("textbox")[1], "2");
    await userEvent.type(screen.getAllByRole("textbox")[2], "3");
    await userEvent.type(screen.getAllByRole("textbox")[3], "4");
    await userEvent.click(screen.getByRole("button", { name: /complete setup/i }));

    await waitFor(() =>
      expect(mockVerifyRegisterOtp).toHaveBeenCalledWith({
        email: "jane@example.com",
        code: "1234",
      }),
    );

    expect(mockRegister).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "StrongPass1",
      full_name: "Jane Smith",
    });
    await waitFor(() =>
      expect(onRegister).toHaveBeenCalledWith({
        token: "a.b.c",
        role: "CUSTOMER",
        remember: false,
      }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/store");
  });
});
