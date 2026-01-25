const sanitize = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "SKU";

export const generateSku = (name: string): string => {
  const slug = sanitize(name);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${slug}-${suffix}`;
};
