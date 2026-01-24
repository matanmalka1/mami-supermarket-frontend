import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const NewSkuModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Initialize New SKU"
    subtitle="Global Product Registry Enrollment"
  >
    <form
      className="space-y-6 py-4"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("SKU Draft Created");
        onClose();
      }}
    >
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Product Name
        </label>
        <input
          required
          placeholder="e.g. Organic Avocados"
          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Category
          </label>
          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold appearance-none">
            <option>Produce</option>
            <option>Dairy</option>
            <option>Bakery</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Initial Stock
          </label>
          <input
            type="number"
            required
            placeholder="0"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold"
          />
        </div>
      </div>
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start gap-4">
        <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
        <p className="text-xs font-bold text-emerald-800/70 leading-relaxed italic">
          System will automatically assign a unique SKU and bin location based on the selected category density.
        </p>
      </div>
      <Button fullWidth size="lg" className="rounded-2xl h-16">
        Register SKU
      </Button>
    </form>
  </Modal>
);

export default NewSkuModal;
