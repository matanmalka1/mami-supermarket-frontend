import React from "react";
import Badge from "@/components/ui/Badge";
import { History, Shield, UserCheck } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { useAuditLogs } from "@/features/ops/hooks/useAuditLogs";

type AuditLog = {
  id: number;
  entityType: string;
  action: string;
  actorEmail?: string | null;
  actorUserId?: number | null;
  createdAt?: string;
  context?: Record<string, unknown>;
};

const formatTime = (value?: string) => {
  if (!value) return "Unknown time";
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? value : dt.toLocaleString();
};

const AuditLogs: React.FC = () => {
  const { logs, loading, error, hasMore, fetchLogs } = useAuditLogs();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-gray-900 tracking-tighter ">
            System Audit
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
            Historical activity & security logs
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <History size={20} className="text-[#006666]" />
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-900">
              Activity Timeline
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">
              Displaying last {logs.length} audit logs
            </p>
          </div>
        </div>
        {loading && logs.length === 0 ? (
          <LoadingState label="Synchronizing audit logs..." />
        ) : error ? (
          <EmptyState title="Audit log unavailable" description={error} />
        ) : logs.length === 0 ? (
          <EmptyState
            title="No audit records"
            description="System audit log is empty."
          />
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-3 rounded-xl transition-all group-hover:scale-110 bg-blue-50 text-blue-500">
                      {log.action?.toLowerCase().includes("login") ? (
                        <Shield size={20} />
                      ) : (
                        <UserCheck size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{log.action}</h4>
                      <p className="text-xs text-gray-400 font-medium">
                        {log.entityType} •{" "}
                        {log.actorEmail || log.actorUserId || "Unknown actor"} •{" "}
                        {formatTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="gray">{log.entityType}</Badge>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 text-center">
              <button
                onClick={() => fetchLogs(true)}
                disabled={loading || !hasMore}
                className="inline-flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest hover:text-[#006666] transition-colors disabled:opacity-50"
              >
                {hasMore ? "Load older entries" : "No more entries"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
