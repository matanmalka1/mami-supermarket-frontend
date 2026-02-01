import React from "react";
import { MapPin, Trash2, Edit2 } from "lucide-react";
import Button from "@/components/ui/Button";
import IconBox from "@/components/ui/IconBox";

interface AddressCardProps {
  addr: any;
  setDefault: (id: number) => void;
  deleteAddress: (id: number) => void;
  onEdit?: (addr: any) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  addr,
  setDefault,
  deleteAddress,
  onEdit,
}) => {
  const fullAddress = [
    addr.address_line,
    addr.city,
    addr.postal_code,
    addr.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={`p-8 bg-white border-2 rounded-[2.5rem] shadow-sm space-y-6 relative overflow-hidden transition-all ${
        addr.is_default
          ? "border-emerald-500 ring-4 ring-emerald-50"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {addr.is_default && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-[2rem] text-[10px] uppercase tracking-widest">
          Default
        </div>
      )}
      <div className="flex gap-5 items-start">
        <IconBox
          size="xl"
          className="bg-gray-50 rounded-2xl text-gray-400 border"
        >
          <MapPin size={28} />
        </IconBox>
        <div className="flex-1 space-y-1">
          <h4 className="text-xl font-bold text-gray-900">
            {addr.label || "Address"}
          </h4>
          {fullAddress && (
            <p className="text-base text-gray-700 leading-relaxed">
              {fullAddress}
            </p>
          )}
          {addr.postal_code && (
            <p className="text-sm text-gray-400">{addr.postal_code}</p>
          )}
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
        <div className="ml-auto flex gap-2">
          {onEdit && (
            <IconBox
              size="sm"
              className="rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
              onClick={() => onEdit(addr)}
            >
              <Edit2 size={18} />
            </IconBox>
          )}
          <IconBox
            size="sm"
            className="rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            onClick={() => deleteAddress(addr.id)}
          >
            <Trash2 size={18} />
          </IconBox>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
