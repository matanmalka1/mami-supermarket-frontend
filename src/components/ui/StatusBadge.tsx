import React from 'react';
import Badge, { BadgeVariant } from './Badge';

type SystemStatus = 
  | 'PENDING' | 'LOADING' | 'IN_PROGRESS' | 'PICKING' | 'RECEIVED' 
  | 'ON_ROUTE' | 'EN_ROUTE' | 'DELIVERED' | 'COMPLETED' | 'SUCCESS' 
  | 'CRITICAL' | 'URGENT' | 'DELAYED' | 'CANCELLED' | 'MISSING'
  | 'LOW_STOCK' | 'OPTIMAL' | 'STEADY' | 'LOCKED' | 'OPEN';

interface StatusBadgeProps {
  status: string | SystemStatus;
  className?: string;
}

const statusMap: Record<string, BadgeVariant> = {
  // Warning / Pending
  PENDING: 'orange',
  LOADING: 'orange',
  URGENT: 'orange',
  LOW_STOCK: 'orange',
  // Success / Positive
  COMPLETED: 'emerald',
  DELIVERED: 'emerald',
  PICKED: 'emerald',
  SUCCESS: 'emerald',
  STEADY: 'emerald',
  OPTIMAL: 'emerald',
  OPEN: 'emerald',
  // Active / Informational
  IN_PROGRESS: 'blue',
  PICKING: 'blue',
  ON_ROUTE: 'blue',
  EN_ROUTE: 'blue',
  RECEIVED: 'teal',
  // Danger / Error
  CRITICAL: 'red',
  DELAYED: 'red',
  CANCELLED: 'red',
  MISSING: 'red',
  LOCKED: 'red',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalizedStatus = status.toUpperCase();
  const variant = statusMap[normalizedStatus] || 'gray';

  return (
    <Badge variant={variant} className={className}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};

export default StatusBadge;
