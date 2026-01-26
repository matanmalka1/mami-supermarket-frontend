import { renderHook, act, waitFor } from "@testing-library/react";
import { useCheckoutFlow } from "./useCheckoutFlow";
import { useAuth } from "@/hooks/useAuth";
import { useBranchSelection } from "@/context/branch-context-core";
import { apiService } from "@/services/api";

vi.mock("@/hooks/useAuth");
vi.mock("@/context/branch-context-core");
vi.mock("@/services/api");

describe("useCheckoutFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (useBranchSelection as any).mockReturnValue({ selectedBranch: { id: 1 } });
    apiService.cart = { get: vi.fn().mockResolvedValue({ id: 123 }) } as any;
    apiService.branches = { listSlots: vi.fn().mockResolvedValue([]) } as any;
    apiService.checkout = {
      preview: vi.fn().mockResolvedValue({ total: 100 }),
    } as any;
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useCheckoutFlow());
    expect(result.current.method).toBe("DELIVERY");
    expect(result.current.serverCartId).toBeNull();
    expect(result.current.deliverySlots).toEqual([]);
    expect(result.current.slotId).toBeNull();
    expect(result.current.preview).toBeNull();
  });

  it("should reset serverCartId if unauthenticated", async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false });
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.serverCartId).toBeNull();
    });
  });

  it("should clear deliverySlots and slotId if no branch selected", async () => {
    (useBranchSelection as any).mockReturnValue({ selectedBranch: null });
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.deliverySlots).toEqual([]);
      expect(result.current.slotId).toBeNull();
    });
  });

  it("should update method and reset slotId", async () => {
    const { result } = renderHook(() => useCheckoutFlow());
    act(() => {
      result.current.setMethod("PICKUP");
    });
    expect(result.current.method).toBe("PICKUP");
    expect(result.current.slotId).toBeNull();
  });

  it("should update slotId when setSlotId is called", () => {
    const { result } = renderHook(() => useCheckoutFlow());
    act(() => {
      result.current.setSlotId(42);
    });
    expect(result.current.slotId).toBe(42);
  });

  it("should handle error when cart fetch fails", async () => {
    apiService.cart = {
      get: vi.fn().mockRejectedValue(new Error("fail")),
    } as any;
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.serverCartId).toBeNull();
    });
  });

  it("should handle error when slot fetch fails", async () => {
    apiService.branches = {
      listSlots: vi.fn().mockRejectedValue(new Error("fail")),
    } as any;
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.deliverySlots).toEqual([]);
    });
  });

  it("should handle error when preview fetch fails", async () => {
    apiService.checkout = {
      preview: vi.fn().mockRejectedValue(new Error("fail")),
    } as any;
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.preview).toBeNull();
    });
  });

  it("should set serverCartId after fetching cart", async () => {
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.serverCartId).toBe(123);
    });
  });

  it("should fetch delivery slots when branch changes", async () => {
    (apiService.branches.listSlots as any) = vi.fn().mockResolvedValue([
      { id: 1, startTime: "10:00", endTime: "12:00" },
      { id: 2, startTime: "12:00", endTime: "14:00" },
    ]);
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.deliverySlots.length).toBe(2);
    });
  });

  it("should set preview after fetching checkout preview", async () => {
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.preview).toEqual({ total: 100 });
    });
  });
});
