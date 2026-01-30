import { apiClient } from "@/services/api-client";
import type {
  BranchResponse,
  DeliverySlotResponse,
} from "./types";

const BRANCH_ENDPOINTS = {
  list: "/branches",
  slots: (branchId: string | number) => `/branches/${branchId}/slots`,
};

const toBranchList = (payload: any): BranchResponse[] =>
  Array.isArray(payload) ? payload : [];

export const branchService = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get<BranchResponse[], BranchResponse[]>(BRANCH_ENDPOINTS.list, {
      params,
    }),
  listSlots: ({ branchId }: { branchId: string | number }) =>
    apiClient.get<DeliverySlotResponse[], DeliverySlotResponse[]>(
      BRANCH_ENDPOINTS.slots(branchId),
    ),
};
