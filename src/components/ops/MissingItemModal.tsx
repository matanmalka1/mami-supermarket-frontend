// Added React import to resolve missing namespace errors
import React, { useState } from "react";
import { Search, ChevronDown, CheckCircle2 } from "lucide-react";
// Fix: Correct import path from common to ui
import Modal from "../ui/Modal";
// Fix: Correct import path from common to ui
import Button from "../ui/Button";
import { apiService } from "../../services/api";

interface MissingItemModalProps {
  itemId: string | null;
  onClose: () => void;
  onUpdateStatus: (
    itemId: string,
    status: string,
    reason: string,
    replacement?: any,
  ) => void;
  itemName?: string;
}

const MISSING_REASONS = [
  "Out of Stock",
  "Damaged / Expired",
  "Incorrect Price",
  "Location Empty",
  "Other",
];

const MissingItemModal: React.FC<MissingItemModalProps> = ({
  itemId,
  onClose,
  onUpdateStatus,
  itemName,
}) => {
  const [modalStep, setModalStep] = useState<"REASON" | "REPLACEMENT">(
    "REASON",
  );
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await apiService.catalog.getProducts({ q: searchQuery });
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setSearchResults(items);
    } finally {
      setLoading(false);
    }
  };

  const renderReasonStep = () => (
    <div className="space-y-2 p-2">
      {MISSING_REASONS.map((r) => (
        <button
          key={r}
          onClick={() => {
            setSelectedReason(r);
            setModalStep("REPLACEMENT");
          }}
          className="w-full text-left p-4 rounded-2xl hover:bg-red-50 hover:text-red-700 transition-all font-bold flex items-center justify-between border border-transparent hover:border-red-100"
        >
          {r} <ChevronDown size={18} className="text-gray-300 -rotate-90" />
        </button>
      ))}
    </div>
  );

  const renderReplacementStep = () => (
    <div className="space-y-4 p-2">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          autoFocus
          placeholder="Search catalog..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#006666]/20 transition-all"
        />
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </form>
      <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {loading ? (
          <div className="py-12 text-center text-gray-300 animate-pulse font-black uppercase tracking-widest">
            Searching...
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((p) => (
            <button
              key={p.id}
              onClick={() =>
                onUpdateStatus(itemId!, "MISSING", selectedReason!, p)
              }
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#006666] hover:bg-emerald-50/30 text-left group"
            >
              <img
                src={p.imageUrl}
                className="w-14 h-14 rounded-xl object-cover border"
                alt=""
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900 truncate">{p.name}</p>
              </div>
              <CheckCircle2
                size={18}
                className="text-gray-200 group-hover:text-[#006666]"
              />
            </button>
          ))
        ) : (
          searchQuery &&
          !loading && (
            <div className="py-12 text-center text-gray-400 font-bold">
              No alternatives found
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={!!itemId}
      onClose={onClose}
      title={modalStep === "REASON" ? "Report Shortage" : "Select Alternative"}
      subtitle={
        modalStep === "REASON"
          ? "Log why this item is unavailable"
          : `Finding replacement for ${itemName}`
      }
      footer={
        <div className="flex gap-3 w-full">
          {modalStep === "REPLACEMENT" && (
            <Button
              variant="ghost"
              onClick={() => setModalStep("REASON")}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          {modalStep === "REASON" && selectedReason && (
            <Button
              onClick={() =>
                onUpdateStatus(itemId!, "MISSING", selectedReason!)
              }
              className="flex-1"
            >
              Skip Alt
            </Button>
          )}
        </div>
      }
    >
      {modalStep === "REASON" ? renderReasonStep() : renderReplacementStep()}
    </Modal>
  );
};

export default MissingItemModal;
