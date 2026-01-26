import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.profile.getAddresses();
      setAddresses(data || []);
    } catch {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (address: {
    address_line: string;
    city: string;
    postal_code: string;
    country: string;
    is_default: boolean;
  }) => {
    if (!address.address_line || !address.city || !address.postal_code || !address.country) {
      toast.error("All address fields are required");
      return;
    }
    try {
      const saved = await apiService.profile.addAddress(address);
      setAddresses((prev) => [
        ...prev,
        saved || { ...address, id: Date.now() },
      ]);
      toast.success("Address added");
    } catch {
      toast.error("Failed to save");
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await apiService.profile.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove address");
    }
  };

  const tagCurrentLocation = () => {
    toast.loading("Accessing device location...", { id: "gps" });
    navigator.geolocation.getCurrentPosition(
      () => toast("Location captured locally (not saved yet).", { id: "gps" }),
      () => toast.error("Location unavailable", { id: "gps" }),
    );
  };

  const setDefault = async (id: number) => {
    try {
      await apiService.profile.setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          is_default: a.id === id,
          isDefault: a.id === id,
        })),
      );
      toast.success("Default updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update default");
    }
  };

  return {
    addresses,
    loading,
    addAddress,
    deleteAddress,
    tagCurrentLocation,
    setDefault,
    refresh: fetchAddresses,
  };
};
