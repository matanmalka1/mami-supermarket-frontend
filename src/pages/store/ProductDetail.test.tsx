import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ProductDetail from "./ProductDetail";
import renderWithRouter from "@/test/render";

const { mockGetProduct, mockGetProducts } = vi.hoisted(() => ({
  mockGetProduct: vi.fn(),
  mockGetProducts: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    catalog: {
      getProduct: mockGetProduct,
      getProducts: mockGetProducts,
    },
  },
}));

vi.mock("@/components/store/ProductGallery", () => ({
  default: () => <div data-testid="gallery" />,
}));

vi.mock("@/components/store/ProductInfo", () => ({
  default: ({ product }: { product: { name?: string } }) => (
    <div>{product?.name}</div>
  ),
}));

vi.mock("@/components/store/ProductTabs", () => ({
  default: () => <div data-testid="tabs" />,
}));

describe("ProductDetail", () => {
  beforeEach(() => {
    mockGetProduct.mockReset();
    mockGetProducts.mockReset();
  });

  it("loads product by id param and renders name", async () => {
    mockGetProduct.mockResolvedValue({ id: 123, name: "Test Product" });
    mockGetProducts.mockResolvedValue([]);

    renderWithRouter({
      route: "/store/product/123",
      path: "/store/product/:id",
      element: <ProductDetail />,
    });

    expect(screen.getByText(/gathering product details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
    expect(mockGetProduct).toHaveBeenCalledWith(123);
  });
});
