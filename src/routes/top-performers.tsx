import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  getHaroonTopProducts,
  getHaroonTopCustomers,
  formatCompactPKR,
  formatPKR,
} from "@/services/metrics";
import { KpiBentoCard } from "@/components/dashboard/KpiBentoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy, ShoppingBag, Users } from "lucide-react";
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

export const Route = createFileRoute("/top-performers")({
  component: TopPerformersPage,
});

const PRODUCT_COLORS = [
  "oklch(0.52 0.128 178)",
  "oklch(0.56 0.13 185)",
  "oklch(0.60 0.12 195)",
  "oklch(0.64 0.11 205)",
  "oklch(0.68 0.10 215)",
];

const CUSTOMER_COLORS = [
  "oklch(0.6 0.118 220)",
  "oklch(0.64 0.12 230)",
  "oklch(0.68 0.13 240)",
  "oklch(0.72 0.14 250)",
  "oklch(0.76 0.15 260)",
];

function compactY(val: number): string {
  if (val === 0) return "0";
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
  return `${val}`;
}

function TopPerformersPage() {
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

  const topProducts = getHaroonTopProducts(dataset, dateRange, 5);
  const topCustomers = getHaroonTopCustomers(dataset, dateRange, 5);

  const topProduct = topProducts[0];
  const topCustomer = topCustomers[0];

  const productChartData = topProducts.map((p) => ({
    name: p.product.product_name,
    revenue: p.revenue,
    units: p.units,
  }));

  const customerChartData = topCustomers.map((c) => ({
    name: c.customer.customer_name,
    revenue: c.revenue,
    orders: c.orders,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 md:py-4 h-full flex flex-col justify-between overflow-y-auto md:overflow-hidden space-y-3.5">
      {/* Clean Page Header (No Subtitles, No Haroon text) */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" /> Top Performers Leaderboard
        </h1>

        <Badge variant="secondary" className="text-xs font-mono px-3 py-1">
          Selected Period Rankings
        </Badge>
      </div>

      {/* Row 1: Compact 4 KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KpiBentoCard
          metricKey="topProductSales"
          title="#1 Product Revenue"
          value={topProduct ? formatCompactPKR(topProduct.revenue) : "N/A"}
          subtext={topProduct ? topProduct.product.product_name : "No sales"}
          badgeText="Top SKU"
        />

        <KpiBentoCard
          metricKey="topCustomerSales"
          title="#1 Customer Sales"
          value={topCustomer ? formatCompactPKR(topCustomer.revenue) : "N/A"}
          subtext={topCustomer ? topCustomer.customer.customer_name : "No sales"}
          badgeText="Key Account"
        />

        <KpiBentoCard
          metricKey="activeProductsSold"
          title="Active Products Sold"
          value={topProducts.length > 0 ? `${topProducts.length}+ SKUs` : "0"}
          subtext="Products generated revenue in range"
        />

        <KpiBentoCard
          metricKey="activeCustomers"
          title="Purchasing Customers"
          value={topCustomers.length > 0 ? `${topCustomers.length}+ Accounts` : "0"}
          subtext="Accounts placed orders in range"
        />
      </div>

      {/* Row 2: Prominent Primary Supporting Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[340px] md:min-h-0">
        {/* Visualization 1: Top 5 Products Chart */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" /> Top 5 Products by Sales
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              Revenue Ranking
            </span>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={productChartData}
                margin={{ top: 5, right: 25, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={compactY}
                  minTickGap={25}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  dy={6}
                />
                <YAxis
                  type="category"
                  dataKey="name"
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
                        <p className="font-bold text-foreground">{d.name}</p>
                        <p className="text-primary font-mono font-bold">Sales: {formatPKR(d.revenue)}</p>
                        <p className="text-muted-foreground">Quantity: {d.units.toLocaleString()} units</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {productChartData.map((_item, index: number) => (
                    <Cell key={`cell-${index}`} fill={PRODUCT_COLORS[index % PRODUCT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visualization 2: Top 5 Customers Chart */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Top 5 Customers by Sales
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              Key Account Volume
            </span>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={customerChartData}
                margin={{ top: 5, right: 25, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={compactY}
                  minTickGap={25}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  dy={6}
                />
                <YAxis
                  type="category"
                  dataKey="name"
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
                        <p className="font-bold text-foreground">{d.name}</p>
                        <p className="text-primary font-mono font-bold">Sales: {formatPKR(d.revenue)}</p>
                        <p className="text-muted-foreground">Orders: {d.orders} orders placed</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {customerChartData.map((_item, index: number) => (
                    <Cell key={`cell-${index}`} fill={CUSTOMER_COLORS[index % CUSTOMER_COLORS.length]} />
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
