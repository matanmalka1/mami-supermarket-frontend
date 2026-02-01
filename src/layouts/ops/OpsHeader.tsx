import { useState } from "react";
import { Bell, Settings2, AlertTriangle, Info } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import { Link } from "react-router";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useOpsAlerts } from "@/features/ops/hooks/useOpsAlerts";
import type { OpsAlert } from "@/domains/notifications/types";

const OpsHeader: React.FC = () => {
  const [showNotifs, setShowNotifs] = useState(false);
  const { alerts, loading: alertsLoading, error: alertsError } = useOpsAlerts();
  const hasAlerts = alerts.length > 0;
  const formatAlertTime = (alert: OpsAlert) =>
    alert.time ||
    (alert.createdAt
      ? new Date(alert.createdAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Just now");
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <SearchInput
          variant="ops"
          placeholder="Search orders, SKU, or customers..."
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative p-2 rounded-xl transition-all group ${showNotifs ? "text-[#006666] bg-emerald-50" : "text-gray-400 hover:text-[#006666] hover:bg-emerald-50"}`}
          >
            <Bell size={22} />
            {hasAlerts && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-5 z-[60] animate-in slide-in-from-top-2">
              <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 px-1">
                Operational Alerts
              </h4>
              <div className="space-y-3">
                {alertsLoading ? (
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                    Loading alerts...
                  </p>
                ) : alertsError ? (
                  <ErrorMessage
                    message={alertsError}
                    className="text-xs font-bold text-red-500 uppercase tracking-tight"
                  />
                ) : alerts.length === 0 ? (
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                    No alerts available.
                  </p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-teal-100 flex items-start gap-3 transition-all cursor-default"
                    >
                      {alert.type === "alert" ? (
                        <AlertTriangle
                          size={14}
                          className="text-red-500 mt-0.5"
                        />
                      ) : (
                        <Info size={14} className="text-blue-500 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900 leading-tight">
                          {alert.text}
                        </p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-tight">
                          {formatAlertTime(alert)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          to="/admin/settings"
          className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all"
        >
          <Settings2 size={22} />
        </Link>
      </div>
    </header>
  );
};

export default OpsHeader;
