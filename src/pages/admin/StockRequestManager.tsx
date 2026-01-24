import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Grid from "../../components/ui/Grid";
import {
  CheckCircle2,
  XCircle,
  Package,
  Search,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

const StockRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await apiService.admin.getStockRequests();
      setRequests(
        data || [
          {
            id: "1",
            product: "Organic Whole Milk 2L",
            qty: 400,
            priority: "CRITICAL",
            requester: "Sarah J.",
            time: "14m ago",
            status: "PENDING",
          },
          {
            id: "2",
            product: "Artisan Baguette",
            qty: 50,
            priority: "URGENT",
            requester: "Mike R.",
            time: "22m ago",
            status: "PENDING",
          },
          {
            id: "3",
            product: "Honey Crisp Apples",
            qty: 120,
            priority: "NORMAL",
            requester: "Elena P.",
            time: "1h ago",
            status: "RESOLVED",
          },
        ],
      );
    } catch {
      toast.error("Failed to load request queue");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, status: "APPROVED" | "REJECTED") => {
    toast.loading(`${status === "APPROVED" ? "Approving" : "Rejecting"}...`);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: status === "APPROVED" ? "RESOLVED" : "CANCELLED" }
            : r,
        ),
      );
      toast.dismiss();
      toast.success(`Request ${status.toLowerCase()} successfully`);
    }, 1000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter">
            Replenishment Queue
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
            Inventory Approvals • Central Branch
          </p>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
          <div className="flex flex-col">
            <span className="text-orange-500">12 Pending</span>
            <span className="text-gray-300">Requests</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col">
            <span>42 Resolved</span>
            <span className="text-gray-300">Today</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {requests.map((req) => (
          <div
            key={req.id}
            className={`bg-white border rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all hover:shadow-xl group overflow-hidden relative ${req.status === "PENDING" ? "border-orange-100" : "border-gray-50"}`}
          >
            {req.priority === "CRITICAL" && req.status === "PENDING" && (
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
            )}

            <div className="flex items-center gap-6">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-colors ${req.status === "PENDING" ? "bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-500 group-hover:text-white" : "bg-gray-50 text-gray-300 border-gray-100"}`}
              >
                <Package size={28} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-black italic text-gray-900">
                    {req.product}
                  </h4>
                  <Badge
                    color={
                      req.priority === "CRITICAL"
                        ? "red"
                        : req.priority === "URGENT"
                          ? "orange"
                          : "gray"
                    }
                  >
                    {req.priority}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {req.time}
                  </span>
                  <span>Requested by {req.requester}</span>
                  <span className="text-[#006666] font-black">
                    {req.qty} Units
                  </span>
                </div>
              </div>
            </div>

            {req.status === "PENDING" ? (
              <div className="flex gap-3">
                <button
                  onClick={() => handleResolve(req.id, "REJECTED")}
                  className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                >
                  Reject
                </button>
                <Button
                  variant="emerald"
                  className="px-10 py-3 rounded-xl h-auto"
                  onClick={() => handleResolve(req.id, "APPROVED")}
                >
                  Approve & Restock
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-emerald-500 font-black italic uppercase text-sm">
                <CheckCircle2 size={20} /> Request Fulfilled
              </div>
            )}
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
            <AlertCircle size={48} />
          </div>
          <p className="text-xl font-black italic text-gray-300">
            All inventory clusters are optimal.
          </p>
        </div>
      )}
    </div>
  );
};

export default StockRequestManager;
