/**
 * @deprecated [2026-01-29] This domain types file has no active consumers and is considered dead code.
 * If you need to revive it, please update documentation and add a consumer.
 */
// Notification domain types

export interface OpsAlert {
  id: number;
  text: string;
  type?: string;
  severity?: string;
  time?: string;
  createdAt?: string;
}

export type OpsAlertType = string; // If there are more specific types, add here.
