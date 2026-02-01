import React, { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Grid from "@/components/ui/Grid";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const filtered = useMemo(() => {
    const result = rows.filter((row) => {
      const branchMatch =
        branchFilter === "all" || String(row.branch?.id) === branchFilter;
      const product = row.product?.name?.toLowerCase() || "";
      const sku = row.product?.sku?.toLowerCase() || "";
      const query = search.trim().toLowerCase();
      const textMatch =
        !query || product.includes(query) || sku.includes(query);
      const inStockMatch = !inStockOnly || (row.availableQuantity ?? 0) > 0;
      return branchMatch && textMatch && inStockMatch;
    });
    setCurrentPage(1); // Reset to first page when filters change
    return result;
  }, [branchFilter, rows, search, inStockOnly]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = filtered.slice(startIndex, endIndex);

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
          <h3 className="text-2xl  text-gray-900">Active inventory snapshot</h3>
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
      <Grid cols={4} gap={4}>
        {[
          { label: "Rows", value: filtered.length },
          { label: "Available units", value: totalAvailable },
          { label: "Reserved units", value: totalReserved },
          { label: "Low stock", value: lowStockRows.length },
        ].map((stat) => (
          <Card
            key={stat.label}
            variant="glass"
            padding="md"
            className="flex flex-col items-center justify-center"
          >
            <p className="text-3xl text-gray-900">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
              {stat.label}
            </p>
          </Card>
        ))}
      </Grid>
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <select
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
            className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wider hover:border-teal-600 transition-colors focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">🏪 All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleInStock}
            className={`px-5 py-3 rounded-xl border-2 uppercase tracking-wider text-sm font-semibold transition-all ${
              inStockOnly
                ? "border-[#008A45] bg-[#008A45]/10 text-[#008A45] shadow-sm"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {inStockOnly ? "✓ In Stock" : "Include Zeros"}
          </button>
        </div>
        <input
          type="search"
          placeholder="🔍 Search SKU or Product Name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full lg:max-w-md rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium tracking-wide placeholder:text-gray-400 hover:border-teal-600 transition-colors focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>
      <div className="space-y-4">
        <StockReportTable rows={paginatedRows} />
        {filtered.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-500 px-2">
            <span className="uppercase tracking-wider">
              Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of{" "}
              {filtered.length} items
            </span>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
        />
      </div>
    </section>
  );
};

export default StockReportPanel;
