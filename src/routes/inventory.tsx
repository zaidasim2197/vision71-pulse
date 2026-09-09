import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateHaroonInventory,
  getLowStockItems,
  formatCompactPKR,
  formatPKR,
} from "@/services/metrics";
import { KpiBentoCard } from "@/components/dashboard/KpiBentoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  PieChart as PieIcon,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/inventory")({
  component: InventoryPage,
});

const CATEGORY_COLORS = [
  "oklch(0.52 0.128 178)",
  "oklch(0.6 0.118 220)",
  "oklch(0.68 0.14 140)",
  "oklch(0.65 0.18 45)",
  "oklch(0.58 0.15 290)",
  "oklch(0.62 0.12 20)",
];

function compactY(val: number): string {
  if (val === 0) return "0";
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
  return `${val}`;
}

function InventoryPage() {
  const { dataset, loading } = useDataset();
  const [tableModalOpen, setTableModalOpen] = useState(false);

  if (loading || !dataset) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[420px]">
          <Skeleton className="h-full lg:col-span-6 rounded-3xl" />
          <Skeleton className="h-full lg:col-span-6 rounded-3xl" />
        </div>
      </div>
    );
  }

  const invHealth = calculateHaroonInventory(dataset);
  const lowStockItems = getLowStockItems(dataset, 5);

  const categoryValuation = useMemo(() => {
    const qtyByProduct = new Map<string, number>();
    for (const row of dataset.inventory) {
      qtyByProduct.set(row.product_id, (qtyByProduct.get(row.product_id) ?? 0) + row.quantity_on_hand);
    }
    const map = new Map<string, number>();
    for (const p of dataset.products) {
      if (p.product_status !== "Active") continue;
      const qoh = qtyByProduct.get(p.product_id) ?? 0;
      const val = qoh * p.unit_cost;
      map.set(p.category, (map.get(p.category) || 0) + val);
    }
    return Array.from(map.entries())
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [dataset]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 md:py-4 h-full flex flex-col justify-between overflow-y-auto md:overflow-hidden space-y-3.5">
      {/* Clean Page Header (No Subtitles, No Haroon text) */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> Inventory Management Dashboard
        </h1>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setTableModalOpen(true)}
          className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-border/70 bg-card hover:bg-muted"
        >
          <ListFilter className="h-3.5 w-3.5 text-primary" />
          <span>Search & View Full Inventory</span>
        </Button>
      </div>

      {/* Row 1: Compact 4 KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KpiBentoCard
          metricKey="totalStockValue"
          title="Total Stock Value"
          value={formatCompactPKR(invHealth.totalStockValue)}
          subtext={`Exact: ${formatPKR(invHealth.totalStockValue)}`}
          isSnapshot={true}
        />

        <KpiBentoCard
          metricKey="lowStock"
          title="Low Stock Items"
          value={invHealth.itemsLowOnStock.toLocaleString()}
          subtext="On-hand ≤ Reorder Level"
          badgeText={invHealth.itemsLowOnStock > 0 ? "Requires Reorder" : "Optimal"}
          onClickDrillDown={() => setTableModalOpen(true)}
        />

        <KpiBentoCard
          metricKey="outOfStock"
          title="Out of Stock Items"
          value={invHealth.itemsOutOfStock.toLocaleString()}
          subtext="Zero physical stock"
          badgeText={invHealth.itemsOutOfStock > 0 ? "Stockout Alert" : "Zero Stockout"}
          onClickDrillDown={() => setTableModalOpen(true)}
        />

        <KpiBentoCard
          metricKey="activeProducts"
          title="Total Active Products"
          value={invHealth.totalActiveProducts.toLocaleString()}
          subtext={`${dataset.products.length} Total Catalog SKUs`}
        />
      </div>

      {/* Row 2: Prominent Primary Supporting Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[340px] md:min-h-0">
        {/* Visualization 1: Valuation by Category */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-primary" /> Stock Valuation by Category
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              {categoryValuation.length} Categories
            </span>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryValuation}
                margin={{ top: 5, right: 25, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  domain={[(min: number) => Math.max(0, Math.floor(min * 0.75)), "auto"]}
                  tickFormatter={compactY}
                  minTickGap={25}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  dy={6}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={140}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-foreground)", fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]!.payload;
                    return (
                      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">{d.category}</p>
                        <p className="text-primary font-mono font-bold">Valuation: {formatPKR(d.value)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {categoryValuation.map((_item, index: number) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visualization 2: Critical Stock Alert Ranking */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-warning" /> Low Stock Attention Required
            </h3>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Top 5 Priority Items
            </Badge>
          </div>

          <div className="py-2 space-y-2 flex-1 overflow-y-auto">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                All products are above reorder thresholds.
              </p>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.product.product_id}
                  className="p-2.5 rounded-2xl border border-border/50 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{item.product.product_name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      SKU: {item.product.sku} | Category: {item.product.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.quantityOnHand === 0
                          ? "bg-destructive/10 text-destructive border border-destructive/20"
                          : "bg-warning/10 text-warning border border-warning/20"
                      }`}
                    >
                      {item.quantityOnHand === 0 ? "Out of Stock" : `${item.quantityOnHand} left`}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                      Reorder at: {item.reorderLevel}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Inventory Modal */}
      <Dialog open={tableModalOpen} onOpenChange={setTableModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] rounded-3xl p-6 flex flex-col">
          <InventoryTableContainer dataset={dataset} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InventoryTableContainer({ dataset }: { dataset: any }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const records = useMemo(() => {
    const qtyByProduct = new Map<string, number>();
    for (const row of dataset.inventory) {
      qtyByProduct.set(row.product_id, (qtyByProduct.get(row.product_id) ?? 0) + row.quantity_on_hand);
    }
    return dataset.products.map((p: any) => ({
      product: p,
      quantityOnHand: qtyByProduct.get(p.product_id) ?? 0,
      totalValue: (qtyByProduct.get(p.product_id) ?? 0) * p.unit_cost,
    }));
  }, [dataset]);

  const filtered = useMemo(() => {
    if (!query) return records;
    const q = query.toLowerCase();
    return records.filter(
      (r: any) =>
        r.product.product_name.toLowerCase().includes(q) ||
        r.product.sku.toLowerCase().includes(q) ||
        r.product.category.toLowerCase().includes(q)
    );
  }, [records, query]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      <DialogHeader>
        <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
          <span>Complete Product Inventory</span>
          <Badge variant="outline" className="text-xs font-mono">
            {filtered.length} SKUs
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="relative">
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
      </div>

      <div className="rounded-2xl border border-border/60 overflow-hidden flex-1 min-h-0">
        <div className="overflow-y-auto max-h-[450px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-semibold text-muted-foreground sticky top-0 bg-card">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">On Hand</th>
                <th className="p-3 text-center">Reorder Level</th>
                <th className="p-3 text-right">Unit Cost</th>
                <th className="p-3 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {paged.map((r: any) => (
                <tr key={r.product.product_id} className="hover:bg-muted/30">
                  <td className="p-3 font-mono font-bold">{r.product.sku}</td>
                  <td className="p-3 font-bold">{r.product.product_name}</td>
                  <td className="p-3 text-muted-foreground">{r.product.category}</td>
                  <td className="p-3 text-center font-mono font-bold">{r.quantityOnHand}</td>
                  <td className="p-3 text-center font-mono text-muted-foreground">{r.product.reorder_level}</td>
                  <td className="p-3 text-right font-mono">{formatPKR(r.product.unit_cost)}</td>
                  <td className="p-3 text-right font-mono font-bold text-primary">{formatCompactPKR(r.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-8 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 text-xs"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
