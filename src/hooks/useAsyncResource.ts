import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export type AsyncResourceErrorHandler = (error: unknown) => void;

export interface UseAsyncResourceOptions<T> {
  initialData: T;
  errorMessage?: string;
  onError?: AsyncResourceErrorHandler;
}

export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  { initialData, errorMessage, onError }: UseAsyncResourceOptions<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetcher();
      setData(payload);
    } catch (err) {
      if (typeof errorMessage === "string") {
        toast.error(errorMessage);
      }
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetcher, errorMessage, onError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    setData,
    loading,
    refresh,
  };
};
