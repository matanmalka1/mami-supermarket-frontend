import { useCallback, useEffect, useState } from "react";
import { opsService } from "@/domains/ops/service";
import type { OpsPerformanceMetrics } from "@/domains/ops/types";

export const useOpsPerformance = () => {
  const [metrics, setMetrics] = useState<OpsPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await opsService.getPerformance();
      setMetrics(data as OpsPerformanceMetrics);
    } catch (err: any) {
      setError(err?.message || "Performance metrics unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { metrics, loading, error, refresh };
};
