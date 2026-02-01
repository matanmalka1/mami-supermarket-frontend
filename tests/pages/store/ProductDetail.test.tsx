import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ProductDetail from "@/pages/store/ProductDetail";
import { Routes, Route } from "react-router";
import renderWithRouter from "../../render";

const { mockUseProductDetail } = vi.hoisted(() => ({
  mockUseProductDetail: vi.fn(),
}));

vi.mock("@/features/store/hooks/useProductDetail", () => ({
  useProductDetail: (id?: number) => mockUseProductDetail(id),
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
    mockUseProductDetail.mockReset();
  });

  it("loads product by id param and renders name", async () => {
    mockUseProductDetail.mockReturnValue({
      product: {
        id: 123,
        name: "Test Product",
        category: "Produce",
        price: 10,
        imageUrl: "image.jpg",
      },
      loading: false,
      error: null,
    });

    renderWithRouter(
      <Routes>
        <Route path="/store/product/:id" element={<ProductDetail />} />
      </Routes>,
      { route: "/store/product/123" },
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
    expect(mockUseProductDetail).toHaveBeenCalledWith(123);
  });
});
