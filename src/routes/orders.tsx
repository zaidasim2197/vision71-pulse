import { useState, useMemo } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import { formatCompactPKR, formatPKR, isQualifyingOrder } from "@/services/metrics";
import { inRange } from "@/services/dateRange";
import { type Order, type OrderItem } from "@/lib/dataset";
import { Search, Filter, ShoppingBag, Eye, X, ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  validateSearch: (search: Record<string, unknown>) => ({
    search: search["search"] ? String(search["search"]) : undefined,
    status: search["status"] ? String(search["status"]) : undefined,
    delivery: search["delivery"] ? String(search["delivery"]) : undefined,
  }),
});

function OrdersPage() {
  const { dataset, dateRange } = useDataset();
  const searchParams = useSearch({ from: "/orders" });

  const [query, setQuery] = useState(searchParams.search || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.status || "ALL");
  const [deliveryFilter, setDeliveryFilter] = useState(searchParams.delivery || "ALL");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (!dataset) return [];
    return dataset.orders.filter((o) => {
      if (!inRange(o.order_date, dateRange)) return false;
      if (statusFilter !== "ALL" && o.order_status !== statusFilter) return false;
      if (deliveryFilter !== "ALL") {
        if (deliveryFilter === "Delayed" && o.delivery_status !== "Delayed") return false;
        if (deliveryFilter === "On-Time" && o.delivery_status !== "On-Time") return false;
        if (deliveryFilter === "Overdue Open Order") {
          if (o.delivered_date || o.order_status === "Cancelled" || !o.required_date || o.required_date >= "2026-09-01")
            return false;
        }
      }
      if (query) {
        const q = query.toLowerCase();
        const cust = dataset.customerById.get(o.customer_id)?.customer_name.toLowerCase() ?? "";
        return o.order_id.toLowerCase().includes(q) || o.customer_id.toLowerCase().includes(q) || cust.includes(q);
      }
      return true;
    });
  }, [dataset, dateRange, statusFilter, deliveryFilter, query]);

  if (!dataset) return null;

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const qualifyingCount = filteredOrders.filter(isQualifyingOrder).length;
  const totalVal = filteredOrders.filter(isQualifyingOrder).reduce((a, b) => a + b.total_amount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" /> Order Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time sales orders, fulfillment statuses, and line item breakdowns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono px-3 py-1 bg-card">
            {filteredOrders.length.toLocaleString()} Orders Filtered
          </Badge>
          <Badge variant="secondary" className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary">
            Qualifying Volume: {formatCompactPKR(totalVal)}
          </Badge>
        </div>
      </div>

      {/* Top Order KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            count: filteredOrders.length,
            amount: totalVal,
            sub: "Qualifying period sales volume",
            icon: ShoppingBag,
          },
          {
            label: "Delivered & Shipped",
            count: filteredOrders.filter((o) => o.order_status === "Delivered" || o.order_status === "Shipped").length,
            amount: filteredOrders.filter((o) => o.order_status === "Delivered" || o.order_status === "Shipped").reduce((a, b) => a + b.total_amount, 0),
            sub: "Fulfilled customer orders",
            icon: CheckCircle2,
          },
          {
            label: "On-Time Fulfillment",
            count: filteredOrders.filter((o) => o.delivery_status === "On-Time").length,
            amount: filteredOrders.filter((o) => o.delivery_status === "On-Time").reduce((a, b) => a + b.total_amount, 0),
            sub: "Arrived within target SLA",
            icon: Clock,
          },
          {
            label: "Delayed / Overdue",
            count: filteredOrders.filter((o) => o.delivery_status === "Delayed" || (o.required_date && o.required_date < "2026-09-01" && !o.delivered_date && o.order_status !== "Cancelled")).length,
            amount: filteredOrders.filter((o) => o.delivery_status === "Delayed").reduce((a, b) => a + b.total_amount, 0),
            sub: "Requires dispatch attention",
            icon: AlertTriangle,
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl border border-border/60 bg-card hover:bg-muted/30 transition-all text-left flex flex-col justify-between shadow-2xs"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-muted/50 text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight">{kpi.label}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {kpi.count} Orders
                </Badge>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                  {formatCompactPKR(kpi.amount)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/60 shadow-xs">
        <div className="relative w-full md:w-80">
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
          {query && (
            <X
              onClick={() => setQuery("")}
              className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium">
              <SelectValue placeholder="All Order Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="ALL">All Order Statuses</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
              <SelectItem value="Partially Returned">Partially Returned</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Delivery filter */}
          <Select
            value={deliveryFilter}
            onValueChange={(v) => {
              setDeliveryFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium">
              <SelectValue placeholder="All Delivery Performance" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="ALL">All Delivery Performance</SelectItem>
              <SelectItem value="On-Time">On-Time Deliveries</SelectItem>
              <SelectItem value="Delayed">Delayed Deliveries</SelectItem>
              <SelectItem value="Overdue Open Order">Overdue Open Orders</SelectItem>
            </SelectContent>
          </Select>

          {(statusFilter !== "ALL" || deliveryFilter !== "ALL" || query) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("ALL");
                setDeliveryFilter("ALL");
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

      {/* Orders Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 font-semibold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Gross Profit</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium text-foreground">
              {pagedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                pagedOrders.map((o) => {
                  const customerName = dataset.customerById.get(o.customer_id)?.customer_name ?? o.customer_id;
                  return (
                    <tr key={o.order_id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold">{o.order_id}</td>
                      <td className="py-3 px-4 font-medium">{customerName}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{o.order_date}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            o.order_status === "Delivered" || o.order_status === "Shipped"
                              ? "default"
                              : o.order_status === "Cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-[10px] font-normal"
                        >
                          {o.order_status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {o.delivery_status === "On-Time" ? (
                          <span className="text-success font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> On-Time
                          </span>
                        ) : o.delivery_status === "Delayed" ? (
                          <span className="text-warning font-semibold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Delayed ({o.delivery_delay_days}d)
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-mono text-[11px]">
                            {o.delivered_date ? o.delivered_date : "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{o.sales_channel}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatCompactPKR(o.total_amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-success">
                        {formatCompactPKR(o.gross_profit)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(o)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                          title="View order items"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages} ({filteredOrders.length.toLocaleString()} total orders)
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

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        {selectedOrder && (
          <OrderItemsModal order={selectedOrder} dataset={dataset} onClose={() => setSelectedOrder(null)} />
        )}
      </Dialog>
    </div>
  );
}

function OrderItemsModal({ order, dataset, onClose }: { order: Order; dataset: any; onClose: () => void }) {
  const items: OrderItem[] = dataset.itemsByOrder.get(order.order_id) ?? [];
  const customer = dataset.customerById.get(order.customer_id);

  return (
    <DialogContent className="sm:max-w-[560px] rounded-3xl p-6">
      <DialogHeader>
        <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
          <span>Order Details #{order.order_id}</span>
          <Badge variant="outline" className="text-xs font-mono">
            {order.order_status}
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2 text-xs">
        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono">
          <div>
            <span className="text-[10px] text-muted-foreground block">Customer</span>
            <strong className="text-foreground">{customer?.customer_name ?? order.customer_id}</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Order Date</span>
            <strong className="text-foreground">{order.order_date}</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Required Date</span>
            <strong className="text-foreground">{order.required_date ?? "N/A"}</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Delivered Date</span>
            <strong className="text-foreground">{order.delivered_date ?? "Pending"}</strong>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-foreground">Order Line Items ({items.length})</h4>
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 font-semibold text-muted-foreground text-[11px]">
                <tr>
                  <th className="p-2.5">Product</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                {items.map((item, i) => {
                  const prod = dataset.productById.get(item.product_id);
                  return (
                    <tr key={i}>
                      <td className="p-2.5 font-sans font-medium text-foreground">
                        {prod?.product_name ?? item.product_id}
                        <span className="text-[10px] text-muted-foreground block">{prod?.sku}</span>
                      </td>
                      <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right font-bold text-foreground">
                        {formatPKR(item.line_total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total summary */}
        <div className="pt-2 border-t border-border/50 flex justify-between items-center font-mono text-xs">
          <span className="text-muted-foreground">Total Amount:</span>
          <strong className="text-base text-foreground font-extrabold">{formatPKR(order.total_amount)}</strong>
        </div>
      </div>
    </DialogContent>
  );
}
