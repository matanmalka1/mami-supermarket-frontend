import { renderHook, waitFor } from "@testing-library/react";
import { useBranches } from "@/hooks/useBranches";
import { branchService } from "@/domains/branch/service";

vi.mock("@/domains/branch/service", () => ({
  branchService: {
    list: vi.fn(),
  },
}));

const mockedBranches = [
  { id: 1, name: "Central", address: "Main St", isActive: true },
  { id: 2, name: "North", address: "North Ave", isActive: true },
];

describe("useBranches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads branches and toggles loading flag", async () => {
    (branchService.list as vi.Mock).mockResolvedValue({ items: mockedBranches });

    const { result } = renderHook(() => useBranches());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.branches).toEqual(mockedBranches);
    expect(result.current.error).toBeNull();
    expect(branchService.list).toHaveBeenCalledWith({ limit: 50 });
  });

  it("handles errors gracefully", async () => {
    (branchService.list as vi.Mock).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useBranches());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.branches).toEqual([]);
    expect(result.current.error).toBe("boom");
  });
});
