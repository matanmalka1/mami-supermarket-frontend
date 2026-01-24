import { useState, useCallback } from 'react';

export const useWeightScale = () => {
  const [weighingItem, setWeighingItem] = useState<any>(null);
  const [currentWeight, setCurrentWeight] = useState(0);
  const isSimulated = true;

  const startWeighing = useCallback(() => {
    if (!weighingItem) return;
  }, [weighingItem]);

  const setManualWeight = useCallback((value: number) => {
    if (!Number.isFinite(value)) {
      setCurrentWeight(0);
      return;
    }
    setCurrentWeight(Math.max(0, parseFloat(value.toFixed(3))));
  }, []);

  const resetScale = useCallback(() => {
    setWeighingItem(null);
    setCurrentWeight(0);
  }, []);

  return {
    weighingItem,
    setWeighingItem,
    currentWeight,
    startWeighing,
    resetScale,
    setManualWeight,
    isSimulated
  };
};
