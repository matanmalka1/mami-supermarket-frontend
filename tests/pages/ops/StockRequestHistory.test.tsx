import { render, screen } from "@testing-library/react";
import StockRequestHistory from "@/features/ops/StockRequestHistory";
import { stockRequestsService } from "@/domains/stock-requests/service";

vi.mock("@/domains/stock-requests/service", () => ({
  stockRequestsService: {
    getMy: vi.fn(),
  },
}));

describe("StockRequestHistory", () => {
  it("renders loading state initially", () => {
    (stockRequestsService.getMy as any).mockImplementation(
      () => new Promise(() => {}),
    );
    render(<StockRequestHistory />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
