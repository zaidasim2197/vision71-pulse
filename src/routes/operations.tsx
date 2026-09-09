import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateOperationalKPIs,
  calculateDeliveryPerformance,
  calculateMonthlySeries,
  formatCompactPKR,
  formatPKR,
} from "@/services/metrics";
import { formatMonth } from "@/services/dateRange";
import { KpiBentoCard } from "@/components/dashboard/KpiBentoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Activity, RotateCcw, Truck } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/operations")({
  component: OperationsPage,
});

function compactY(val: number): string {
  if (val === 0) return "0";
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
  return `${val}`;
}

function OperationsPage() {
  const { dataset, loading, dateRange } = useDataset();

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

  const ops = calculateOperationalKPIs(dataset, dateRange);
  const delivery = calculateDeliveryPerformance(dataset, dateRange);

  const monthlySeries = calculateMonthlySeries(dataset, dateRange)
    .filter((s) => s.month <= "2026-08")
    .map((s) => ({
      ...s,
      monthLabel: formatMonth(s.month),
      returnPct: s.orders > 0 ? (s.returns / Math.max(1, s.grossSales)) * 100 : 0,
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 md:py-4 h-full flex flex-col justify-between overflow-y-auto md:overflow-hidden space-y-3.5">
      {/* Clean Page Header (No Subtitles, No Haroon text) */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" /> Operational KPIs & Efficiency Dashboard
        </h1>

        <Badge variant="secondary" className="text-xs font-mono px-3 py-1">
          Logistics SLA & Quality Metrics
        </Badge>
      </div>

      {/* Row 1: Compact 4 KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KpiBentoCard
          metricKey="avgFulfillmentTime"
          title="Avg Fulfillment Time"
          value={ops.avgFulfillmentTimeDays != null ? `${ops.avgFulfillmentTimeDays.toFixed(1)} days` : "N/A"}
          subtext="Order date to delivery date"
        />

        <KpiBentoCard
          metricKey="returnRate"
          title="Return Rate"
          value={`${ops.returnRatePct.toFixed(1)}%`}
          subtext="Share of orders returned"
          badgeText={ops.returnRatePct > 5 ? "High Return" : "Low Return"}
        />

        <KpiBentoCard
          metricKey="repeatCustomerRate"
          title="Repeat Customer Rate"
          value={`${ops.repeatCustomerRatePct.toFixed(1)}%`}
          subtext="Customers with >1 order in range"
        />

        <KpiBentoCard
          metricKey="inventoryTurnover"
          title="Inventory Turnover"
          value={ops.inventoryTurnover != null ? `${ops.inventoryTurnover.toFixed(2)}x` : "N/A"}
          subtext="COGS / Avg Inventory Value"
        />
      </div>

      {/* Row 2: Prominent Primary Supporting Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[340px] md:min-h-0">
        {/* Visualization 1: On-Time vs Delayed Delivery Breakdown */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" /> Delivery Speed & SLA Performance
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              On-Time Rate: {delivery.onTimeRate.toFixed(1)}%
            </span>
          </div>

          <div className="py-3 space-y-3.5 flex-1 flex flex-col justify-center">
            {/* On-Time Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">On-Time Deliveries</span>
                <span className="text-success font-mono font-bold">{delivery.onTime} Orders ({delivery.onTimeRate.toFixed(1)}%)</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, delivery.onTimeRate))}%` }}
                />
              </div>
            </div>

            {/* Delayed Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Delayed Deliveries</span>
                <span className="text-destructive font-mono font-bold">{delivery.delayed} Orders ({(100 - delivery.onTimeRate).toFixed(1)}%)</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, 100 - delivery.onTimeRate))}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 grid grid-cols-2 gap-2 text-xs font-mono text-center">
              <div>
                <span className="text-[10px] text-muted-foreground block">Avg Lead Time</span>
                <strong className="text-foreground">{delivery.avgLeadTimeDays.toFixed(1)} days</strong>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Avg Delay When Late</span>
                <strong className="text-destructive">{delivery.avgDelayDays.toFixed(1)} days</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization 2: Return & Quality Trend */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-warning" /> Returns Volume Over Time
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              Quality Monitor
            </span>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries} margin={{ top: 10, right: 15, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  dataKey="monthLabel"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={25}
                  dy={6}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  width={50}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={compactY}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]!.payload;
                    return (
                      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">{d.monthLabel}</p>
                        <p className="text-destructive font-mono font-bold">Returns Value: {formatPKR(d.returns)}</p>
                        <p className="text-muted-foreground">Net Sales: {formatCompactPKR(d.netSales)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="returns" fill="oklch(0.58 0.15 290)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
