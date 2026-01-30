import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { vi } from "vitest";
import Checkout from "./Checkout";
import type { OrderSuccessSnapshot } from "@/domains/orders/types";

const {
  mockUseCheckoutProcess,
  mockNavigate,
  mockClearCart,
} = vi.hoisted(() => ({
  mockUseCheckoutProcess: vi.fn(),
  mockNavigate: vi.fn(),
  mockClearCart: vi.fn(),
}));

vi.mock("@/features/store/hooks/useCheckoutProcess", () => ({
  useCheckoutProcess: () => mockUseCheckoutProcess(),
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
  const snapshot = {
    orderId: "order-9",
    orderNumber: "order-9",
    fulfillmentType: "delivery",
    items: [
      { id: 1, name: "A", image: "", unit: "", price: 10, quantity: 1 },
    ],
    subtotal: 120,
    deliveryFee: 0,
    total: 120,
    estimatedDelivery: "Delivery window pending",
  } as OrderSuccessSnapshot;
  const confirmOrder = vi.fn().mockResolvedValue({
    orderId: "order-9",
    snapshot,
  });

  beforeEach(() => {
    mockUseCheckoutProcess.mockReset();
    mockNavigate.mockReset();
    mockClearCart.mockReset();
    confirmOrder.mockReset().mockResolvedValue({
      orderId: "order-9",
      snapshot,
    });
    mockUseCheckoutProcess.mockReturnValue({
      items: snapshot.items,
      total: 120,
      clearCart: mockClearCart,
      isAuthenticated: true,
      method: "DELIVERY",
      setMethod: vi.fn(),
      serverCartId: "cart-1",
      deliverySlots: [],
      slotId: null,
      setSlotId: vi.fn(),
      preview: { cart_total: 120, delivery_fee: 0 },
      selectedBranch: null,
      loading: false,
      error: null,
      setError: vi.fn(),
      confirmOrder,
    });
  });

  it("confirms and navigates after payment", async () => {
    render(
      <MemoryRouter initialEntries={["/store/checkout"]}>
        <Routes>
          <Route path="/store/checkout" element={<Checkout />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByText(/next to schedule/i));
    await userEvent.click(screen.getByText(/next to payment/i));
    await userEvent.click(screen.getByText(/confirm order/i));

    await waitFor(() => expect(confirmOrder).toHaveBeenCalled());
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/store/order-success/order-9", {
      state: { snapshot },
    });
  });
});
