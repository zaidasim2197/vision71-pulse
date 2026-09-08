import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateSales,
  calculateReceivables,
  calculateInventoryHealth,
  calculateDeliveryPerformance,
  getInventoryRecords,
  getReceivableRecords,
  formatCompactPKR,
  formatPKR,
  calculateDailySeries,
} from "@/services/metrics";
import { KpiBentoCard } from "@/components/dashboard/KpiBentoCard";
import { SalesPerformanceCard } from "@/components/dashboard/SalesPerformanceCard";
import { InventoryHealthCard } from "@/components/dashboard/InventoryHealthCard";
import { OrderStatusCard } from "@/components/dashboard/OrderStatusCard";
import { ActionCenterCard } from "@/components/dashboard/ActionCenterCard";
import { TopProductsCard } from "@/components/dashboard/TopProductsCard";
import { TopCustomersCard } from "@/components/dashboard/TopCustomersCard";
import { ReceivablesCard } from "@/components/dashboard/ReceivablesCard";
import { DeliveryPerformanceCard } from "@/components/dashboard/DeliveryPerformanceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { dataset, loading, dateRange, prevDateRange } = useDataset();
  const router = useRouter();

  if (loading || !dataset) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-[360px] lg:col-span-8 rounded-3xl" />
          <Skeleton className="h-[360px] lg:col-span-4 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Calculate current period metrics
  const sales = calculateSales(dataset, dateRange);
  const salesPrev = calculateSales(dataset, prevDateRange);

  const recRecords = getReceivableRecords(dataset);
  const rec = calculateReceivables(recRecords);

  const invRecords = getInventoryRecords(dataset);
  const inv = calculateInventoryHealth(invRecords);

  const delivery = calculateDeliveryPerformance(dataset, dateRange);
  const deliveryPrev = calculateDeliveryPerformance(dataset, prevDateRange);

  const dailySparkline = calculateDailySeries(dataset, dateRange);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Good morning, Team 👋
            </h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">
              Live Operations
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Here's what's happening across your business today.</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-primary/90 font-mono font-medium">
              <Clock className="h-3 w-3" /> Data through Aug 31, 2026 | Reference date: Sep 1, 2026
            </span>
          </p>
        </div>

        {/* Header Right Status Badges */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-success/30 bg-success/10 text-success text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Dataset Verified (7/7 Passed)</span>
          </div>
          <button
            onClick={() => router.navigate({ to: "/ai-assistant" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Row 1: Primary KPI Bento Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Net Sales */}
        <KpiBentoCard
          metricKey="netSales"
          title="Net Sales"
          value={formatCompactPKR(sales.netSales)}
          subtext={`Gross: ${formatCompactPKR(sales.grossSales)}`}
          currentVal={sales.netSales}
          prevVal={salesPrev.netSales}
          sparklineData={dailySparkline}
          onClickDrillDown={() => router.navigate({ to: "/orders" as any })}
        />

        {/* 2. Gross Profit & Margin */}
        <KpiBentoCard
          metricKey="grossProfit"
          title="Gross Profit"
          value={formatCompactPKR(sales.grossProfit)}
          subtext={`Margin: ${sales.grossMarginPct.toFixed(1)}%`}
          currentVal={sales.grossProfit}
          prevVal={salesPrev.grossProfit}
        />

        {/* 3. Total Orders & AOV */}
        <KpiBentoCard
          metricKey="totalOrders"
          title="Total Orders"
          value={sales.totalOrders.toLocaleString()}
          subtext={`AOV: ${formatCompactPKR(sales.averageOrderValue)}`}
          currentVal={sales.totalOrders}
          prevVal={salesPrev.totalOrders}
          onClickDrillDown={() => router.navigate({ to: "/orders" as any })}
        />

        {/* 4. Outstanding Receivables */}
        <KpiBentoCard
          metricKey="receivables"
          title="Receivables"
          value={formatCompactPKR(rec.outstanding)}
          subtext={`Overdue: ${rec.overduePct.toFixed(0)}% (${formatCompactPKR(rec.overdue)})`}
          badgeText={`${rec.overdueCount} Overdue`}
          onClickDrillDown={() => router.navigate({ to: "/receivables" as any, search: { status: "Overdue" } as any })}
        />

        {/* 5. Inventory Valuation */}
        <KpiBentoCard
          metricKey="inventoryValue"
          title="Inventory Value"
          value={formatCompactPKR(inv.inventoryValue)}
          subtext={`${inv.lowStock} Low / ${inv.outOfStock} Out of Stock`}
          badgeText={`${inv.healthyPct.toFixed(0)}% Healthy`}
          onClickDrillDown={() => router.navigate({ to: "/inventory" as any })}
        />

        {/* 6. On-Time Delivery Rate */}
        <KpiBentoCard
          metricKey="onTimeDelivery"
          title="On-Time Delivery"
          value={`${delivery.onTimeRate.toFixed(1)}%`}
          subtext={`${delivery.delayed} Delayed / ${delivery.avgLeadTimeDays.toFixed(1)}d Lead`}
          currentVal={delivery.onTimeRate}
          prevVal={deliveryPrev.onTimeRate}
          onClickDrillDown={() => router.navigate({ to: "/orders" as any, search: { delivery: "Delayed" } as any })}
        />
      </div>

      {/* Row 2: Sales Performance Chart & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SalesPerformanceCard />
        </div>
        <div className="lg:col-span-4">
          <ActionCenterCard />
        </div>
      </div>

      {/* Row 3: Inventory Health & Order Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <InventoryHealthCard />
        </div>
        <div className="lg:col-span-6">
          <OrderStatusCard />
        </div>
      </div>

      {/* Row 4: Top Products & Top Customers Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <TopProductsCard />
        </div>
        <div className="lg:col-span-6">
          <TopCustomersCard />
        </div>
      </div>

      {/* Row 5: Outstanding Receivables & Delivery Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ReceivablesCard />
        </div>
        <div className="lg:col-span-6">
          <DeliveryPerformanceCard />
        </div>
      </div>
    </div>
  );
}
