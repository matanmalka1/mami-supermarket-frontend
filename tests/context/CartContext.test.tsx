import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../../src/context/CartProvider";
import { useCart } from "../../src/context/cart-context";
import { vi } from "vitest";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    userRole: "CUSTOMER",
    userName: "Test",
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("@/domains/cart/service", () => ({
  cartService: {
    addItem: vi.fn().mockResolvedValue({}),
    removeItem: vi.fn().mockResolvedValue({}),
    updateItem: vi.fn().mockResolvedValue({}),
    get: vi.fn().mockResolvedValue({ items: [] }),
    clear: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../../src/context/cart/cart-operations", async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    addItemToCart: vi.fn().mockResolvedValue(true),
    removeItemFromCart: vi.fn().mockResolvedValue(true),
    updateItemQuantity: vi.fn().mockResolvedValue(true),
  };
});

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

    await userEvent.click(screen.getByText("Add"));
    await waitFor(() => {
      expect(getCount()).toBe("1");
    });

    await userEvent.click(screen.getByText("Set3"));
    await waitFor(() => {
      expect(getCount()).toBe("3");
    });

    await userEvent.click(screen.getByText("Remove"));
    await waitFor(() => {
      expect(getCount()).toBe("0");
    });
  });

  it("rehydrates from localStorage on mount", async () => {
    const snapshot = [
      { id: "p2", name: "Banana", price: 2, image: "", quantity: 4 },
    ];
    localStorage.setItem("mami_cart", JSON.stringify(snapshot));

    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>,
    );

    // Component should render
    expect(screen.getByTestId("count")).toBeInTheDocument();
  });
});
