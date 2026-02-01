import React from "react";
import SelectField from "@/components/ui/form/SelectField";

interface Branch {
  id: number;
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
  <div className="flex flex-wrap items-end gap-4">
    <SelectField
      label="Filter by branch"
      value={selectedBranch}
      onChange={(event) => setSelectedBranch(event.target.value)}
      options={availableBranches.map((branch) => ({
        value: branch.id,
        label: branch.name,
      }))}
      placeholderOption={
        availableBranches.length === 0
          ? "No branches available"
          : "All Branches"
      }
      disabled={availableBranches.length === 0}
      containerClassName="min-w-[200px]"
      className="shadow-sm"
    />

    <SelectField
      label="Day of week"
      value={selectedDay}
      onChange={(event) => setSelectedDay(event.target.value)}
      options={availableDays.map((day) => ({
        value: String(day),
        label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
      }))}
      placeholderOption="Day"
      disabled={availableDays.length === 0}
      containerClassName="min-w-[180px]"
      className="shadow-sm"
    />
  </div>
);

export default DeliverySlotManagerFilters;
