import { renderHook, act, waitFor } from "@testing-library/react";
import { useAsyncResource } from "./useAsyncResource";
import { toast } from "react-hot-toast";

vi.mock("react-hot-toast");

describe("useAsyncResource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and set data", async () => {
    const fetcher = vi.fn().mockResolvedValue([1, 2, 3]);
    const { result } = renderHook(() =>
      useAsyncResource(fetcher, { initialData: [] }),
    );
    await waitFor(() => {
      expect(result.current.data).toEqual([1, 2, 3]);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle fetch error and show toast", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() =>
      useAsyncResource(fetcher, { initialData: [], errorMessage: "err" }),
    );
    await waitFor(() => {
      expect(result.current.data).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("err");
    });
  });

  it("should call onError callback on error", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("fail"));
    const onError = vi.fn();
    renderHook(() => useAsyncResource(fetcher, { initialData: [], onError }));
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it("should refresh and update data", async () => {
    let value = 1;
    const fetcher = vi
      .fn()
      .mockImplementation(() => Promise.resolve([value++]));
    const { result } = renderHook(() =>
      useAsyncResource(fetcher, { initialData: [] }),
    );
    await waitFor(() => expect(result.current.data).toEqual([1]));
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.data).toEqual([2]);
  });
});
