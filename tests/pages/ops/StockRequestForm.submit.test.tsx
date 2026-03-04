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
];

const useBranchesMock = vi.fn();
const useCatalogMock = vi.fn();
const refreshMock = vi.fn();
const createMock = vi.fn();
const toastMock = { loading: vi.fn(), success: vi.fn(), error: vi.fn() };

vi.mock("@/hooks/useBranches", () => ({
  useBranches: () => useBranchesMock(),
}));

vi.mock("@/features/store/hooks/useCatalog", () => ({
  useCatalog: () => useCatalogMock(),
}));

vi.mock("@/domains/stock-requests/service", () => ({
  stockRequestsService: { create: createMock },
}));

vi.mock("react-hot-toast", () => ({ toast: toastMock }));

describe("StockRequestForm – submission", () => {
  beforeEach(() => {
    useBranchesMock.mockReturnValue({ branches: branchesMockValue, loading: false, error: null });
    useCatalogMock.mockReturnValue({ products: productsMockValue, loading: false, refresh: refreshMock });
    createMock.mockReset();
  });

  it("submits when branch and product are chosen", async () => {
    createMock.mockResolvedValue({});
    const onSubmitted = vi.fn();

    render(<StockRequestForm onSubmitted={onSubmitted} />);

    const submitButton = screen.getByRole("button", { name: /submit stock request/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByText("Central Branch").closest("button")!);
    fireEvent.click(screen.getByRole("button", { name: /Super Rice/i }));

    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith({
        branch: "1",
        product: "101",
        quantity: 1,
        type: "ADD_QUANTITY",
      }),
    );

    expect(toast.loading).toHaveBeenCalledWith("Submitting stock request...", { id: "stock-req" });
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Stock request submitted successfully!", { id: "stock-req" }),
    );
    expect(onSubmitted).toHaveBeenCalled();
  });

  it("shows an error toast when creation fails", async () => {
    const rejection = new Error("service down");
    createMock.mockRejectedValueOnce(rejection);
    render(<StockRequestForm onSubmitted={vi.fn()} />);

    fireEvent.click(screen.getByText("Central Branch").closest("button")!);
    fireEvent.click(screen.getByRole("button", { name: /Super Rice/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit stock request/i }));

    await waitFor(() => expect(createMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("service down", { id: "stock-req" }),
    );
  });
});
