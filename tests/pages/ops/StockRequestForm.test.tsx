import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StockRequestForm from "@/features/ops/StockRequestForm";
import { toast } from "react-hot-toast";

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
const toastMock = {
  loading: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
};
const createMock = vi.fn();

vi.mock("@/hooks/useBranches", () => ({
  useBranches: () => useBranchesMock(),
}));

vi.mock("@/features/store/hooks/useCatalog", () => ({
  useCatalog: () => useCatalogMock(),
}));

vi.mock("@/domains/stock-requests/service", () => ({
  stockRequestsService: {
    create: createMock,
  },
}));

vi.mock("react-hot-toast", () => ({
  toast: toastMock,
}));

describe("StockRequestForm", () => {
  beforeEach(() => {
    useBranchesMock.mockReturnValue({
      branches: branchesMockValue,
      loading: false,
      error: null,
    });
    useCatalogMock.mockReturnValue({
      products: productsMockValue,
      loading: false,
      refresh: refreshMock,
    });
    createMock.mockReset();
  });

  it("submits a stock request once a branch and product are selected", async () => {
    createMock.mockResolvedValue({});
    const onSubmitted = vi.fn();

    render(<StockRequestForm onSubmitted={onSubmitted} />);

    const submitButton = screen.getByRole("button", {
      name: /submit stock request/i,
    });
    expect(submitButton).toBeDisabled();

    const branchButton = screen.getByText("Central Branch").closest("button");
    expect(branchButton).not.toBeNull();
    fireEvent.click(branchButton!);

    const productButton = screen.getByRole("button", {
      name: /Super Rice/i,
    });
    fireEvent.click(productButton);

    expect(submitButton).toBeEnabled();
    expect(screen.getByText(/Request Summary/i)).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith({
        branch: "1",
        product: "101",
        quantity: 1,
        type: "ADD_QUANTITY",
      }),
    );

    expect(toast.loading).toHaveBeenCalledWith("Submitting stock request...", {
      id: "stock-req",
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Stock request submitted successfully!",
        { id: "stock-req" },
      ),
    );

    expect(onSubmitted).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByText(/Request Summary/i)).not.toBeInTheDocument(),
    );
  });

  it("shows an error toast when the service rejects", async () => {
    const rejection = new Error("service down");
    createMock.mockRejectedValueOnce(rejection);
    const onSubmitted = vi.fn();

    render(<StockRequestForm onSubmitted={onSubmitted} />);

    const branchButton = screen.getByText("Central Branch").closest("button");
    fireEvent.click(branchButton!);

    const productButton = screen.getByRole("button", {
      name: /Super Rice/i,
    });
    fireEvent.click(productButton);

    const submitButton = screen.getByRole("button", {
      name: /submit stock request/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(createMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("service down", {
        id: "stock-req",
      }),
    );
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it("filters the product list based on the search input", () => {
    render(<StockRequestForm onSubmitted={vi.fn()} />);

    expect(screen.getByText(/Super Rice/i)).toBeInTheDocument();
    expect(screen.getByText(/Green Beans/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "rice" } });

    expect(screen.getByText(/Super Rice/i)).toBeInTheDocument();
    expect(screen.queryByText(/Green Beans/i)).not.toBeInTheDocument();
  });
});
