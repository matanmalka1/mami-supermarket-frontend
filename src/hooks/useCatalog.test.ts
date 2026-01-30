import { renderHook, waitFor } from "@testing-library/react";
import { useCatalog } from "./useCatalog";
import { apiService } from "@/services/api";
import * as productsUtils from "@/utils/products";

vi.mock("@/services/api");

const mockProducts = [
  { id: 1, name: "P1", category: "Produce" },
  { id: 2, name: "P2", category: "Dairy" },
];

vi.spyOn(productsUtils, "normalizeProductList").mockImplementation(
  (x: any) => x,
);

describe("useCatalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all products by default", async () => {
    (apiService.catalog.getProducts as any) = vi
      .fn()
      .mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useCatalog());
    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should filter by category name", async () => {
    (apiService.catalog.getProducts as any) = vi
      .fn()
      .mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useCatalog(1));
    await waitFor(() => {
      expect(result.current.products).toEqual([
        { id: 1, name: "P1", category: "Produce" },
      ]);
    });
  });

  it("should fetch by query", async () => {
    const queryResponse = [{ id: 3, name: "P3" }];
    (apiService.catalog.getProducts as any) = vi
      .fn()
      .mockResolvedValue(queryResponse);
    const { result } = renderHook(() => useCatalog(undefined, "milk"));
    await waitFor(() => {
      expect(result.current.products).toEqual(queryResponse);
      expect(apiService.catalog.getProducts).toHaveBeenCalledWith({
        q: "milk",
      });
    });
  });

  it("should handle error gracefully", async () => {
    (apiService.catalog.getProducts as any) = vi
      .fn()
      .mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useCatalog());
    await waitFor(() => {
      expect(result.current.products).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });
});
