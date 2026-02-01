import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import { useAddresses } from "@/features/store/hooks/useAddresses";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import AddressCard from "@/pages/store/AddressCard";
import TextField from "@/components/ui/form/TextField";

const AddressBook: React.FC = () => {
  const {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
  } = useAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

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

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    updateAddress(editingAddress.id, {
      address_line: String(formData.get("street") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      postal_code: String(formData.get("postalCode") || "").trim(),
      country: String(formData.get("country") || "Israel").trim(),
    });
    setEditingAddress(null);
  };

  if (loading)
    return (
      <div className="py-40">
        <LoadingState label="Syncing address book..." />
      </div>
    );

  return (
    <div className="space-y-10">
      <PageHeader
        title="Addresses"
        subtitle="Manage your shipping nodes"
        actions={
          <Button
            variant="brand"
            icon={<Plus size={18} />}
            className="rounded-2xl h-14 px-8"
            onClick={() => setIsModalOpen(true)}
          >
            Add New
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onEdit={setEditingAddress}
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
            <TextField name="city" label="City" required />
            <TextField name="street" label="Street & House #" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField name="postalCode" label="Postal Code" required />
            <TextField
              name="country"
              label="Country"
              defaultValue="Israel"
              required
            />
          </div>
          <Button fullWidth size="lg" className="rounded-2xl" type="submit">
            Save Address
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        title="Edit Address"
      >
        <form onSubmit={handleEdit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="city"
              label="City"
              defaultValue={editingAddress?.city}
              required
            />
            <TextField
              name="street"
              label="Street & House #"
              defaultValue={editingAddress?.address_line}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="postalCode"
              label="Postal Code"
              defaultValue={editingAddress?.postal_code}
              required
            />
            <TextField
              name="country"
              label="Country"
              defaultValue={editingAddress?.country || "Israel"}
              required
            />
          </div>
          <Button fullWidth size="lg" className="rounded-2xl" type="submit">
            Update Address
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AddressBook;
