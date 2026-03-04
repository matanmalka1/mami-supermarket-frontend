import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StockRequestForm from "@/features/ops/StockRequestForm";

const branchesMockValue = [
  { id: 1, name: "Central Branch", address: "101 Main St", isActive: true },
];

const productsMockValue = [
  {
    id: 101,
    name: "Super Rice",
    sku: "SKU-101",
    category: "Pantry",
    price: 42,
    availableQuantity: 120,
    reservedQuantity: 0,
    status: "ACTIVE",
    imageUrl: "",
  },
  {
    id: 102,
    name: "Green Beans",
    sku: "SKU-102",
    category: "Produce",
    price: 18,
    availableQuantity: 70,
    reservedQuantity: 0,
    status: "ACTIVE",
    imageUrl: "",
  },
];

const useBranchesMock = vi.fn();
const useCatalogMock = vi.fn();
const refreshMock = vi.fn();
const toastMock = { loading: vi.fn(), success: vi.fn(), error: vi.fn() };

vi.mock("@/hooks/useBranches", () => ({ useBranches: () => useBranchesMock() }));
vi.mock("@/features/store/hooks/useCatalog", () => ({ useCatalog: () => useCatalogMock() }));
vi.mock("@/domains/stock-requests/service", () => ({ stockRequestsService: { create: vi.fn() } }));
vi.mock("react-hot-toast", () => ({ toast: toastMock }));

describe("StockRequestForm – behavior", () => {
  beforeEach(() => {
    useBranchesMock.mockReturnValue({ branches: branchesMockValue, loading: false, error: null });
    useCatalogMock.mockReturnValue({ products: productsMockValue, loading: false, refresh: refreshMock });
  });

  it("prevents submission when quantity is invalid", async () => {
    render(<StockRequestForm onSubmitted={vi.fn()} />);

    fireEvent.click(screen.getByText("Central Branch").closest("button")!);
    fireEvent.click(screen.getByRole("button", { name: /Super Rice/i }));

    fireEvent.change(screen.getByPlaceholderText("Enter quantity"), {
      target: { value: "0" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit stock request/i }));

    await waitFor(() =>
      expect(screen.getByText("Quantity must be at least 1")).toBeInTheDocument(),
    );
  });

  it("shows the SET action once the radio is selected", () => {
    render(<StockRequestForm onSubmitted={vi.fn()} />);

    fireEvent.click(screen.getByText("Central Branch").closest("button")!);
    fireEvent.click(screen.getByRole("button", { name: /Super Rice/i }));

    fireEvent.click(screen.getByRole("radio", { name: /SET QUANTITY/i }));

    expect(screen.getByText(/Set 1 units/i)).toBeInTheDocument();
  });

  it("filters the product list when typing a query", () => {
    render(<StockRequestForm onSubmitted={vi.fn()} />);

    expect(screen.getByText(/Super Rice/i)).toBeInTheDocument();
    expect(screen.getByText(/Green Beans/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search products..."), {
      target: { value: "rice" },
    });

    expect(screen.getByText(/Super Rice/i)).toBeInTheDocument();
    expect(screen.queryByText(/Green Beans/i)).not.toBeInTheDocument();
  });
});
