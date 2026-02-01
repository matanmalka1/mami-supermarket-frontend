import React from "react";
import { ShieldAlert, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

type Props = {
  onSuspend: () => void;
  onFlush: () => void;
};

const DangerZone: React.FC<Props> = ({ onSuspend, onFlush }) => (
  <section className="bg-red-50 border border-red-100 rounded-[2.5rem] p-10 space-y-8">
    <h3 className="text-xl  flex items-center gap-3 text-red-600">
      <ShieldAlert size={22} /> Danger Zone
    </h3>
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full bg-white text-red-600 border-red-200 hover:bg-red-500 hover:text-white h-14 rounded-2xl "
        onClick={onSuspend}
      >
        Suspend Global Catalog
      </Button>
      <Button
        variant="outline"
        className="w-full bg-white text-gray-600 border-gray-200 hover:bg-gray-100 h-14 rounded-2xl flex items-center gap-2"
        onClick={onFlush}
      >
        <Trash2 size={16} /> Flush Session Cache
      </Button>
    </div>
  </section>
);

export default DangerZone;
