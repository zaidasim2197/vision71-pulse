import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-Bl18eSKb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REFERENCE_DATE = "2026-09-01";
var DATA_START_DATE = "2025-03-01";
/** Order statuses that qualify as realised sales (cancelled + not-yet-shipped excluded). */
var QUALIFYING_STATUSES = [
	"Shipped",
	"Delivered",
	"Returned",
	"Partially Returned"
];
function materialise(raw) {
	const { columns, rows } = raw;
	const out = new Array(rows.length);
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		const obj = {};
		for (let c = 0; c < columns.length; c++) obj[columns[c]] = row[c];
		out[i] = obj;
	}
	return out;
}
function validate(d) {
	const issues = [];
	const add = (check, ok, details) => issues.push({
		check,
		status: ok ? "PASS" : "FAIL",
		details
	});
	add("Core files loaded", d.orders.length > 0 && d.orderItems.length > 0, `${d.orders.length} orders, ${d.orderItems.length} order items`);
	const orphanItems = d.orderItems.filter((i) => !d.orderById.has(i.order_id)).length;
	add("Order items link to orders", orphanItems === 0, `${orphanItems} orphan items`);
	const orphanOrders = d.orders.filter((o) => !d.customerById.has(o.customer_id)).length;
	add("Orders link to customers", orphanOrders === 0, `${orphanOrders} orphan orders`);
	const badDates = d.orders.filter((o) => Number.isNaN(Date.parse(o.order_date))).length;
	add("Order dates parse", badDates === 0, `${badDates} unparseable dates`);
	const future = d.orders.filter((o) => (o.delivered_date ?? "") > REFERENCE_DATE).length;
	add("No future deliveries", future === 0, `${future} records after ${REFERENCE_DATE}`);
	const paidByInvoice = /* @__PURE__ */ new Map();
	for (const p of d.payments) paidByInvoice.set(p.invoice_id, (paidByInvoice.get(p.invoice_id) ?? 0) + p.payment_amount);
	let maxDiff = 0;
	for (const r of d.receivables) {
		const diff = Math.abs((paidByInvoice.get(r.invoice_id) ?? 0) - r.amount_paid);
		if (diff > maxDiff) maxDiff = diff;
	}
	add("Payments reconcile to receivables", maxDiff < .05, `max difference ${maxDiff.toFixed(2)}`);
	const invMissing = d.inventory.filter((i) => !d.productById.has(i.product_id)).length;
	add("Inventory links to products", invMissing === 0, `${invMissing} unmatched inventory rows`);
	return issues;
}
var cached = null;
function loadDataset() {
	if (cached) return cached;
	cached = (async () => {
		const [orders, orderItems, products, customers, inventory, receivables, payments, returns] = await Promise.all([
			import("./orders-CccKozUG.mjs"),
			import("./order_items-SN9kDitH.mjs"),
			import("./products-BL5EtIuM.mjs"),
			import("./customers-BhDFJS1u.mjs"),
			import("./inventory-BRLVwQzw.mjs"),
			import("./receivables-DMdlIBkV.mjs"),
			import("./payments-B_4NRxvr.mjs"),
			import("./returns-CsJ_O65L.mjs")
		]);
		const o = materialise(orders.default);
		const oi = materialise(orderItems.default);
		const p = materialise(products.default);
		const c = materialise(customers.default);
		const inv = materialise(inventory.default);
		const rec = materialise(receivables.default);
		const pay = materialise(payments.default);
		const ret = materialise(returns.default);
		const productById = new Map(p.map((x) => [x.product_id, x]));
		const customerById = new Map(c.map((x) => [x.customer_id, x]));
		const orderById = new Map(o.map((x) => [x.order_id, x]));
		const itemsByOrder = /* @__PURE__ */ new Map();
		for (const item of oi) {
			const list = itemsByOrder.get(item.order_id);
			if (list) list.push(item);
			else itemsByOrder.set(item.order_id, [item]);
		}
		const base = {
			orders: o,
			orderItems: oi,
			products: p,
			customers: c,
			inventory: inv,
			receivables: rec,
			payments: pay,
			returns: ret,
			productById,
			customerById,
			orderById,
			itemsByOrder
		};
		const validation = validate(base);
		if (typeof console !== "undefined") {
			const failed = validation.filter((v) => v.status === "FAIL");
			if (failed.length) console.error("[dataset validation] failures", failed);
		}
		return {
			...base,
			validation
		};
	})();
	return cached;
}
var PRESET_LABELS = {
	today: "Today",
	yesterday: "Yesterday",
	last7: "Last 7 Days",
	last30: "Last 30 Days",
	thisMonth: "This Month",
	lastMonth: "Last Month",
	thisQuarter: "This Quarter",
	thisYear: "This Year",
	allTime: "All Time",
	custom: "Custom Range"
};
var PRESET_ORDER = [
	"today",
	"yesterday",
	"last7",
	"last30",
	"thisMonth",
	"lastMonth",
	"thisQuarter",
	"thisYear",
	"allTime"
];
var toISO = (d) => d.toISOString().slice(0, 10);
var parse = (s) => /* @__PURE__ */ new Date(`${s}T00:00:00Z`);
var addDays = (s, n) => {
	const d = parse(s);
	d.setUTCDate(d.getUTCDate() + n);
	return toISO(d);
};
var daysBetween = (a, b) => Math.round((parse(b).getTime() - parse(a).getTime()) / 864e5);
function resolvePreset(preset, today = REFERENCE_DATE) {
	const d = parse(today);
	const y = d.getUTCFullYear();
	const m = d.getUTCMonth();
	const startOfMonth = toISO(new Date(Date.UTC(y, m, 1)));
	switch (preset) {
		case "today": return {
			preset,
			from: today,
			to: today
		};
		case "yesterday": {
			const yd = addDays(today, -1);
			return {
				preset,
				from: yd,
				to: yd
			};
		}
		case "last7": return {
			preset,
			from: addDays(today, -6),
			to: today
		};
		case "last30": return {
			preset,
			from: addDays(today, -29),
			to: today
		};
		case "thisMonth": return {
			preset,
			from: startOfMonth,
			to: today
		};
		case "lastMonth": return {
			preset,
			from: toISO(new Date(Date.UTC(y, m - 1, 1))),
			to: toISO(new Date(Date.UTC(y, m, 0)))
		};
		case "thisQuarter": return {
			preset,
			from: toISO(new Date(Date.UTC(y, Math.floor(m / 3) * 3, 1))),
			to: today
		};
		case "thisYear": return {
			preset,
			from: toISO(new Date(Date.UTC(y, 0, 1))),
			to: today
		};
		default: return {
			preset: "allTime",
			from: DATA_START_DATE,
			to: today
		};
	}
}
/** Immediately preceding window of identical length, for period-over-period comparison. */
function previousRange(range) {
	const len = daysBetween(range.from, range.to) + 1;
	return {
		preset: "custom",
		from: addDays(range.from, -len),
		to: addDays(range.from, -1)
	};
}
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function formatDay(iso) {
	if (!iso) return "—";
	const [y, m, d] = iso.split("-");
	return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
function formatMonth(ym) {
	const [y, m] = ym.split("-");
	return `${MONTHS[Number(m) - 1]} ${String(y).slice(2)}`;
}
var inRange = (iso, r) => !!iso && iso >= r.from && iso <= r.to;
var DatasetContext = (0, import_react.createContext)(null);
function DatasetProvider({ children }) {
	const [dataset, setDataset] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [dateRange, setDateRange] = (0, import_react.useState)(() => resolvePreset("allTime"));
	const prevDateRange = (0, import_react.useMemo)(() => previousRange(dateRange), [dateRange]);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [infoMetricKey, setInfoMetricKey] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [drillDown, setDrillDown] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		loadDataset().then((data) => {
			if (isMounted) {
				setDataset(data);
				setLoading(false);
			}
		}).catch((err) => {
			if (isMounted) {
				setError(err);
				setLoading(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, []);
	const value = {
		dataset,
		loading,
		error,
		dateRange,
		setDateRange,
		prevDateRange,
		searchOpen,
		setSearchOpen,
		infoMetricKey,
		setInfoMetricKey,
		settingsOpen,
		setSettingsOpen,
		drillDown,
		setDrillDown
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatasetContext.Provider, {
		value,
		children
	});
}
function useDataset() {
	const ctx = (0, import_react.useContext)(DatasetContext);
	if (!ctx) throw new Error("useDataset must be used within DatasetProvider");
	return ctx;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var QUALIFYING = new Set(QUALIFYING_STATUSES);
var isQualifyingOrder = (o) => QUALIFYING.has(o.order_status);
function calculateSales(data, range) {
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
		grossMarginPct: grossSales > 0 ? grossProfit / grossSales * 100 : 0,
		totalOrders,
		averageOrderValue: totalOrders > 0 ? grossSales / totalOrders : 0
	};
}
function calculateMonthlySeries(data, range) {
	const map = /* @__PURE__ */ new Map();
	const touch = (month) => {
		let p = map.get(month);
		if (!p) {
			p = {
				month,
				label: month,
				grossSales: 0,
				netSales: 0,
				grossProfit: 0,
				orders: 0,
				returns: 0
			};
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
	return [...map.values()].sort((a, b) => a.month.localeCompare(b.month)).map((p) => ({
		...p,
		netSales: p.grossSales - p.returns
	}));
}
/** Daily net sales series — used for KPI sparklines. */
function calculateDailySeries(data, range) {
	const map = /* @__PURE__ */ new Map();
	for (const o of data.orders) {
		if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
		map.set(o.order_date, (map.get(o.order_date) ?? 0) + o.total_amount);
	}
	return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, value]) => ({
		date,
		value
	}));
}
function getOrderStatusSummary(data, range) {
	const map = /* @__PURE__ */ new Map();
	for (const o of data.orders) {
		if (!inRange(o.order_date, range)) continue;
		const row = map.get(o.order_status) ?? {
			status: o.order_status,
			count: 0,
			value: 0
		};
		row.count += 1;
		row.value += o.total_amount;
		map.set(o.order_status, row);
	}
	return [...map.values()].sort((a, b) => b.count - a.count);
}
function classifyStock(available, reorderLevel) {
	if (available < 0) return "Discrepancy";
	if (available === 0) return "Out of Stock";
	if (available <= reorderLevel) return "Low Stock";
	return "In Stock";
}
function getInventoryRecords(data) {
	const out = [];
	for (const row of data.inventory) {
		const product = data.productById.get(row.product_id);
		if (!product) continue;
		const available = row.quantity_on_hand - row.quantity_reserved;
		out.push({
			product,
			row,
			available,
			status: classifyStock(available, row.reorder_level),
			value: row.quantity_on_hand * product.unit_cost
		});
	}
	return out;
}
function calculateInventoryHealth(records) {
	const health = {
		inStock: 0,
		lowStock: 0,
		outOfStock: 0,
		discrepancy: 0,
		total: records.length,
		inventoryValue: 0,
		healthyPct: 0
	};
	for (const r of records) {
		health.inventoryValue += r.value;
		if (r.status === "In Stock") health.inStock += 1;
		else if (r.status === "Low Stock") health.lowStock += 1;
		else if (r.status === "Out of Stock") health.outOfStock += 1;
		else health.discrepancy += 1;
	}
	health.healthyPct = health.total ? health.inStock / health.total * 100 : 0;
	return health;
}
var DUE_SOON_WINDOW = 14;
var dayDiff = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 864e5);
function getReceivableRecords(data, referenceDate = REFERENCE_DATE) {
	return data.receivables.map((invoice) => {
		const outstanding = Number((invoice.invoice_amount - invoice.amount_paid).toFixed(2));
		const daysUntilDue = dayDiff(referenceDate, invoice.due_date);
		let status = "Paid";
		if (outstanding > 0) if (invoice.due_date < referenceDate) status = "Overdue";
		else if (daysUntilDue <= DUE_SOON_WINDOW) status = "Due Soon";
		else status = "Current";
		return {
			invoice,
			customerName: data.customerById.get(invoice.customer_id)?.customer_name ?? invoice.customer_id,
			outstanding,
			status,
			daysOverdue: status === "Overdue" ? -daysUntilDue : 0,
			daysUntilDue
		};
	});
}
function calculateReceivables(records) {
	const s = {
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
			{
				bucket: "Not due",
				amount: 0,
				count: 0
			},
			{
				bucket: "1–30 days",
				amount: 0,
				count: 0
			},
			{
				bucket: "31–60 days",
				amount: 0,
				count: 0
			},
			{
				bucket: "61–90 days",
				amount: 0,
				count: 0
			},
			{
				bucket: "90+ days",
				amount: 0,
				count: 0
			}
		]
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
		const idx = r.status !== "Overdue" ? 0 : r.daysOverdue <= 30 ? 1 : r.daysOverdue <= 60 ? 2 : r.daysOverdue <= 90 ? 3 : 4;
		s.aging[idx].amount += r.outstanding;
		s.aging[idx].count += 1;
	}
	s.overduePct = s.outstanding > 0 ? s.overdue / s.outstanding * 100 : 0;
	return s;
}
function calculateDeliveryPerformance(data, range) {
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
			if (!!o.required_date && o.delivered_date <= o.required_date) onTime += 1;
			else {
				delayed += 1;
				delaySum += o.delivery_delay_days ?? 0;
			}
			if (o.delivery_lead_time_days != null) {
				leadSum += o.delivery_lead_time_days;
				leadCount += 1;
			}
		}
		if (inRange(o.order_date, range) && !o.delivered_date && o.order_status !== "Cancelled" && !!o.required_date && o.required_date < "2026-09-01") overdueOpen += 1;
	}
	return {
		completed,
		onTime,
		delayed,
		onTimeRate: completed ? onTime / completed * 100 : 0,
		avgLeadTimeDays: leadCount ? leadSum / leadCount : 0,
		avgDelayDays: delayed ? delaySum / delayed : 0,
		overdueOpenOrders: overdueOpen
	};
}
function getTopProducts(data, range, limit) {
	const map = /* @__PURE__ */ new Map();
	for (const o of data.orders) {
		if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
		const items = data.itemsByOrder.get(o.order_id);
		if (!items) continue;
		for (const item of items) {
			const product = data.productById.get(item.product_id);
			if (!product) continue;
			let row = map.get(item.product_id);
			if (!row) {
				row = {
					product,
					revenue: 0,
					units: 0,
					grossProfit: 0,
					marginPct: 0,
					orders: 0
				};
				map.set(item.product_id, row);
			}
			row.revenue += item.line_total;
			row.units += item.quantity;
			row.grossProfit += item.line_total - item.line_cost;
			row.orders += 1;
		}
	}
	const rows = [...map.values()].map((r) => ({
		...r,
		marginPct: r.revenue > 0 ? r.grossProfit / r.revenue * 100 : 0
	})).sort((a, b) => b.revenue - a.revenue);
	return limit ? rows.slice(0, limit) : rows;
}
function getTopProductsByProfit(data, range, limit) {
	const sorted = [...getTopProducts(data, range)].sort((a, b) => b.grossProfit - a.grossProfit);
	return limit ? sorted.slice(0, limit) : sorted;
}
function getTopCustomers(data, range, limit) {
	const map = /* @__PURE__ */ new Map();
	for (const o of data.orders) {
		if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
		const customer = data.customerById.get(o.customer_id);
		if (!customer) continue;
		let row = map.get(o.customer_id);
		if (!row) {
			row = {
				customer,
				revenue: 0,
				orders: 0,
				grossProfit: 0,
				outstanding: 0
			};
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
function getCityPerformance(data, range, limit) {
	const cityMap = /* @__PURE__ */ new Map();
	const customersInCity = /* @__PURE__ */ new Map();
	for (const o of data.orders) {
		if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
		const city = data.customerById.get(o.customer_id)?.city ?? "Unknown";
		let row = cityMap.get(city);
		if (!row) {
			row = {
				city,
				orders: 0,
				revenue: 0,
				customersCount: 0
			};
			cityMap.set(city, row);
		}
		row.orders += 1;
		row.revenue += o.total_amount;
		let custSet = customersInCity.get(city);
		if (!custSet) {
			custSet = /* @__PURE__ */ new Set();
			customersInCity.set(city, custSet);
		}
		custSet.add(o.customer_id);
	}
	const rows = [...cityMap.values()].map((r) => ({
		...r,
		customersCount: customersInCity.get(r.city)?.size ?? 0
	})).sort((a, b) => b.orders - a.orders);
	return limit ? rows.slice(0, limit) : rows;
}
function getIndustryPerformance(data, range, limit) {
	const indMap = /* @__PURE__ */ new Map();
	const custInInd = /* @__PURE__ */ new Map();
	for (const o of data.orders) {
		if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
		const industry = data.customerById.get(o.customer_id)?.industry ?? "Unknown";
		let row = indMap.get(industry);
		if (!row) {
			row = {
				industry,
				orders: 0,
				revenue: 0,
				customersCount: 0
			};
			indMap.set(industry, row);
		}
		row.orders += 1;
		row.revenue += o.total_amount;
		let custSet = custInInd.get(industry);
		if (!custSet) {
			custSet = /* @__PURE__ */ new Set();
			custInInd.set(industry, custSet);
		}
		custSet.add(o.customer_id);
	}
	const rows = [...indMap.values()].map((r) => ({
		...r,
		customersCount: custInInd.get(r.industry)?.size ?? 0
	})).sort((a, b) => b.orders - a.orders);
	return limit ? rows.slice(0, limit) : rows;
}
function getChannelPerformance(data, range) {
	const chanMap = /* @__PURE__ */ new Map();
	for (const o of data.orders) {
		if (!isQualifyingOrder(o) || !inRange(o.order_date, range)) continue;
		const channel = o.sales_channel || "Direct";
		let row = chanMap.get(channel);
		if (!row) {
			row = {
				channel,
				orders: 0,
				revenue: 0
			};
			chanMap.set(channel, row);
		}
		row.orders += 1;
		row.revenue += o.total_amount;
	}
	return [...chanMap.values()].sort((a, b) => b.revenue - a.revenue);
}
function buildAlerts(inventory, receivables, delivery) {
	const alerts = [];
	if (inventory.outOfStock > 0) alerts.push({
		id: "oos",
		severity: "critical",
		title: `${inventory.outOfStock} products are out of stock`,
		detail: "No available units left to fulfil new orders.",
		actionLabel: "Review inventory",
		to: "/inventory",
		search: { status: "Out of Stock" }
	});
	if (receivables.overdueCount > 0) alerts.push({
		id: "overdue",
		severity: "critical",
		title: `${receivables.overdueCount} invoices are overdue`,
		detail: `${formatCompactPKR(receivables.overdue)} past its due date.`,
		actionLabel: "Review receivables",
		to: "/receivables",
		search: { status: "Overdue" }
	});
	if (inventory.lowStock > 0) alerts.push({
		id: "low",
		severity: "warning",
		title: `${inventory.lowStock} products are below reorder level`,
		detail: "Available stock is at or under the reorder point.",
		actionLabel: "Review inventory",
		to: "/inventory",
		search: { status: "Low Stock" }
	});
	if (delivery.delayed > 0) alerts.push({
		id: "delayed",
		severity: "warning",
		title: `${delivery.delayed.toLocaleString()} deliveries were delayed`,
		detail: `Average delay of ${delivery.avgDelayDays.toFixed(1)} days against the promised date.`,
		actionLabel: "Review delivery performance",
		to: "/orders",
		search: { delivery: "Delayed" }
	});
	if (delivery.overdueOpenOrders > 0) alerts.push({
		id: "overdueOpen",
		severity: "warning",
		title: `${delivery.overdueOpenOrders.toLocaleString()} open orders are past their required date`,
		detail: "Not yet delivered and the promised date has passed.",
		actionLabel: "Review orders",
		to: "/orders",
		search: { delivery: "Overdue Open Order" }
	});
	if (inventory.discrepancy > 0) alerts.push({
		id: "disc",
		severity: "info",
		title: `${inventory.discrepancy} inventory discrepancies detected`,
		detail: "Reserved units exceed units on hand.",
		actionLabel: "Review inventory",
		to: "/inventory",
		search: { status: "Discrepancy" }
	});
	return alerts;
}
function formatPKR(value, opts = {}) {
	if (!Number.isFinite(value)) return "—";
	if (opts.compact) return `PKR ${compact(value)}`;
	return `PKR ${value.toLocaleString("en-US", {
		minimumFractionDigits: opts.decimals ?? 0,
		maximumFractionDigits: opts.decimals ?? 0
	})}`;
}
var formatCompactPKR = (value) => `PKR ${compact(value)}`;
function compact(value) {
	const abs = Math.abs(value);
	const sign = value < 0 ? "-" : "";
	if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
	if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
	if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
	return `${sign}${abs.toFixed(0)}`;
}
function formatChartAxisTick(v, formatValue = "pkr") {
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
function trend(current, previous) {
	if (!Number.isFinite(previous) || previous === 0) return null;
	const pct = (current - previous) / Math.abs(previous) * 100;
	return {
		pct,
		direction: pct > .05 ? "up" : pct < -.05 ? "down" : "flat"
	};
}
var METRIC_INFO = {
	netSales: {
		title: "Net Sales",
		definition: "Total revenue generated from qualifying customer orders minus customer refunds and returns.",
		formula: "Net Sales = Gross Sales - Refunds",
		rules: [
			"Qualifying order statuses: Shipped, Delivered, Returned, Partially Returned.",
			"Cancelled, Pending, and Confirmed orders are excluded from sales totals.",
			"Returns reduce Net Sales in the period the refund is recorded."
		],
		sources: ["orders.csv", "returns.csv"],
		sample: "Gross Sales PKR 4.38B - Returns PKR 101.4M = Net Sales PKR 4.28B"
	},
	grossProfit: {
		title: "Gross Profit & Margin",
		definition: "The profit financial margin earned after subtracting product unit manufacturing/purchase costs from gross sales.",
		formula: "Gross Profit = Sum(Line Total - Line Cost); Margin % = (Gross Profit / Gross Sales) * 100",
		rules: [
			"Calculated at item level: (unit_price - unit_cost) * quantity.",
			"Only qualifying order items are included.",
			"Refunds/returns do not alter standard COGS cost baselines unless restocked."
		],
		sources: [
			"orders.csv",
			"order_items.csv",
			"products.csv"
		],
		sample: "Gross Sales PKR 4.38B - Cost of Goods PKR 3.50B = Profit PKR 877.7M (20.0%)"
	},
	totalOrders: {
		title: "Total Qualifying Orders",
		definition: "Count of customer orders that reached a fulfilled or shipped status.",
		formula: "Total Orders = Count(orders where order_status in QUALIFYING_STATUSES)",
		rules: ["Qualifying statuses: Shipped, Delivered, Returned, Partially Returned.", "Cancelled, Pending, and Confirmed orders are tracked separately in Order Operations."],
		sources: ["orders.csv"]
	},
	receivables: {
		title: "Outstanding Receivables & Overdue",
		definition: "Uncollected payment balances on issued customer invoices.",
		formula: "Outstanding Amount = Invoice Amount - Amount Paid",
		rules: [
			"Paid: Outstanding Amount = 0.",
			"Current: Outstanding balance exists and due date is > 14 days in the future.",
			"Due Soon: Outstanding balance exists and due date is within 14 days.",
			"Overdue: due_date < reference_date (2026-09-01) AND outstanding_amount > 0."
		],
		sources: [
			"receivables.csv",
			"payments.csv",
			"customers.csv"
		],
		sample: "Total Outstanding PKR 264.0M | Overdue PKR 91.3M (34.58%)"
	},
	inventoryValue: {
		title: "Inventory Value & Health",
		definition: "Total monetary valuation of physical stock held in warehouses and classification by availability.",
		formula: "Quantity Available = Quantity On Hand - Quantity Reserved; Value = On Hand * Unit Cost",
		rules: [
			"In Stock: available > reorder_level",
			"Low Stock: 0 < available <= reorder_level",
			"Out of Stock: available = 0",
			"Inventory Discrepancy: available < 0 (Reserved units exceed units on hand)"
		],
		sources: ["inventory.csv", "products.csv"],
		sample: "52 In Stock, 11 Low Stock, 7 Out of Stock, 2 Discrepancy"
	},
	onTimeDelivery: {
		title: "On-Time Delivery Rate",
		definition: "Percentage of delivered shipments that reached the customer on or before the promised required date.",
		formula: "On-Time Rate = (On-Time Deliveries / Total Completed Deliveries) * 100",
		rules: [
			"On-Time: delivered_date <= required_date.",
			"Delayed: delivered_date > required_date.",
			"Lead Time: delivered_date - order_date.",
			"Overdue Open Order: Order not delivered and required_date < 2026-09-01."
		],
		sources: ["orders.csv"],
		sample: "1,775 On-Time / 2,369 Completed = 74.93% On-Time Rate"
	},
	topProducts: {
		title: "Top Products Ranking",
		definition: "Products ranked by total realized gross revenue from qualifying sales orders.",
		formula: "Product Revenue = Sum(line_total) for qualifying order items",
		rules: ["Excludes line items from cancelled or pending orders.", "Margin % = (Gross Profit / Line Total) * 100"],
		sources: [
			"order_items.csv",
			"orders.csv",
			"products.csv"
		]
	},
	topCustomers: {
		title: "Top Customers Ranking",
		definition: "Key accounts ranked by total purchase volume across qualifying sales orders.",
		formula: "Customer Sales = Sum(total_amount) for qualifying orders",
		rules: ["Outstanding balances are matched directly from customer invoice records."],
		sources: [
			"orders.csv",
			"customers.csv",
			"receivables.csv"
		]
	},
	orderStatus: {
		title: "Order Status Operations",
		definition: "Comprehensive breakdown of all orders across their lifecycle stages.",
		formula: "Group orders by order_status and sum total_amount",
		rules: ["Includes all 3,200 orders in the dataset regardless of status.", "Only qualifying statuses contribute to Net Sales metrics."],
		sources: ["orders.csv"]
	},
	actionCenter: {
		title: "Management Action Center",
		definition: "Automated business alerts highlighting operational bottlenecks and financial risks.",
		formula: "Real-time rule evaluation over inventory, receivables, and order delivery tables",
		rules: [
			"Critical severity: Out-of-stock items, Overdue invoices.",
			"Warning severity: Low-stock items, Delayed deliveries, Overdue open orders.",
			"Info severity: Inventory discrepancies."
		],
		sources: [
			"inventory.csv",
			"receivables.csv",
			"orders.csv"
		]
	}
};
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { isQualifyingOrder as A, getInventoryRecords as C, getTopProducts as D, getTopCustomers as E, trend as M, useDataset as N, getTopProductsByProfit as O, getIndustryPerformance as S, getReceivableRecords as T, formatDay as _, PRESET_LABELS as a, getChannelPerformance as b, calculateDailySeries as c, calculateMonthlySeries as d, calculateReceivables as f, formatCompactPKR as g, formatChartAxisTick as h, METRIC_INFO as i, resolvePreset as j, inRange as k, calculateDeliveryPerformance as l, cn as m, Button as n, PRESET_ORDER as o, calculateSales as p, DatasetProvider as r, buildAlerts as s, Badge as t, calculateInventoryHealth as u, formatMonth as v, getOrderStatusSummary as w, getCityPerformance as x, formatPKR as y };
