export type OrderTrackingStep = {
  id?: string;
  status: string;
  time?: string;
  done?: boolean;
};

export type OrderHistoryEntry = {
  id: number;
  orderNumber?: string;
  createdAt?: string;
  date?: string;
  total?: number;
  status?: string;
  tracking?: OrderTrackingStep[];
  address?: string;
};
