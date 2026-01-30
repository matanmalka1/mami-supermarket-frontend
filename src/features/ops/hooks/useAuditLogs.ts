import { useCallback, useEffect, useRef, useState } from "react";
import { adminService } from "@/domains/admin/service";
import { extractArrayPayload } from "@/utils/api-response";

export type AuditLog = {
  id: number;
  entityType: string;
  action: string;
  actorEmail?: string | null;
  actorUserId?: number | null;
  createdAt?: string;
  context?: Record<string, unknown>;
};

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const logsRef = useRef<AuditLog[]>([]);

  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

  const fetchLogs = useCallback(async (append = false) => {
    setLoading(true);
    setError(null);
    try {
      const offset = append ? logsRef.current.length : 0;
      const data = await adminService.getAuditLogs({
        limit: 20,
        offset,
      });
      const items = extractArrayPayload<AuditLog>(data);
      setLogs((prev) => (append ? [...prev, ...items] : items));
      setHasMore(items.length === 20);
    } catch (err: any) {
      setError(err?.message || "Failed to load audit logs");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(false);
  }, [fetchLogs]);

  return { logs, loading, error, hasMore, fetchLogs };
};
