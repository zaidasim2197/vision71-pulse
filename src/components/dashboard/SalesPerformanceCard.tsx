import { useState } from "react";
import { Info, BarChart3 } from "lucide-react";
import { useDataset } from "../providers/DatasetProvider";
import { calculateMonthlySeries, formatCompactPKR, formatPKR } from "@/services/metrics";
import { formatMonth } from "@/services/dateRange";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button } from "../ui/button";

export function SalesPerformanceCard() {
  const { dataset, dateRange, setInfoMetricKey } = useDataset();
  const [metricType, setMetricType] = useState<"netSales" | "grossSales" | "grossProfit">("netSales");

  if (!dataset) return null;

  const rawSeries = calculateMonthlySeries(dataset, dateRange);

  // Filter out any empty trailing month beyond dataset end date (Aug 2026)
  const chartData = rawSeries
    .filter((s) => s.month <= "2026-08")
    .map((s) => ({
      ...s,
      monthLabel: formatMonth(s.month),
    }));

  const totalNet = chartData.reduce((acc, curr) => acc + curr.netSales, 0);

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Monthly Sales Performance
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInfoMetricKey("netSales")}
              className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
              title="Metric info [i]"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Realized Net Sales: <strong className="text-foreground font-mono">{formatCompactPKR(totalNet)}</strong> ({formatPKR(totalNet)})
          </p>
        </div>

        {/* Metric Switcher Controls */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 self-start sm:self-auto">
          <button
            onClick={() => setMetricType("netSales")}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
              metricType === "netSales"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Net Sales
          </button>
          <button
            onClick={() => setMetricType("grossSales")}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
              metricType === "grossSales"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Gross Sales
          </button>
          <button
            onClick={() => setMetricType("grossProfit")}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
              metricType === "grossProfit"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Gross Profit
          </button>
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 15, left: 10, bottom: 15 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.52 0.128 178)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="oklch(0.52 0.128 178)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              interval={1}
              minTickGap={30}
              dy={8}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              width={50}
              tickLine={false}
              axisLine={false}
              dx={-4}
              tickFormatter={(v) => (v === 0 ? "" : compactY(v))}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0]!.payload;
                return (
                  <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1">
                    <p className="font-bold text-foreground border-b border-border/40 pb-1">{data.monthLabel} ({data.month})</p>
                    <p className="text-primary font-mono font-bold">Net Sales: {formatPKR(data.netSales)}</p>
                    <p className="text-muted-foreground font-mono">Gross Sales: {formatPKR(data.grossSales)}</p>
                    <p className="text-success font-mono">Gross Profit: {formatPKR(data.grossProfit)}</p>
                    <p className="text-destructive font-mono">Returns: {formatPKR(data.returns)}</p>
                    <p className="text-muted-foreground">Orders: {data.orders.toLocaleString()}</p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey={metricType}
              stroke="oklch(0.52 0.128 178)"
              strokeWidth={2.5}
              fill="url(#salesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function compactY(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
  return `${val}`;
}
