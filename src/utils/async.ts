/**
 * Standard debounce implementation for search inputs and rapid UI updates
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
};

/**
 * Simple delay helper
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));