import { renderHook, waitFor } from "@testing-library/react";
import { useCatalog } from "./useCatalog";
import { apiService } from "@/services/api";
import * as productsUtils from "@/utils/products";

vi.mock("@/services/api");

const mockProducts = [{ id: 1, name: "P1" }];

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

  it("should fetch by categoryId", async () => {
    (apiService.catalog.getProducts as any) = vi
      .fn()
      .mockResolvedValue([{ id: 2 }]);
    const { result } = renderHook(() => useCatalog(5));
    await waitFor(() => {
      expect(result.current.products).toEqual([{ id: 2 }]);
    });
  });

  it("should fetch by query", async () => {
    (apiService.catalog.getProducts as any) = vi
      .fn()
      .mockResolvedValue([{ id: 3 }]);
    const { result } = renderHook(() => useCatalog(undefined, "milk"));
    await waitFor(() => {
      expect(result.current.products).toEqual([{ id: 3 }]);
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
