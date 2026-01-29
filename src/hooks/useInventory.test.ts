import { renderHook, act, waitFor } from "@testing-library/react";
import { useInventory } from "./useInventory";
import { apiService } from "@/services/api";
import { toast } from "react-hot-toast";

vi.mock("@/services/api");
vi.mock("react-hot-toast");

const mockInventory = [
  {
    id: 1,
    available_quantity: 5,
    reserved_quantity: 2,
    branch_id: 1,
    branch_name: "A",
    product_id: 1,
    product_name: "P",
    productSku: "SKU",
  },
];

const renderInventoryHook = async (
  response: any = { items: mockInventory },
) => {
  (apiService.admin.getInventory as any) = vi.fn().mockResolvedValue(response);
  const hook = renderHook(() => useInventory());
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  await waitFor(() =>
    expect(hook.result.current.inventory.length).toBeGreaterThan(0),
  );
  return hook;
};

describe("useInventory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and normalize inventory", async () => {
    const { result } = await renderInventoryHook();
    expect(result.current.inventory[0].id).toBe(1);
    expect(result.current.inventory[0].availableQuantity).toBe(5);
    expect(result.current.loading).toBe(false);
  });

  it("should handle array response", async () => {
    const { result } = await renderInventoryHook([mockInventory[0]]);
    expect(result.current.inventory.length).toBe(1);
  });

  it("should show error for invalid updateStock", async () => {
    const { result } = await renderInventoryHook();
    await act(async () => {
      await result.current.updateStock(1, -1);
    });
    expect(toast.error).toHaveBeenCalledWith(
      "Quantity must be a non-negative number",
    );
  });

  it("should update stock and show success", async () => {
    (apiService.admin.updateStock as any) = vi.fn().mockResolvedValue({});
    const { result } = await renderInventoryHook();
    await act(async () => {
      await result.current.updateStock(1, 10);
    });
    expect(apiService.admin.updateStock).toHaveBeenCalledWith(1, {
      availableQuantity: 10,
      reservedQuantity: 2,
    });
    expect(toast.success).toHaveBeenCalledWith("Stock level synchronized");
  });

  it("should show error if updateStock fails", async () => {
    (apiService.admin.updateStock as any) = vi
      .fn()
      .mockRejectedValue(new Error("fail"));
    const { result } = await renderInventoryHook();
    await act(async () => {
      await result.current.updateStock(1, 10);
    });
    expect(toast.error).toHaveBeenCalledWith("Sync failed");
  });
});
