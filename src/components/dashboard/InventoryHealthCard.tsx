import { Info, PackageCheck, AlertCircle, AlertTriangle, ShieldAlert, ArrowRight, Warehouse, CheckCircle2 } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import { calculateInventoryHealth, formatCompactPKR, formatPKR, getInventoryRecords } from "@/services/metrics";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function InventoryHealthCard() {
  const { dataset, setInfoMetricKey } = useDataset();
  const router = useRouter();

  if (!dataset) return null;

  const records = getInventoryRecords(dataset);
  const health = calculateInventoryHealth(records);

  const pieData = [
    { name: "In Stock", value: health.inStock, color: "oklch(0.6 0.135 152)" },
    { name: "Low Stock", value: health.lowStock, color: "oklch(0.73 0.155 72)" },
    { name: "Out of Stock", value: health.outOfStock, color: "oklch(0.577 0.208 25)" },
    { name: "Discrepancy", value: health.discrepancy, color: "oklch(0.52 0.012 260)" },
  ];

  const criticalLowItems = records
    .filter((r) => r.status === "Low Stock" || r.status === "Out of Stock")
    .slice(0, 3);

  const items = [
    {
      label: "In Stock",
      count: health.inStock,
      color: "bg-success/15 text-success border-success/30",
      icon: PackageCheck,
      statusQuery: "In Stock",
    },
    {
      label: "Low Stock",
      count: health.lowStock,
      color: "bg-warning/15 text-warning border-warning/30",
      icon: AlertTriangle,
      statusQuery: "Low Stock",
    },
    {
      label: "Out of Stock",
      count: health.outOfStock,
      color: "bg-destructive/15 text-destructive border-destructive/30",
      icon: AlertCircle,
      statusQuery: "Out of Stock",
    },
    {
      label: "Discrepancy",
      count: health.discrepancy,
      color: "bg-muted text-muted-foreground border-border",
      icon: ShieldAlert,
      statusQuery: "Discrepancy",
    },
  ];

  const handleNavigate = (status: string) => {
    router.navigate({ to: "/inventory" as any, search: { status } as any });
  };

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-primary" /> Inventory Stock Health
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInfoMetricKey("inventoryValue")}
              className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
              title="Metric info [i]"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total Valuation: <strong className="text-foreground font-mono">{formatCompactPKR(health.inventoryValue)}</strong> ({formatPKR(health.inventoryValue)})
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-bold px-3 py-1 bg-success/10 text-success border-success/30 font-mono">
          {health.healthyPct.toFixed(0)}% Healthy
        </Badge>
      </div>

      {/* 2. Top Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
          <span>Overall Stock Allocation</span>
          <span>{health.inStock} of {health.total} SKUs Healthy</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-border/40 overflow-hidden flex">
          <div
            className="h-full bg-success transition-all duration-500"
            style={{ width: `${(health.inStock / health.total) * 100}%` }}
            title={`In Stock: ${health.inStock}`}
          />
          <div
            className="h-full bg-warning transition-all duration-500"
            style={{ width: `${(health.lowStock / health.total) * 100}%` }}
            title={`Low Stock: ${health.lowStock}`}
          />
          <div
            className="h-full bg-destructive transition-all duration-500"
            style={{ width: `${(health.outOfStock / health.total) * 100}%` }}
            title={`Out of Stock: ${health.outOfStock}`}
          />
          <div
            className="h-full bg-muted-foreground transition-all duration-500"
            style={{ width: `${(health.discrepancy / health.total) * 100}%` }}
            title={`Discrepancy: ${health.discrepancy}`}
          />
        </div>
      </div>

      {/* 3. Middle Section: Donut Gauge + 4 Interactive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-1">
        {/* Recharts Semi Donut Gauge */}
        <div className="sm:col-span-5 h-[150px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--color-card)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]!;
                  return (
                    <div className="rounded-xl border border-border/80 bg-card p-2 shadow-lg text-xs font-semibold text-foreground">
                      {d.name}: {d.value} SKUs
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold font-mono text-foreground leading-none">{health.total}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">Total SKUs</span>
          </div>
        </div>

        {/* 4 Interactive Stock Cards */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-2.5">
          {items.map((item) => {
            const Icon = item.icon;
            const pct = ((item.count / health.total) * 100).toFixed(0);
            return (
              <div
                key={item.label}
                onClick={() => handleNavigate(item.statusQuery)}
                className={`p-3.5 sm:p-4 rounded-2xl border ${item.color} transition-all cursor-pointer hover:scale-[1.02] shadow-2xs flex flex-col justify-between group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground tracking-tight">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-[9px] font-mono font-bold px-1.5 py-0 rounded-full">
                      {pct}%
                    </Badge>
                    <Icon className="h-4 w-4 opacity-80" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight leading-none text-foreground">
                    {item.count}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium block mt-1 group-hover:text-primary transition-colors">
                    Filter SKUs &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Section: Low Stock Action Highlights */}
      {criticalLowItems.length > 0 && (
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" /> Items Requiring Reorder Attention
            </span>
            <span className="text-[10px] font-mono text-warning font-semibold">
              {health.lowStock + health.outOfStock} items below reorder
            </span>
          </div>
          <div className="space-y-1">
            {criticalLowItems.map((r) => (
              <div
                key={r.product.product_id}
                onClick={() => handleNavigate(r.status)}
                className="flex items-center justify-between text-[11px] py-1 border-b border-border/40 last:border-0 cursor-pointer hover:underline"
              >
                <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-[240px]">
                  {r.product.product_name}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-muted-foreground">{r.available} avail / {r.row.reorder_level} reorder</span>
                  <Badge
                    variant={r.status === "Out of Stock" ? "destructive" : "outline"}
                    className="text-[9px] py-0 px-1.5 font-bold"
                  >
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Footer */}
      <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center shrink-0">
        <span>Reorder rule: available &le; reorder level</span>
        <button
          onClick={() => router.navigate({ to: "/inventory" as any })}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          View all {health.total} SKUs <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
