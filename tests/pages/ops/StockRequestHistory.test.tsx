import { render, screen } from "@testing-library/react";
import StockRequestHistory from "@/features/ops/StockRequestHistory";

describe("StockRequestHistory", () => {
  it("renders default items with badges", () => {
    render(<StockRequestHistory />);

    expect(screen.getByText(/Organic Milk 2L/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
    expect(screen.getByText(/Artisan Baguette/i)).toBeInTheDocument();
    expect(screen.getByText(/In Transit/i)).toBeInTheDocument();
  });

  it("renders passed items list", () => {
    const customItems = [
      {
        id: 999,
        title: "Special Cheese",
        sku: "SC-999",
        quantity: 5,
        status: "DELIVERED" as const,
        ago: "10 mins ago",
      },
    ];

    render(<StockRequestHistory items={customItems} />);

    expect(screen.getByText("Special Cheese")).toBeInTheDocument();
    expect(screen.getByText("SKU: SC-999")).toBeInTheDocument();
    expect(screen.getByText(/5 Units/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
  });
});
