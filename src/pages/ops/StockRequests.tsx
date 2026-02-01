import React, { useState, useEffect } from "react";
import { Package, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import StockRequestForm from "@/features/ops/StockRequestForm";
import StockRequestHistory from "@/features/ops/StockRequestHistory";
import { stockRequestsService } from "@/domains/stock-requests/service";
import type { StockRequest } from "@/domains/stock-requests/types";

type Step = "FORM" | "HISTORY";

const StockRequests: React.FC = () => {
  const [step, setStep] = useState<Step>("FORM");
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await stockRequestsService.getMy();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch stock requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved" || r.status === "resolved").length,
    rejected: requests.filter((r) => r.status === "rejected" || r.status === "cancelled").length,
  };

  const handleSubmitted = () => {
    setStep("HISTORY");
    fetchRequests();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader
        title="Stock Requests"
        subtitle="Request inventory updates and track their status"
        actions={
          <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 rounded-2xl shadow-sm">
            <button
              onClick={() => setStep("FORM")}
              className={`px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all ${
                step === "FORM"
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package className="inline-block mr-2" size={16} />
              New Request
            </button>
            <button
              onClick={() => setStep("HISTORY")}
              className={`px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all ${
                step === "HISTORY"
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Clock className="inline-block mr-2" size={16} />
              My History
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Package size={24} className="opacity-80" />
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm opacity-90 uppercase tracking-wider">Total Requests</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Clock size={24} className="opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pending}</div>
            <div className="text-sm opacity-90 uppercase tracking-wider">Pending</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle size={24} className="opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.approved}</div>
            <div className="text-sm opacity-90 uppercase tracking-wider">Approved</div>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-xs font-bold">✕</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.rejected}</div>
            <div className="text-sm opacity-90 uppercase tracking-wider">Rejected</div>
          </div>
        </div>
      )}

      {/* Content */}
      {step === "FORM" ? (
        <StockRequestForm onSubmitted={handleSubmitted} />
      ) : (
        <div className="space-y-6">
          <StockRequestHistory />
          <Button
            variant="outline"
            className="w-full rounded-2xl h-14 text-base font-semibold border-2 hover:border-emerald-500 hover:text-emerald-600 transition-all"
            onClick={() => setStep("FORM")}
          >
            <Package className="inline-block mr-2" size={20} />
            Submit Another Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default StockRequests;
