import { CheckCircle2 } from "lucide-react";
import { useOpsAlerts } from "@/features/ops/hooks/useOpsAlerts";
import type { OpsAlert } from "@/domains/notifications/types";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface NotifDropdownProps {
  items?: OpsAlert[];
  onClose: () => void;
}

const NotifDropdown: React.FC<NotifDropdownProps> = ({ items, onClose }) => {
  const { alerts, loading, error } = useOpsAlerts(items);
  const formatTime = (alert: OpsAlert) =>
    alert.time ||
    (alert.createdAt
      ? new Date(alert.createdAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Just now");

  return (
    <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl p-4 animate-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400">
            Notifications
          </h4>
          <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">
            Coming Soon
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[9px] uppercase text-[#008A45] hover:underline"
        >
          Close
        </button>
      </div>
      <div className="space-y-2">
        {loading ? (
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
            Loading notifications...
          </p>
        ) : error ? (
          <ErrorMessage
            message={error}
            className="text-xs font-bold uppercase tracking-tight"
          />
        ) : alerts.length === 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
              No notifications yet.
            </p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Real-time notifications for order updates, promotions, and fresh
              arrivals will be available soon.
            </p>
          </div>
        ) : (
          alerts.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-emerald-100 transition-all flex items-start gap-3"
            >
              <div className="mt-0.5">
                <CheckCircle2
                  size={14}
                  className={
                    n.type === "success"
                      ? "text-emerald-500"
                      : "text-orange-500"
                  }
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-900">{n.text}</p>
                <p className="text-[9px] text-gray-400 uppercase">
                  {formatTime(n)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotifDropdown;
