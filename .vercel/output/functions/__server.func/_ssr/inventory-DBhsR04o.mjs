import { i as __toESM } from "../_runtime.mjs";
import { _ as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as getInventoryRecords, N as useDataset, g as formatCompactPKR, n as Button, t as Badge, u as calculateInventoryHealth, y as formatPKR } from "./badge-Bl18eSKb.mjs";
import { t as Input } from "./input-ihffJmEB.mjs";
import { B as ChevronLeft, I as CircleCheck, L as CircleAlert, b as Package, m as ShieldAlert, o as TriangleAlert, t as X, v as Search, x as PackageCheck, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYsW5vrb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-DBhsR04o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const { dataset } = useDataset();
	const searchParams = useSearch({ from: "/inventory" });
	const [query, setQuery] = (0, import_react.useState)(searchParams.search || "");
	const [activeTab, setActiveTab] = (0, import_react.useState)(searchParams.status || "ALL");
	const [warehouseFilter, setWarehouseFilter] = (0, import_react.useState)("ALL");
	const [page, setPage] = (0, import_react.useState)(1);
	const pageSize = 15;
	const records = (0, import_react.useMemo)(() => {
		if (!dataset) return [];
		return getInventoryRecords(dataset);
	}, [dataset]);
	const health = (0, import_react.useMemo)(() => calculateInventoryHealth(records), [records]);
	const filteredRecords = (0, import_react.useMemo)(() => {
		return records.filter((r) => {
			if (activeTab !== "ALL" && r.status !== activeTab) return false;
			if (warehouseFilter !== "ALL" && r.row.warehouse !== warehouseFilter) return false;
			if (query) {
				const q = query.toLowerCase();
				return r.product.product_name.toLowerCase().includes(q) || r.product.sku.toLowerCase().includes(q) || r.product.category.toLowerCase().includes(q);
			}
			return true;
		});
	}, [
		records,
		activeTab,
		warehouseFilter,
		query
	]);
	if (!dataset) return null;
	const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
	const currentPage = Math.min(page, totalPages);
	const pagedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const warehouses = Array.from(new Set(records.map((r) => r.row.warehouse)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6 text-primary" }), " Inventory Management"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Physical stock levels, reservation allocations, and warehouse reorder alerts"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs font-mono px-3 py-1 bg-card",
						children: ["Total Valuation: ", formatCompactPKR(health.inventoryValue)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "text-xs font-mono px-3 py-1 bg-primary/10 text-primary",
						children: [records.length, " Active SKUs"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3",
				children: [
					{
						label: "All Items",
						key: "ALL",
						count: health.total,
						sub: "Total active catalog",
						pct: "100%",
						icon: PackageCheck,
						activeColor: "border-primary bg-primary/10 ring-2 ring-primary/20",
						inactiveColor: "border-border/60 bg-card hover:bg-muted/30"
					},
					{
						label: "In Stock",
						key: "In Stock",
						count: health.inStock,
						sub: "Fully allocated & ready",
						pct: `${(health.inStock / health.total * 100).toFixed(0)}%`,
						icon: CircleCheck,
						activeColor: "border-success bg-success/10 ring-2 ring-success/20 text-success",
						inactiveColor: "border-border/60 bg-card hover:bg-success/5"
					},
					{
						label: "Low Stock",
						key: "Low Stock",
						count: health.lowStock,
						sub: "Near reorder limit",
						pct: `${(health.lowStock / health.total * 100).toFixed(0)}%`,
						icon: TriangleAlert,
						activeColor: "border-warning bg-warning/10 ring-2 ring-warning/20 text-warning",
						inactiveColor: "border-border/60 bg-card hover:bg-warning/5"
					},
					{
						label: "Out of Stock",
						key: "Out of Stock",
						count: health.outOfStock,
						sub: "Critical stockout SKUs",
						pct: `${(health.outOfStock / health.total * 100).toFixed(0)}%`,
						icon: CircleAlert,
						activeColor: "border-destructive bg-destructive/10 ring-2 ring-destructive/20 text-destructive",
						inactiveColor: "border-border/60 bg-card hover:bg-destructive/5"
					},
					{
						label: "Discrepancy",
						key: "Discrepancy",
						count: health.discrepancy,
						sub: "Audit check flags",
						pct: `${(health.discrepancy / health.total * 100).toFixed(0)}%`,
						icon: ShieldAlert,
						activeColor: "border-muted-foreground bg-muted ring-2 ring-muted-foreground/20 text-foreground",
						inactiveColor: "border-border/60 bg-card hover:bg-muted/30"
					}
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.key;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setActiveTab(tab.key);
							setPage(1);
						},
						className: `p-4 sm:p-5 rounded-2xl border transition-all text-left flex flex-col justify-between shadow-2xs group relative overflow-hidden ${isActive ? tab.activeColor : tab.inactiveColor}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `p-1.5 rounded-xl ${isActive ? "bg-card/60" : "bg-muted/50 text-muted-foreground"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs sm:text-sm font-bold text-foreground tracking-tight",
									children: tab.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full",
								children: tab.pct
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground",
								children: tab.count
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1 font-medium",
								children: tab.sub
							})]
						})]
					}, tab.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/60 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:w-80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search product name, SKU or category...",
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
					className: "flex items-center gap-2 w-full md:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: warehouseFilter,
						onValueChange: (v) => {
							setWarehouseFilter(v);
							setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[200px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Warehouses" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
							className: "rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "ALL",
								children: "All Warehouses"
							}), warehouses.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: w,
								children: ["Warehouse: ", w]
							}, w))]
						})]
					}), (activeTab !== "ALL" || warehouseFilter !== "ALL" || query) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							setActiveTab("ALL");
							setWarehouseFilter("ALL");
							setQuery("");
							setPage(1);
						},
						className: "h-9 text-xs",
						children: "Reset Filters"
					})]
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
									children: "Product Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "SKU"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "On Hand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "Reserved"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "Available"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "Reorder Level"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Unit Cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Total Value"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/40 font-medium text-foreground",
							children: pagedRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 10,
								className: "py-12 text-center text-muted-foreground text-xs",
								children: "No inventory records matching selected filters."
							}) }) : pagedRecords.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-bold text-foreground",
										children: r.product.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono text-muted-foreground",
										children: r.product.sku
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: r.product.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center font-mono font-semibold",
										children: r.row.quantity_on_hand
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center font-mono text-muted-foreground",
										children: r.row.quantity_reserved
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center font-mono font-bold text-foreground",
										children: r.available
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center font-mono text-muted-foreground",
										children: r.row.reorder_level
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono text-muted-foreground",
										children: formatPKR(r.product.unit_cost)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono font-bold text-foreground",
										children: formatCompactPKR(r.value)
									})
								]
							}, r.product.product_id))
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
							filteredRecords.length,
							" items)"
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
			})
		]
	});
}
function StatusBadge({ status }) {
	if (status === "In Stock") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "default",
		className: "text-[10px] font-semibold bg-success/15 text-success border-success/30",
		children: "In Stock"
	});
	if (status === "Low Stock") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[10px] font-semibold bg-warning/15 text-warning border-warning/30",
		children: "Low Stock"
	});
	if (status === "Out of Stock") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "destructive",
		className: "text-[10px] font-semibold",
		children: "Out of Stock"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "secondary",
		className: "text-[10px] font-semibold bg-muted text-muted-foreground",
		children: "Discrepancy"
	});
}
//#endregion
export { InventoryPage as component };
