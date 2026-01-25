export interface BranchResponse {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface DeliverySlotResponse {
  id: string;
  branchId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export type DeliverySlotOption = {
  id: string;
  label: string;
};
