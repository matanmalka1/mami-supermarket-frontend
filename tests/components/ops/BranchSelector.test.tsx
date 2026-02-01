import { fireEvent, render, screen } from "@testing-library/react";
import { BranchSelector } from "@/features/ops/components/BranchSelector";

describe("BranchSelector", () => {
  const branches = [
    { id: 1, name: "Central", address: "Main", isActive: true },
    { id: 2, name: "North", address: "North Ave", isActive: true },
  ];

  it("shows loading placeholder when loading true", () => {
    render(
      <BranchSelector
        branches={[]}
        selectedBranchId={0}
        onSelectBranch={vi.fn()}
        loading
      />,
    );

    expect(screen.getByText(/Loading branches/i)).toBeInTheDocument();
  });

  it("renders branch buttons and reports selection", () => {
    const handleSelect = vi.fn();
    render(
      <BranchSelector
        branches={branches}
        selectedBranchId={1}
        onSelectBranch={handleSelect}
        loading={false}
      />,
    );

    expect(screen.getByText("Central")).toBeInTheDocument();
    expect(screen.getByText("North")).toBeInTheDocument();

    fireEvent.click(screen.getByText("North"));
    expect(handleSelect).toHaveBeenCalledWith(2);
  });

  it("displays error text when provided", () => {
    render(
      <BranchSelector
        branches={branches}
        selectedBranchId={1}
        onSelectBranch={vi.fn()}
        loading={false}
        error="branch error"
      />,
    );

    expect(screen.getByText("branch error")).toBeInTheDocument();
  });
});
