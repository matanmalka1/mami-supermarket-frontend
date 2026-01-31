import React, { useState } from "react";
import { MapPin, Plus, Trash2, Navigation, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAddresses } from "@/features/store/hooks/useAddresses";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import AddressCard from "@/pages/store/AddressCard";

const AddressBook: React.FC = () => {
  const {
    addresses,
    loading,
    addAddress,
    deleteAddress,
    tagCurrentLocation,
    setDefault,
  } = useAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    addAddress({
      address_line: String(formData.get("street") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      postal_code: String(formData.get("postalCode") || "").trim(),
      country: String(formData.get("country") || "Israel").trim(),
      is_default: addresses.length === 0,
    });
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <div className="py-40">
        <LoadingState label="Syncing address book..." />
      </div>
    );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-5xl  text-gray-900 tracking-tighter">
            Addresses
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Manage your shipping nodes
          </p>
        </div>
        <Button
          variant="emerald"
          icon={<Plus size={18} />}
          className="rounded-2xl h-14 px-8"
          onClick={() => setIsModalOpen(true)}
        >
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={tagCurrentLocation}
          className="col-span-full bg-emerald-50/50 border-2 border-dashed border-emerald-200 p-10 rounded-[2.5rem] flex items-center justify-center gap-4 text-emerald-700  hover:bg-emerald-100/50 transition-all group"
        >
          <Navigation size={24} className="group-hover:animate-pulse" />
          <span className="text-xl">Tag My Current Location</span>
        </button>
        {addresses.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No addresses saved"
              description="Add your first delivery address to speed up checkout."
            />
          </div>
        ) : (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              setDefault={setDefault}
              deleteAddress={deleteAddress}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Delivery Node"
      >
        <form onSubmit={handleAdd} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="city"
              required
              placeholder="City"
              className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
            />
            <input
              name="street"
              required
              placeholder="Street & House #"
              className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="postalCode"
              required
              placeholder="Postal Code"
              className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
            />
            <input
              name="country"
              defaultValue="Israel"
              required
              placeholder="Country"
              className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold"
            />
          </div>
          <Button fullWidth size="lg" className="rounded-2xl" type="submit">
            Save Address
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AddressBook;
