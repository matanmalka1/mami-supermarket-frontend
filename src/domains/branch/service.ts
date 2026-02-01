import { apiClient } from "@/services/api-client";
import type {
  BranchResponse,
  DeliverySlotResponse,
} from "./types";

const BRANCH_ENDPOINTS = {
  list: "/branches",
  deliverySlots: "/delivery-slots",
  deliverySource: "/branches/delivery-source",
};

export const branchService = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<BranchResponse[], BranchResponse[]>(BRANCH_ENDPOINTS.list, {
      params,
    }),
  listSlots: ({ branchId }: { branchId: string | number }) =>
    apiClient.get<DeliverySlotResponse[], DeliverySlotResponse[]>(
      BRANCH_ENDPOINTS.deliverySlots,
      { params: { branchId } },
    ),
  getDeliverySource: () =>
    apiClient.get<{ id: number; name: string }, { id: number; name: string }>(
      BRANCH_ENDPOINTS.deliverySource
    ),
};
