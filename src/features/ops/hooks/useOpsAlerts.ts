import { useEffect, useState } from "react";
import { opsService } from "@/domains/ops/service";
import type { OpsAlert } from "@/domains/notifications/types";

export const useOpsAlerts = (initialAlerts?: OpsAlert[]) => {
  const [alerts, setAlerts] = useState<OpsAlert[]>(initialAlerts ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await opsService.getAlerts();
        if (!isMounted) return;
        setAlerts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || "Unable to load alerts");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  return { alerts, loading, error } as const;
};
