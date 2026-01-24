import { useState, useCallback } from 'react';

export const useWeightScale = () => {
  const [weighingItem, setWeighingItem] = useState<any>(null);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [isStabilizing, setIsStabilizing] = useState(false);

  const startWeighing = useCallback(() => {
    if (!weighingItem) return;
    setIsStabilizing(true);
    let count = 0;
    const interval = setInterval(() => {
      setCurrentWeight(parseFloat((Math.random() * 0.2 + (weighingItem?.quantity * 0.5)).toFixed(2)));
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsStabilizing(false);
      }
    }, 100);
  }, [weighingItem]);

  const resetScale = useCallback(() => {
    setWeighingItem(null);
    setCurrentWeight(0);
    setIsStabilizing(false);
  }, []);

  return {
    weighingItem,
    setWeighingItem,
    currentWeight,
    isStabilizing,
    startWeighing,
    resetScale
  };
};