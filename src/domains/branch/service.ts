import { apiClient } from "@/services/api-client";
import type {
  BranchResponse,
  DeliverySlotResponse,
} from "./types";

const BRANCH_ENDPOINTS = {
  list: "/branches",
  deliverySlots: "/delivery-slots",
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
};
