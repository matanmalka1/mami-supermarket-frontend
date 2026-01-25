import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { apiService } from '@/services/api';

type OpsAlert = {
  id: string | number;
  text: string;
  type?: string;
  severity?: string;
  time?: string;
  createdAt?: string;
};

interface NotifDropdownProps {
  items: any[];
  onClose: () => void;
}

const NotifDropdown: React.FC<NotifDropdownProps> = ({ items, onClose }) => {
  const [alerts, setAlerts] = useState<OpsAlert[]>(items ?? []);
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
        setError(err.message || "Unable to load notifications");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

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
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Notifications</h4>
        <button onClick={onClose} className="text-[9px] font-black uppercase text-[#008A45] hover:underline">Close</button>
      </div>
      <div className="space-y-2">
        {loading ? (
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Loading notifications...</p>
        ) : error ? (
          <p className="text-xs font-bold text-red-500 uppercase tracking-tight">{error}</p>
        ) : alerts.length === 0 ? (
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">No new notifications at the moment.</p>
        ) : (
          alerts.map((n) => (
            <div key={n.id} className="p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-emerald-100 transition-all flex items-start gap-3">
               <div className="mt-0.5">
                 <CheckCircle2 size={14} className={n.type === 'success' ? 'text-emerald-500' : 'text-orange-500'} />
               </div>
               <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-900">{n.text}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase">{formatTime(n)}</p>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotifDropdown;
