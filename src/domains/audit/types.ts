// Audit domain types (frontend-only, camelCase, type aliases only)

export type AuditRecord = {
  id: number | string;
  action: string;
  actor: string;
  target: string;
  details?: string;
  createdAt: string;
};

export type AuditQuery = {
  page?: number;
  pageSize?: number;
  action?: string;
  actor?: string;
  target?: string;
  fromDate?: string;
  toDate?: string;
};

export type AuditPage = {
  results: AuditRecord[];
  count: number;
  page: number;
  pageSize: number;
};
