import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { vi } from "vitest";
import Checkout from "./Checkout";

const { mockPreview, mockConfirm, mockNavigate, mockClearCart } = vi.hoisted(() => ({
  mockPreview: vi.fn(),
  mockConfirm: vi.fn(),
  mockNavigate: vi.fn(),
  mockClearCart: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    checkout: {
      preview: mockPreview,
      confirm: mockConfirm,
    },
  },
}));

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    items: [{ cart_id: "cart-1" }],
    total: 120,
    clearCart: mockClearCart,
  }),
}));

vi.mock("react-router", async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/components/checkout/CheckoutStepper", () => ({
  default: () => <div>Stepper</div>,
}));

vi.mock("@/components/checkout/FulfillmentStep", () => ({
  default: ({ onNext }: { onNext: (step: any) => void }) => (
    <button onClick={() => onNext("SCHEDULE")}>Next to Schedule</button>
  ),
}));

vi.mock("@/components/checkout/ScheduleStep", () => ({
  default: ({ onNext }: { onNext: (step: any) => void }) => (
    <button onClick={() => onNext("PAYMENT")}>Next to Payment</button>
  ),
}));

vi.mock("@/components/checkout/PaymentStep", () => ({
  default: ({ onConfirm }: { onConfirm: () => void }) => (
    <button onClick={onConfirm}>Confirm Order</button>
  ),
}));

describe("Checkout", () => {
  beforeEach(() => {
    mockPreview.mockResolvedValue({ cart_total: 120, delivery_fee: 0 });
    mockConfirm.mockResolvedValue({ order_id: "order-9" });
    mockNavigate.mockReset();
    mockClearCart.mockReset();
    mockPreview.mockClear();
    mockConfirm.mockClear();
  });

  it("calls preview on mount and confirm with idempotency key", async () => {
    render(
      <MemoryRouter initialEntries={["/store/checkout"]}>
        <Routes>
          <Route path="/store/checkout" element={<Checkout />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(mockPreview).toHaveBeenCalledWith({
        cart_id: "cart-1",
        fulfillment_type: "DELIVERY",
        delivery_slot_id: undefined,
      }),
    );

    await userEvent.click(screen.getByText(/next to schedule/i));
    await userEvent.click(screen.getByText(/next to payment/i));
    await userEvent.click(screen.getByText(/confirm order/i));

    await waitFor(() =>
      expect(mockConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          cart_id: "cart-1",
          fulfillment_type: "DELIVERY",
          payment_token_id: expect.any(Number),
        }),
        expect.any(String),
      ),
    );
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/store/order-success/order-9");
  });
});
