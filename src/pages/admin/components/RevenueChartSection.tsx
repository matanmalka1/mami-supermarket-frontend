import React from "react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { TrendingUp, DollarSign } from "lucide-react";
import { ChartEntry } from "./types";

type Props = {
  entries: ChartEntry[];
  hasData: boolean;
  momentumText: string;
  momentumWidth: number;
  scopeText: string;
};

const RevenueChartSection: React.FC<Props> = ({
  entries,
  hasData,
  momentumText,
  momentumWidth,
  scopeText,
}) => (
  <div className="grid grid-cols-12 gap-10">
    <Card className="col-span-12 lg:col-span-8 p-10 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl ">Revenue Performance</h3>
        <TrendingUp size={20} className="text-emerald-500" />
      </div>
      {hasData ? (
        <div className="h-64 flex items-end gap-2">
          {entries.map((entry) => (
            <div
              key={entry.label || entry.value}
              className="flex-1 bg-emerald-50 hover:bg-emerald-100 rounded-t-xl transition-all relative group"
              style={{ height: `${entry.height}%` }}
              title={entry.label}
            >
              <div className="absolute -top-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] ">₪{entry.value}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Revenue data unavailable"
          description="The analytics endpoint returned no history."
        />
      )}
    </Card>

    <div className="col-span-12 lg:col-span-4 space-y-6">
      <Card variant="brand" className="p-10 space-y-6">
        <DollarSign size={40} className="opacity-40" />
        <h3 className="text-3xl ">Momentum</h3>
        <p className="font-bold opacity-80 ">{momentumText}</p>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white shadow-lg"
            style={{ width: `${momentumWidth}%` }}
          />
        </div>
      </Card>
      <Card className="p-10">
        <TrendingUp size={40} className="opacity-40" />
        <h4 className="text-xl  text-slate-800">Scope</h4>
        <p className="text-sm font-bold text-slate-600 leading-relaxed mt-2 ">
          {scopeText}
        </p>
      </Card>
    </div>
  </div>
);

export default RevenueChartSection;
