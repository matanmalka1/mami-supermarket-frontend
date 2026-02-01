import { render, screen } from "@testing-library/react";
import { RequestSummary } from "@/features/ops/components/RequestSummary";

const branch = { id: 1, name: "Central", address: "101 Main" } as const;
const product = { id: 10, name: "Cashews" } as const;

describe("RequestSummary", () => {
  it("renders branch, product, and action details", () => {
    render(
      <RequestSummary
        selectedBranch={branch}
        selectedProduct={product as any}
        requestType="ADD_QUANTITY"
        quantity={5}
      />,
    );

    expect(screen.getByText("Branch:")).toBeInTheDocument();
    expect(screen.getByText("Central")).toBeInTheDocument();
    expect(screen.getByText("Product:")).toBeInTheDocument();
    expect(screen.getByText("Cashews")).toBeInTheDocument();
    expect(screen.getByText(/Add 5 units/i)).toBeInTheDocument();
  });

  it("renders the SET verb when requestType is SET_QUANTITY", () => {
    render(
      <RequestSummary
        selectedBranch={branch}
        selectedProduct={product as any}
        requestType="SET_QUANTITY"
        quantity={2}
      />,
    );

    expect(screen.getByText(/Set 2 units/i)).toBeInTheDocument();
  });

  it("renders nothing when branch or product are missing", () => {
    const { container } = render(
      <RequestSummary
        selectedBranch={undefined}
        selectedProduct={undefined}
        requestType="ADD_QUANTITY"
        quantity={1}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
