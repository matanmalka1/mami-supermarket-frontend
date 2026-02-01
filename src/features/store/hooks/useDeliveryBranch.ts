import { useState, useEffect } from "react";
import { branchService } from "@/domains/branch/service";

export const useDeliveryBranch = () => {
  const [deliveryBranchId, setDeliveryBranchId] = useState<
    number | undefined
  >();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDeliveryBranch = async () => {
      try {
        const { id } = await branchService.getDeliverySource();
        setDeliveryBranchId(id);
      } catch (error) {
        console.error("Failed to load delivery branch:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadDeliveryBranch();
  }, []);

  return { deliveryBranchId, isLoaded };
};
