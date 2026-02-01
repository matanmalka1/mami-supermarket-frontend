import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import IconBox from "@/components/ui/IconBox";
import { MapPin, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

interface StorefrontModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const farms = [
  {
    name: "Kfar Azar Orchards",
    location: "Central",
    specialty: "Citrus",
  },
  {
    name: "Golan Heights Artisans",
    location: "Northern",
    specialty: "Cheeses",
  },
];

const StorefrontModal: React.FC<StorefrontModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verified Local Producers"
      subtitle="Direct from Israeli soil"
    >
      <div className="py-6 space-y-4">
        {farms.map((farm) => (
          <div
            key={farm.name}
            className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-emerald-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <IconBox
                size="md"
                className="bg-white rounded-2xl text-emerald-600 shadow-sm"
              >
                <MapPin size={20} />
              </IconBox>
              <div>
                <h4 className="font-bold text-gray-900">{farm.name}</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {farm.location} • {farm.specialty}
                </p>
              </div>
            </div>
            <ChevronRight
              className="text-gray-300 group-hover:text-emerald-500 transition-all"
              size={20}
            />
          </div>
        ))}
        <Button
          fullWidth
          onClick={() => {
            onClose();
            navigate("/store/category/produce");
          }}
          className="mt-4 rounded-2xl"
        >
          View All Local Produce
        </Button>
      </div>
    </Modal>
  );
};

export default StorefrontModal;
