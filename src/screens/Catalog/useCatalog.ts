import { useCallback } from "react";
import { apiService } from "@/services/api";
import type { Product } from "@/types/domain";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { normalizeProductList } from "@/utils/products";

// ...existing code...
