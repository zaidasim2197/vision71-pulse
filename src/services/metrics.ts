// Business logic layer. Every dashboard number is derived here from the
// source records — no component computes business values on its own.
//
// Haroon's Architecture Document is the single source of truth for all KPI
// definitions and formulas. See METRIC_INFO at the bottom for exact wording.

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
import { inRange, previousRange, type DateRange } from "./dateRange";

const QUALIFYING = new Set<string>(QUALIFYING_STATUSES);

/** Legacy filter — used by AI engine. Keeps Shipped/Delivered/Returned/Partially Returned. */
export const isQualifyingOrder = (o: Order) => QUALIFYING.has(o.order_status);

/** Haroon filter — "orders that are not cancelled". Includes Pending, Processing, etc. */
export const isNotCancelled = (o: Order) => o.order_status !== "Cancelled";

export interface SalesMetrics {
  grossSales: number;
  returns: number;
  netSales: number;
  grossProfit: number;
  grossMarginPct: number;
  totalOrders: number;
  averageOrderValue: number;
}

/** Legacy sales calc using QUALIFYING_STATUSES — kept for AI engine. */
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

// ======================== HAROON-COMPLIANT KPIs ========================

/** Page 1 — Sales Performance (Haroon §3.1) */
export interface HaroonSalesKPIs {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowthPct: number | null;
}

/**
 * Haroon Total Sales: Sum(quantity × unit_price) across order lines for
 * not-cancelled orders where order_date is in selected range.
 * Uses line_total from OrderItem which IS quantity × unit_price.
 */
export function calculateHaroonSales(data: Dataset, range: DateRange): HaroonSalesKPIs {
  const orderIdsInRange = new Set<string>();
  for (const o of data.orders) {
    if (isNotCancelled(o) && inRange(o.order_date, range)) {
      orderIdsInRange.add(o.order_id);
    }
  }
  let totalSales = 0;
  for (const item of data.orderItems) {
    if (orderIdsInRange.has(item.order_id)) {
      totalSales += item.line_total; // line_total = quantity × unit_price
    }
  }
  const totalOrders = orderIdsInRange.size;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Sales Growth: compare to previous period of equal length
  const prev = previousRange(range);
  const prevOrderIds = new Set<string>();
  for (const o of data.orders) {
    if (isNotCancelled(o) && inRange(o.order_date, prev)) {
      prevOrderIds.add(o.order_id);
    }
  }
  let prevSales = 0;
  for (const item of data.orderItems) {
    if (prevOrderIds.has(item.order_id)) {
      prevSales += item.line_total;
    }
  }
  const salesGrowthPct = prevSales > 0
    ? ((totalSales - prevSales) / prevSales) * 100
    : null;

  return { totalSales, totalOrders, averageOrderValue, salesGrowthPct };
}

/** Monthly sales series using Haroon's not-cancelled filter. */
export function calculateHaroonMonthlySales(data: Dataset, range: DateRange): { month: string; label: string; sales: number; orders: number }[] {
  const orderIdsInRange = new Set<string>();
  const orderMonths = new Map<string, string>(); // order_id → month
  for (const o of data.orders) {
    if (isNotCancelled(o) && inRange(o.order_date, range)) {
      orderIdsInRange.add(o.order_id);
      orderMonths.set(o.order_id, o.order_date.slice(0, 7));
    }
  }
  const map = new Map<string, { month: string; sales: number; orders: Set<string> }>();
  for (const item of data.orderItems) {
    const month = orderMonths.get(item.order_id);
    if (!month) continue;
    let row = map.get(month);
    if (!row) {
      row = { month, sales: 0, orders: new Set() };
      map.set(month, row);
    }
    row.sales += item.line_total;
    row.orders.add(item.order_id);
  }
  return [...map.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((r) => ({ month: r.month, label: r.month, sales: r.sales, orders: r.orders.size }));
}

/** Sales by category using Haroon's not-cancelled filter. */
export function calculateSalesByCategory(data: Dataset, range: DateRange): { category: string; sales: number }[] {
  const orderIdsInRange = new Set<string>();
  for (const o of data.orders) {
    if (isNotCancelled(o) && inRange(o.order_date, range)) {
      orderIdsInRange.add(o.order_id);
    }
  }
  const map = new Map<string, number>();
  for (const item of data.orderItems) {
    if (!orderIdsInRange.has(item.order_id)) continue;
    const product = data.productById.get(item.product_id);
    const cat = product?.category ?? "Other";
    map.set(cat, (map.get(cat) ?? 0) + item.line_total);
  }
  return [...map.entries()]
    .map(([category, sales]) => ({ category, sales }))
    .sort((a, b) => b.sales - a.sales);
}

/** Page 2 — Orders & Fulfillment (Haroon §3.2) */
export interface OrdersFulfillmentKPIs {
  ordersPending: number;
  ordersDelivered: number;
  ordersCancelled: number;
  fulfillmentRate: number;
  totalOrdersInRange: number;
}

export function calculateOrdersFulfillment(data: Dataset, range: DateRange): OrdersFulfillmentKPIs {
  let ordersPending = 0;
  let ordersDelivered = 0;
  let ordersCancelled = 0;
  let totalNotCancelled = 0;
  for (const o of data.orders) {
    if (!inRange(o.order_date, range)) continue;
    if (o.order_status === "Cancelled") { ordersCancelled++; continue; }
    totalNotCancelled++;
    if (o.order_status === "Pending" || o.order_status === "Processing") ordersPending++;
    if (o.order_status === "Delivered") ordersDelivered++;
  }
  const fulfillmentRate = totalNotCancelled > 0 ? (ordersDelivered / totalNotCancelled) * 100 : 0;
  return { ordersPending, ordersDelivered, ordersCancelled, fulfillmentRate, totalOrdersInRange: totalNotCancelled + ordersCancelled };
}

/** Monthly order counts for Orders Over Time chart. */
export function calculateMonthlyOrders(data: Dataset, range: DateRange): { month: string; total: number; delivered: number; cancelled: number }[] {
  const map = new Map<string, { month: string; total: number; delivered: number; cancelled: number }>();
  for (const o of data.orders) {
    if (!inRange(o.order_date, range)) continue;
    const m = o.order_date.slice(0, 7);
    let row = map.get(m);
    if (!row) { row = { month: m, total: 0, delivered: 0, cancelled: 0 }; map.set(m, row); }
    row.total++;
    if (o.order_status === "Delivered") row.delivered++;
    if (o.order_status === "Cancelled") row.cancelled++;
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

/** Page 3 — Inventory (Haroon §3.3) — Live snapshot, ignores date filter */
export interface HaroonInventoryKPIs {
  totalStockValue: number;
  itemsLowOnStock: number;
  itemsOutOfStock: number;
  totalActiveProducts: number;
}

export function calculateHaroonInventory(data: Dataset): HaroonInventoryKPIs {
  let totalStockValue = 0;
  let itemsLowOnStock = 0;
  let itemsOutOfStock = 0;
  const activeProducts = data.products.filter(p => p.product_status === "Active");

  // Aggregate quantity_on_hand per product across all warehouses
  const qtyByProduct = new Map<string, number>();
  for (const row of data.inventory) {
    qtyByProduct.set(row.product_id, (qtyByProduct.get(row.product_id) ?? 0) + row.quantity_on_hand);
  }

  for (const p of activeProducts) {
    const qoh = qtyByProduct.get(p.product_id) ?? 0;
    totalStockValue += qoh * p.unit_cost;
    if (qoh === 0) itemsOutOfStock++;
    else if (qoh <= p.reorder_level) itemsLowOnStock++;
  }

  return { totalStockValue, itemsLowOnStock, itemsOutOfStock, totalActiveProducts: activeProducts.length };
}

/** Low stock items list for the Inventory page ranking visualization. */
export function getLowStockItems(data: Dataset, limit = 10): { product: Product; quantityOnHand: number; reorderLevel: number; pctOfReorder: number }[] {
  const qtyByProduct = new Map<string, number>();
  for (const row of data.inventory) {
    qtyByProduct.set(row.product_id, (qtyByProduct.get(row.product_id) ?? 0) + row.quantity_on_hand);
  }
  const items: { product: Product; quantityOnHand: number; reorderLevel: number; pctOfReorder: number }[] = [];
  for (const p of data.products) {
    if (p.product_status !== "Active") continue;
    const qoh = qtyByProduct.get(p.product_id) ?? 0;
    if (qoh > 0 && qoh <= p.reorder_level) {
      items.push({ product: p, quantityOnHand: qoh, reorderLevel: p.reorder_level, pctOfReorder: p.reorder_level > 0 ? (qoh / p.reorder_level) * 100 : 0 });
    }
  }
  return items.sort((a, b) => a.pctOfReorder - b.pctOfReorder).slice(0, limit);
}

/** Page 4 — Receivables (Haroon §3.4) */
export interface HaroonReceivablesKPIs {
  totalOutstanding: number;
  overdueAmount: number;
  overdueInvoicesCount: number;
  avgDaysToPay: number | null;
}

export function calculateHaroonReceivables(data: Dataset, range: DateRange): HaroonReceivablesKPIs {
  const today = REFERENCE_DATE;
  let totalOutstanding = 0;
  let overdueAmount = 0;
  let overdueInvoicesCount = 0;

  // Total Outstanding & Overdue are LIVE SNAPSHOTS (ignore date filter)
  for (const r of data.receivables) {
    const outstanding = r.invoice_amount - r.amount_paid;
    if (outstanding <= 0) continue; // Paid
    totalOutstanding += outstanding;
    if (r.due_date < today) {
      overdueAmount += outstanding;
      overdueInvoicesCount++;
    }
  }

  // Avg Days to Pay: date-filtered — invoices marked Paid within selected range
  let payDaysSum = 0;
  let payDaysCount = 0;
  for (const r of data.receivables) {
    const outstanding = r.invoice_amount - r.amount_paid;
    if (outstanding > 0.01) continue; // Not fully paid
    // Find payment date from payments table
    const payments = data.payments.filter(p => p.invoice_id === r.invoice_id);
    if (payments.length === 0) continue;
    const lastPayment = payments.sort((a, b) => b.payment_date.localeCompare(a.payment_date))[0]!;
    if (!inRange(lastPayment.payment_date, range)) continue;
    const daysDiff = Math.round(
      (Date.parse(`${lastPayment.payment_date}T00:00:00Z`) - Date.parse(`${r.invoice_date}T00:00:00Z`)) / 86_400_000
    );
    if (daysDiff >= 0) {
      payDaysSum += daysDiff;
      payDaysCount++;
    }
  }
  const avgDaysToPay = payDaysCount > 0 ? payDaysSum / payDaysCount : null;

  return { totalOutstanding, overdueAmount, overdueInvoicesCount, avgDaysToPay };
}

/** Top overdue customers for the Receivables page visualization. */
export function getTopOverdueCustomers(data: Dataset, limit = 5): { customerName: string; overdueAmount: number; invoiceCount: number }[] {
  const today = REFERENCE_DATE;
  const map = new Map<string, { name: string; amount: number; count: number }>();
  for (const r of data.receivables) {
    const outstanding = r.invoice_amount - r.amount_paid;
    if (outstanding <= 0 || r.due_date >= today) continue;
    const cust = data.customerById.get(r.customer_id);
    const name = cust?.customer_name ?? r.customer_id;
    let row = map.get(r.customer_id);
    if (!row) { row = { name, amount: 0, count: 0 }; map.set(r.customer_id, row); }
    row.amount += outstanding;
    row.count++;
  }
  return [...map.values()]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
    .map(r => ({ customerName: r.name, overdueAmount: r.amount, invoiceCount: r.count }));
}

/** Page 5 — Top Performers (Haroon §3.5), using not-cancelled filter */
export function getHaroonTopProducts(data: Dataset, range: DateRange, limit = 5): ProductPerformance[] {
  const map = new Map<string, ProductPerformance>();
  for (const o of data.orders) {
    if (!isNotCancelled(o) || !inRange(o.order_date, range)) continue;
    const items = data.itemsByOrder.get(o.order_id);
    if (!items) continue;
    for (const item of items) {
      const product = data.productById.get(item.product_id);
      if (!product) continue;
      let row = map.get(item.product_id);
      if (!row) { row = { product, revenue: 0, units: 0, grossProfit: 0, marginPct: 0, orders: 0 }; map.set(item.product_id, row); }
      row.revenue += item.line_total;
      row.units += item.quantity;
      row.grossProfit += item.line_total - item.line_cost;
      row.orders++;
    }
  }
  return [...map.values()]
    .map(r => ({ ...r, marginPct: r.revenue > 0 ? (r.grossProfit / r.revenue) * 100 : 0 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function getHaroonTopCustomers(data: Dataset, range: DateRange, limit = 5): CustomerPerformance[] {
  const map = new Map<string, CustomerPerformance>();
  for (const o of data.orders) {
    if (!isNotCancelled(o) || !inRange(o.order_date, range)) continue;
    const customer = data.customerById.get(o.customer_id);
    if (!customer) continue;
    let row = map.get(o.customer_id);
    if (!row) { row = { customer, revenue: 0, orders: 0, grossProfit: 0, outstanding: 0 }; map.set(o.customer_id, row); }
    row.revenue += o.total_amount;
    row.grossProfit += o.gross_profit;
    row.orders++;
  }
  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

/** Page 6 — Operational KPIs (Haroon §3.6) */
export interface OperationalKPIs {
  avgFulfillmentTimeDays: number | null;
  returnRatePct: number;
  repeatCustomerRatePct: number;
  inventoryTurnover: number | null;
}

export function calculateOperationalKPIs(data: Dataset, range: DateRange): OperationalKPIs {
  // Avg Fulfillment Time: avg(delivered_date - order_date) for Delivered orders in range
  let fulfillSum = 0;
  let fulfillCount = 0;
  let returnedCount = 0;
  let totalNotCancelled = 0;
  const customerOrders = new Map<string, number>();

  for (const o of data.orders) {
    if (!inRange(o.order_date, range)) continue;
    if (o.order_status === "Cancelled") continue;
    totalNotCancelled++;
    if (o.order_status === "Returned") returnedCount++;

    // Track customer orders for repeat rate
    customerOrders.set(o.customer_id, (customerOrders.get(o.customer_id) ?? 0) + 1);

    if (o.order_status === "Delivered" && o.delivered_date) {
      const days = Math.round(
        (Date.parse(`${o.delivered_date}T00:00:00Z`) - Date.parse(`${o.order_date}T00:00:00Z`)) / 86_400_000
      );
      if (days >= 0) { fulfillSum += days; fulfillCount++; }
    }
  }

  const avgFulfillmentTimeDays = fulfillCount > 0 ? fulfillSum / fulfillCount : null;
  const returnRatePct = totalNotCancelled > 0 ? (returnedCount / totalNotCancelled) * 100 : 0;

  // Repeat Customer Rate
  const totalCustomers = customerOrders.size;
  let repeatCustomers = 0;
  for (const count of customerOrders.values()) {
    if (count > 1) repeatCustomers++;
  }
  const repeatCustomerRatePct = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

  // Inventory Turnover: COGS in range / Average Inventory Value
  let cogs = 0;
  for (const o of data.orders) {
    if (!isNotCancelled(o) || !inRange(o.order_date, range)) continue;
    cogs += o.total_cost;
  }
  const invKPIs = calculateHaroonInventory(data);
  const avgInvValue = invKPIs.totalStockValue; // snapshot = current value; for demo, use as average
  const inventoryTurnover = avgInvValue > 0 ? cogs / avgInvValue : null;

  return { avgFulfillmentTimeDays, returnRatePct, repeatCustomerRatePct, inventoryTurnover };
}

/** Monthly fulfillment time trend for Operations page chart. */
export function calculateMonthlyFulfillmentTrend(data: Dataset, range: DateRange): { month: string; avgDays: number }[] {
  const map = new Map<string, { sum: number; count: number }>();
  for (const o of data.orders) {
    if (o.order_status !== "Delivered" || !o.delivered_date || !inRange(o.order_date, range)) continue;
    const days = Math.round(
      (Date.parse(`${o.delivered_date}T00:00:00Z`) - Date.parse(`${o.order_date}T00:00:00Z`)) / 86_400_000
    );
    if (days < 0) continue;
    const m = o.order_date.slice(0, 7);
    let row = map.get(m);
    if (!row) { row = { sum: 0, count: 0 }; map.set(m, row); }
    row.sum += days;
    row.count++;
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, r]) => ({ month, avgDays: r.count > 0 ? r.sum / r.count : 0 }));
}

/** Monthly return rate trend for Operations page chart. */
export function calculateMonthlyReturnTrend(data: Dataset, range: DateRange): { month: string; returnRate: number }[] {
  const map = new Map<string, { total: number; returned: number }>();
  for (const o of data.orders) {
    if (!inRange(o.order_date, range)) continue;
    if (o.order_status === "Cancelled") continue;
    const m = o.order_date.slice(0, 7);
    let row = map.get(m);
    if (!row) { row = { total: 0, returned: 0 }; map.set(m, row); }
    row.total++;
    if (o.order_status === "Returned") row.returned++;
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, r]) => ({ month, returnRate: r.total > 0 ? (r.returned / r.total) * 100 : 0 }));
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

export function getTopProductsByProfit(data: Dataset, range: DateRange, limit?: number): ProductPerformance[] {
  const products = getTopProducts(data, range);
  const sorted = [...products].sort((a, b) => b.grossProfit - a.grossProfit);
  return limit ? sorted.slice(0, limit) : sorted;
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

export interface CityPerformance {
  city: string;
  orders: number;
  revenue: number;
  customersCount: number;
}

export function getCityPerformance(data: Dataset, range: DateRange, limit?: number): CityPerformance[] {
  const cityMap = new Map<string, CityPerformance>();
  const customersInCity = new Map<string, Set<string>>();

  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    const customer = data.customerById.get(o.customer_id);
    const city = customer?.city ?? "Unknown";
    let row = cityMap.get(city);
    if (!row) {
      row = { city, orders: 0, revenue: 0, customersCount: 0 };
      cityMap.set(city, row);
    }
    row.orders += 1;
    row.revenue += o.total_amount;

    let custSet = customersInCity.get(city);
    if (!custSet) {
      custSet = new Set<string>();
      customersInCity.set(city, custSet);
    }
    custSet.add(o.customer_id);
  }

  const rows = [...cityMap.values()]
    .map((r) => ({
      ...r,
      customersCount: customersInCity.get(r.city)?.size ?? 0,
    }))
    .sort((a, b) => b.orders - a.orders);

  return limit ? rows.slice(0, limit) : rows;
}

export interface IndustryPerformance {
  industry: string;
  orders: number;
  revenue: number;
  customersCount: number;
}

export function getIndustryPerformance(data: Dataset, range: DateRange, limit?: number): IndustryPerformance[] {
  const indMap = new Map<string, IndustryPerformance>();
  const custInInd = new Map<string, Set<string>>();

  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    const customer = data.customerById.get(o.customer_id);
    const industry = customer?.industry ?? "Unknown";
    let row = indMap.get(industry);
    if (!row) {
      row = { industry, orders: 0, revenue: 0, customersCount: 0 };
      indMap.set(industry, row);
    }
    row.orders += 1;
    row.revenue += o.total_amount;

    let custSet = custInInd.get(industry);
    if (!custSet) {
      custSet = new Set<string>();
      custInInd.set(industry, custSet);
    }
    custSet.add(o.customer_id);
  }

  const rows = [...indMap.values()]
    .map((r) => ({
      ...r,
      customersCount: custInInd.get(r.industry)?.size ?? 0,
    }))
    .sort((a, b) => b.orders - a.orders);

  return limit ? rows.slice(0, limit) : rows;
}

export interface ChannelPerformance {
  channel: string;
  orders: number;
  revenue: number;
}

export function getChannelPerformance(data: Dataset, range: DateRange): ChannelPerformance[] {
  const chanMap = new Map<string, ChannelPerformance>();
  for (const o of data.orders) {
    if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
    const channel = o.sales_channel || "Direct";
    let row = chanMap.get(channel);
    if (!row) {
      row = { channel, orders: 0, revenue: 0 };
      chanMap.set(channel, row);
    }
    row.orders += 1;
    row.revenue += o.total_amount;
  }
  return [...chanMap.values()].sort((a, b) => b.revenue - a.revenue);
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

export function formatChartAxisTick(v: any, formatValue: "pkr" | "pct" | "number" = "pkr"): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return String(v ?? "");
  if (v === 0) return "0";
  if (formatValue === "pct") return `${v}%`;

  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e9) {
    const val = abs / 1e9;
    return `${sign}${val % 1 === 0 ? val.toFixed(0) : val < 10 ? val.toFixed(1) : val.toFixed(0)}B`;
  }
  if (abs >= 1e6) {
    const val = abs / 1e6;
    return `${sign}${val % 1 === 0 ? val.toFixed(0) : val < 10 ? val.toFixed(1) : val.toFixed(0)}M`;
  }
  if (abs >= 1e3) {
    const val = abs / 1e3;
    return `${sign}${val % 1 === 0 ? val.toFixed(0) : val < 10 ? val.toFixed(1) : val.toFixed(0)}K`;
  }
  return `${sign}${abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(1)}`;
}

export const formatPct = (value: number, decimals = 1) =>
  Number.isFinite(value) ? `${value.toFixed(decimals)}%` : "—";

export function trend(current: number, previous: number): { pct: number; direction: "up" | "down" | "flat" } | null {
  if (!Number.isFinite(previous) || previous === 0) return null;
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  return { pct, direction: pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat" };
}

export interface MetricDefinition {
  title: string;
  definition: string;
  formula: string;
  rules: string[];
  sources: string[];
  sample?: string;
}

// ======================== HAROON METRIC DEFINITIONS ========================
// Every definition uses Haroon's exact wording from the Architecture Document.

export const METRIC_INFO: Record<string, MetricDefinition> = {
  // --- Page 1: Sales Performance ---
  totalSales: {
    title: "Total Sales",
    definition: "The total value of everything sold in the selected date range.",
    formula: "Sum of quantity × unit price, across every order line, for orders that are not cancelled, where the order date falls in the selected range.",
    rules: ["Excludes cancelled orders only. All other statuses are included."],
    sources: ["CustomerOrder", "OrderLine"],
  },
  totalOrders: {
    title: "Total Orders",
    definition: "The number of orders placed in the selected date range.",
    formula: "Count of orders that are not cancelled, where the order date falls in the selected range.",
    rules: ["Excludes cancelled orders only."],
    sources: ["CustomerOrder"],
  },
  avgOrderValue: {
    title: "Average Order Value",
    definition: "How much a typical order is worth.",
    formula: "Total Sales ÷ Total Orders",
    rules: ["Derived from Total Sales and Total Orders for the same range."],
    sources: ["CustomerOrder", "OrderLine"],
  },
  salesGrowth: {
    title: "Sales Growth",
    definition: "How sales in this period compare to the period right before it.",
    formula: "(Current Period Sales − Previous Period Sales) ÷ Previous Period Sales × 100",
    rules: ["Previous period is the immediately preceding window of equal length."],
    sources: ["CustomerOrder", "OrderLine"],
  },
  // --- Page 2: Orders & Fulfillment ---
  ordersPending: {
    title: "Orders Pending",
    definition: "Orders still waiting to be processed or shipped.",
    formula: "Count of orders with status Pending or Processing, where order date falls in the selected range.",
    rules: [],
    sources: ["CustomerOrder"],
  },
  ordersDelivered: {
    title: "Orders Delivered",
    definition: "Orders successfully completed in the range.",
    formula: "Count of orders with status Delivered, where order date falls in the selected range.",
    rules: [],
    sources: ["CustomerOrder"],
  },
  ordersCancelled: {
    title: "Orders Cancelled",
    definition: "Orders that did not go through.",
    formula: "Count of orders with status Cancelled, where order date falls in the selected range.",
    rules: [],
    sources: ["CustomerOrder"],
  },
  fulfillmentRate: {
    title: "Fulfillment Rate",
    definition: "The share of placed orders that were actually delivered.",
    formula: "Orders Delivered ÷ Total Orders × 100",
    rules: ["Total Orders excludes cancelled orders."],
    sources: ["CustomerOrder"],
  },
  // --- Page 3: Inventory ---
  totalStockValue: {
    title: "Total Stock Value",
    definition: "The value of everything currently sitting in inventory.",
    formula: "Sum of quantity on hand × unit cost, across all active products.",
    rules: ["Live snapshot — not affected by the date filter."],
    sources: ["InventoryPosition", "Product"],
  },
  lowStock: {
    title: "Items Low on Stock",
    definition: "Products that are close to running out.",
    formula: "Count of products where quantity on hand > 0 and ≤ reorder threshold.",
    rules: [],
    sources: ["InventoryPosition", "Product"],
  },
  outOfStock: {
    title: "Items Out of Stock",
    definition: "Products with nothing left to sell.",
    formula: "Count of products where quantity on hand = 0.",
    rules: [],
    sources: ["InventoryPosition", "Product"],
  },
  activeProducts: {
    title: "Total Active Products",
    definition: "How many products are currently sold.",
    formula: "Count of products marked active.",
    rules: [],
    sources: ["Product"],
  },
  // --- Page 4: Receivables ---
  totalOutstanding: {
    title: "Total Outstanding",
    definition: "Money the business is still owed by customers right now.",
    formula: "Sum of invoice amount − paid amount, for invoices with status not equal to Paid.",
    rules: ["Live snapshot — not affected by the date filter."],
    sources: ["Receivable"],
  },
  overdueAmount: {
    title: "Overdue Amount",
    definition: "Money that is not just outstanding but already late.",
    formula: "Sum of invoice amount − paid amount, where due date is before today and status is not Paid.",
    rules: [],
    sources: ["Receivable"],
  },
  overdueInvoices: {
    title: "Overdue Invoices",
    definition: "How many separate invoices are late.",
    formula: "Count of invoices where due date is before today and status is not Paid.",
    rules: [],
    sources: ["Receivable"],
  },
  avgDaysToPay: {
    title: "Average Days to Pay",
    definition: "How long customers typically take to pay once invoiced.",
    formula: "Average of payment date − invoice date, across invoices marked Paid within the selected range.",
    rules: ["Only fully paid invoices within the selected range are included."],
    sources: ["Receivable", "Payment"],
  },
  // --- Page 5: Top Performers ---
  topProducts: {
    title: "Top Products by Sales",
    definition: "The five products bringing in the most revenue.",
    formula: "Rank every product by sum of quantity × unit price across its order lines, excluding cancelled orders. Show the top five.",
    rules: ["Uses the selected date range."],
    sources: ["CustomerOrder", "OrderLine", "Product"],
  },
  topCustomers: {
    title: "Top Customers by Sales",
    definition: "The five customers bringing in the most revenue.",
    formula: "Rank every customer by sum of their order totals, excluding cancelled orders. Show the top five.",
    rules: ["Uses the selected date range."],
    sources: ["CustomerOrder", "Customer"],
  },
  // --- Page 6: Operational KPIs ---
  avgFulfillmentTime: {
    title: "Average Fulfillment Time",
    definition: "How many days it takes on average from order to delivery.",
    formula: "Average of delivered date − order date, across orders with status Delivered in the selected range.",
    rules: [],
    sources: ["CustomerOrder"],
  },
  returnRate: {
    title: "Return Rate",
    definition: "The share of orders that came back as returns.",
    formula: "Returned Orders ÷ Total Orders × 100",
    rules: ["Total Orders excludes cancelled orders."],
    sources: ["CustomerOrder"],
  },
  repeatCustomerRate: {
    title: "Repeat Customer Rate",
    definition: "How many customers ordered more than once in the range.",
    formula: "Customers with more than one order ÷ Total unique customers × 100",
    rules: ["Only non-cancelled orders in the selected range."],
    sources: ["CustomerOrder", "Customer"],
  },
  inventoryTurnover: {
    title: "Inventory Turnover",
    definition: "How efficiently stock is being sold and replaced.",
    formula: "Cost of Goods Sold in selected range ÷ Average Inventory Value.",
    rules: [],
    sources: ["CustomerOrder", "InventoryPosition", "Product"],
  },
  // --- Legacy (kept for AI engine / Action Center) ---
  netSales: {
    title: "Net Sales",
    definition: "Total revenue from qualifying orders minus refunds and returns.",
    formula: "Net Sales = Gross Sales − Refunds",
    rules: ["Uses qualifying statuses: Shipped, Delivered, Returned, Partially Returned."],
    sources: ["orders", "returns"],
  },
  grossProfit: {
    title: "Gross Profit & Margin",
    definition: "Profit margin after subtracting product costs from gross sales.",
    formula: "Gross Profit = Sum(Line Total − Line Cost); Margin % = Gross Profit ÷ Gross Sales × 100",
    rules: ["Only qualifying order items are included."],
    sources: ["orders", "order_items", "products"],
  },
  receivables: {
    title: "Outstanding Receivables",
    definition: "Uncollected payment balances on issued customer invoices.",
    formula: "Outstanding = Invoice Amount − Amount Paid",
    rules: ["Live snapshot — not affected by the date filter."],
    sources: ["receivables", "payments"],
  },
  inventoryValue: {
    title: "Inventory Value",
    definition: "Total monetary valuation of physical stock held in warehouses.",
    formula: "Value = Quantity On Hand × Unit Cost",
    rules: ["Live snapshot — not affected by the date filter."],
    sources: ["inventory", "products"],
  },
  onTimeDelivery: {
    title: "On-Time Delivery Rate",
    definition: "Percentage of deliveries that arrived on or before the promised date.",
    formula: "On-Time Rate = On-Time Deliveries ÷ Total Completed × 100",
    rules: ["On-Time: delivered_date ≤ required_date."],
    sources: ["orders"],
  },
  orderStatus: {
    title: "Order Status Breakdown",
    definition: "Breakdown of all orders across their lifecycle stages.",
    formula: "Group orders by order_status",
    rules: [],
    sources: ["orders"],
  },
  actionCenter: {
    title: "Action Center",
    definition: "Automated alerts highlighting operational bottlenecks and risks.",
    formula: "Rule evaluation over inventory, receivables, and delivery data",
    rules: [
      "Critical: Out-of-stock items, Overdue invoices.",
      "Warning: Low-stock items, Delayed deliveries.",
    ],
    sources: ["inventory", "receivables", "orders"],
  },
};

