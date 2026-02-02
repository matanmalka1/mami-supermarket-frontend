import { useCallback } from "react";
import { toast } from "react-hot-toast";

export const useApiError = () => {
  return useCallback(
    (error: any, fallbackMessage: string = "An error occurred") => {
      const message =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || error?.message;

      const displayMessage = message || fallbackMessage;

      toast.error(displayMessage);

      return displayMessage;
    },
    [],
  );
};
