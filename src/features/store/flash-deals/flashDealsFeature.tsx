import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { extractArrayPayload } from "@/utils/api-response";

export function useFlashDeals() {
  // Countdown timer
  const [secondsLeft, setSecondsLeft] = useState(2 * 3600 + 45 * 60 + 12);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await apiService.catalog.listFeaturedProducts({
          limit: 4,
        });
        setDeals(items);
      } catch (err: any) {
        setError(err.message || "Unable to load flash deals");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { secondsLeft, deals, loading, error };
}

export function formatSeconds(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
