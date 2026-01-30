import { useEffect, useState } from "react";
import { catalogService } from "@/domains/catalog/service";
import type { Product } from "@/domains/catalog/types";
import { addRecentlyViewedItem } from "@/features/store/recently-viewed/utils/recentlyViewed";

type ProductDetailState = {
  product: Product | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProductDetailState = {
  product: null,
  loading: false,
  error: null,
};

export const useProductDetail = (productId?: number) => {
  const [state, setState] = useState<ProductDetailState>(initialState);

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) {
      setState({ product: null, loading: false, error: null });
      return;
    }

    let active = true;
    const fetchProduct = async () => {
      setState({ product: null, loading: true, error: null });
      try {
        const data = await catalogService.getProduct(productId);
        if (!active) return;
        setState({ product: data, loading: false, error: null });
        addRecentlyViewedItem({
          id: data.id,
          name: data.name,
          category: data.category,
          price: data.price,
          image: data.imageUrl,
          oldPrice: data.oldPrice,
          unit: data.unit,
        });
      } catch (err: any) {
        if (!active) return;
        setState({
          product: null,
          loading: false,
          error: err.message || "Failed to load product",
        });
      }
    };

    fetchProduct();
    return () => {
      active = false;
    };
  }, [productId]);

  return state;
};
