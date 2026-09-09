import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateHaroonSales,
  calculateSalesByCategory,
  formatCompactPKR,
  formatPKR,
  calculateDailySeries,
} from "@/services/metrics";
import { KpiBentoCard } from "@/components/dashboard/KpiBentoCard";
import { SalesPerformanceCard } from "@/components/dashboard/SalesPerformanceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, PieChart as PieIcon } from "lucide-react";
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

export const Route = createFileRoute("/")({
  component: SalesPerformancePage,
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

function SalesPerformancePage() {
  const { dataset, loading, dateRange } = useDataset();
  const router = useRouter();

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
          <Skeleton className="h-full lg:col-span-7 rounded-3xl" />
          <Skeleton className="h-full lg:col-span-5 rounded-3xl" />
        </div>
      </div>
    );
  }

  const sales = calculateHaroonSales(dataset, dateRange);
  const dailySparkline = calculateDailySeries(dataset, dateRange);
  const categorySales = calculateSalesByCategory(dataset, dateRange);

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 md:py-4 h-full flex flex-col justify-between overflow-y-auto md:overflow-hidden space-y-3.5">
      {/* Clean Page Header (Only main heading, no subtitles, no Haroon text) */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Sales Performance Dashboard
        </h1>

        <button
          onClick={() => router.navigate({ to: "/ai-assistant" })}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
        >
          {/* <Sparkles className="h-3.5 w-3.5" /> */}
          <span>Ask AI</span>
        </button>
      </div>

      {/* Row 1: Compact 4 KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KpiBentoCard
          metricKey="totalSales"
          title="Total Sales"
          value={formatCompactPKR(sales.totalSales)}
          subtext={`Exact: ${formatPKR(sales.totalSales)}`}
          sparklineData={dailySparkline}
          onClickDrillDown={() => router.navigate({ to: "/orders" as any })}
        />

        <KpiBentoCard
          metricKey="totalOrders"
          title="Total Orders"
          value={sales.totalOrders.toLocaleString()}
          subtext="Non-cancelled order count"
          onClickDrillDown={() => router.navigate({ to: "/orders" as any })}
        />

        <KpiBentoCard
          metricKey="avgOrderValue"
          title="Average Order Value"
          value={formatCompactPKR(sales.averageOrderValue)}
          subtext={`Exact: ${formatPKR(sales.averageOrderValue)}`}
        />

        <KpiBentoCard
          metricKey="salesGrowth"
          title="Sales Growth"
          value={
            sales.salesGrowthPct != null
              ? `${sales.salesGrowthPct >= 0 ? "+" : ""}${sales.salesGrowthPct.toFixed(1)}%`
              : "N/A"
          }
          subtext="vs previous matching period"
        />
      </div>

      {/* Row 2: Prominent Primary Supporting Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[340px] md:min-h-0">
        {/* Visualization 1: Monthly Sales Trend */}
        <div className="lg:col-span-7 flex flex-col min-h-[320px] md:min-h-0">
          <SalesPerformanceCard />
        </div>

        {/* Visualization 2: Sales by Category */}
        <div className="lg:col-span-5 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-primary" /> Sales by Category
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              {categorySales.length} Categories
            </span>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categorySales}
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
                        <p className="text-primary font-mono font-bold">Sales: {formatPKR(d.sales)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                  {categorySales.map((_item, index: number) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
