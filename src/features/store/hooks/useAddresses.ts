import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { authService } from "@/domains/auth/service";

export interface AddressWithLocation {
  id: number;
  label?: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
  isDefault?: boolean;
  lat?: number | null;
  lng?: number | null;
}

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<AddressWithLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authService.getAddresses();
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
    if (
      !address.address_line ||
      !address.city ||
      !address.postal_code ||
      !address.country
    ) {
      toast.error("All address fields are required");
      return;
    }
    try {
      const saved = await authService.addAddress(address);
      if (!saved || !saved.id) {
        throw new Error("Invalid response from server");
      }
      setAddresses((prev) => [...prev, saved]);
      toast.success("Address added");
    } catch (error: any) {
      console.error("Failed to save address:", error);
      toast.error(error.message || "Failed to save");
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await authService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove address");
    }
  };

  const updateAddress = async (
    id: number,
    address: {
      address_line?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    },
  ) => {
    try {
      const updated = await authService.updateAddress(id, address);
      if (!updated || !updated.id) {
        throw new Error("Invalid response from server");
      }
      setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success("Address updated");
    } catch (error: any) {
      console.error("Failed to update address:", error);
      toast.error(error.message || "Failed to update");
    }
  };

  const setDefault = async (id: number) => {
    try {
      await authService.setDefaultAddress(id);
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
    updateAddress,
    deleteAddress,
    setDefault,
    refresh: fetchAddresses,
  };
};
