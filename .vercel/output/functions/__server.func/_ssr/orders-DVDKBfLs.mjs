import { i as __toESM } from "../_runtime.mjs";
import { _ as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as isQualifyingOrder, N as useDataset, g as formatCompactPKR, k as inRange, n as Button, t as Badge, y as formatPKR } from "./badge-Bl18eSKb.mjs";
import { t as Input } from "./input-ihffJmEB.mjs";
import { A as Eye, B as ChevronLeft, I as CircleCheck, N as Clock, f as ShoppingBag, o as TriangleAlert, t as X, v as Search, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-B2VMkDTk.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYsW5vrb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-DVDKBfLs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const { dataset, dateRange } = useDataset();
	const searchParams = useSearch({ from: "/orders" });
	const [query, setQuery] = (0, import_react.useState)(searchParams.search || "");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)(searchParams.status || "ALL");
	const [deliveryFilter, setDeliveryFilter] = (0, import_react.useState)(searchParams.delivery || "ALL");
	const [page, setPage] = (0, import_react.useState)(1);
	const pageSize = 15;
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const filteredOrders = (0, import_react.useMemo)(() => {
		if (!dataset) return [];
		return dataset.orders.filter((o) => {
			if (!inRange(o.order_date, dateRange)) return false;
			if (statusFilter !== "ALL" && o.order_status !== statusFilter) return false;
			if (deliveryFilter !== "ALL") {
				if (deliveryFilter === "Delayed" && o.delivery_status !== "Delayed") return false;
				if (deliveryFilter === "On-Time" && o.delivery_status !== "On-Time") return false;
				if (deliveryFilter === "Overdue Open Order") {
					if (o.delivered_date || o.order_status === "Cancelled" || !o.required_date || o.required_date >= "2026-09-01") return false;
				}
			}
			if (query) {
				const q = query.toLowerCase();
				const cust = dataset.customerById.get(o.customer_id)?.customer_name.toLowerCase() ?? "";
				return o.order_id.toLowerCase().includes(q) || o.customer_id.toLowerCase().includes(q) || cust.includes(q);
			}
			return true;
		});
	}, [
		dataset,
		dateRange,
		statusFilter,
		deliveryFilter,
		query
	]);
	if (!dataset) return null;
	const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
	const currentPage = Math.min(page, totalPages);
	const pagedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	filteredOrders.filter(isQualifyingOrder).length;
	const totalVal = filteredOrders.filter(isQualifyingOrder).reduce((a, b) => a + b.total_amount, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-6 w-6 text-primary" }), " Order Management"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Real-time sales orders, fulfillment statuses, and line item breakdowns"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs font-mono px-3 py-1 bg-card",
						children: [filteredOrders.length.toLocaleString(), " Orders Filtered"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "text-xs font-mono px-3 py-1 bg-primary/10 text-primary",
						children: ["Qualifying Volume: ", formatCompactPKR(totalVal)]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					{
						label: "Total Orders",
						count: filteredOrders.length,
						amount: totalVal,
						sub: "Qualifying period sales volume",
						icon: ShoppingBag
					},
					{
						label: "Delivered & Shipped",
						count: filteredOrders.filter((o) => o.order_status === "Delivered" || o.order_status === "Shipped").length,
						amount: filteredOrders.filter((o) => o.order_status === "Delivered" || o.order_status === "Shipped").reduce((a, b) => a + b.total_amount, 0),
						sub: "Fulfilled customer orders",
						icon: CircleCheck
					},
					{
						label: "On-Time Fulfillment",
						count: filteredOrders.filter((o) => o.delivery_status === "On-Time").length,
						amount: filteredOrders.filter((o) => o.delivery_status === "On-Time").reduce((a, b) => a + b.total_amount, 0),
						sub: "Arrived within target SLA",
						icon: Clock
					},
					{
						label: "Delayed / Overdue",
						count: filteredOrders.filter((o) => o.delivery_status === "Delayed" || o.required_date && o.required_date < "2026-09-01" && !o.delivered_date && o.order_status !== "Cancelled").length,
						amount: filteredOrders.filter((o) => o.delivery_status === "Delayed").reduce((a, b) => a + b.total_amount, 0),
						sub: "Requires dispatch attention",
						icon: TriangleAlert
					}
				].map((kpi, idx) => {
					const Icon = kpi.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 rounded-2xl border border-border/60 bg-card hover:bg-muted/30 transition-all text-left flex flex-col justify-between shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-1.5 rounded-xl bg-muted/50 text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs sm:text-sm font-bold text-foreground tracking-tight",
									children: kpi.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full",
								children: [kpi.count, " Orders"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground",
								children: formatCompactPKR(kpi.amount)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1 font-medium",
								children: kpi.sub
							})]
						})]
					}, idx);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/60 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:w-80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search order ID or customer name...",
							value: query,
							onChange: (e) => {
								setQuery(e.target.value);
								setPage(1);
							},
							className: "pl-9 text-xs h-9 rounded-xl"
						}),
						query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							onClick: () => setQuery(""),
							className: "absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 w-full md:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onValueChange: (v) => {
								setStatusFilter(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[180px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Order Statuses" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "rounded-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ALL",
										children: "All Order Statuses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Delivered",
										children: "Delivered"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Shipped",
										children: "Shipped"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Processing",
										children: "Processing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Confirmed",
										children: "Confirmed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Returned",
										children: "Returned"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Partially Returned",
										children: "Partially Returned"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Cancelled",
										children: "Cancelled"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: deliveryFilter,
							onValueChange: (v) => {
								setDeliveryFilter(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[200px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Delivery Performance" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "rounded-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ALL",
										children: "All Delivery Performance"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "On-Time",
										children: "On-Time Deliveries"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Delayed",
										children: "Delayed Deliveries"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Overdue Open Order",
										children: "Overdue Open Orders"
									})
								]
							})]
						}),
						(statusFilter !== "ALL" || deliveryFilter !== "ALL" || query) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setStatusFilter("ALL");
								setDeliveryFilter("ALL");
								setQuery("");
								setPage(1);
							},
							className: "h-9 text-xs",
							children: "Reset Filters"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bento-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 border-b border-border/60 font-semibold text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Order ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Order Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Delivery"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Channel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Total Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Gross Profit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/40 font-medium text-foreground",
							children: pagedOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 9,
								className: "py-12 text-center text-muted-foreground text-xs",
								children: "No orders matching selected criteria."
							}) }) : pagedOrders.map((o) => {
								const customerName = dataset.customerById.get(o.customer_id)?.customer_name ?? o.customer_id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-mono font-bold",
											children: o.order_id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-medium",
											children: customerName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 font-mono text-muted-foreground",
											children: o.order_date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: o.order_status === "Delivered" || o.order_status === "Shipped" ? "default" : o.order_status === "Cancelled" ? "destructive" : "secondary",
												className: "text-[10px] font-normal",
												children: o.order_status
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4",
											children: o.delivery_status === "On-Time" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-success font-semibold flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " On-Time"]
											}) : o.delivery_status === "Delayed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-warning font-semibold flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }),
													" Delayed (",
													o.delivery_delay_days,
													"d)"
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground font-mono text-[11px]",
												children: o.delivered_date ? o.delivered_date : "Pending"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-muted-foreground",
											children: o.sales_channel
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-right font-mono font-bold",
											children: formatCompactPKR(o.total_amount)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-right font-mono text-success",
											children: formatCompactPKR(o.gross_profit)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-4 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												onClick: () => setSelectedOrder(o),
												className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground",
												title: "View order items",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
											})
										})
									]
								}, o.order_id);
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-4 border-t border-border/40 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [
							"Page ",
							currentPage,
							" of ",
							totalPages,
							" (",
							filteredOrders.length.toLocaleString(),
							" total orders)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							disabled: currentPage <= 1,
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							className: "h-8 text-xs gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), " Prev"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							disabled: currentPage >= totalPages,
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							className: "h-8 text-xs gap-1",
							children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedOrder,
				onOpenChange: (open) => !open && setSelectedOrder(null),
				children: selectedOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderItemsModal, {
					order: selectedOrder,
					dataset,
					onClose: () => setSelectedOrder(null)
				})
			})
		]
	});
}
function OrderItemsModal({ order, dataset, onClose }) {
	const items = dataset.itemsByOrder.get(order.order_id) ?? [];
	const customer = dataset.customerById.get(order.customer_id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-[560px] rounded-3xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
			className: "text-base font-bold text-foreground flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Order Details #", order.order_id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "text-xs font-mono",
				children: order.order_status
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 py-2 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: customer?.customer_name ?? order.customer_id
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Order Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: order.order_date
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Required Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: order.required_date ?? "N/A"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Delivered Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: order.delivered_date ?? "Pending"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "font-bold text-foreground",
						children: [
							"Order Line Items (",
							items.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border/60 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/50 font-semibold text-muted-foreground text-[11px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2.5",
										children: "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2.5 text-center",
										children: "Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2.5 text-right",
										children: "Line Total"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40 font-mono text-[11px]",
								children: items.map((item, i) => {
									const prod = dataset.productById.get(item.product_id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2.5 font-sans font-medium text-foreground",
											children: [prod?.product_name ?? item.product_id, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground block",
												children: prod?.sku
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 text-center font-bold",
											children: item.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2.5 text-right font-bold text-foreground",
											children: formatPKR(item.line_total)
										})
									] }, i);
								})
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2 border-t border-border/50 flex justify-between items-center font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Total Amount:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-base text-foreground font-extrabold",
						children: formatPKR(order.total_amount)
					})]
				})
			]
		})]
	});
}
//#endregion
export { OrdersPage as component };
