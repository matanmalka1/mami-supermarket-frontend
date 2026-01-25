import { apiClient } from "./api-client";
import { BranchResponse, DeliverySlotResponse } from "@/types/branch";

export const branchService = {
  list: (params?: { limit?: number; offset?: number }) =>
    apiClient.get<BranchResponse[], BranchResponse[]>("/branches", { params }),
  listSlots: (params?: { branchId?: string; day?: number }) =>
    apiClient.get<DeliverySlotResponse[], DeliverySlotResponse[]>("/delivery-slots", { params }),
};
