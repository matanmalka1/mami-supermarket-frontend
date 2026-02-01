import { render, screen } from "@testing-library/react";
import { RequestTypeInfo } from "@/features/ops/components/RequestTypeInfo";

describe("RequestTypeInfo", () => {
  it("shows descriptions for ADD_QUANTITY and SET_QUANTITY", () => {
    render(<RequestTypeInfo />);

    expect(screen.getByText(/ADD_QUANTITY:/)).toBeInTheDocument();
    expect(screen.getByText(/SET_QUANTITY:/)).toBeInTheDocument();
    expect(screen.getByText(/Increases current stock/i)).toBeInTheDocument();
    expect(screen.getByText(/Sets stock to exact specified amount/i)).toBeInTheDocument();
  });
});
