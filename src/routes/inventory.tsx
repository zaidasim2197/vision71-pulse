import { useState, useMemo } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateInventoryHealth,
  formatCompactPKR,
  formatPKR,
  getInventoryRecords,
  type InventoryRecord,
  type StockStatus,
} from "@/services/metrics";
import { Package, Search, Filter, X, ChevronLeft, ChevronRight, AlertTriangle, AlertCircle, PackageCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/inventory")({
  component: InventoryPage,
  validateSearch: (search: Record<string, unknown>) => ({
    search: search["search"] ? String(search["search"]) : undefined,
    status: search["status"] ? String(search["status"]) : undefined,
  }),
});

function InventoryPage() {
  const { dataset } = useDataset();
  const searchParams = useSearch({ from: "/inventory" });

  const [query, setQuery] = useState(searchParams.search || "");
  const [activeTab, setActiveTab] = useState<string>(searchParams.status || "ALL");
  const [warehouseFilter, setWarehouseFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const records = useMemo(() => {
    if (!dataset) return [];
    return getInventoryRecords(dataset);
  }, [dataset]);

  const health = useMemo(() => calculateInventoryHealth(records), [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (activeTab !== "ALL" && r.status !== activeTab) return false;
      if (warehouseFilter !== "ALL" && r.row.warehouse !== warehouseFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          r.product.product_name.toLowerCase().includes(q) ||
          r.product.sku.toLowerCase().includes(q) ||
          r.product.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, activeTab, warehouseFilter, query]);

  if (!dataset) return null;

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const pagedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const warehouses = Array.from(new Set(records.map((r) => r.row.warehouse)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" /> Inventory Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Physical stock levels, reservation allocations, and warehouse reorder alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono px-3 py-1 bg-card">
            Total Valuation: {formatCompactPKR(health.inventoryValue)}
          </Badge>
          <Badge variant="secondary" className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary">
            {records.length} Active SKUs
          </Badge>
        </div>
      </div>

      {/* Stock Status Filter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          {
            label: "All Items",
            key: "ALL",
            count: health.total,
            sub: "Total active catalog",
            pct: "100%",
            icon: PackageCheck,
            activeColor: "border-primary bg-primary/10 ring-2 ring-primary/20",
            inactiveColor: "border-border/60 bg-card hover:bg-muted/30",
          },
          {
            label: "In Stock",
            key: "In Stock",
            count: health.inStock,
            sub: "Fully allocated & ready",
            pct: `${((health.inStock / health.total) * 100).toFixed(0)}%`,
            icon: CheckCircle2,
            activeColor: "border-success bg-success/10 ring-2 ring-success/20 text-success",
            inactiveColor: "border-border/60 bg-card hover:bg-success/5",
          },
          {
            label: "Low Stock",
            key: "Low Stock",
            count: health.lowStock,
            sub: "Near reorder limit",
            pct: `${((health.lowStock / health.total) * 100).toFixed(0)}%`,
            icon: AlertTriangle,
            activeColor: "border-warning bg-warning/10 ring-2 ring-warning/20 text-warning",
            inactiveColor: "border-border/60 bg-card hover:bg-warning/5",
          },
          {
            label: "Out of Stock",
            key: "Out of Stock",
            count: health.outOfStock,
            sub: "Critical stockout SKUs",
            pct: `${((health.outOfStock / health.total) * 100).toFixed(0)}%`,
            icon: AlertCircle,
            activeColor: "border-destructive bg-destructive/10 ring-2 ring-destructive/20 text-destructive",
            inactiveColor: "border-border/60 bg-card hover:bg-destructive/5",
          },
          {
            label: "Discrepancy",
            key: "Discrepancy",
            count: health.discrepancy,
            sub: "Audit check flags",
            pct: `${((health.discrepancy / health.total) * 100).toFixed(0)}%`,
            icon: ShieldAlert,
            activeColor: "border-muted-foreground bg-muted ring-2 ring-muted-foreground/20 text-foreground",
            inactiveColor: "border-border/60 bg-card hover:bg-muted/30",
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all text-left flex flex-col justify-between shadow-2xs group relative overflow-hidden ${
                isActive ? tab.activeColor : tab.inactiveColor
              }`}
            >
              {/* Header: Icon + Label + Badge */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl ${isActive ? "bg-card/60" : "bg-muted/50 text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight">{tab.label}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {tab.pct}
                </Badge>
              </div>

              {/* Main Number & Context */}
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                  {tab.count}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">{tab.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Warehouse Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/60 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search product name, SKU or category..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9 text-xs h-9 rounded-xl"
          />
          {query && (
            <X
              onClick={() => setQuery("")}
              className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
            />
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={warehouseFilter}
            onValueChange={(v) => {
              setWarehouseFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="ALL">All Warehouses</SelectItem>
              {warehouses.map((w) => (
                <SelectItem key={w} value={w}>
                  Warehouse: {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(activeTab !== "ALL" || warehouseFilter !== "ALL" || query) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTab("ALL");
                setWarehouseFilter("ALL");
                setQuery("");
                setPage(1);
              }}
              className="h-9 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 font-semibold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">On Hand</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Reorder Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium text-foreground">
              {pagedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground text-xs">
                    No inventory records matching selected filters.
                  </td>
                </tr>
              ) : (
                pagedRecords.map((r) => (
                  <tr key={r.product.product_id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">{r.product.product_name}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{r.product.sku}</td>
                    <td className="py-3 px-4">{r.product.category}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{r.row.quantity_on_hand}</td>
                    <td className="py-3 px-4 text-center font-mono text-muted-foreground">{r.row.quantity_reserved}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-foreground">
                      {r.available}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-muted-foreground">{r.row.reorder_level}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                      {formatPKR(r.product.unit_cost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      {formatCompactPKR(r.value)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages} ({filteredRecords.length} items)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StockStatus }) {
  if (status === "In Stock") {
    return (
      <Badge variant="default" className="text-[10px] font-semibold bg-success/15 text-success border-success/30">
        In Stock
      </Badge>
    );
  }
  if (status === "Low Stock") {
    return (
      <Badge variant="outline" className="text-[10px] font-semibold bg-warning/15 text-warning border-warning/30">
        Low Stock
      </Badge>
    );
  }
  if (status === "Out of Stock") {
    return (
      <Badge variant="destructive" className="text-[10px] font-semibold">
        Out of Stock
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-[10px] font-semibold bg-muted text-muted-foreground">
      Discrepancy
    </Badge>
  );
}
