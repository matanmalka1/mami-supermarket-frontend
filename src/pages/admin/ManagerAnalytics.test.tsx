import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ManagerAnalytics from "./ManagerAnalytics";
import renderWithRouter from "@/test/render";

const { mockGetRevenue } = vi.hoisted(() => ({
  mockGetRevenue: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    admin: {
      getRevenueAnalytics: mockGetRevenue,
    },
  },
}));

describe("ManagerAnalytics", () => {
  beforeEach(() => {
    mockGetRevenue.mockReset();
  });

  it("renders stats once revenue series is fetched", async () => {
    mockGetRevenue.mockResolvedValueOnce({
      data: { labels: ["Jan", "Feb"], values: [1000, 1500] },
    });
    renderWithRouter();

    await waitFor(() => expect(mockGetRevenue).toHaveBeenCalled());
    expect(screen.getByText(/Revenue Velocity/i)).toBeInTheDocument();
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Tracked Periods")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows error state and retries on demand", async () => {
    mockGetRevenue
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({ data: { labels: ["Mar"], values: [2000] } });
    renderWithRouter();

    await waitFor(() => expect(screen.getByText("boom")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() =>
      expect(screen.getByText(/Revenue Velocity/i)).toBeInTheDocument(),
    );
    expect(mockGetRevenue).toHaveBeenCalledTimes(2);
  });
});
