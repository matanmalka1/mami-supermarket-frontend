import { renderHook, waitFor } from "@testing-library/react";
import { useCatalog } from "./useCatalog";
import { catalogService } from "@/domains/catalog/service";
import * as productsUtils from "@/utils/products";

vi.mock("@/domains/catalog/service", () => ({
  catalogService: {
    getProducts: vi.fn(),
  },
}));

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
    (catalogService.getProducts as any) = vi
      .fn()
      .mockResolvedValue(mockProducts);
    const { result } = renderHook(() => useCatalog());
    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should filter by category name", async () => {
    (catalogService.getProducts as any) = vi
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
    (catalogService.getProducts as any) = vi
      .fn()
      .mockResolvedValue(queryResponse);
    const { result } = renderHook(() => useCatalog(undefined, "milk"));
    await waitFor(() => {
      expect(result.current.products).toEqual(queryResponse);
      expect(catalogService.getProducts).toHaveBeenCalledWith({
        q: "milk",
      });
    });
  });

  it("should handle error gracefully", async () => {
    (catalogService.getProducts as any) = vi
      .fn()
      .mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useCatalog());
    await waitFor(() => {
      expect(result.current.products).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });
});
