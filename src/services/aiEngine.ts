import { type Dataset } from "@/lib/dataset";
import {
  calculateDeliveryPerformance,
  calculateInventoryHealth,
  calculateReceivables,
  calculateSales,
  formatCompactPKR,
  formatPKR,
  getInventoryRecords,
  getReceivableRecords,
  getTopCustomers,
  getTopProducts,
  getOrderStatusSummary,
} from "./metrics";
import { resolvePreset, type DateRange } from "./dateRange";

export interface AIAnalysisResult {
  isSupported: boolean;
  question: string;
  structuredFacts: string;
  directAnswer: string;
}

export function queryAiEngine(
  question: string,
  data: Dataset,
  currentRange: DateRange,
): AIAnalysisResult {
  const q = question.toLowerCase().trim();

  // Out of scope check (weather, recipes, coding, generic knowledge, etc.)
  const outOfScopeKeywords = [
    "weather",
    "recipe",
    "president",
    "capital",
    "joke",
    "python",
    "javascript",
    "code",
    "who are you",
    "hello",
    "hi",
    "how are you",
    "tell me a story",
  ];
  if (
    outOfScopeKeywords.some((k) => q === k || q.startsWith(k + " ")) &&
    !q.includes("sales") &&
    !q.includes("order") &&
    !q.includes("stock")
  ) {
    return {
      isSupported: false,
      question,
      structuredFacts: "Out of scope request.",
      directAnswer:
        "I can't help with that. I can only answer questions about the available Sales & Operations data.",
    };
  }

  // 1. Sales & Revenue
  if (
    q.includes("net sales") ||
    q.includes("total sales") ||
    q.includes("how much are we selling") ||
    q.includes("revenue") ||
    q.includes("gross sales")
  ) {
    const sales = calculateSales(data, currentRange);
    const facts = `Net Sales: ${formatPKR(sales.netSales)} (${formatCompactPKR(sales.netSales)}). Gross Sales: ${formatPKR(sales.grossSales)}. Returns: ${formatPKR(sales.returns)}. Gross Profit: ${formatPKR(sales.grossProfit)} (${sales.grossMarginPct.toFixed(2)}% margin). Total Qualifying Orders: ${sales.totalOrders.toLocaleString()}. Selected period: ${currentRange.preset}.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Net Sales for the selected period are ${formatCompactPKR(sales.netSales)} (${formatPKR(sales.netSales)}). Gross sales reached ${formatCompactPKR(sales.grossSales)} with ${formatCompactPKR(sales.returns)} in returns across ${sales.totalOrders.toLocaleString()} qualifying orders.`,
    };
  }

  // 2. Profit / Gross Profit
  if (q.includes("profit") || q.includes("margin")) {
    const sales = calculateSales(data, currentRange);
    const facts = `Gross Profit: ${formatPKR(sales.grossProfit)} (${formatCompactPKR(sales.grossProfit)}). Gross Margin: ${sales.grossMarginPct.toFixed(2)}%. Gross Sales: ${formatPKR(sales.grossSales)}.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Gross Profit is ${formatCompactPKR(sales.grossProfit)} (${formatPKR(sales.grossProfit)}), representing a gross profit margin of ${sales.grossMarginPct.toFixed(2)}% on gross sales of ${formatCompactPKR(sales.grossSales)}.`,
    };
  }

  // 3. Receivables & Outstanding / Overdue
  if (
    q.includes("receivable") ||
    q.includes("outstanding") ||
    q.includes("overdue") ||
    q.includes("due soon") ||
    q.includes("unpaid") ||
    q.includes("invoice")
  ) {
    const recRecords = getReceivableRecords(data);
    const rec = calculateReceivables(recRecords);
    const facts = `Total Outstanding Receivables: ${formatPKR(rec.outstanding)} (${formatCompactPKR(rec.outstanding)}). Overdue Receivables: ${formatPKR(rec.overdue)} (${formatCompactPKR(rec.overdue)}). Overdue Share: ${rec.overduePct.toFixed(2)}%. Overdue Invoices Count: ${rec.overdueCount}. Current Outstanding: ${formatCompactPKR(rec.current)}. Due Soon Outstanding: ${formatCompactPKR(rec.dueSoon)}.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Total outstanding receivables are ${formatCompactPKR(rec.outstanding)} (${formatPKR(rec.outstanding)}). Of this, ${formatCompactPKR(rec.overdue)} is overdue across ${rec.overdueCount} invoices, representing ${rec.overduePct.toFixed(2)}% of total receivables.`,
    };
  }

  // 4. Inventory Health & Stock
  if (
    q.includes("inventory") ||
    q.includes("stock") ||
    q.includes("low stock") ||
    q.includes("out of stock") ||
    q.includes("discrepancy") ||
    q.includes("reorder")
  ) {
    const invRecords = getInventoryRecords(data);
    const inv = calculateInventoryHealth(invRecords);
    const facts = `Total Inventory Valuation: ${formatPKR(inv.inventoryValue)} (${formatCompactPKR(inv.inventoryValue)}). Total SKUs: ${inv.total}. In Stock: ${inv.inStock}. Low Stock: ${inv.lowStock}. Out of Stock: ${inv.outOfStock}. Inventory Discrepancy: ${inv.discrepancy}. Healthy Stock Pct: ${inv.healthyPct.toFixed(1)}%.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Inventory valuation is ${formatCompactPKR(inv.inventoryValue)}. Stock breakdown across ${inv.total} products: ${inv.inStock} In Stock, ${inv.lowStock} Low Stock (at/below reorder level), ${inv.outOfStock} Out of Stock, and ${inv.discrepancy} Discrepancy items.`,
    };
  }

  // 5. Delivery & Operations Performance
  if (
    q.includes("delivery") ||
    q.includes("on-time") ||
    q.includes("delayed") ||
    q.includes("lead time") ||
    q.includes("logistics")
  ) {
    const del = calculateDeliveryPerformance(data, currentRange);
    const facts = `Completed Deliveries: ${del.completed.toLocaleString()}. On-Time Deliveries: ${del.onTime.toLocaleString()}. Delayed Deliveries: ${del.delayed.toLocaleString()}. On-Time Delivery Rate: ${del.onTimeRate.toFixed(2)}%. Avg Lead Time: ${del.avgLeadTimeDays.toFixed(2)} days. Avg Delay: ${del.avgDelayDays.toFixed(2)} days. Overdue Open Orders: ${del.overdueOpenOrders}.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Our on-time delivery rate is ${del.onTimeRate.toFixed(2)}%. Out of ${del.completed.toLocaleString()} completed deliveries, ${del.onTime.toLocaleString()} arrived on time while ${del.delayed.toLocaleString()} were delayed (avg lead time: ${del.avgLeadTimeDays.toFixed(1)} days).`,
    };
  }

  // 6. Top Products
  if (
    q.includes("product") ||
    q.includes("top product") ||
    q.includes("best selling") ||
    q.includes("highest revenue product")
  ) {
    const top = getTopProducts(data, currentRange, 5);
    if (!top.length) {
      return {
        isSupported: true,
        question,
        structuredFacts: "No product sales in range.",
        directAnswer: "No qualifying product sales were recorded in the selected date range.",
      };
    }
    const top1 = top[0]!;
    const topList = top
      .map(
        (p, i) =>
          `#${i + 1} ${p.product.product_name} (${formatCompactPKR(p.revenue)}, ${p.units} units)`,
      )
      .join("; ");
    const facts = `Top Product: ${top1.product.product_name} generating ${formatPKR(top1.revenue)} across ${top1.units} units. Top 5 Products: ${topList}.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `${top1.product.product_name} is our top product, generating ${formatCompactPKR(top1.revenue)} (${formatPKR(top1.revenue)}) across ${top1.units} units sold in the selected period.`,
    };
  }

  // 7. Top Customers
  if (
    q.includes("customer") ||
    q.includes("top customer") ||
    q.includes("best customer") ||
    q.includes("highest revenue customer")
  ) {
    const top = getTopCustomers(data, currentRange, 5);
    if (!top.length) {
      return {
        isSupported: true,
        question,
        structuredFacts: "No customer sales in range.",
        directAnswer: "No qualifying customer sales were recorded in the selected date range.",
      };
    }
    const top1 = top[0]!;
    const topList = top
      .map(
        (c, i) =>
          `#${i + 1} ${c.customer.customer_name} (${formatCompactPKR(c.revenue)}, ${c.orders} orders)`,
      )
      .join("; ");
    const facts = `Top Customer: ${top1.customer.customer_name} spending ${formatPKR(top1.revenue)} over ${top1.orders} orders. Top 5 Customers: ${topList}.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `${top1.customer.customer_name} is our top customer by sales volume, generating ${formatCompactPKR(top1.revenue)} (${formatPKR(top1.revenue)}) across ${top1.orders} orders in the selected period.`,
    };
  }

  // 8. Orders & Status summary
  if (q.includes("order") || q.includes("cancelled") || q.includes("pending") || q.includes("processing")) {
    const statuses = getOrderStatusSummary(data, currentRange);
    const summaryStr = statuses.map((s) => `${s.status}: ${s.count} orders (${formatCompactPKR(s.value)})`).join(", ");
    const totalCount = statuses.reduce((acc, s) => acc + s.count, 0);
    const facts = `Total Orders in Range: ${totalCount}. Status Breakdown: ${summaryStr}.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Total order count for the period is ${totalCount.toLocaleString()}. Order breakdown: ${summaryStr}.`,
    };
  }

  // 9. Peak sales month / best month
  if (q.includes("month") || q.includes("highest sales") || q.includes("peak")) {
    const salesAll = calculateSales(data, resolvePreset("allTime"));
    const facts = `Historical Dataset covers March 2025 through August 2026. All-time Net Sales reach ${formatCompactPKR(salesAll.netSales)} (${formatPKR(salesAll.netSales)}) across ${salesAll.totalOrders.toLocaleString()} orders.`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Across the historical dataset (March 2025 – August 2026), total net sales reached ${formatCompactPKR(salesAll.netSales)} (${formatPKR(salesAll.netSales)}).`,
    };
  }

  // Default fallback if query contains business keywords but didn't trigger specific branch
  const businessKeywords = ["sales", "revenue", "order", "product", "customer", "inventory", "stock", "receivable", "payment", "delivery", "invoice", "profit"];
  if (businessKeywords.some((k) => q.includes(k))) {
    const sales = calculateSales(data, currentRange);
    const rec = calculateReceivables(getReceivableRecords(data));
    const inv = calculateInventoryHealth(getInventoryRecords(data));
    const facts = `Net Sales: ${formatCompactPKR(sales.netSales)}. Orders: ${sales.totalOrders}. Outstanding Receivables: ${formatCompactPKR(rec.outstanding)}. Overdue Receivables: ${formatCompactPKR(rec.overdue)}. Inventory Value: ${formatCompactPKR(inv.inventoryValue)} (${inv.lowStock} low stock, ${inv.outOfStock} out of stock).`;
    return {
      isSupported: true,
      question,
      structuredFacts: facts,
      directAnswer: `Here is a summary for the current view: Net Sales are ${formatCompactPKR(sales.netSales)}, Outstanding Receivables are ${formatCompactPKR(rec.outstanding)} (${formatCompactPKR(rec.overdue)} overdue), and Inventory Valuation is ${formatCompactPKR(inv.inventoryValue)}.`,
    };
  }

  return {
    isSupported: false,
    question,
    structuredFacts: "Question not supported by dataset.",
    directAnswer:
      "I can't help with that. I can only answer questions about the available Sales & Operations data.",
  };
}
