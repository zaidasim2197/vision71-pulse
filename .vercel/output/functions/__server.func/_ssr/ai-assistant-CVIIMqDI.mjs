import { i as __toESM } from "../_runtime.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-C5zcObD8.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as getInventoryRecords, D as getTopProducts, E as getTopCustomers, N as useDataset, O as getTopProductsByProfit, S as getIndustryPerformance, T as getReceivableRecords, b as getChannelPerformance, d as calculateMonthlySeries, f as calculateReceivables, g as formatCompactPKR, h as formatChartAxisTick, j as resolvePreset, k as inRange, l as calculateDeliveryPerformance, n as Button, p as calculateSales, t as Badge, u as calculateInventoryHealth, w as getOrderStatusSummary, x as getCityPerformance, y as formatPKR } from "./badge-Bl18eSKb.mjs";
import { t as Input } from "./input-ihffJmEB.mjs";
import { F as CircleQuestionMark, H as Check, K as Bot, M as Copy, T as Maximize2, U as ChartColumn, _ as Send, d as Sparkles, i as User, l as Trash2, p as ShieldCheck, t as X } from "../_libs/lucide-react.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, h as Legend, i as LineChart, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-assistant-CVIIMqDI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function detectRequestedChartType(q, defaultType) {
	const qLower = q.toLowerCase();
	if (qLower.includes("pie") || qLower.includes("donut")) return "pie";
	if (qLower.includes("line") || qLower.includes("trend")) return "line";
	if (qLower.includes("area") || qLower.includes("growth")) return "area";
	if (qLower.includes("bar") || qLower.includes("column")) return "bar";
	return defaultType;
}
function extractContextFromHistory(chatHistory, data) {
	if (!chatHistory || chatHistory.length === 0) return {};
	const recentMessages = chatHistory.slice(-8).reverse();
	let referencedProduct = null;
	let referencedCustomer = null;
	let referencedCity = null;
	let mostRecentType = null;
	for (const msg of recentMessages) {
		const textLower = msg.text.toLowerCase();
		if (!referencedCustomer) {
			let firstPos = Infinity;
			let bestC = null;
			for (const c of data.customers) {
				const name = c.customer_name.toLowerCase();
				const pos = textLower.indexOf(name);
				if (pos !== -1 && pos < firstPos) {
					firstPos = pos;
					bestC = c;
				}
			}
			if (bestC) {
				referencedCustomer = bestC;
				if (!mostRecentType) mostRecentType = "customer";
			}
		}
		if (!referencedProduct) {
			let firstPos = Infinity;
			let bestP = null;
			for (const p of data.products) {
				const name = p.product_name.toLowerCase();
				const sku = p.sku.toLowerCase();
				const posName = textLower.indexOf(name);
				const posSku = textLower.indexOf(sku);
				let pos = posName;
				if (pos === -1 || posSku !== -1 && posSku < pos) pos = posSku;
				if (pos !== -1 && pos < firstPos) {
					firstPos = pos;
					bestP = p;
				}
			}
			if (bestP) {
				referencedProduct = bestP;
				if (!mostRecentType) mostRecentType = "product";
			}
		}
		if (!referencedCity) {
			const cities = [
				"lahore",
				"karachi",
				"faisalabad",
				"islamabad",
				"sialkot",
				"multan",
				"rawalpindi",
				"peshawar",
				"gujranwala",
				"quetta"
			];
			let firstPos = Infinity;
			let bestCity = null;
			for (const city of cities) {
				const pos = textLower.indexOf(city);
				if (pos !== -1 && pos < firstPos) {
					firstPos = pos;
					bestCity = city;
				}
			}
			if (bestCity) {
				referencedCity = bestCity.charAt(0).toUpperCase() + bestCity.slice(1);
				if (!mostRecentType) mostRecentType = "city";
			}
		}
	}
	return {
		referencedProduct,
		referencedCustomer,
		referencedCity,
		mostRecentType
	};
}
function extractLimit(q, defaultLimit = 5) {
	const matchNum = q.match(/\btop\s*(\d+)\b/i) || q.match(/\b(\d+)\s*(customer|product|item|repeat|selling|repeated)\b/i);
	if (matchNum && matchNum[1]) {
		const num = parseInt(matchNum[1], 10);
		if (!isNaN(num) && num > 0) return Math.min(num, 20);
	}
	const wordMap = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		ten: 10
	};
	const wordMatch = q.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i);
	if (wordMatch && wordMatch[1]) {
		const num = wordMap[wordMatch[1].toLowerCase()];
		if (num) return num;
	}
	return defaultLimit;
}
function queryAiEngine(question, data, currentRange, chatHistory) {
	const qRaw = question.toLowerCase().trim();
	const q = qRaw.replace(/[^a-z0-9\s]/g, "").trim();
	const historyContext = extractContextFromHistory(chatHistory, data);
	const pronounRegex = /\b(it|its|this|that|they|their|them|same|above|previous|former|latter|the product|the item|the customer|the city)\b/i;
	const isFollowUp = pronounRegex.test(qRaw) || q.includes("what about") || q.includes("tell me more");
	if ((q.includes("pie") || q.includes("bar") || q.includes("line") || q.includes("area") || q.includes("chart") || q.includes("graph")) && (q.includes("instead") || q.includes("convert") || q.includes("change") || q.includes("switch") || q.includes("make it") || q.includes("show as") || q.includes("create its") || q.includes("render as") || q.includes("format")) && chatHistory && chatHistory.length > 0) {
		const userMessages = [...chatHistory].reverse().filter((m) => m.sender === "user");
		let lastAnalyticalQuery = null;
		for (const uMsg of userMessages) {
			const uText = uMsg.text.toLowerCase();
			if (!(uText.includes("instead") || uText.includes("create its") || uText.includes("make it a") || uText.includes("change to") || uText.includes("convert to") || uText.includes("show as")) && uText.trim().length > 3) {
				lastAnalyticalQuery = uMsg.text;
				break;
			}
		}
		if (lastAnalyticalQuery) {
			const historyWithoutLast = chatHistory.slice(0, -1);
			const res = queryAiEngine(`${lastAnalyticalQuery} ${question}`, data, currentRange, historyWithoutLast);
			if (res && res.isSupported) return {
				...res,
				question
			};
		}
	}
	const attachHistoryFacts = (facts) => {
		if (!chatHistory || chatHistory.length === 0) return facts;
		return `[Recent Conversation Context: ${chatHistory.filter((m) => m.text && m.text.length > 0).slice(-4).map((m) => `${m.sender === "user" ? "User" : "AI"}: "${m.text.replace(/\s+/g, " ").substring(0, 100)}..."`).join(" | ")}] ${facts}`;
	};
	if (/^(sorry\?|pardon\??|what\?|huh\??|excuse me\??|repeat\??|explain\??|what do you mean\??)$/i.test(qRaw.trim())) {
		let answer = "Could you please clarify what you'd like me to explain? You can ask me to expand on your **sales performance**, **inventory stock**, **top customers**, or **receivables**.";
		if (chatHistory && chatHistory.length > 0) {
			const lastAiMsg = [...chatHistory].reverse().find((m) => m.sender === "ai");
			if (lastAiMsg && lastAiMsg.text) answer = `To clarify my previous message:\n${lastAiMsg.text}\n\nPlease let me know if you would like more specific details or data on any of these figures.`;
		}
		return {
			isSupported: true,
			question,
			structuredFacts: attachHistoryFacts("User requested clarification or repetition of previous response."),
			directAnswer: answer
		};
	}
	if (/^(h+e+l+o+|h+i+|h+e+y+|howdy|greetings|good\s*(morning|afternoon|evening)|how\s*are\s*you|who\s*are\s*you|what\s*can\s*you\s*do|sorry|my\s*bad|oops|apolog|thank\s*you|thanks|thx|ok|okay|k|cool|got\s*it|great|awesome|perfect|bye|goodbye|help|what\s*should\s*i\s*ask)/i.test(qRaw) && !qRaw.includes("?") && !q.includes("product") && !q.includes("sales") && !q.includes("order") && !q.includes("customer") && !q.includes("profit") && !q.includes("stock") && !q.includes("receivable")) {
		let answer = "Hello! I am your **PulseOps Sales & Operations Intelligence Assistant**. How can I help you analyze your business performance, sales, inventory, or customer data today?";
		if (qRaw.includes("sorry") || qRaw.includes("my bad") || qRaw.includes("oops") || qRaw.includes("apolog")) answer = "No problem at all! Feel free to ask any question about your **sales performance**, **inventory stock**, **top customers**, or **receivables**.";
		else if (qRaw.includes("thank") || qRaw.includes("thx")) answer = "You're very welcome! Let me know if you need any other business insights or data reports.";
		else if (/^(ok|okay|k|cool|got\s*it|great|awesome|perfect)$/i.test(qRaw.trim())) answer = "Sounds good! I'm here whenever you're ready to explore more insights.";
		else if (qRaw.includes("bye") || qRaw.includes("goodbye")) answer = "Goodbye! Have a great day ahead.";
		else if (qRaw.includes("help") || qRaw.includes("what can you do")) answer = "I can analyze your **Sales Revenue**, **Top Customers**, **Inventory & Stock Levels**, **Overdue Receivables**, **Delivery Performance**, and **Profitability**. Ask me any question!";
		return {
			isSupported: true,
			question,
			structuredFacts: attachHistoryFacts("User conversational remark/pleasantry. Respond warmly and helpfully as PulseOps Sales & Operations AI Assistant."),
			directAnswer: answer
		};
	}
	if (q.includes("purchase") || q.includes("buy") || q.includes("restock") || q.includes("go outside") || q.includes("new items") || q.includes("new products") || q.includes("procure")) {
		const invRecords = getInventoryRecords(data);
		const inv = calculateInventoryHealth(invRecords);
		const facts = `Purchasing & Inventory Procurement Advice: Total Valuation: ${formatPKR(inv.inventoryValue)} (${formatCompactPKR(inv.inventoryValue)}). Total SKUs: ${data.products.length}. Stock Breakdown: ${inv.inStock} In Stock, ${inv.lowStock} Low Stock (at/below reorder level), ${inv.outOfStock} Out of Stock, ${inv.discrepancy} Discrepancy. Reorder Priority: ${inv.outOfStock} items completely out of stock, ${inv.lowStock} items low in stock. Recommendation: Restock current 7 out-of-stock and 11 low-stock items before adding unlisted new verticals outside.`;
		const directAnswer = `Before going outside to purchase new items, consider our current inventory status: we have **${inv.outOfStock} Out of Stock** items and **${inv.lowStock} Low Stock** items (at or below reorder level) among our **${data.products.length} active product SKUs** (**${formatCompactPKR(inv.inventoryValue)}** total valuation). We recommend prioritizing restocks for our existing high-demand SKUs before introducing new unlisted product lines.`;
		return {
			isSupported: true,
			question,
			structuredFacts: attachHistoryFacts(facts),
			directAnswer
		};
	}
	if (q.includes("write") || q.includes("edit") || q.includes("update") || q.includes("modify") || q.includes("delete") || q.includes("change") || q.includes("read only") || q.includes("database") || q.includes("db")) return {
		isSupported: true,
		question,
		structuredFacts: attachHistoryFacts(`System Capabilities: Read-Only Mode. Engine is connected to 8 dataset entities (Orders: ${data.orders.length}, Order Items: ${data.orderItems.length}, Products: ${data.products.length}, Customers: ${data.customers.length}, Inventory Rows: ${data.inventory.length}, Receivables: ${data.receivables.length}, Payments: ${data.payments.length}, Returns: ${data.returns.length}). Write access: NO.`),
		directAnswer: `No, I operate strictly in **read-only mode** over your PulseOps dataset. I cannot write, modify, or delete any records in your database, ensuring your underlying business data remains 100% secure and unchanged.`
	};
	if (!(q.includes("product") || q.includes("order") || q.includes("customer") || q.includes("status") || q.includes("sales") || q.includes("revenue") || q.includes("inventory") || q.includes("stock") || q.includes("receivable") || q.includes("city") || q.includes("industry") || q.includes("sector") || q.includes("channel") || q.includes("profit") || q.includes("delivery") || q.includes("refund") || q.includes("return")) && (q.includes("chart") || q.includes("graph") || q.includes("visualize") || q.includes("draw") || q.includes("diagram"))) {
		if (q.includes("can") || q.includes("possible") || q.includes("efficient") || q.includes("fast") || q.includes("generate") || q.includes("how") || q.includes("clean")) {
			const monthlySeries = calculateMonthlySeries(data, currentRange);
			const chartConfig = {
				type: detectRequestedChartType(q, "area"),
				title: "Monthly Sales Trend (Interactive Sample Chart)",
				data: monthlySeries.map((m) => ({
					name: m.label,
					value: m.netSales
				})),
				formatValue: "pkr"
			};
			return {
				isSupported: true,
				question,
				structuredFacts: attachHistoryFacts(`Chart & Graph Generation Capabilities: Fully Supported, Instant & Clean. Supported chart types: Bar Chart (Top Products, Top Customers, City Performance, Industry Sectors), Area/Line Chart (Monthly Sales Trends, Revenue over Time), Pie Chart (Sales Channels, Inventory Stock Status Breakdown). Latency: 0ms (Client-Side Recharts execution).`),
				directAnswer: `Yes! I can instantly generate clean, interactive, and responsive **charts and graphs** on request directly inside our chat interface.\n\n### ⚡ Highlights:\n- **Instant & Fast (0ms Latency)**: Charts are calculated directly from your sales data using client-side **Recharts** rendering with zero network delay.\n- **Clean & High Quality**: Modern HSL styling, precise hover tooltips, and compact layout.\n- **Multiple Visualizations**:\n  - **Bar Charts**: Top products, top customers, city performance, industry sectors\n  - **Area & Line Charts**: Monthly revenue trends, sales over time\n  - **Pie Charts**: Sales channel distribution, inventory stock status breakdown\n\nHere is a live sample chart of your monthly sales performance below:`,
				chartConfig
			};
		}
	}
	if ([
		"weather",
		"recipe",
		"cook",
		"bake",
		"baking",
		"president",
		"prime minister",
		"capital of",
		"tell me a joke",
		"python",
		"javascript",
		"code",
		"coding",
		"algorithm",
		"tell me a story",
		"movie",
		"film",
		"song",
		"music",
		"game",
		"cricket",
		"football",
		"soccer",
		"astronomy",
		"planet",
		"moon"
	].some((k) => q === k || q.includes(" " + k) || q.startsWith(k + " ") || q.endsWith(" " + k)) && !q.includes("sales") && !q.includes("order") && !q.includes("stock")) return {
		isSupported: false,
		question,
		structuredFacts: attachHistoryFacts("Explicit out of scope request."),
		directAnswer: "I can't help with that. I can only answer questions about the available **Sales & Operations data**."
	};
	if ((q.includes("available") || q.includes("in stock") || q.includes("do we have") || q.includes("is there") || q.includes("products list") || q.includes("in inventory") || q.includes("carry")) && !q.includes("how many total") && !q.includes("which product") && !q.includes("most orders")) {
		let matched = data.products.find((p) => {
			const name = p.product_name.toLowerCase();
			const sku = p.sku.toLowerCase();
			if (qRaw.includes(name) || qRaw.includes(sku)) return true;
			const words = name.split(/\s+/).filter((w) => w.length > 2);
			return words.length > 1 && words.every((w) => qRaw.includes(w));
		});
		if (!matched && historyContext.referencedProduct && (isFollowUp || q.includes("product") || q.includes("item"))) matched = historyContext.referencedProduct;
		if (matched) {
			const invRow = data.inventory.find((inv) => inv.product_id === matched.product_id);
			const qtyOnHand = invRow?.quantity_on_hand ?? 0;
			const qtyReserved = invRow?.quantity_reserved ?? 0;
			const available = qtyOnHand - qtyReserved;
			const status = invRow ? available < 0 ? "Discrepancy" : available === 0 ? "Out of Stock" : available <= matched.reorder_level ? "Low Stock" : "In Stock" : "Unknown";
			return {
				isSupported: true,
				question,
				structuredFacts: `Product Availability Search: YES. Matched Product: ${matched.product_name} (SKU: ${matched.sku}, Category: ${matched.category}). Unit Price: ${formatPKR(matched.unit_price)}. Stock: ${available} units available (${qtyOnHand} on hand, ${qtyReserved} reserved). Status: ${status}.`,
				directAnswer: `Yes, **${matched.product_name}** (SKU: **${matched.sku}**, Category: **${matched.category}**) is listed in our product catalog with **${available} available units** in inventory (**${status}**, unit price: **${formatPKR(matched.unit_price)}**).`
			};
		} else {
			let itemTerm = question.replace(/is/i, "").replace(/this product/i, "").replace(/available in our inventory or products list\??/i, "").replace(/available in inventory\??/i, "").replace(/available in stock\??/i, "").replace(/available\??/i, "").replace(/do we have/i, "").replace(/in stock\??/i, "").replace(/in our products list\??/i, "").replace(/in products list\??/i, "").trim();
			if (!itemTerm || itemTerm.length < 2) itemTerm = "the requested product";
			const facts = `Product Availability Search: NO. Queried Item: "${itemTerm}". Catalog Summary: Total 72 SKUs across 7 categories (Furniture, IT & Networking, Safety Equipment, Industrial Supplies, Office Equipment, Electrical, Consumables). Item "${itemTerm}" is NOT listed in the dataset.`;
			const directAnswer = `No, **"${itemTerm}"** is not currently listed in our product catalog or inventory. We carry **72 active product SKUs** across 7 categories (**Furniture**, **IT & Networking**, **Safety Equipment**, **Industrial Supplies**, **Office Equipment**, **Electrical**, and **Consumables**).`;
			return {
				isSupported: true,
				question,
				structuredFacts: attachHistoryFacts(facts),
				directAnswer
			};
		}
	}
	let matchedProduct = data.products.find((p) => {
		const name = p.product_name.toLowerCase();
		const sku = p.sku.toLowerCase();
		if (qRaw.includes(name) || qRaw.includes(sku)) return true;
		const words = name.split(/\s+/).filter((w) => w.length > 2);
		return words.length > 1 && words.every((w) => qRaw.includes(w));
	});
	const isCustomerTerm = q.includes("they") || q.includes("their") || q.includes("them") || q.includes("credit limit") || q.includes("customer") || q.includes("located");
	if (!matchedProduct && historyContext.referencedProduct && !isCustomerTerm) {
		if (!(q.includes("chart") || q.includes("graph") || q.includes("instead") || q.includes("pie") || q.includes("bar") || q.includes("line") || q.includes("area")) && (pronounRegex.test(qRaw) || q.includes("price") || q.includes("cost") || q.includes("unit") || q.includes("sku") || q.includes("remaining") || q.includes("stock") || q.includes("inventory") || q.includes("reorder") || q.includes("category"))) matchedProduct = historyContext.referencedProduct;
	}
	let matchedCustomer = data.customers.find((c) => {
		const name = c.customer_name.toLowerCase();
		if (qRaw.includes(name)) return true;
		const words = name.split(/\s+/).filter((w) => w.length > 2);
		return words.length > 1 && words.every((w) => qRaw.includes(w));
	});
	if (!matchedCustomer && historyContext.referencedCustomer) {
		if (isCustomerTerm || pronounRegex.test(qRaw) && !q.includes("stock") && !q.includes("product") && !q.includes("sku")) matchedCustomer = historyContext.referencedCustomer;
	}
	if (matchedCustomer && (isCustomerTerm || historyContext.mostRecentType === "customer" || !matchedProduct)) {
		let customerRevenue = 0;
		let customerOrders = 0;
		let customerProfit = 0;
		for (const o of data.orders) if (o.customer_id === matchedCustomer.customer_id && o.order_status !== "Cancelled" && inRange(o.order_date, currentRange)) {
			customerRevenue += o.total_amount;
			customerProfit += o.gross_profit;
			customerOrders += 1;
		}
		const customerInvoices = data.receivables.filter((r) => r.customer_id === matchedCustomer.customer_id);
		let customerOutstanding = 0;
		let customerOverdue = 0;
		for (const inv of customerInvoices) {
			const unpaid = inv.invoice_amount - inv.amount_paid;
			if (unpaid > 0) {
				customerOutstanding += unpaid;
				if (inv.due_date < "2026-09-01") customerOverdue += unpaid;
			}
		}
		const facts = `Specific Customer Lookup: ${matchedCustomer.customer_name} (City: ${matchedCustomer.city}, Industry: ${matchedCustomer.industry}, Segment: ${matchedCustomer.customer_segment}). Sales in Period (${currentRange.preset}): ${formatPKR(customerRevenue)} (${formatCompactPKR(customerRevenue)}) across ${customerOrders} orders. Gross Profit: ${formatPKR(customerProfit)}. Outstanding Receivables: ${formatPKR(customerOutstanding)} (${formatCompactPKR(customerOutstanding)}). Overdue Receivables: ${formatPKR(customerOverdue)} (${formatCompactPKR(customerOverdue)}). Credit Limit: ${formatPKR(matchedCustomer.credit_limit)}.`;
		let directAnswer = "";
		if (q.includes("city") || q.includes("located") || q.includes("where")) directAnswer = `**${matchedCustomer.customer_name}** is located in **${matchedCustomer.city}** (${matchedCustomer.industry} sector). Credit Limit: **${formatPKR(matchedCustomer.credit_limit)}**. Sales in the selected period total **${formatCompactPKR(customerRevenue)}** (**${formatPKR(customerRevenue)}**) across **${customerOrders}** orders.`;
		else if (q.includes("credit limit") || q.includes("limit")) directAnswer = `The credit limit for **${matchedCustomer.customer_name}** is **${formatPKR(matchedCustomer.credit_limit)}** (**${formatCompactPKR(matchedCustomer.credit_limit)}**). Total sales in the selected period are **${formatCompactPKR(customerRevenue)}** across **${customerOrders}** orders.`;
		else directAnswer = `**${matchedCustomer.customer_name}** generated **${formatCompactPKR(customerRevenue)}** (**${formatPKR(customerRevenue)}**) in sales across **${customerOrders}** orders in the selected period. Total outstanding receivables are **${formatCompactPKR(customerOutstanding)}** (**${formatCompactPKR(customerOverdue)}** overdue). Credit Limit: **${formatPKR(matchedCustomer.credit_limit)}**.`;
		return {
			isSupported: true,
			question,
			structuredFacts: attachHistoryFacts(facts),
			directAnswer
		};
	}
	if (matchedProduct) {
		const invRow = data.inventory.find((inv) => inv.product_id === matchedProduct.product_id);
		const qtyOnHand = invRow?.quantity_on_hand ?? 0;
		const qtyReserved = invRow?.quantity_reserved ?? 0;
		const available = qtyOnHand - qtyReserved;
		const reorderLevel = matchedProduct.reorder_level;
		const status = invRow ? available < 0 ? "Discrepancy" : available === 0 ? "Out of Stock" : available <= reorderLevel ? "Low Stock" : "In Stock" : "Unknown";
		let productRevenue = 0;
		let productUnits = 0;
		let productOrders = 0;
		for (const o of data.orders) {
			if (o.order_status === "Cancelled" || !inRange(o.order_date, currentRange)) continue;
			const items = data.itemsByOrder.get(o.order_id);
			if (!items) continue;
			for (const item of items) if (item.product_id === matchedProduct.product_id) {
				productRevenue += item.line_total;
				productUnits += item.quantity;
				productOrders += 1;
			}
		}
		const facts = `Specific Product Lookup: ${matchedProduct.product_name} (SKU: ${matchedProduct.sku}, Category: ${matchedProduct.category}). Unit Price: ${formatPKR(matchedProduct.unit_price)}, Unit Cost: ${formatPKR(matchedProduct.unit_cost)}. Stock Details: On Hand: ${qtyOnHand}, Reserved: ${qtyReserved}, Available Remaining: ${available} units. Reorder Level: ${reorderLevel}. Stock Status: ${status}. Sales in Period (${currentRange.preset}): ${formatPKR(productRevenue)} (${formatCompactPKR(productRevenue)}) across ${productUnits} units in ${productOrders} orders.`;
		let directAnswer = "";
		if (q.includes("price") || q.includes("cost")) directAnswer = `The unit price of **${matchedProduct.product_name}** is **${formatPKR(matchedProduct.unit_price)}** (unit cost: **${formatPKR(matchedProduct.unit_cost)}**). Total sales in the selected period are **${formatCompactPKR(productRevenue)}** across **${productUnits}** units sold (**${productOrders}** orders).`;
		else if (q.includes("remaining") || q.includes("stock") || q.includes("inventory") || q.includes("available") || q.includes("how many")) directAnswer = `There are currently **${available} available units** of **${matchedProduct.product_name}** remaining in inventory (**${qtyOnHand}** units on hand minus **${qtyReserved}** reserved). Stock status is **${status}** (reorder level: **${reorderLevel}** units).`;
		else if (q.includes("sales") || q.includes("revenue")) directAnswer = `**${matchedProduct.product_name}** generated **${formatCompactPKR(productRevenue)}** (**${formatPKR(productRevenue)}**) in revenue across **${productUnits}** units sold (**${productOrders}** orders) during the selected period. Unit Price: **${formatPKR(matchedProduct.unit_price)}**.`;
		else directAnswer = `**${matchedProduct.product_name}** (SKU: **${matchedProduct.sku}**, Category: **${matchedProduct.category}**) has **${available} available units** remaining in stock (**${qtyOnHand}** on hand, **${qtyReserved}** reserved). Sales for the selected period total **${formatCompactPKR(productRevenue)}** across **${productUnits}** units.`;
		return {
			isSupported: true,
			question,
			structuredFacts: attachHistoryFacts(facts),
			directAnswer
		};
	}
	if (matchedCustomer) {
		let customerRevenue = 0;
		let customerOrders = 0;
		let customerProfit = 0;
		for (const o of data.orders) if (o.customer_id === matchedCustomer.customer_id && o.order_status !== "Cancelled" && inRange(o.order_date, currentRange)) {
			customerRevenue += o.total_amount;
			customerProfit += o.gross_profit;
			customerOrders += 1;
		}
		const customerInvoices = data.receivables.filter((r) => r.customer_id === matchedCustomer.customer_id);
		let customerOutstanding = 0;
		let customerOverdue = 0;
		for (const inv of customerInvoices) {
			const unpaid = inv.invoice_amount - inv.amount_paid;
			if (unpaid > 0) {
				customerOutstanding += unpaid;
				if (inv.due_date < "2026-09-01") customerOverdue += unpaid;
			}
		}
		return {
			isSupported: true,
			question,
			structuredFacts: `Specific Customer Lookup: ${matchedCustomer.customer_name} (City: ${matchedCustomer.city}, Industry: ${matchedCustomer.industry}, Segment: ${matchedCustomer.customer_segment}). Sales in Period (${currentRange.preset}): ${formatPKR(customerRevenue)} (${formatCompactPKR(customerRevenue)}) across ${customerOrders} orders. Gross Profit: ${formatPKR(customerProfit)}. Outstanding Receivables: ${formatPKR(customerOutstanding)} (${formatCompactPKR(customerOutstanding)}). Overdue Receivables: ${formatPKR(customerOverdue)} (${formatCompactPKR(customerOverdue)}). Credit Limit: ${formatPKR(matchedCustomer.credit_limit)}.`,
			directAnswer: `**${matchedCustomer.customer_name}** generated **${formatCompactPKR(customerRevenue)}** (**${formatPKR(customerRevenue)}**) in sales across **${customerOrders}** orders in the selected period. Total outstanding receivables are **${formatCompactPKR(customerOutstanding)}** (**${formatCompactPKR(customerOverdue)}** overdue). Credit Limit: **${formatPKR(matchedCustomer.credit_limit)}**.`
		};
	}
	const matchedCategory = [
		"Furniture",
		"IT & Networking",
		"Safety Equipment",
		"Industrial Supplies",
		"Office Equipment",
		"Electrical",
		"Consumables"
	].find((cat) => qRaw.includes(cat.toLowerCase()));
	if (matchedCategory) {
		const catProducts = data.products.filter((p) => p.category.toLowerCase() === matchedCategory.toLowerCase());
		const catProductIds = new Set(catProducts.map((p) => p.product_id));
		let catValuation = 0;
		let catInStock = 0;
		let catLowStock = 0;
		let catOutOfStock = 0;
		for (const invRow of data.inventory) if (catProductIds.has(invRow.product_id)) {
			const product = data.productById.get(invRow.product_id);
			if (product) {
				catValuation += invRow.quantity_on_hand * product.unit_cost;
				const avail = invRow.quantity_on_hand - invRow.quantity_reserved;
				if (avail === 0) catOutOfStock += 1;
				else if (avail <= invRow.reorder_level) catLowStock += 1;
				else catInStock += 1;
			}
		}
		return {
			isSupported: true,
			question,
			structuredFacts: `Category Lookup: ${matchedCategory}. Total SKUs: ${catProducts.length}. Total Category Inventory Valuation: ${formatPKR(catValuation)} (${formatCompactPKR(catValuation)}). Stock Breakdown: ${catInStock} In Stock, ${catLowStock} Low Stock, ${catOutOfStock} Out of Stock.`,
			directAnswer: `In the **${matchedCategory}** category across **${catProducts.length}** product SKUs, total inventory valuation is **${formatCompactPKR(catValuation)}**. Stock breakdown: **${catInStock}** In Stock, **${catLowStock}** Low Stock, and **${catOutOfStock}** Out of Stock.`
		};
	}
	if (q.includes("profit") && (q.includes("product") || q.includes("item") || q.includes("best") || q.includes("most") || q.includes("which") || q.includes("top") || q.includes("making") || q.includes("generating") || q.includes("highest"))) {
		const limit = extractLimit(q, 5);
		const topByProfit = getTopProductsByProfit(data, currentRange, limit);
		if (!topByProfit.length) return {
			isSupported: true,
			question,
			structuredFacts: "No product sales recorded in range.",
			directAnswer: "No qualifying product sales were recorded in the selected date range."
		};
		const top1 = topByProfit[0];
		const listFormatted = topByProfit.map((p, i) => `${i + 1}. **${p.product.product_name}** — Gross Profit: **${formatPKR(p.grossProfit)}** (**${formatCompactPKR(p.grossProfit)}**, **${p.marginPct.toFixed(1)}%** margin) on revenue of **${formatCompactPKR(p.revenue)}** (${p.units} units)`).join("\n");
		const facts = `Product Profit Ranking: Top Profit Product is ${top1.product.product_name} with Gross Profit of ${formatPKR(top1.grossProfit)} (${formatCompactPKR(top1.grossProfit)}, ${top1.marginPct.toFixed(2)}% margin) on ${formatPKR(top1.revenue)} sales. Top ${limit} Products by Gross Profit:\n${listFormatted}`;
		let directAnswer = "";
		if (limit === 1 || q.includes("which product") || q.includes("best profit") || q.includes("most profit") || q.includes("highest profit") || q.includes("making me")) directAnswer = `The product making you the best profit is **${top1.product.product_name}**, generating a total gross profit of **${formatCompactPKR(top1.grossProfit)}** (**${formatPKR(top1.grossProfit)}**) with a **${top1.marginPct.toFixed(2)}%** gross profit margin on **${formatCompactPKR(top1.revenue)}** in total sales (${top1.units} units sold).`;
		else directAnswer = `The product generating the highest profit is **${top1.product.product_name}** with **${formatCompactPKR(top1.grossProfit)}** (**${formatPKR(top1.grossProfit)}**) in gross profit.\n\nThe top ${limit} most profitable products overall are:\n${listFormatted}`;
		const chartConfig = {
			type: detectRequestedChartType(q, "bar"),
			title: `Top ${topByProfit.length} Products by Gross Profit`,
			data: topByProfit.map((p) => ({
				name: p.product.product_name,
				value: p.grossProfit
			})),
			formatValue: "pkr"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: facts,
			directAnswer,
			chartConfig
		};
	}
	if (q.includes("net sales") || q.includes("total sales") || q.includes("how much are we selling") || q.includes("revenue") || q.includes("gross sales")) {
		const sales = calculateSales(data, currentRange);
		const monthlySeries = calculateMonthlySeries(data, currentRange);
		const chartConfig = {
			type: detectRequestedChartType(q, "area"),
			title: "Monthly Sales Trend",
			data: monthlySeries.map((m) => ({
				name: m.label,
				value: m.netSales
			})),
			formatValue: "pkr"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: `Net Sales: ${formatPKR(sales.netSales)} (${formatCompactPKR(sales.netSales)}). Gross Sales: ${formatPKR(sales.grossSales)}. Returns: ${formatPKR(sales.returns)}. Gross Profit: ${formatPKR(sales.grossProfit)} (${sales.grossMarginPct.toFixed(2)}% margin). Total Qualifying Orders: ${sales.totalOrders.toLocaleString()}. Selected period: ${currentRange.preset}.`,
			directAnswer: `Net Sales for the selected period are ${formatCompactPKR(sales.netSales)} (${formatPKR(sales.netSales)}). Gross sales reached ${formatCompactPKR(sales.grossSales)} with ${formatCompactPKR(sales.returns)} in returns across ${sales.totalOrders.toLocaleString()} qualifying orders.`,
			chartConfig
		};
	}
	if (q.includes("profit") || q.includes("margin")) {
		const sales = calculateSales(data, currentRange);
		return {
			isSupported: true,
			question,
			structuredFacts: `Gross Profit: ${formatPKR(sales.grossProfit)} (${formatCompactPKR(sales.grossProfit)}). Gross Margin: ${sales.grossMarginPct.toFixed(2)}%. Gross Sales: ${formatPKR(sales.grossSales)}.`,
			directAnswer: `Gross Profit is ${formatCompactPKR(sales.grossProfit)} (${formatPKR(sales.grossProfit)}), representing a gross profit margin of ${sales.grossMarginPct.toFixed(2)}% on gross sales of ${formatCompactPKR(sales.grossSales)}.`
		};
	}
	if (q.includes("receivable") || q.includes("outstanding") || q.includes("overdue") || q.includes("due soon") || q.includes("unpaid") || q.includes("invoice")) {
		const recRecords = getReceivableRecords(data);
		const rec = calculateReceivables(recRecords);
		const chartConfig = {
			type: detectRequestedChartType(q, "bar"),
			title: "Receivables Breakdown",
			data: [
				{
					name: "Current",
					value: rec.current
				},
				{
					name: "Due Soon",
					value: rec.dueSoon
				},
				{
					name: "Overdue",
					value: rec.overdue
				}
			],
			formatValue: "pkr"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: `Total Outstanding Receivables: ${formatPKR(rec.outstanding)} (${formatCompactPKR(rec.outstanding)}). Overdue Receivables: ${formatPKR(rec.overdue)} (${formatCompactPKR(rec.overdue)}). Overdue Share: ${rec.overduePct.toFixed(2)}%. Overdue Invoices Count: ${rec.overdueCount}. Current Outstanding: ${formatCompactPKR(rec.current)}. Due Soon Outstanding: ${formatCompactPKR(rec.dueSoon)}.`,
			directAnswer: `Total outstanding receivables are ${formatCompactPKR(rec.outstanding)} (${formatPKR(rec.outstanding)}). Of this, ${formatCompactPKR(rec.overdue)} is overdue across ${rec.overdueCount} invoices, representing ${rec.overduePct.toFixed(2)}% of total receivables.`,
			chartConfig
		};
	}
	if (q.includes("inventory") || q.includes("stock") || q.includes("low stock") || q.includes("out of stock") || q.includes("discrepancy") || q.includes("reorder")) {
		const invRecords = getInventoryRecords(data);
		const inv = calculateInventoryHealth(invRecords);
		const chartConfig = {
			type: detectRequestedChartType(q, "pie"),
			title: "Inventory Stock Status",
			data: [
				{
					name: "In Stock",
					value: inv.inStock
				},
				{
					name: "Low Stock",
					value: inv.lowStock
				},
				{
					name: "Out of Stock",
					value: inv.outOfStock
				},
				{
					name: "Discrepancy",
					value: inv.discrepancy
				}
			],
			formatValue: "number"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: `Total Inventory Valuation: ${formatPKR(inv.inventoryValue)} (${formatCompactPKR(inv.inventoryValue)}). Total SKUs: ${inv.total}. In Stock: ${inv.inStock}. Low Stock: ${inv.lowStock}. Out of Stock: ${inv.outOfStock}. Inventory Discrepancy: ${inv.discrepancy}. Healthy Stock Pct: ${inv.healthyPct.toFixed(1)}%.`,
			directAnswer: `Inventory valuation is ${formatCompactPKR(inv.inventoryValue)}. Stock breakdown across ${inv.total} products: ${inv.inStock} In Stock, ${inv.lowStock} Low Stock (at/below reorder level), ${inv.outOfStock} Out of Stock, and ${inv.discrepancy} Discrepancy items.`,
			chartConfig
		};
	}
	if (q.includes("delivery") || q.includes("on-time") || q.includes("delayed") || q.includes("lead time") || q.includes("logistics")) {
		const del = calculateDeliveryPerformance(data, currentRange);
		return {
			isSupported: true,
			question,
			structuredFacts: `Completed Deliveries: ${del.completed.toLocaleString()}. On-Time Deliveries: ${del.onTime.toLocaleString()}. Delayed Deliveries: ${del.delayed.toLocaleString()}. On-Time Delivery Rate: ${del.onTimeRate.toFixed(2)}%. Avg Lead Time: ${del.avgLeadTimeDays.toFixed(2)} days. Avg Delay: ${del.avgDelayDays.toFixed(2)} days. Overdue Open Orders: ${del.overdueOpenOrders}.`,
			directAnswer: `Our on-time delivery rate is ${del.onTimeRate.toFixed(2)}%. Out of ${del.completed.toLocaleString()} completed deliveries, ${del.onTime.toLocaleString()} arrived on time while ${del.delayed.toLocaleString()} were delayed (avg lead time: ${del.avgLeadTimeDays.toFixed(1)} days).`
		};
	}
	if ((q.includes("product") || q.includes("sku") || q.includes("item")) && (q.includes("how many") || q.includes("total") || q.includes("count") || q.includes("number") || q.includes("all") || q.includes("exist") || q.includes("have"))) {
		const totalProductsCount = data.products.length;
		const categoriesCount = new Set(data.products.map((p) => p.category)).size;
		const invRecords = getInventoryRecords(data);
		const inv = calculateInventoryHealth(invRecords);
		return {
			isSupported: true,
			question,
			structuredFacts: `Total Product SKUs in Dataset: ${totalProductsCount} across ${categoriesCount} product categories. Inventory Health: ${inv.inStock} In Stock, ${inv.lowStock} Low Stock, ${inv.outOfStock} Out of Stock, ${inv.discrepancy} Discrepancy. Total Inventory Valuation: ${formatPKR(inv.inventoryValue)}.`,
			directAnswer: `We have a total of **${totalProductsCount} product SKUs** in our dataset across **${categoriesCount}** product categories. Total inventory valuation is **${formatCompactPKR(inv.inventoryValue)}** (**${inv.inStock}** in stock, **${inv.lowStock}** low stock, **${inv.outOfStock}** out of stock).`
		};
	}
	if (q.includes("product") || q.includes("top product") || q.includes("best selling") || q.includes("highest revenue product")) {
		const limit = extractLimit(q, 5);
		const top = getTopProducts(data, currentRange, limit);
		if (!top.length) return {
			isSupported: true,
			question,
			structuredFacts: `Total Product SKUs in Dataset: ${data.products.length}. No product sales in range.`,
			directAnswer: "No qualifying product sales were recorded in the selected date range."
		};
		const top1 = top[0];
		const topListFormatted = top.map((p, i) => `${i + 1}. **${p.product.product_name}** — **${formatPKR(p.revenue)}** (**${formatCompactPKR(p.revenue)}**) across **${p.units}** units`).join("\n");
		const facts = `Total Product SKUs in Dataset: ${data.products.length}. User requested Top ${limit} Products. Top Product: ${top1.product.product_name} generating ${formatPKR(top1.revenue)} across ${top1.units} units. Top ${limit} Products:\n${topListFormatted}`;
		const chartConfig = {
			type: detectRequestedChartType(q, "bar"),
			title: `Top ${top.length} Products by Sales`,
			data: top.map((p) => ({
				name: p.product.product_name,
				value: p.revenue
			})),
			formatValue: "pkr"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: facts,
			directAnswer: `Your top overall product is **${top1.product.product_name}** with total revenue of **${formatPKR(top1.revenue)}** across **${top1.units}** units sold.\n\nThe top ${limit} best-selling products overall are:\n${topListFormatted}`,
			chartConfig
		};
	}
	if (q.includes("customer") && (q.includes("how many") || q.includes("total") || q.includes("count") || q.includes("number") || q.includes("all") || q.includes("registered") || q.includes("exist") || q.includes("have"))) {
		const totalCustomersCount = data.customers.length;
		const activeCustomersInPeriod = getTopCustomers(data, currentRange).length;
		const citiesCount = new Set(data.customers.map((c) => c.city)).size;
		const industriesCount = new Set(data.customers.map((c) => c.industry)).size;
		const top1 = getTopCustomers(data, currentRange, 1)[0];
		const topStr = top1 ? ` Top customer: ${top1.customer.customer_name} spending ${formatCompactPKR(top1.revenue)}.` : "";
		return {
			isSupported: true,
			question,
			structuredFacts: `Total Registered Customer Accounts in Dataset: ${totalCustomersCount}. Active Purchasing Customers in Period (${currentRange.preset}): ${activeCustomersInPeriod}. Geographic Coverage: ${citiesCount} cities. Industry Sectors: ${industriesCount} industries.${topStr}`,
			directAnswer: `We have a total of **${totalCustomersCount} registered customer accounts** in our dataset across **${citiesCount}** cities and **${industriesCount}** industry sectors (**${activeCustomersInPeriod}** active purchasing customers in the selected period).`
		};
	}
	if (q.includes("customer") || q.includes("top customer") || q.includes("best customer") || q.includes("highest revenue customer") || q.includes("repeat customer") || q.includes("repeated customer")) {
		const limit = extractLimit(q, 5);
		const top = getTopCustomers(data, currentRange, limit);
		if (!top.length) return {
			isSupported: true,
			question,
			structuredFacts: `Total Customer Accounts in Dataset: ${data.customers.length}. No customer sales in range.`,
			directAnswer: "No qualifying customer sales were recorded in the selected date range."
		};
		const top1 = top[0];
		const topListFormatted = top.map((c, i) => `${i + 1}. **${c.customer.customer_name}** — **${formatPKR(c.revenue)}** (**${formatCompactPKR(c.revenue)}**) across **${c.orders}** orders`).join("\n");
		const facts = `Total Registered Customer Accounts in Dataset: ${data.customers.length}. User requested Top ${limit} Customers. Top Customer: ${top1.customer.customer_name} spending ${formatPKR(top1.revenue)} over ${top1.orders} orders. Top ${limit} Customers:\n${topListFormatted}`;
		const chartConfig = {
			type: detectRequestedChartType(q, "bar"),
			title: `Top ${top.length} Customers by Revenue`,
			data: top.map((c) => ({
				name: c.customer.customer_name,
				value: c.revenue
			})),
			formatValue: "pkr"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: facts,
			directAnswer: `Your top overall customer is **${top1.customer.customer_name}** with total revenue of **${formatPKR(top1.revenue)}** across **${top1.orders}** orders.\n\nThe top ${limit} repeat customers overall are:\n${topListFormatted}`,
			chartConfig
		};
	}
	if (q.includes("city") || q.includes("cities") || q.includes("location") || q.includes("geographic") || q.includes("region") || q.includes("where")) {
		const limit = extractLimit(q, 5);
		const cities = getCityPerformance(data, currentRange, limit);
		if (!cities.length) return {
			isSupported: true,
			question,
			structuredFacts: "No city order data available in range.",
			directAnswer: "No qualifying sales orders were recorded in the selected date range."
		};
		const top1 = cities[0];
		const cityListFormatted = cities.map((c, i) => `${i + 1}. **${c.city}** — **${c.orders} orders** (**${formatCompactPKR(c.revenue)}** sales across ${c.customersCount} customer accounts)`).join("\n");
		const facts = `Geographic Breakdown by City: Top City by Orders is ${top1.city} (${top1.orders} orders, ${formatPKR(top1.revenue)} sales). Top ${limit} Cities:\n${cityListFormatted}`;
		let directAnswer = "";
		if (limit === 1 || q.includes("most orders") || q.includes("highest orders") || q.includes("top city") || q.includes("which city") || q.includes("where")) directAnswer = `The city with the most orders is **${top1.city}** with **${top1.orders} orders** (**${formatCompactPKR(top1.revenue)}** in total sales revenue across ${top1.customersCount} customer accounts), followed by **${cities[1]?.city ?? "Karachi"}** (**${cities[1]?.orders ?? 0} orders**, **${formatCompactPKR(cities[1]?.revenue ?? 0)}**).`;
		else directAnswer = `The top city by order volume is **${top1.city}** with **${top1.orders} orders** (**${formatCompactPKR(top1.revenue)}**).\n\nThe top ${limit} cities by order volume are:\n${cityListFormatted}`;
		const chartConfig = {
			type: detectRequestedChartType(q, "bar"),
			title: `Top ${cities.length} Cities by Sales Revenue`,
			data: cities.map((c) => ({
				name: c.city,
				value: c.revenue
			})),
			formatValue: "pkr"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: facts,
			directAnswer,
			chartConfig
		};
	}
	if (q.includes("industry") || q.includes("sector") || q.includes("industries")) {
		const limit = extractLimit(q, 5);
		const industries = getIndustryPerformance(data, currentRange, limit);
		if (!industries.length) return {
			isSupported: true,
			question,
			structuredFacts: "No industry order data in range.",
			directAnswer: "No qualifying sales orders were recorded in the selected date range."
		};
		const top1 = industries[0];
		const indListFormatted = industries.map((ind, i) => `${i + 1}. **${ind.industry}** — **${ind.orders} orders** (**${formatCompactPKR(ind.revenue)}** sales across ${ind.customersCount} customer accounts)`).join("\n");
		return {
			isSupported: true,
			question,
			structuredFacts: `Industry Sector Breakdown: Top Sector is ${top1.industry} (${top1.orders} orders, ${formatPKR(top1.revenue)}). Top ${limit} Sectors:\n${indListFormatted}`,
			directAnswer: `The top industry sector by order volume is **${top1.industry}** with **${top1.orders} orders** (**${formatCompactPKR(top1.revenue)}** in sales).\n\nTop ${limit} industry sectors:\n${indListFormatted}`,
			chartConfig: {
				type: detectRequestedChartType(q, "bar"),
				title: `Sales by Industry Sector`,
				data: industries.map((ind) => ({
					name: ind.industry,
					value: ind.revenue
				})),
				formatValue: "pkr"
			}
		};
	}
	if (q.includes("channel") || q.includes("sales channel") || q.includes("direct vs") || q.includes("wholesale") || q.includes("distributor")) {
		const channels = getChannelPerformance(data, currentRange);
		if (!channels.length) return {
			isSupported: true,
			question,
			structuredFacts: "No channel sales data in range.",
			directAnswer: "No qualifying sales orders were recorded in the selected date range."
		};
		const top1 = channels[0];
		const chanListFormatted = channels.map((ch, i) => `${i + 1}. **${ch.channel}** — **${ch.orders} orders** (**${formatCompactPKR(ch.revenue)}** sales)`).join("\n");
		return {
			isSupported: true,
			question,
			structuredFacts: `Sales Channel Breakdown: Top Channel is ${top1.channel} (${top1.orders} orders, ${formatPKR(top1.revenue)}). Channels:\n${chanListFormatted}`,
			directAnswer: `Our top sales channel is **${top1.channel}** generating **${formatCompactPKR(top1.revenue)}** across **${top1.orders}** orders.\n\nSales channel breakdown:\n${chanListFormatted}`,
			chartConfig: {
				type: detectRequestedChartType(q, "pie"),
				title: `Sales Channel Breakdown`,
				data: channels.map((ch) => ({
					name: ch.channel,
					value: ch.revenue
				})),
				formatValue: "pkr"
			}
		};
	}
	if (q.includes("order") || q.includes("status") || q.includes("cancelled") || q.includes("pending") || q.includes("processing")) {
		const statuses = getOrderStatusSummary(data, currentRange);
		const summaryStr = statuses.map((s) => `${s.status}: ${s.count} orders (${formatCompactPKR(s.value)})`).join(", ");
		const totalCount = statuses.reduce((acc, s) => acc + s.count, 0);
		const facts = `Total Orders in Range: ${totalCount}. Status Breakdown: ${summaryStr}.`;
		const chartConfig = {
			type: detectRequestedChartType(q, "pie"),
			title: "Order Status Breakdown Distribution",
			data: statuses.map((s) => ({
				name: s.status,
				value: s.count,
				secondaryValue: s.value
			})),
			formatValue: "number"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: facts,
			directAnswer: `Total order count for the period is ${totalCount.toLocaleString()}. Order breakdown: ${summaryStr}.`,
			chartConfig
		};
	}
	if (q.includes("month") || q.includes("highest sales") || q.includes("peak")) {
		const salesAll = calculateSales(data, resolvePreset("allTime"));
		const monthlySeries = calculateMonthlySeries(data, resolvePreset("allTime"));
		const facts = `Historical Dataset covers March 2025 through August 2026. All-time Net Sales reach ${formatCompactPKR(salesAll.netSales)} (${formatPKR(salesAll.netSales)}) across ${salesAll.totalOrders.toLocaleString()} orders.`;
		const chartConfig = {
			type: detectRequestedChartType(q, "area"),
			title: "All-Time Monthly Sales Performance",
			data: monthlySeries.map((m) => ({
				name: m.label,
				value: m.netSales
			})),
			formatValue: "pkr"
		};
		return {
			isSupported: true,
			question,
			structuredFacts: facts,
			directAnswer: `Across the historical dataset (March 2025 – August 2026), total net sales reached ${formatCompactPKR(salesAll.netSales)} (${formatPKR(salesAll.netSales)}).`,
			chartConfig
		};
	}
	if (q.includes("refund") || q.includes("return")) {
		const sales = calculateSales(data, currentRange);
		const returnPct = sales.grossSales > 0 ? sales.returns / sales.grossSales * 100 : 0;
		const returnedOrders = data.orders.filter((o) => o.order_status === "Returned" || o.order_status === "Partially Returned").length;
		return {
			isSupported: true,
			question,
			structuredFacts: `Total Returns & Refund Amount: ${formatPKR(sales.returns)} (${formatCompactPKR(sales.returns)}). Gross Sales: ${formatPKR(sales.grossSales)}. Refund/Return Rate: ${returnPct.toFixed(2)}% of gross sales. Returned/Partially Returned Orders Count: ${returnedOrders} out of ${data.orders.length} total orders.`,
			directAnswer: `Total returns and refund volume is ${formatCompactPKR(sales.returns)} (${formatPKR(sales.returns)}), representing a return rate of ${returnPct.toFixed(2)}% of gross sales (${returnedOrders} returned orders).`
		};
	}
	if ([
		"sales",
		"revenue",
		"order",
		"product",
		"customer",
		"inventory",
		"stock",
		"receivable",
		"payment",
		"delivery",
		"invoice",
		"profit",
		"refund",
		"return",
		"returns",
		"rate",
		"cost",
		"margin",
		"channel",
		"warehouse",
		"performance",
		"volume",
		"amount"
	].some((k) => q.includes(k))) {
		const sales = calculateSales(data, currentRange);
		const rec = calculateReceivables(getReceivableRecords(data));
		const inv = calculateInventoryHealth(getInventoryRecords(data));
		return {
			isSupported: true,
			question,
			structuredFacts: attachHistoryFacts(`Overall Business Metrics (${currentRange.preset}): Net Sales: ${formatCompactPKR(sales.netSales)} (${formatPKR(sales.netSales)}). Total Orders: ${sales.totalOrders}. Gross Profit: ${formatCompactPKR(sales.grossProfit)} (${sales.grossMarginPct.toFixed(2)}% margin). Outstanding Receivables: ${formatCompactPKR(rec.outstanding)} (${formatCompactPKR(rec.overdue)} overdue). Inventory Value: ${formatCompactPKR(inv.inventoryValue)} across ${data.products.length} SKUs (${inv.inStock} In Stock, ${inv.lowStock} Low Stock, ${inv.outOfStock} Out of Stock).`),
			directAnswer: `Our overall performance for the selected period shows **${formatCompactPKR(sales.netSales)}** in Net Sales across **${sales.totalOrders}** orders (**${sales.grossMarginPct.toFixed(2)}%** gross margin). Outstanding receivables total **${formatCompactPKR(rec.outstanding)}** (**${formatCompactPKR(rec.overdue)}** overdue), and total inventory valuation is **${formatCompactPKR(inv.inventoryValue)}** (${inv.inStock} items in stock, ${inv.lowStock} low stock).`
		};
	}
	return {
		isSupported: true,
		question,
		structuredFacts: attachHistoryFacts("Unrecognized or ambiguous query. Ask user to clarify their question regarding Sales & Operations dataset."),
		directAnswer: "I didn't quite catch that. Could you please rephrase or ask a question about your **sales performance**, **inventory stock**, **top customers**, **receivables**, or **delivery performance**?"
	};
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var queryGeminiServerFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b2e8283837c9de85e38739fbde0fd8505397e43c141b6e86cac3450b0a37b490"));
var CHART_COLORS = [
	"hsl(158, 64%, 40%)",
	"hsl(175, 70%, 41%)",
	"hsl(199, 89%, 48%)",
	"hsl(38, 92%, 50%)",
	"hsl(262, 83%, 58%)",
	"hsl(340, 82%, 52%)"
];
function CustomChartTooltip({ active, payload, label, formatValue }) {
	if (active && payload && payload.length) {
		const dataItem = payload[0];
		const val = dataItem.value;
		const formatted = formatValue === "pkr" ? formatPKR(val) : formatValue === "pct" ? `${val.toFixed(1)}%` : val.toLocaleString();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-popover/95 border border-border/80 px-2.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-popover-foreground",
				children: label || dataItem.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-primary font-mono font-bold mt-0.5",
				children: formatted
			})]
		});
	}
	return null;
}
function InlineChatChart({ config }) {
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	if (!config || !config.data || config.data.length === 0) return null;
	const { type, title, data, formatValue = "pkr" } = config;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2.5 pt-2.5 border-t border-border/40 w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-2 gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "text-[11px] font-bold tracking-tight text-foreground flex items-center gap-1.5 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3.5 w-3.5 text-primary shrink-0" }), title]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-mono text-muted-foreground uppercase px-2 py-0.5 bg-muted/60 rounded-full border border-border/40",
						children: [type, " chart"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsModalOpen(true),
						className: "flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md border border-primary/25 transition-all cursor-pointer shadow-2xs",
						title: "Preview Fullscreen Chart",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3 w-3" }), "Expand"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full h-60 bg-card/80 border border-border/60 rounded-xl p-2 shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: type === "line" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data,
						margin: {
							top: 12,
							right: 12,
							left: 6,
							bottom: 28
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								stroke: "#888888",
								fontSize: 9,
								tickLine: false,
								axisLine: false,
								interval: 0,
								angle: -20,
								textAnchor: "end",
								height: 32,
								tickFormatter: (str) => typeof str === "string" && str.length > 14 ? `${str.substring(0, 12)}...` : str
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "#888888",
								fontSize: 9,
								width: 48,
								tickLine: false,
								axisLine: false,
								tickFormatter: (v) => formatChartAxisTick(v, formatValue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "value",
								stroke: "hsl(158, 64%, 40%)",
								strokeWidth: 2.5,
								dot: {
									r: 3,
									fill: "hsl(158, 64%, 40%)"
								},
								activeDot: { r: 5 }
							})
						]
					}) : type === "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data,
						margin: {
							top: 12,
							right: 12,
							left: 6,
							bottom: 28
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "chartGrad",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "hsl(158, 64%, 40%)",
									stopOpacity: .4
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "hsl(158, 64%, 40%)",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								stroke: "#888888",
								fontSize: 9,
								tickLine: false,
								axisLine: false,
								interval: 0,
								angle: -20,
								textAnchor: "end",
								height: 32,
								tickFormatter: (str) => typeof str === "string" && str.length > 14 ? `${str.substring(0, 12)}...` : str
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "#888888",
								fontSize: 9,
								width: 48,
								tickLine: false,
								axisLine: false,
								tickFormatter: (v) => formatChartAxisTick(v, formatValue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "value",
								stroke: "hsl(158, 64%, 40%)",
								strokeWidth: 2,
								fillOpacity: 1,
								fill: "url(#chartGrad)"
							})
						]
					}) : type === "pie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
							fontSize: "10px",
							paddingTop: "4px"
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data,
							cx: "50%",
							cy: "42%",
							innerRadius: 28,
							outerRadius: 55,
							paddingAngle: 4,
							dataKey: "value",
							children: data.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						margin: {
							top: 12,
							right: 12,
							left: 6,
							bottom: 28
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								stroke: "#888888",
								fontSize: 9,
								tickLine: false,
								axisLine: false,
								interval: 0,
								angle: -20,
								textAnchor: "end",
								height: 32,
								tickFormatter: (str) => typeof str === "string" && str.length > 14 ? `${str.substring(0, 12)}...` : str
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "#888888",
								fontSize: 9,
								width: 48,
								tickLine: false,
								axisLine: false,
								tickFormatter: (v) => formatChartAxisTick(v, formatValue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "value",
								radius: [
									4,
									4,
									0,
									0
								],
								maxBarSize: 45,
								children: data.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))
							})
						]
					})
				})
			}),
			isModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200",
				onClick: () => setIsModalOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative bg-card border border-border/80 rounded-2xl shadow-2xl p-4 sm:p-6 w-[95vw] sm:w-full max-w-4xl max-h-[92vh] flex flex-col gap-3 animate-in zoom-in-95 duration-200 overflow-hidden",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/50 pb-2.5 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5 text-primary shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm sm:text-base font-bold text-foreground truncate max-w-[200px] sm:max-w-md",
									children: title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-[10px] sm:text-xs uppercase font-mono bg-muted/60 shrink-0",
									children: [type, " chart"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => setIsModalOpen(false),
							className: "h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-[320px] sm:h-[450px] pt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: type === "line" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data,
								margin: {
									top: 15,
									right: 20,
									left: 10,
									bottom: 45
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: "#888888",
										fontSize: 10,
										tickLine: false,
										axisLine: false,
										interval: 0,
										angle: -25,
										textAnchor: "end",
										height: 45,
										tickFormatter: (str) => typeof str === "string" && str.length > 18 ? `${str.substring(0, 16)}...` : str
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#888888",
										fontSize: 10,
										width: 55,
										tickLine: false,
										axisLine: false,
										tickFormatter: (v) => formatChartAxisTick(v, formatValue)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
										paddingTop: "10px",
										fontSize: "11px"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "value",
										name: title,
										stroke: "hsl(158, 64%, 40%)",
										strokeWidth: 3,
										dot: {
											r: 4,
											fill: "hsl(158, 64%, 40%)"
										},
										activeDot: { r: 7 }
									})
								]
							}) : type === "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data,
								margin: {
									top: 15,
									right: 20,
									left: 10,
									bottom: 45
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "chartGradModal",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "hsl(158, 64%, 40%)",
											stopOpacity: .5
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "hsl(158, 64%, 40%)",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: "#888888",
										fontSize: 10,
										tickLine: false,
										axisLine: false,
										interval: 0,
										angle: -25,
										textAnchor: "end",
										height: 45,
										tickFormatter: (str) => typeof str === "string" && str.length > 18 ? `${str.substring(0, 16)}...` : str
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#888888",
										fontSize: 10,
										width: 55,
										tickLine: false,
										axisLine: false,
										tickFormatter: (v) => formatChartAxisTick(v, formatValue)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
										paddingTop: "10px",
										fontSize: "11px"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "value",
										name: title,
										stroke: "hsl(158, 64%, 40%)",
										strokeWidth: 2.5,
										fillOpacity: 1,
										fill: "url(#chartGradModal)"
									})
								]
							}) : type === "pie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
									paddingTop: "14px",
									fontSize: "11px"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data,
									cx: "50%",
									cy: "42%",
									innerRadius: 50,
									outerRadius: 105,
									paddingAngle: 6,
									dataKey: "value",
									label: ({ name, percent }) => `${typeof name === "string" && name.length > 12 ? name.substring(0, 10) + "..." : name} (${(percent * 100).toFixed(0)}%)`,
									children: data.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `modal-cell-${index}`))
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data,
								margin: {
									top: 15,
									right: 20,
									left: 10,
									bottom: 45
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: "#888888",
										fontSize: 10,
										tickLine: false,
										axisLine: false,
										interval: 0,
										angle: -25,
										textAnchor: "end",
										height: 45,
										tickFormatter: (str) => typeof str === "string" && str.length > 18 ? `${str.substring(0, 16)}...` : str
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#888888",
										fontSize: 10,
										width: 55,
										tickLine: false,
										axisLine: false,
										tickFormatter: (v) => formatChartAxisTick(v, formatValue)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomChartTooltip, { formatValue }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
										paddingTop: "10px",
										fontSize: "11px"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										name: title,
										radius: [
											6,
											6,
											0,
											0
										],
										maxBarSize: 60,
										children: data.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `modal-cell-${index}`))
									})
								]
							})
						})
					})]
				})
			})
		]
	});
}
var SUGGESTIONS = [
	"What were our total sales this year?",
	"Which products generated the most revenue?",
	"Which customers purchased the most?",
	"How much is currently outstanding?",
	"How much receivables are overdue?",
	"Which products are low in stock?",
	"What is our on-time delivery rate?",
	"Which month had the highest sales?",
	"How many orders were cancelled?"
];
function FormattedMarkdown({ text }) {
	const lines = text.split("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children: lines.map((line, lineIdx) => {
			const trimmed = line.trim();
			if (!trimmed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1" }, lineIdx);
			const parseBold = (str) => {
				return str.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
					if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "font-bold text-foreground font-semibold",
						children: part.slice(2, -2)
					}, pIdx);
					return part;
				});
			};
			const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
			if (numMatch) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-1.5 pl-0.5 my-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold text-primary shrink-0",
					children: [numMatch[1], "."]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: parseBold(numMatch[2]) })]
			}, lineIdx);
			const bulletMatch = trimmed.match(/^[\-\*]\s+(.*)/);
			if (bulletMatch) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-1.5 pl-1.5 my-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary font-bold shrink-0",
					children: "•"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: parseBold(bulletMatch[1]) })]
			}, lineIdx);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: parseBold(line) }, lineIdx);
		})
	});
}
function AIAssistantPage() {
	const { dataset, dateRange } = useDataset();
	const [messages, setMessages] = (0, import_react.useState)([{
		id: "welcome",
		sender: "ai",
		text: "Hello! I am your PulseOps Sales & Operations Intelligence Assistant. Ask me anything about your sales performance, inventory status, receivables, customer rankings, or logistics performance.",
		sourceTag: "PulseOps Data Engine",
		timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		})
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const messagesContainerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (messagesContainerRef.current) messagesContainerRef.current.scrollTo({
			top: messagesContainerRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, loading]);
	const handleSend = async (questionText) => {
		const q = (questionText || input).trim();
		if (!q || !dataset || loading) return;
		setInput("");
		const userMsg = {
			id: `u-${Date.now()}`,
			sender: "user",
			text: q,
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		const chatHistoryPayload = messages.filter((m) => m.id !== "welcome" && m.text).slice(-10).map((m) => ({
			sender: m.sender,
			text: m.text
		}));
		setMessages((prev) => [...prev, userMsg]);
		setLoading(true);
		try {
			const localResult = queryAiEngine(q, dataset, dateRange, chatHistoryPayload);
			let aiText = localResult.directAnswer;
			let sourceTag = "PulseOps Data Engine";
			if (localResult.isSupported) try {
				const res = await queryGeminiServerFn({ data: {
					question: q,
					structuredFacts: localResult.structuredFacts,
					isSupported: localResult.isSupported,
					fallbackAnswer: localResult.directAnswer,
					chatHistory: chatHistoryPayload
				} });
				if (res?.answer) aiText = res.answer;
				if (res?.source) sourceTag = res.source;
			} catch {
				aiText = localResult.directAnswer;
				sourceTag = "PulseOps Data Engine";
			}
			const aiMsg = {
				id: `ai-${Date.now()}`,
				sender: "ai",
				text: aiText,
				sourceTag,
				isError: !localResult.isSupported,
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}),
				...localResult.chartConfig ? { chartConfig: localResult.chartConfig } : {}
			};
			setMessages((prev) => [...prev, aiMsg]);
		} catch {
			setMessages((prev) => [...prev, {
				id: `err-${Date.now()}`,
				sender: "ai",
				text: "I encountered an issue processing that query over the dataset.",
				sourceTag: "System Error",
				isError: true,
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				})
			}]);
		} finally {
			setLoading(false);
		}
	};
	const handleCopy = (id, text) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-6xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3.5 h-full flex flex-col min-h-0 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bento-card flex-1 flex flex-col min-h-0 overflow-hidden p-3.5 sm:p-5 md:p-6 border-border/80 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/50 shrink-0 gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-lg sm:text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary animate-pulse" }), " AI Business Assistant"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[11px] font-mono border-primary/30 text-primary bg-primary/10 px-2 py-0.5 rounded-full",
							children: "Gemini 3.5 + Data Engine"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Strictly dataset-backed executive intelligence powered by Gemini 2.0 & PulseOps Data Engine"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setMessages([{
							id: "welcome",
							sender: "ai",
							text: "Hello! I am your PulseOps Sales & Operations Intelligence Assistant. Ask me anything about your sales performance, inventory status, receivables, customer rankings, or logistics performance.",
							sourceTag: "PulseOps Data Engine",
							timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})
						}]),
						className: "h-8 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 rounded-xl border-border/60 hover:bg-muted shrink-0 self-start sm:self-auto px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Clear Chat"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: messagesContainerRef,
					className: "flex-1 min-h-0 overflow-y-auto py-3 pr-1 space-y-3.5",
					children: [messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-start gap-2.5 sm:gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl shrink-0 shadow-2xs ${msg.sender === "user" ? "bg-primary text-primary-foreground font-bold text-xs" : "bg-primary/10 border border-primary/20 text-primary"}`,
							children: msg.sender === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `group relative max-w-[84%] sm:max-w-[72%] md:max-w-[65%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-tr-xs" : msg.isError ? "bg-destructive/10 border border-destructive/30 text-destructive rounded-tl-xs" : "bg-muted/40 border border-border/70 rounded-tl-xs text-foreground"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormattedMarkdown, { text: msg.text }),
								msg.chartConfig && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineChatChart, { config: msg.chartConfig }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-[10px] sm:text-[11px] font-mono gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 opacity-75",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: msg.timestamp }), msg.sourceTag && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 font-sans font-medium text-primary",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }),
												" ",
												msg.sourceTag
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleCopy(msg.id, msg.text),
										className: `p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 ${msg.sender === "user" ? "hover:bg-white/20 text-primary-foreground/80 hover:text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`,
										title: "Copy message",
										children: copiedId === msg.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
									})]
								})
							]
						})]
					}, msg.id)), loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2.5 sm:gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3.5 w-3.5 animate-pulse" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-muted/40 border border-border/70 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs text-muted-foreground flex items-center gap-2 shadow-2xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "animate-pulse font-medium",
								children: "Analyzing PulseOps dataset records & running data verification..."
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 pt-3 border-t border-border/50 space-y-2.5 bg-card/50",
					children: [messages.length < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3 w-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Suggested dataset questions:" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: SUGGESTIONS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleSend(s),
								className: "px-2.5 py-1 text-[11px] font-medium rounded-full border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all text-left shadow-2xs",
								children: s
							}, i))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							handleSend();
						},
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Ask anything about sales, orders, receivables, stock, or delivery performance...",
							value: input,
							onChange: (e) => setInput(e.target.value),
							disabled: loading,
							className: "h-10 sm:h-10 text-xs rounded-full border-border/70 bg-muted/20 px-4 shadow-xs focus-visible:ring-primary focus-visible:ring-2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: !input.trim() || loading,
							className: "h-10 sm:h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 shadow-xs shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { AIAssistantPage as component };
