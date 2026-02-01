import React from "react";
import Badge, { BadgeVariant } from "./Badge";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * StatusBadge is a UI primitive for displaying status text.
 *
 * @param status - The status text to display (will be formatted by replacing underscores with spaces)
 * @param variant - Optional badge color variant. If not provided, defaults to 'gray'
 * @param className - Optional additional CSS classes
 *
 * Note: This component does not interpret status values. The caller is responsible
 * for mapping domain-specific statuses to appropriate color variants.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "gray",
  className = "",
}) => {
  return (
    <Badge variant={variant} className={className}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

export default StatusBadge;
