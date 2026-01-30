import React, { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import StockReportTable from "@/pages/inventory/components/StockReportTable";
import type { InventoryRow } from "@/domains/inventory/types";
import type { BranchResponse } from "@/domains/branch/types";

type Props = {
  rows: InventoryRow[];
  branches: BranchResponse[];
};

const StockReportPanel: React.FC<Props> = ({ rows, branches }) => {
  const [branchFilter, setBranchFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const branchMatch =
        branchFilter === "all" || String(row.branch?.id) === branchFilter;
      const product = row.product?.name?.toLowerCase() || "";
      const sku = row.product?.sku?.toLowerCase() || "";
      const query = search.trim().toLowerCase();
      const textMatch =
        !query || product.includes(query) || sku.includes(query);
      const inStockMatch =
        !inStockOnly || (row.availableQuantity ?? 0) > 0;
      return branchMatch && textMatch && inStockMatch;
    });
  }, [branchFilter, rows, search, inStockOnly]);

  const totalAvailable = filtered.reduce(
    (sum, row) => sum + (row.availableQuantity ?? 0),
    0,
  );
  const totalReserved = filtered.reduce(
    (sum, row) => sum + (row.reservedQuantity ?? 0),
    0,
  );
  const lowStockRows = filtered.filter(
    (row) => (row.availableQuantity ?? 0) <= 25,
  );

  const printReport = () => window.print();
  const exportCsv = () => {
    const header = [
      "SKU",
      "Product",
      "Branch",
      "Available",
      "Reserved",
      "Status",
    ];
    const lines = filtered.map((row) => {
      const product = row.product?.name || "SKU";
      const sku = row.product?.sku || "n/a";
      const branch = row.branch?.name || "Central Hub";
      const available = row.availableQuantity ?? 0;
      const reserved = row.reservedQuantity ?? 0;
      const status =
        available <= 0 ? "Out" : available <= 25 ? "Low" : "Healthy";
      return [sku, product, branch, available, reserved, status].join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `stock-report-${Date.now()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const toggleInStock = () => setInStockOnly((prev) => !prev);

  return (
    <section className="space-y-4 border border-gray-100 bg-white p-6 rounded-[2rem] shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
            Stock report
          </p>
          <h3 className="text-2xl font-black italic text-gray-900">
            Active inventory snapshot
          </h3>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={printReport}>
            Print
          </Button>
          <Button variant="ghost" size="sm" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Card label="Rows" value={filtered.length.toString()} />
        <Card label="Available units" value={totalAvailable.toString()} />
        <Card label="Reserved units" value={totalReserved.toString()} />
        <Card label="Low stock" value={lowStockRows.length.toString()} />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex gap-3 flex-wrap">
          <select
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
            className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold uppercase tracking-[0.3em]"
          >
            <option value="all">All branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleInStock}
            className={`px-4 py-3 rounded-xl border font-black uppercase tracking-[0.3em] text-sm ${
              inStockOnly
                ? "border-[#008A45] bg-[#008A45]/10 text-[#008A45]"
                : "border-gray-100 text-gray-600"
            }`}
          >
            {inStockOnly ? "In stock only" : "Include zeros"}
          </button>
        </div>
        <input
          type="search"
          placeholder="Search SKU / product"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full max-w-xs rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm font-bold uppercase tracking-[0.2em]"
        />
      </div>
      <StockReportTable rows={filtered} />
    </section>
  );
};

const Card: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-black uppercase tracking-[0.3em] text-gray-500">
    <p className="text-3xl text-gray-900">{value}</p>
    <p className="text-[10px]">{label}</p>
  </div>
);

export default StockReportPanel;
