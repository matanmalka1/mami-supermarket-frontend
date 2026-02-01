/**
 * Convert snake_case object keys to camelCase
 */
export const toCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map((item) => toCamel(item));
  if (
    obj !== null &&
    typeof obj === "object" &&
    (obj.constructor === Object || !obj.constructor)
  ) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, (g) =>
        g.toUpperCase().replace("-", "").replace("_", ""),
      );
      acc[camelKey] = toCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

/**
 * Convert camelCase object keys to snake_case
 */
export const toSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map((item) => toSnake(item));
  if (
    obj !== null &&
    typeof obj === "object" &&
    (obj.constructor === Object || !obj.constructor)
  ) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
      acc[snakeKey] = toSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};
