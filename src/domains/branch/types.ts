export interface BranchResponse {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
}

export interface DeliverySlotResponse {
  id: number;
  branchId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export type DeliverySlotOption = {
  id: number;
  label: string;
};
