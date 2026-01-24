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

  const addAddress = async (address: any) => {
    try {
      const saved = await apiService.profile.addAddress(address);
      setAddresses((prev) => [
        ...prev,
        saved || { ...address, id: Date.now().toString() },
      ]);
      toast.success("Address added");
    } catch {
      toast.error("Failed to save");
    }
  };

  const deleteAddress = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  const tagCurrentLocation = () => {
    toast.loading("Accessing GPS...", { id: "gps" });
    navigator.geolocation.getCurrentPosition(
      () => toast.success("Location tagged!", { id: "gps" }),
      () => toast.error("GPS access denied", { id: "gps" }),
    );
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default updated");
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
