/**
 * Format address object into a single line string
 */
export const formatAddressLine = (
  address?: Record<string, any>,
): string | undefined => {
  if (!address) return undefined;
  const parts = [
    address.address_line ?? address.addressLine,
    address.city,
    address.postal_code ?? address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
};
