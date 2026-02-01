import React from "react";
import type { OrderItem } from "@/domains/orders/types";

export type OpsOrderStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELED"
  | "DELAYED"
  | "MISSING";

const ORDER_STATUS_OPTIONS: { value: OpsOrderStatus; label: string }[] = [
  { value: "CREATED", label: "Created" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "READY", label: "Ready" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELED", label: "Canceled" },
  { value: "DELAYED", label: "Delayed" },
  { value: "MISSING", label: "Missing" },
];

const STATUS_LABELS: Record<OpsOrderStatus, string> =
  ORDER_STATUS_OPTIONS.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.label }),
    {} as Record<OpsOrderStatus, string>,
  );

const normalizeStatus = (value?: string) =>
  typeof value === "string" ? value.toUpperCase() : "";

const humanizeStatus = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const getAllowedTransitions = (
  current: OpsOrderStatus,
  hasAllPicked: boolean,
  hasAnyMissing: boolean,
): OpsOrderStatus[] => {
  if (current === "CREATED") return ["IN_PROGRESS"];
  if (current === "IN_PROGRESS") {
    const transitions: OpsOrderStatus[] = [];
    if (hasAllPicked) transitions.push("READY");
    if (hasAnyMissing) transitions.push("MISSING");
    return transitions;
  }
  return [];
};

interface Props {
  status?: string;
  items?: OrderItem[];
  onChange: (status: OpsOrderStatus) => void;
}

const OrderStatusSelect: React.FC<Props> = ({ status, items, onChange }) => {
  const normalizedStatus =
    normalizeStatus(status) || ORDER_STATUS_OPTIONS[0].value;
  const parsedItems = Array.isArray(items) ? items : [];
  const hasAllPicked =
    parsedItems.length > 0 &&
    parsedItems.every(
      (item) => normalizeStatus(item.pickedStatus) === "PICKED",
    );
  const hasAnyMissing =
    parsedItems.length > 0 &&
    parsedItems.some(
      (item) => normalizeStatus(item.pickedStatus) === "MISSING",
    );
  const allowedTransitions = normalizedStatus
    ? getAllowedTransitions(
        normalizedStatus as OpsOrderStatus,
        hasAllPicked,
        hasAnyMissing,
      )
    : [];
  const isTransitionable = allowedTransitions.length > 0;
  const resolvedLabel =
    (normalizedStatus && STATUS_LABELS[normalizedStatus as OpsOrderStatus]) ||
    humanizeStatus(status ?? "");
  const selectOptions = [
    {
      value: normalizedStatus,
      label: `${resolvedLabel} (current)`,
      disabled: true,
    },
    ...allowedTransitions.map((transition) => ({
      value: transition,
      label: STATUS_LABELS[transition],
      disabled: false,
    })),
  ];

  return (
    <div className="space-y-1">
      <select
        value={normalizedStatus}
        onChange={(event) => {
          onChange(event.target.value as OpsOrderStatus);
        }}
        disabled={!isTransitionable}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600 transition hover:border-gray-300 focus:border-emerald-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
      >
        {selectOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {!isTransitionable && (
        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400">
          No transitions allowed for the current status.
        </p>
      )}
    </div>
  );
};

export default OrderStatusSelect;
