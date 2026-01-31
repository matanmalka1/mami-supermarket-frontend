import React from "react";

interface Branch {
  id: string;
  name: string;
}

interface DeliverySlotManagerFiltersProps {
  availableBranches: Branch[];
  availableDays: number[];
  selectedBranch: string;
  selectedDay: string;
  setSelectedBranch: (id: string) => void;
  setSelectedDay: (day: string) => void;
}

const DeliverySlotManagerFilters: React.FC<DeliverySlotManagerFiltersProps> = ({
  availableBranches,
  availableDays,
  selectedBranch,
  selectedDay,
  setSelectedBranch,
  setSelectedDay,
}) => (
  <div className="flex flex-wrap items-center gap-4">
    <label className="text-xs uppercase tracking-[0.3em] text-gray-400">
      Filter by branch
    </label>
    {availableBranches.length > 0 ? (
      <select
        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm"
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
      >
        {availableBranches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    ) : (
      <div className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm text-gray-600">
        No branch
      </div>
    )}
    <label className="text-xs uppercase tracking-[0.3em] text-gray-400">
      Day of week
    </label>
    {availableDays.length > 0 ? (
      <select
        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm"
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      >
        {availableDays.map((day) => (
          <option key={day} value={String(day)}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
          </option>
        ))}
      </select>
    ) : (
      <div className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold bg-white shadow-sm text-gray-600">
        Day
      </div>
    )}
  </div>
);

export default DeliverySlotManagerFilters;
