import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import GlobalSettings from "./GlobalSettings";

const mockToast = { success: vi.fn(), error: vi.fn() };
const {
  mockUseGlobalSettings,
  mockHandleChange,
  mockSaveSettings,
} = vi.hoisted(() => ({
  mockUseGlobalSettings: vi.fn(),
  mockHandleChange: vi.fn(),
  mockSaveSettings: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({ toast: mockToast }));

vi.mock("@/features/admin/hooks/useGlobalSettings", () => ({
  useGlobalSettings: () => mockUseGlobalSettings(),
}));

vi.mock("@/components/ui/Button", () => ({
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

vi.mock("./SettingsField", () => ({
  default: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </label>
  ),
}));

vi.mock("./DangerZone", () => ({ default: () => null }));
vi.mock("@/components/ui/ConfirmDialog", () => ({ default: () => null }));

describe("GlobalSettings", () => {
  beforeEach(() => {
    mockUseGlobalSettings.mockReturnValue({
      form: { deliveryMin: 120, deliveryFee: 15, slots: "07:00-20:00" },
      loading: false,
      handleChange: mockHandleChange,
      saveSettings: mockSaveSettings,
      loadSettings: vi.fn(),
    });
    mockHandleChange.mockClear();
    mockSaveSettings.mockClear();
  });

  it("loads settings and updates with only allowed keys", async () => {
    render(<GlobalSettings />);

    await waitFor(() =>
      expect(screen.getByLabelText(/delivery minimum/i)).toHaveValue("120"),
    );

    await userEvent.clear(screen.getByLabelText(/delivery minimum/i));
    await userEvent.type(screen.getByLabelText(/delivery minimum/i), "180");
    await userEvent.clear(screen.getByLabelText(/delivery fee/i));
    await userEvent.type(screen.getByLabelText(/delivery fee/i), "25");
    await userEvent.clear(screen.getByLabelText(/slots window/i));
    await userEvent.type(screen.getByLabelText(/slots window/i), "08:00-22:00");

    await userEvent.click(screen.getByText(/publish global changes/i));

    await waitFor(() => expect(mockSaveSettings).toHaveBeenCalled());
    expect(mockSaveSettings).toHaveBeenCalledTimes(1);
    expect(mockSaveSettings).toHaveBeenCalledWith({
      deliveryMin: 180,
      deliveryFee: 25,
      slots: "08:00-22:00",
    });
  });
});
