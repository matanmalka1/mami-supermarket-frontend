import { fireEvent, render, screen } from "@testing-library/react";
import { ProductSelector } from "@/features/ops/components/ProductSelector";
import type { Product } from "@/domains/catalog/types";

describe("ProductSelector", () => {
  const products: Product[] = [
    { id: 1, name: "Rice", sku: "R", category: "Pantry", price: 10, availableQuantity: 5, reservedQuantity: 0, status: "ACTIVE", imageUrl: "", binLocation: "A1", description: "", unit: "kg" },
    { id: 2, name: "Beans", sku: "B", category: "Pantry", price: 5, availableQuantity: 3, reservedQuantity: 0, status: "ACTIVE", imageUrl: "", binLocation: "B1", description: "", unit: "kg" },
  ];

  it("shows loading state when loading flag is true", () => {
    render(
      <ProductSelector
        products={[]}
        selectedProductId={0}
        onSelectProduct={vi.fn()}
        searchValue=""
        onSearchChange={vi.fn()}
        loading
      />,
    );

    expect(screen.getByText(/Loading products\.\.\./i)).toBeInTheDocument();
  });

  it("renders product options and handles selection", () => {
    const onSelect = vi.fn();
    render(
      <ProductSelector
        products={products}
        selectedProductId={0}
        onSelectProduct={onSelect}
        searchValue=""
        onSearchChange={vi.fn()}
        loading={false}
      />,
    );

    expect(screen.getByText("Rice")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Rice/i }));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("filters items based on search change event", () => {
    const onSearchChange = vi.fn();
    render(
      <ProductSelector
        products={products}
        selectedProductId={0}
        onSelectProduct={vi.fn()}
        searchValue=""
        onSearchChange={onSearchChange}
        loading={false}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search products..."), {
      target: { value: "beans" },
    });

    expect(onSearchChange).toHaveBeenCalledWith("beans");
  });
});
