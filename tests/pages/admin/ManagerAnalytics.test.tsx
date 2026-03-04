import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ManagerAnalytics from "@/pages/admin/ManagerAnalytics";
import renderWithRouter from "../../render";

const { mockUseManagerAnalytics } = vi.hoisted(() => ({
  mockUseManagerAnalytics: vi.fn(),
}));

vi.mock("@/features/admin/hooks/useManagerAnalytics", () => ({
  useManagerAnalytics: () => mockUseManagerAnalytics(),
}));

describe("ManagerAnalytics", () => {
  beforeEach(() => {
    mockUseManagerAnalytics.mockReset();
  });

  it("renders stats once revenue series is fetched", async () => {
    mockUseManagerAnalytics.mockReturnValue({
      revenue: { labels: ["Jan", "Feb"], values: [1000, 1500] },
      status: "idle",
      errorMessage: "",
      loadRevenue: vi.fn(),
    });
    renderWithRouter(<ManagerAnalytics />);

    await waitFor(() =>
      expect(screen.getByText(/Revenue Velocity/i)).toBeInTheDocument(),
    );
  });

  it("shows error state and retries on demand", async () => {
    const loadRevenue = vi.fn();
    mockUseManagerAnalytics.mockReturnValue({
      revenue: { labels: [], values: [] },
      status: "error",
      errorMessage: "boom",
      loadRevenue,
    });
    renderWithRouter(<ManagerAnalytics />);

    await waitFor(() => expect(screen.getByText("boom")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
