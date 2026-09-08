// Business logic layer. Every dashboard number is derived here from the
// source records — no component computes business values on its own.

import {
  QUALIFYING_STATUSES,
  REFERENCE_DATE,
  type Customer,
  type Dataset,
  type InventoryRow,
  type Order,
  type Product,
  type Receivable,
} from "@/lib/dataset";
import { inRange, type DateRange } from "./dateRange";

const QUALIFYING = new Set<string>(QUALIFYING_STATUSES);

export const isQualifyingOrder = (o: Order) => QUALIFYING.has(o.order_status);

export interface SalesMetrics {
  grossSales: number;
  returns: number;
  netSales: number;
  grossProfit: number;
  grossMarginPct: number;
  totalOrders: number;
  averageOrderValue: number;
}

export function calculateSales(data: Dataset, range: DateRange): SalesMetrics {
  let grossSales = 0;
  let grossProfit = 0;
  let totalOrders = 0;
  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    grossSales += o.total_amount;
    grossProfit += o.gross_profit;
    totalOrders += 1;
  }
  let returns = 0;
  for (const r of data.returns) if (inRange(r.return_date, range)) returns += r.refund_amount;
  const netSales = grossSales - returns;
  return {
    grossSales,
    returns,
    netSales,
    grossProfit,
    grossMarginPct: grossSales > 0 ? (grossProfit / grossSales) * 100 : 0,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? grossSales / totalOrders : 0,
  };
}

export interface MonthlyPoint {
  month: string;
  label: string;
  grossSales: number;
  netSales: number;
  grossProfit: number;
  orders: number;
  returns: number;
}

export function calculateMonthlySeries(data: Dataset, range: DateRange): MonthlyPoint[] {
  const map = new Map<string, MonthlyPoint>();
  const touch = (month: string) => {
    let p = map.get(month);
    if (!p) {
      p = { month, label: month, grossSales: 0, netSales: 0, grossProfit: 0, orders: 0, returns: 0 };
      map.set(month, p);
    }
    return p;
  };
  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    const p = touch(o.order_date.slice(0, 7));
    p.grossSales += o.total_amount;
    p.grossProfit += o.gross_profit;
    p.orders += 1;
  }
  for (const r of data.returns) {
    if (!inRange(r.return_date, range)) continue;
    touch(r.return_date.slice(0, 7)).returns += r.refund_amount;
  }
  return [...map.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((p) => ({ ...p, netSales: p.grossSales - p.returns }));
}

/** Daily net sales series — used for KPI sparklines. */
export function calculateDailySeries(data: Dataset, range: DateRange): { date: string; value: number }[] {
  const map = new Map<string, number>();
  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    map.set(o.order_date, (map.get(o.order_date) ?? 0) + o.total_amount);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));
}

export interface OrderStatusSummary {
  status: string;
  count: number;
  value: number;
}

export function getOrderStatusSummary(data: Dataset, range: DateRange): OrderStatusSummary[] {
  const map = new Map<string, OrderStatusSummary>();
  for (const o of data.orders) {
    if (!inRange(o.order_date, range)) continue;
    const row = map.get(o.order_status) ?? { status: o.order_status, count: 0, value: 0 };
    row.count += 1;
    row.value += o.total_amount;
    map.set(o.order_status, row);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Discrepancy";

export interface InventoryRecord {
  product: Product;
  row: InventoryRow;
  available: number;
  status: StockStatus;
  value: number;
}

export function classifyStock(available: number, reorderLevel: number): StockStatus {
  if (available < 0) return "Discrepancy";
  if (available === 0) return "Out of Stock";
  if (available <= reorderLevel) return "Low Stock";
  return "In Stock";
}

export function getInventoryRecords(data: Dataset): InventoryRecord[] {
  const out: InventoryRecord[] = [];
  for (const row of data.inventory) {
    const product = data.productById.get(row.product_id);
    if (!product) continue;
    const available = row.quantity_on_hand - row.quantity_reserved;
    out.push({
      product,
      row,
      available,
      status: classifyStock(available, row.reorder_level),
      value: row.quantity_on_hand * product.unit_cost,
    });
  }
  return out;
}

export interface InventoryHealth {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  discrepancy: number;
  total: number;
  inventoryValue: number;
  healthyPct: number;
}

export function calculateInventoryHealth(records: InventoryRecord[]): InventoryHealth {
  const health: InventoryHealth = {
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    discrepancy: 0,
    total: records.length,
    inventoryValue: 0,
    healthyPct: 0,
  };
  for (const r of records) {
    health.inventoryValue += r.value;
    if (r.status === "In Stock") health.inStock += 1;
    else if (r.status === "Low Stock") health.lowStock += 1;
    else if (r.status === "Out of Stock") health.outOfStock += 1;
    else health.discrepancy += 1;
  }
  health.healthyPct = health.total ? (health.inStock / health.total) * 100 : 0;
  return health;
}

export type ReceivableStatus = "Paid" | "Current" | "Due Soon" | "Overdue";

export interface ReceivableRecord {
  invoice: Receivable;
  customerName: string;
  outstanding: number;
  status: ReceivableStatus;
  daysOverdue: number;
  daysUntilDue: number;
}

const DUE_SOON_WINDOW = 14;
const dayDiff = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

export function getReceivableRecords(data: Dataset, referenceDate = REFERENCE_DATE): ReceivableRecord[] {
  return data.receivables.map((invoice) => {
    const outstanding = Number((invoice.invoice_amount - invoice.amount_paid).toFixed(2));
    const daysUntilDue = dayDiff(referenceDate, invoice.due_date);
    let status: ReceivableStatus = "Paid";
    if (outstanding > 0) {
      if (invoice.due_date < referenceDate) status = "Overdue";
      else if (daysUntilDue <= DUE_SOON_WINDOW) status = "Due Soon";
      else status = "Current";
    }
    return {
      invoice,
      customerName: data.customerById.get(invoice.customer_id)?.customer_name ?? invoice.customer_id,
      outstanding,
      status,
      daysOverdue: status === "Overdue" ? -daysUntilDue : 0,
      daysUntilDue,
    };
  });
}

export interface ReceivablesSummary {
  outstanding: number;
  current: number;
  dueSoon: number;
  overdue: number;
  overduePct: number;
  paidCount: number;
  overdueCount: number;
  currentCount: number;
  dueSoonCount: number;
  aging: { bucket: string; amount: number; count: number }[];
}

export function calculateReceivables(records: ReceivableRecord[]): ReceivablesSummary {
  const s: ReceivablesSummary = {
    outstanding: 0,
    current: 0,
    dueSoon: 0,
    overdue: 0,
    overduePct: 0,
    paidCount: 0,
    overdueCount: 0,
    currentCount: 0,
    dueSoonCount: 0,
    aging: [
      { bucket: "Not due", amount: 0, count: 0 },
      { bucket: "1–30 days", amount: 0, count: 0 },
      { bucket: "31–60 days", amount: 0, count: 0 },
      { bucket: "61–90 days", amount: 0, count: 0 },
      { bucket: "90+ days", amount: 0, count: 0 },
    ],
  };
  for (const r of records) {
    if (r.status === "Paid") {
      s.paidCount += 1;
      continue;
    }
    s.outstanding += r.outstanding;
    if (r.status === "Current") {
      s.current += r.outstanding;
      s.currentCount += 1;
    } else if (r.status === "Due Soon") {
      s.dueSoon += r.outstanding;
      s.dueSoonCount += 1;
    } else {
      s.overdue += r.outstanding;
      s.overdueCount += 1;
    }
    const idx =
      r.status !== "Overdue" ? 0 : r.daysOverdue <= 30 ? 1 : r.daysOverdue <= 60 ? 2 : r.daysOverdue <= 90 ? 3 : 4;
    s.aging[idx]!.amount += r.outstanding;
    s.aging[idx]!.count += 1;
  }
  s.overduePct = s.outstanding > 0 ? (s.overdue / s.outstanding) * 100 : 0;
  return s;
}

export interface DeliveryPerformance {
  completed: number;
  onTime: number;
  delayed: number;
  onTimeRate: number;
  avgLeadTimeDays: number;
  avgDelayDays: number;
  overdueOpenOrders: number;
}

export function calculateDeliveryPerformance(data: Dataset, range: DateRange): DeliveryPerformance {
  let completed = 0;
  let onTime = 0;
  let delayed = 0;
  let leadSum = 0;
  let leadCount = 0;
  let delaySum = 0;
  let overdueOpen = 0;
  for (const o of data.orders) {
    if (o.delivered_date && inRange(o.delivered_date, range)) {
      completed += 1;
      const isOnTime = !!o.required_date && o.delivered_date <= o.required_date;
      if (isOnTime) onTime += 1;
      else {
        delayed += 1;
        delaySum += o.delivery_delay_days ?? 0;
      }
      if (o.delivery_lead_time_days != null) {
        leadSum += o.delivery_lead_time_days;
        leadCount += 1;
      }
    }
    if (
      inRange(o.order_date, range) &&
      !o.delivered_date &&
      o.order_status !== "Cancelled" &&
      !!o.required_date &&
      o.required_date < REFERENCE_DATE
    )
      overdueOpen += 1;
  }
  return {
    completed,
    onTime,
    delayed,
    onTimeRate: completed ? (onTime / completed) * 100 : 0,
    avgLeadTimeDays: leadCount ? leadSum / leadCount : 0,
    avgDelayDays: delayed ? delaySum / delayed : 0,
    overdueOpenOrders: overdueOpen,
  };
}

export interface ProductPerformance {
  product: Product;
  revenue: number;
  units: number;
  grossProfit: number;
  marginPct: number;
  orders: number;
}

export function getTopProducts(data: Dataset, range: DateRange, limit?: number): ProductPerformance[] {
  const map = new Map<string, ProductPerformance>();
  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    const items = data.itemsByOrder.get(o.order_id);
    if (!items) continue;
    for (const item of items) {
      const product = data.productById.get(item.product_id);
      if (!product) continue;
      let row = map.get(item.product_id);
      if (!row) {
        row = { product, revenue: 0, units: 0, grossProfit: 0, marginPct: 0, orders: 0 };
        map.set(item.product_id, row);
      }
      row.revenue += item.line_total;
      row.units += item.quantity;
      row.grossProfit += item.line_total - item.line_cost;
      row.orders += 1;
    }
  }
  const rows = [...map.values()]
    .map((r) => ({ ...r, marginPct: r.revenue > 0 ? (r.grossProfit / r.revenue) * 100 : 0 }))
    .sort((a, b) => b.revenue - a.revenue);
  return limit ? rows.slice(0, limit) : rows;
}

export interface CustomerPerformance {
  customer: Customer;
  revenue: number;
  orders: number;
  grossProfit: number;
  outstanding: number;
}

export function getTopCustomers(data: Dataset, range: DateRange, limit?: number): CustomerPerformance[] {
  const map = new Map<string, CustomerPerformance>();
  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    const customer = data.customerById.get(o.customer_id);
    if (!customer) continue;
    let row = map.get(o.customer_id);
    if (!row) {
      row = { customer, revenue: 0, orders: 0, grossProfit: 0, outstanding: 0 };
      map.set(o.customer_id, row);
    }
    row.revenue += o.total_amount;
    row.grossProfit += o.gross_profit;
    row.orders += 1;
  }
  for (const r of data.receivables) {
    const row = map.get(r.customer_id);
    if (row) row.outstanding += r.invoice_amount - r.amount_paid;
  }
  const rows = [...map.values()].sort((a, b) => b.revenue - a.revenue);
  return limit ? rows.slice(0, limit) : rows;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  actionLabel: string;
  to: string;
  search?: Record<string, string>;
}

export function buildAlerts(
  inventory: InventoryHealth,
  receivables: ReceivablesSummary,
  delivery: DeliveryPerformance,
): Alert[] {
  const alerts: Alert[] = [];
  if (inventory.outOfStock > 0)
    alerts.push({
      id: "oos",
      severity: "critical",
      title: `${inventory.outOfStock} products are out of stock`,
      detail: "No available units left to fulfil new orders.",
      actionLabel: "Review inventory",
      to: "/inventory",
      search: { status: "Out of Stock" },
    });
  if (receivables.overdueCount > 0)
    alerts.push({
      id: "overdue",
      severity: "critical",
      title: `${receivables.overdueCount} invoices are overdue`,
      detail: `${formatCompactPKR(receivables.overdue)} past its due date.`,
      actionLabel: "Review receivables",
      to: "/receivables",
      search: { status: "Overdue" },
    });
  if (inventory.lowStock > 0)
    alerts.push({
      id: "low",
      severity: "warning",
      title: `${inventory.lowStock} products are below reorder level`,
      detail: "Available stock is at or under the reorder point.",
      actionLabel: "Review inventory",
      to: "/inventory",
      search: { status: "Low Stock" },
    });
  if (delivery.delayed > 0)
    alerts.push({
      id: "delayed",
      severity: "warning",
      title: `${delivery.delayed.toLocaleString()} deliveries were delayed`,
      detail: `Average delay of ${delivery.avgDelayDays.toFixed(1)} days against the promised date.`,
      actionLabel: "Review delivery performance",
      to: "/orders",
      search: { delivery: "Delayed" },
    });
  if (delivery.overdueOpenOrders > 0)
    alerts.push({
      id: "overdueOpen",
      severity: "warning",
      title: `${delivery.overdueOpenOrders.toLocaleString()} open orders are past their required date`,
      detail: "Not yet delivered and the promised date has passed.",
      actionLabel: "Review orders",
      to: "/orders",
      search: { delivery: "Overdue Open Order" },
    });
  if (inventory.discrepancy > 0)
    alerts.push({
      id: "disc",
      severity: "info",
      title: `${inventory.discrepancy} inventory discrepancies detected`,
      detail: "Reserved units exceed units on hand.",
      actionLabel: "Review inventory",
      to: "/inventory",
      search: { status: "Discrepancy" },
    });
  return alerts;
}

// ---------- formatting helpers ----------

export function formatPKR(value: number, opts: { compact?: boolean; decimals?: number } = {}): string {
  if (!Number.isFinite(value)) return "—";
  if (opts.compact) return `PKR ${compact(value)}`;
  return `PKR ${value.toLocaleString("en-US", {
    minimumFractionDigits: opts.decimals ?? 0,
    maximumFractionDigits: opts.decimals ?? 0,
  })}`;
}

export const formatCompactPKR = (value: number) => `PKR ${compact(value)}`;

export function compact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

export const formatPct = (value: number, decimals = 1) =>
  Number.isFinite(value) ? `${value.toFixed(decimals)}%` : "—";

export function trend(current: number, previous: number): { pct: number; direction: "up" | "down" | "flat" } | null {
  if (!Number.isFinite(previous) || previous === 0) return null;
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  return { pct, direction: pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat" };
}
