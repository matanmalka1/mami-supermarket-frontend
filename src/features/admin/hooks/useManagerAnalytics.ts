import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/domains/admin/service";
import type { RevenueData } from "@/pages/admin/components/analytics-utils";

export const useManagerAnalytics = () => {
  const [revenue, setRevenue] = useState<RevenueData>({ labels: [], values: [] });
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadRevenue = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await adminService.getRevenueAnalytics();
      const payload = (response as any)?.data ?? response;
      if (
        payload &&
        Array.isArray(payload.labels) &&
        Array.isArray(payload.values)
      ) {
        setRevenue({ labels: payload.labels, values: payload.values });
      } else {
        setRevenue({ labels: [], values: [] });
      }
      setStatus("idle");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to load analytics");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  return { revenue, status, errorMessage, loadRevenue };
};
