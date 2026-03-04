import { renderHook, waitFor } from "@testing-library/react";
import { useAllProducts } from "@/features/ops/hooks/useAllProducts";
import { adminService } from "@/domains/admin/service";

vi.mock("@/domains/admin/service", () => ({
  adminService: {
    getProducts: vi.fn(),
  },
}));

const mockProducts = [
  { id: 1, name: "Stored Rice", category: "Pantry" },
  { id: 2, name: "Organic Milk", category: "Dairy" },
];

describe("useAllProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads product list and toggles loading flag", async () => {
    (adminService.getProducts as any).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useAllProducts());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Eventually completes
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("captures the error message if loading fails", async () => {
    const error = new Error("backend failure");
    (adminService.getProducts as any).mockRejectedValue(error);

    const { result } = renderHook(() => useAllProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("backend failure");
    });
  });
});
