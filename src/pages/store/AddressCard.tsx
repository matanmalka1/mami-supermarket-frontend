import React from "react";
import { MapPin, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface AddressCardProps {
  addr: any;
  setDefault: (id: number) => void;
  deleteAddress: (id: number) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ addr, setDefault, deleteAddress }) => (
  <div
    className={`p-8 bg-white border-2 rounded-[2.5rem] shadow-sm space-y-6 relative overflow-hidden transition-all ${addr.is_default ? "border-emerald-500 ring-4 ring-emerald-50" : "border-gray-100 hover:border-gray-200"}`}
  >
    {addr.is_default && (
      <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-[2rem] text-[10px] uppercase tracking-widest">
        Default
      </div>
    )}
    <div className="flex gap-5 items-start">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border">
        <MapPin size={28} />
      </div>
      <div>
        <h4 className="text-2xl  text-gray-900">
          {addr.address_line || "Address"}
        </h4>
        <p className="text-sm font-bold text-gray-500">
          {addr.city}, {addr.country || "Israel"} {addr.postal_code ? `• ${addr.postal_code}` : ""}
        </p>
      </div>
    </div>
    <div className="flex gap-3 pt-4 border-t border-gray-50">
      {!addr.is_default && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs uppercase"
          onClick={() => setDefault(addr.id)}
        >
          Set Default
        </Button>
      )}
      <button
        onClick={() => deleteAddress(addr.id)}
        className="ml-auto w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export default AddressCard;
