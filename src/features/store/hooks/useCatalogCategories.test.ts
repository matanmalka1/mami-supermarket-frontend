import { renderHook, waitFor } from "@testing-library/react";
import { useCatalogCategories } from "./useCatalogCategories";
import { catalogService } from "@/domains/catalog/service";

vi.mock("@/domains/catalog/service", () => ({
  catalogService: {
    listCategories: vi.fn(),
  },
}));

describe("useCatalogCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading true and empty categories", () => {
    const { result } = renderHook(() => useCatalogCategories());
    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("should set categories on successful fetch", async () => {
    (catalogService.listCategories as any) = vi
      .fn()
      .mockResolvedValue({ items: [{ id: 1, name: "A" }] });
    const { result } = renderHook(() => useCatalogCategories());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.categories).toEqual([{ id: 1, name: "A" }]);
      expect(result.current.error).toBeNull();
    });
  });

  it("should handle array response", async () => {
    (catalogService.listCategories as any) = vi
      .fn()
      .mockResolvedValue([{ id: 2, name: "B" }]);
    const { result } = renderHook(() => useCatalogCategories());
    await waitFor(() => {
      expect(result.current.categories).toEqual([{ id: 2, name: "B" }]);
    });
  });

  it("should set error on fetch failure", async () => {
    (catalogService.listCategories as any) = vi
      .fn()
      .mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useCatalogCategories());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.categories).toEqual([]);
      expect(result.current.error).toBe("fail");
    });
  });
});
