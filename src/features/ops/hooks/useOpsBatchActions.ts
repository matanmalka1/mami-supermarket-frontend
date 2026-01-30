import { useCallback } from "react";
import { opsService } from "@/domains/ops/service";

export const useOpsBatchActions = () => {
  const createBatch = useCallback((orderIds: number[]) => {
    return opsService.createBatch(orderIds);
  }, []);

  return { createBatch };
};
