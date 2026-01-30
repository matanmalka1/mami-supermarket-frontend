import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "./CartContext";
import { useCart } from "./cart-context";
import { vi } from "vitest";

const { mockToast } = vi.hoisted(() => ({
  mockToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("react-hot-toast", () => ({ toast: mockToast }));

const CartHarness = () => {
  const { items, total, addItem, updateQuantity, removeItem } = useCart();
  return (
    <div>
      <div data-testid="count">{items.reduce((s, i) => s + i.quantity, 0)}</div>
      <div data-testid="total">{total}</div>
      <button
        onClick={() =>
          addItem({ id: "p1", name: "Apple", price: 5, image: "" })
        }
      >
        Add
      </button>
      <button onClick={() => updateQuantity("p1", 3)}>Set3</button>
      <button onClick={() => removeItem("p1")}>Remove</button>
    </div>
  );
};

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockToast.success.mockReset();
    mockToast.error.mockReset();
  });

  it("adds, updates, removes items and persists to localStorage", async () => {
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>,
    );

    const getCount = () => screen.getByTestId("count").textContent;
    const getTotal = () => screen.getByTestId("total").textContent;

    await userEvent.click(screen.getByText("Add"));
    expect(getCount()).toBe("1");
    expect(getTotal()).toBe("5");
    expect(JSON.parse(localStorage.getItem("mami_cart") || "[]")).toHaveLength(
      1,
    );

    await userEvent.click(screen.getByText("Set3"));
    expect(getCount()).toBe("3");
    expect(getTotal()).toBe("15");

    await userEvent.click(screen.getByText("Remove"));
    expect(getCount()).toBe("0");
    expect(getTotal()).toBe("0");
    expect(JSON.parse(localStorage.getItem("mami_cart") || "[]")).toHaveLength(
      0,
    );
  });

  it("rehydrates from localStorage on mount", async () => {
    const snapshot = [{ id: "p2", name: "Banana", price: 2, image: "", quantity: 4 }];
    localStorage.setItem("mami_cart", JSON.stringify(snapshot));

    const { unmount } = render(
      <CartProvider>
        <CartHarness />
      </CartProvider>,
    );

    expect(screen.getByTestId("count").textContent).toBe("4");
    expect(screen.getByTestId("total").textContent).toBe("8");

    unmount();
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>,
    );
    expect(screen.getByTestId("count").textContent).toBe("4");
    expect(screen.getByTestId("total").textContent).toBe("8");
  });
});
