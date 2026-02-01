import React from "react";
import Button from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";
import ErrorMessage from "@/components/ui/ErrorMessage";

type Props = {
  summaryLabel: string;
  branchLabel: string;
  initialStock: number;
  error: string | null;
  isBusy: boolean;
  disabled: boolean;
};

const NewSkuFooter: React.FC<Props> = ({
  summaryLabel,
  branchLabel,
  initialStock,
  error,
  isBusy,
  disabled,
}) => (
  <>
    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start gap-4">
      <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
      <p className="text-xs font-bold text-emerald-800/70 leading-relaxed ">
        {summaryLabel}: entering the name, price, and {initialStock} units seeds
        the {branchLabel} ledger and publishes the catalog entry.
      </p>
    </div>

    <ErrorMessage
      message={error}
      className="text-xs uppercase tracking-[0.5em] text-red-500 text-left"
    />

    <Button
      fullWidth
      size="lg"
      className="rounded-2xl h-16"
      type="submit"
      disabled={disabled}
    >
      {isBusy ? "Registering…" : "Register SKU"}
    </Button>
  </>
);

export default NewSkuFooter;
