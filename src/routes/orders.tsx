import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateOrdersFulfillment,
  getOrderStatusSummary,
  formatCompactPKR,
  formatPKR,
  calculateMonthlySeries,
} from "@/services/metrics";
import { inRange, formatMonth } from "@/services/dateRange";
import { type Order, type OrderItem } from "@/lib/dataset";
import { KpiBentoCard } from "@/components/dashboard/KpiBentoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ShoppingBag,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ListFilter,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

const STATUS_COLORS: Record<string, string> = {
  Delivered: "oklch(0.68 0.14 140)",
  Shipped: "oklch(0.52 0.128 178)",
  Processing: "oklch(0.6 0.118 220)",
  Pending: "oklch(0.65 0.18 45)",
  Cancelled: "oklch(0.58 0.22 25)",
  Returned: "oklch(0.58 0.15 290)",
  "Partially Returned": "oklch(0.62 0.12 20)",
};

function OrdersPage() {
  const { dataset, loading, dateRange } = useDataset();

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const currFulfillment = calculateOrdersFulfillment(dataset, dateRange);
  const statusSummary = getOrderStatusSummary(dataset, dateRange);

  const statusPieData = statusSummary.map((item) => ({
    name: item.status,
    value: item.count,
    color: STATUS_COLORS[item.status] || "oklch(0.5 0.05 200)",
  }));

  const monthlyData = calculateMonthlySeries(dataset, dateRange)
    .filter((s) => s.month <= "2026-08")
    .map((s) => ({
      ...s,
      monthLabel: formatMonth(s.month),
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 md:py-4 h-full flex flex-col justify-between overflow-y-auto md:overflow-hidden space-y-3.5">
      {/* Clean Page Header (No Subtitles, No Haroon badges) */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" /> Orders & Fulfillment Dashboard
        </h1>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setTableModalOpen(true)}
          className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-border/70 bg-card hover:bg-muted"
        >
          <ListFilter className="h-3.5 w-3.5 text-primary" />
          <span>Search & View Orders Table</span>
        </Button>
      </div>

      {/* Row 1: Compact 4 KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KpiBentoCard
          metricKey="ordersPending"
          title="Pending Orders"
          value={currFulfillment.ordersPending.toLocaleString()}
          subtext="Pending & Processing backlog"
          badgeText="Operational Backlog"
          onClickDrillDown={() => setTableModalOpen(true)}
        />

        <KpiBentoCard
          metricKey="ordersDelivered"
          title="Delivered Orders"
          value={currFulfillment.ordersDelivered.toLocaleString()}
          subtext="Successfully completed"
          onClickDrillDown={() => setTableModalOpen(true)}
        />

        <KpiBentoCard
          metricKey="ordersCancelled"
          title="Cancelled Orders"
          value={currFulfillment.ordersCancelled.toLocaleString()}
          subtext="Orders not fulfilled"
        />

        <KpiBentoCard
          metricKey="fulfillmentRate"
          title="Fulfillment Rate"
          value={`${currFulfillment.fulfillmentRate.toFixed(1)}%`}
          subtext="Delivered / Total placed orders"
        />
      </div>

      {/* Row 2: Prominent Primary Supporting Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[340px] md:min-h-0">
        {/* Visualization 1: Order Status Breakdown (Pie/Donut) */}
        <div className="lg:col-span-5 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-primary" /> Order Status Breakdown
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              Total Placed: {currFulfillment.totalOrdersInRange.toLocaleString()}
            </span>
          </div>

          <div className="flex-1 w-full relative min-h-0 flex items-center justify-center pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="75%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--color-card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]!.payload;
                    const pct = currFulfillment.totalOrdersInRange > 0 ? (d.value / currFulfillment.totalOrdersInRange) * 100 : 0;
                    return (
                      <div className="rounded-xl border border-border/80 bg-card p-2.5 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">{d.name}</p>
                        <p className="text-primary font-mono font-bold">{d.value.toLocaleString()} Orders</p>
                        <p className="text-muted-foreground">{pct.toFixed(1)}% of total</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Compact Legend */}
          <div className="grid grid-cols-3 gap-x-2 gap-y-1 pt-2 border-t border-border/40 shrink-0">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-[10px]">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}:</span>
                <span className="font-bold text-foreground font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visualization 2: Orders Volume Over Time */}
        <div className="lg:col-span-7 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <LineIcon className="h-4 w-4 text-primary" /> Monthly Orders Trend
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              Avg/Month: {Math.round(currFulfillment.totalOrdersInRange / (monthlyData.length || 1))} Orders
            </span>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 15, left: 0, bottom: 15 }}>
                <defs>
                  <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.52 0.128 178)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.52 0.128 178)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
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
                  width={40}
                  tickLine={false}
                  axisLine={false}
                  domain={[(min: number) => Math.max(0, Math.floor(min * 0.85)), "auto"]}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]!.payload;
                    return (
                      <div className="rounded-xl border border-border/80 bg-card p-2.5 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">{d.monthLabel} ({d.month})</p>
                        <p className="text-primary font-mono font-bold">Total Orders: {d.orders.toLocaleString()}</p>
                        <p className="text-success font-mono">Net Sales: {formatCompactPKR(d.netSales)}</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="oklch(0.52 0.128 178)"
                  strokeWidth={2.5}
                  fill="url(#ordersGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search & Orders Table Modal */}
      <Dialog open={tableModalOpen} onOpenChange={setTableModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] rounded-3xl p-6 flex flex-col">
          <OrdersTableContainer dataset={dataset} dateRange={dateRange} onSelectOrder={setSelectedOrder} />
        </DialogContent>
      </Dialog>

      {/* Order Item Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        {selectedOrder && (
          <OrderItemsDetailModal order={selectedOrder} dataset={dataset} />
        )}
      </Dialog>
    </div>
  );
}

function OrdersTableContainer({
  dataset,
  dateRange,
  onSelectOrder,
}: {
  dataset: any;
  dateRange: any;
  onSelectOrder: (o: Order) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filteredOrders = useMemo(() => {
    return dataset.orders.filter((o: Order) => {
      if (!inRange(o.order_date, dateRange)) return false;
      if (query) {
        const q = query.toLowerCase();
        const cust = dataset.customerById.get(o.customer_id)?.customer_name.toLowerCase() ?? "";
        return o.order_id.toLowerCase().includes(q) || cust.includes(q);
      }
      return true;
    });
  }, [dataset, dateRange, query]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paged = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      <DialogHeader>
        <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
          <span>Order Search & Record Table</span>
          <Badge variant="outline" className="text-xs font-mono">
            {filteredOrders.length.toLocaleString()} Orders
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order ID or customer name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9 text-xs h-9 rounded-xl"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 overflow-hidden flex-1 min-h-0">
        <div className="overflow-y-auto max-h-[450px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-semibold text-muted-foreground sticky top-0 bg-card">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {paged.map((o: Order) => (
                <tr key={o.order_id} className="hover:bg-muted/30">
                  <td className="p-3 font-mono font-bold">{o.order_id}</td>
                  <td className="p-3">{dataset.customerById.get(o.customer_id)?.customer_name ?? o.customer_id}</td>
                  <td className="p-3 font-mono text-muted-foreground">{o.order_date}</td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {o.order_status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">{formatCompactPKR(o.total_amount)}</td>
                  <td className="p-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectOrder(o)}
                      className="h-7 w-7 rounded-lg"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </td>
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

function OrderItemsDetailModal({ order, dataset }: { order: Order; dataset: any }) {
  const items: OrderItem[] = dataset.itemsByOrder.get(order.order_id) ?? [];
  const customer = dataset.customerById.get(order.customer_id);

  return (
    <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
      <DialogHeader>
        <DialogTitle className="text-base font-bold text-foreground">
          Order Details #{order.order_id}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-3 py-2 text-xs">
        <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono">
          <div>
            <span className="text-[10px] text-muted-foreground block">Customer</span>
            <strong className="text-foreground">{customer?.customer_name ?? order.customer_id}</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Order Date</span>
            <strong className="text-foreground">{order.order_date}</strong>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-foreground">Line Items ({items.length})</h4>
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 font-semibold text-muted-foreground text-[11px]">
                <tr>
                  <th className="p-2">Product</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                {items.map((item, i) => {
                  const prod = dataset.productById.get(item.product_id);
                  return (
                    <tr key={i}>
                      <td className="p-2 font-sans font-medium text-foreground">
                        {prod?.product_name ?? item.product_id}
                      </td>
                      <td className="p-2 text-center font-bold">{item.quantity}</td>
                      <td className="p-2 text-right font-bold text-foreground">
                        {formatPKR(item.line_total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
