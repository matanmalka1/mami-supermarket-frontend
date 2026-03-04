import { renderHook, act, waitFor } from "@testing-library/react";
import { useCheckoutFlow } from "../../src/features/store/hooks/useCheckoutFlow";
import { useAuth } from "@/hooks/useAuth";
import { useBranchSelection } from "@/context/branch-context-core";
import { cartService } from "@/domains/cart/service";
import { checkoutService } from "@/domains/checkout/service";
import { branchService } from "@/domains/branch/service";

vi.mock("@/hooks/useAuth");
vi.mock("@/context/branch-context-core");

describe("useCheckoutFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (useBranchSelection as any).mockReturnValue({ selectedBranch: { id: 1 } });
    vi.spyOn(cartService, "get").mockResolvedValue({ id: 123 } as any);
    (branchService as any).listSlots = vi.fn().mockResolvedValue([]);
    vi.spyOn(checkoutService, "preview").mockResolvedValue({
      total: 100,
    } as any);
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
    vi.spyOn(cartService, "get").mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.serverCartId).toBeNull();
    });
  });

  it("should handle error when slot fetch fails", async () => {
    (branchService as any).listSlots = vi
      .fn()
      .mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.deliverySlots).toEqual([]);
    });
  });

  it("should handle error when preview fetch fails", async () => {
    vi.spyOn(checkoutService, "preview").mockRejectedValue(new Error("fail"));
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

  it("should accept string cart IDs so preview still runs", async () => {
    vi.spyOn(cartService, "get").mockResolvedValue({ id: "cart-abc" } as any);
    const previewSpy = vi
      .spyOn(checkoutService, "preview")
      .mockResolvedValue({ total: 55 } as any);
    const { result } = renderHook(() => useCheckoutFlow());
    await waitFor(() => {
      expect(result.current.serverCartId).toBe("cart-abc");
    });
    await waitFor(() => {
      expect(previewSpy).toHaveBeenCalledWith(
        expect.objectContaining({ cartId: "cart-abc" }),
      );
    });
  });

  it("should fetch delivery slots when branch changes", async () => {
    const slots = [
      { id: 1, startTime: "10:00", endTime: "12:00" },
      { id: 2, startTime: "12:00", endTime: "14:00" },
    ];
    (branchService as any).listSlots = vi.fn().mockResolvedValue(slots);
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
