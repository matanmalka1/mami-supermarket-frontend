import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { OpsAlert } from "@/types/ops";

const useOpsAlerts = (initialAlerts?: OpsAlert[]) => {
  const [alerts, setAlerts] = useState<OpsAlert[]>(initialAlerts ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.ops.getAlerts();
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

export default useOpsAlerts;
