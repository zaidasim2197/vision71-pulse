import { i as __toESM } from "../_runtime.mjs";
import { v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as getInventoryRecords, D as getTopProducts, E as getTopCustomers, M as trend, N as useDataset, T as getReceivableRecords, c as calculateDailySeries, d as calculateMonthlySeries, f as calculateReceivables, g as formatCompactPKR, l as calculateDeliveryPerformance, m as cn, n as Button, p as calculateSales, s as buildAlerts, t as Badge, u as calculateInventoryHealth, v as formatMonth, w as getOrderStatusSummary, y as formatPKR } from "./badge-Bl18eSKb.mjs";
import { C as Minus, I as CircleCheck, L as CircleAlert, N as Clock, O as Info, U as ChartColumn, Y as ArrowRight, a as Truck, b as Package, c as TrendingDown, d as Sparkles, f as ShoppingBag, m as ShieldAlert, n as Warehouse, o as TriangleAlert, p as ShieldCheck, r as Users, s as TrendingUp, x as PackageCheck, y as Receipt } from "../_libs/lucide-react.mjs";
import { a as YAxis, d as Pie, f as Cell, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-B2VMkDTk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cc7sZYL0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KpiBentoCard({ metricKey, title, value, subtext, currentVal, prevVal, sparklineData, accentColor = "hsl(var(--primary))", badgeText, onClickDrillDown }) {
	const { setInfoMetricKey } = useDataset();
	const tr = currentVal != null && prevVal != null ? trend(currentVal, prevVal) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: onClickDrillDown,
		className: `bento-card group relative flex flex-col justify-between p-4 sm:p-5 transition-all ${onClickDrillDown ? "cursor-pointer hover:border-primary/40" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-1.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-muted-foreground leading-tight",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: (e) => {
						e.stopPropagation();
						setInfoMetricKey(metricKey);
					},
					className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:bg-muted hover:text-foreground shrink-0",
					title: "Metric definition & rules [i]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
				})]
			}),
			badgeText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20 leading-none",
					children: badgeText
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground tabular",
					children: value
				}), subtext && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5 leading-snug",
					children: subtext
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between pt-2 border-t border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 text-xs font-semibold",
					children: tr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [tr.direction === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-0.5 text-success",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }),
							" +",
							tr.pct.toFixed(1),
							"%"
						]
					}) : tr.direction === "down" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-0.5 text-destructive",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }),
							" ",
							tr.pct.toFixed(1),
							"%"
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-0.5 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" }), " 0.0%"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground font-normal",
						children: "vs prev period"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground font-normal",
						children: "No prev comparison"
					})
				}), sparklineData && sparklineData.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-8 w-16 opacity-80 group-hover:opacity-100 transition-opacity",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: sparklineData,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: `spark-${metricKey}`,
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "oklch(0.52 0.128 178)",
									stopOpacity: .4
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "oklch(0.52 0.128 178)",
									stopOpacity: 0
								})]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "value",
								stroke: "oklch(0.52 0.128 178)",
								strokeWidth: 2,
								fill: `url(#spark-${metricKey})`,
								isAnimationActive: false
							})]
						})
					})
				})]
			})
		]
	});
}
function SalesPerformanceCard() {
	const { dataset, dateRange, setInfoMetricKey } = useDataset();
	const [metricType, setMetricType] = (0, import_react.useState)("netSales");
	if (!dataset) return null;
	const chartData = calculateMonthlySeries(dataset, dateRange).filter((s) => s.month <= "2026-08").map((s) => ({
		...s,
		monthLabel: formatMonth(s.month)
	}));
	const totalNet = chartData.reduce((acc, curr) => acc + curr.netSales, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-base font-bold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4 text-primary" }), " Monthly Sales Performance"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: () => setInfoMetricKey("netSales"),
					className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
					title: "Metric info [i]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: [
					"Realized Net Sales: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground font-mono",
						children: formatCompactPKR(totalNet)
					}),
					" (",
					formatPKR(totalNet),
					")"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 self-start sm:self-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMetricType("netSales"),
						className: `px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${metricType === "netSales" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
						children: "Net Sales"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMetricType("grossSales"),
						className: `px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${metricType === "grossSales" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
						children: "Gross Sales"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMetricType("grossProfit"),
						className: `px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${metricType === "grossProfit" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
						children: "Gross Profit"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[280px] w-full pt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data: chartData,
					margin: {
						top: 15,
						right: 15,
						left: 10,
						bottom: 15
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "salesGrad",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "oklch(0.52 0.128 178)",
								stopOpacity: .45
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "oklch(0.52 0.128 178)",
								stopOpacity: .02
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							vertical: false,
							stroke: "var(--color-border)",
							opacity: .5
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "monthLabel",
							tickLine: false,
							axisLine: false,
							interval: 1,
							minTickGap: 30,
							dy: 8,
							tick: {
								fontSize: 11,
								fill: "var(--color-muted-foreground)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							width: 50,
							tickLine: false,
							axisLine: false,
							dx: -4,
							tickFormatter: (v) => v === 0 ? "" : compactY$1(v),
							tick: {
								fontSize: 11,
								fill: "var(--color-muted-foreground)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
							if (!active || !payload?.length) return null;
							const data = payload[0].payload;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-foreground border-b border-border/40 pb-1",
										children: [
											data.monthLabel,
											" (",
											data.month,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-primary font-mono font-bold",
										children: ["Net Sales: ", formatPKR(data.netSales)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground font-mono",
										children: ["Gross Sales: ", formatPKR(data.grossSales)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-success font-mono",
										children: ["Gross Profit: ", formatPKR(data.grossProfit)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-destructive font-mono",
										children: ["Returns: ", formatPKR(data.returns)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["Orders: ", data.orders.toLocaleString()]
									})
								]
							});
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: metricType,
							stroke: "oklch(0.52 0.128 178)",
							strokeWidth: 2.5,
							fill: "url(#salesGrad)"
						})
					]
				})
			})
		})]
	});
}
function compactY$1(val) {
	if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
	if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
	if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
	return `${val}`;
}
function InventoryHealthCard() {
	const { dataset, setInfoMetricKey } = useDataset();
	const router = useRouter();
	if (!dataset) return null;
	const records = getInventoryRecords(dataset);
	const health = calculateInventoryHealth(records);
	const pieData = [
		{
			name: "In Stock",
			value: health.inStock,
			color: "oklch(0.6 0.135 152)"
		},
		{
			name: "Low Stock",
			value: health.lowStock,
			color: "oklch(0.73 0.155 72)"
		},
		{
			name: "Out of Stock",
			value: health.outOfStock,
			color: "oklch(0.577 0.208 25)"
		},
		{
			name: "Discrepancy",
			value: health.discrepancy,
			color: "oklch(0.52 0.012 260)"
		}
	];
	const criticalLowItems = records.filter((r) => r.status === "Low Stock" || r.status === "Out of Stock").slice(0, 3);
	const items = [
		{
			label: "In Stock",
			count: health.inStock,
			color: "bg-success/15 text-success border-success/30",
			icon: PackageCheck,
			statusQuery: "In Stock"
		},
		{
			label: "Low Stock",
			count: health.lowStock,
			color: "bg-warning/15 text-warning border-warning/30",
			icon: TriangleAlert,
			statusQuery: "Low Stock"
		},
		{
			label: "Out of Stock",
			count: health.outOfStock,
			color: "bg-destructive/15 text-destructive border-destructive/30",
			icon: CircleAlert,
			statusQuery: "Out of Stock"
		},
		{
			label: "Discrepancy",
			count: health.discrepancy,
			color: "bg-muted text-muted-foreground border-border",
			icon: ShieldAlert,
			statusQuery: "Discrepancy"
		}
	];
	const handleNavigate = (status) => {
		router.navigate({
			to: "/inventory",
			search: { status }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b border-border/40 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "h-4 w-4 text-primary" }), " Inventory Stock Health"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setInfoMetricKey("inventoryValue"),
						className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
						title: "Metric info [i]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: [
						"Total Valuation: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-mono",
							children: formatCompactPKR(health.inventoryValue)
						}),
						" (",
						formatPKR(health.inventoryValue),
						")"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "text-xs font-bold px-3 py-1 bg-success/10 text-success border-success/30 font-mono",
					children: [health.healthyPct.toFixed(0), "% Healthy"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-[11px] text-muted-foreground font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overall Stock Allocation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						health.inStock,
						" of ",
						health.total,
						" SKUs Healthy"
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-2.5 w-full rounded-full bg-border/40 overflow-hidden flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-success transition-all duration-500",
							style: { width: `${health.inStock / health.total * 100}%` },
							title: `In Stock: ${health.inStock}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-warning transition-all duration-500",
							style: { width: `${health.lowStock / health.total * 100}%` },
							title: `Low Stock: ${health.lowStock}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-destructive transition-all duration-500",
							style: { width: `${health.outOfStock / health.total * 100}%` },
							title: `Out of Stock: ${health.outOfStock}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-muted-foreground transition-all duration-500",
							style: { width: `${health.discrepancy / health.total * 100}%` },
							title: `Discrepancy: ${health.discrepancy}`
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-5 h-[150px] relative flex items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: pieData,
							cx: "50%",
							cy: "50%",
							innerRadius: 46,
							outerRadius: 68,
							paddingAngle: 4,
							dataKey: "value",
							children: pieData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								fill: entry.color,
								stroke: "var(--color-card)",
								strokeWidth: 2
							}, `cell-${index}`))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
							if (!active || !payload?.length) return null;
							const d = payload[0];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-card p-2 shadow-lg text-xs font-semibold text-foreground",
								children: [
									d.name,
									": ",
									d.value,
									" SKUs"
								]
							});
						} })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-extrabold font-mono text-foreground leading-none",
							children: health.total
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground uppercase font-semibold mt-0.5",
							children: "Total SKUs"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-7 grid grid-cols-2 gap-2.5",
					children: items.map((item) => {
						const Icon = item.icon;
						const pct = (item.count / health.total * 100).toFixed(0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => handleNavigate(item.statusQuery),
							className: `p-3.5 sm:p-4 rounded-2xl border ${item.color} transition-all cursor-pointer hover:scale-[1.02] shadow-2xs flex flex-col justify-between group`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-foreground tracking-tight",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "text-[9px] font-mono font-bold px-1.5 py-0 rounded-full",
										children: [pct, "%"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 opacity-80" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl sm:text-3xl font-extrabold font-mono tracking-tight leading-none text-foreground",
									children: item.count
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground font-medium block mt-1 group-hover:text-primary transition-colors",
									children: "Filter SKUs →"
								})]
							})]
						}, item.label);
					})
				})]
			}),
			criticalLowItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-warning/30 bg-warning/5 p-3 space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold text-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-warning" }), " Items Requiring Reorder Attention"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-mono text-warning font-semibold",
						children: [health.lowStock + health.outOfStock, " items below reorder"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: criticalLowItems.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleNavigate(r.status),
						className: "flex items-center justify-between text-[11px] py-1 border-b border-border/40 last:border-0 cursor-pointer hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-medium truncate max-w-[200px] sm:max-w-[240px]",
							children: r.product.product_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									r.available,
									" avail / ",
									r.row.reorder_level,
									" reorder"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.status === "Out of Stock" ? "destructive" : "outline",
								className: "text-[9px] py-0 px-1.5 font-bold",
								children: r.status
							})]
						})]
					}, r.product.product_id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reorder rule: available ≤ reorder level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => router.navigate({ to: "/inventory" }),
					className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
					children: [
						"View all ",
						health.total,
						" SKUs ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })
					]
				})]
			})
		]
	});
}
function OrderStatusCard() {
	const { dataset, dateRange, setInfoMetricKey } = useDataset();
	const router = useRouter();
	if (!dataset) return null;
	const statuses = getOrderStatusSummary(dataset, dateRange);
	const totalOrders = statuses.reduce((acc, curr) => acc + curr.count, 0);
	const handleStatusClick = (status) => {
		router.navigate({
			to: "/orders",
			search: { status }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between gap-2 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4 text-primary" }), " Order Operations"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setInfoMetricKey("orderStatus"),
						className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
						title: "Metric info [i]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: ["Total Orders in Range: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground font-mono",
						children: totalOrders.toLocaleString()
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 my-2",
				children: statuses.map((item) => {
					const pct = totalOrders > 0 ? item.count / totalOrders * 100 : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleStatusClick(item.status),
						className: "p-2.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/50 transition-all cursor-pointer flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 pr-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-foreground",
									children: item.status
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-mono font-bold text-foreground",
									children: [
										item.count.toLocaleString(),
										" (",
										pct.toFixed(0),
										"%)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-full rounded-full bg-border/40 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary transition-all duration-300",
									style: { width: `${pct}%` }
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-mono font-semibold text-foreground block",
								children: formatCompactPKR(item.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "Value"
							})]
						})]
					}, item.status);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-3 border-t border-border/40 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => router.navigate({ to: "/orders" }),
					className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
					children: ["View all orders ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
				})
			})
		]
	});
}
function ActionCenterCard() {
	const { dataset, dateRange, setInfoMetricKey } = useDataset();
	const router = useRouter();
	if (!dataset) return null;
	const inventory = calculateInventoryHealth(getInventoryRecords(dataset));
	const receivables = calculateReceivables(getReceivableRecords(dataset));
	const delivery = calculateDeliveryPerformance(dataset, dateRange);
	const alerts = buildAlerts(inventory, receivables, delivery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning" }), " Action Center"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setInfoMetricKey("actionCenter"),
						className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
						title: "Metric info [i]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "text-xs font-mono font-semibold border-warning/30 text-warning",
					children: [alerts.length, " Attention Needed"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2.5 my-2 max-h-[280px] overflow-y-auto pr-1",
				children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8 text-success" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "All operational indicators healthy!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No critical stockouts or overdue bottlenecks detected." })
					]
				}) : alerts.map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl border border-border/60 bg-muted/20 flex items-start justify-between gap-3 hover:border-border transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2.5 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-6 w-6 items-center justify-center rounded-lg shrink-0 mt-0.5 ${alert.severity === "critical" ? "bg-destructive/15 text-destructive" : alert.severity === "warning" ? "bg-warning/15 text-warning" : "bg-primary/15 text-primary"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-bold text-foreground leading-tight truncate",
								children: alert.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5 leading-snug",
								children: alert.detail
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							router.navigate({
								to: alert.to,
								search: alert.search ?? {}
							});
						},
						className: "h-7 text-[11px] font-semibold rounded-lg px-2.5 gap-1 shrink-0 bg-card hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: alert.actionLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
					})]
				}, alert.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-3 border-t border-border/40 text-[11px] text-muted-foreground",
				children: "Real-time dataset rule validation & issue identification"
			})
		]
	});
}
function TopProductsCard() {
	const { dataset, dateRange, setInfoMetricKey } = useDataset();
	const router = useRouter();
	const [selectedProduct, setSelectedProduct] = (0, import_react.useState)(null);
	if (!dataset) return null;
	const topProducts = getTopProducts(dataset, dateRange, 5);
	const chartData = topProducts.map((p, idx) => ({
		rank: `#${idx + 1}`,
		name: p.product.product_name,
		shortName: p.product.product_name.length > 20 ? `${p.product.product_name.slice(0, 18)}...` : p.product.product_name,
		revenue: p.revenue,
		units: p.units,
		marginPct: p.marginPct,
		raw: p
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-primary" }), " Top Products Ranking"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setInfoMetricKey("topProducts"),
						className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
						title: "Metric info [i]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Ranked by qualifying sales order revenue"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => router.navigate({ to: "/inventory" }),
					className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
					children: "View all →"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[210px] w-full my-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						layout: "vertical",
						data: chartData,
						margin: {
							top: 5,
							right: 20,
							left: 10,
							bottom: 5
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "category",
								dataKey: "shortName",
								width: 120,
								tickLine: false,
								axisLine: false,
								tick: {
									fontSize: 11,
									fill: "var(--color-foreground)",
									fontWeight: 600
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								if (!active || !payload?.length) return null;
								const item = payload[0].payload.raw;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-foreground",
											children: item.product.product_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground font-mono",
											children: [
												item.product.sku,
												" • ",
												item.product.category
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-primary font-mono font-bold",
											children: ["Revenue: ", formatPKR(item.revenue)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-foreground font-mono",
											children: ["Units Sold: ", item.units.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-success font-mono font-bold",
											children: [
												"Margin: ",
												item.marginPct.toFixed(1),
												"%"
											]
										})
									]
								});
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "revenue",
								radius: [
									0,
									8,
									8,
									0
								],
								barSize: 18,
								children: chartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: "oklch(0.52 0.128 178)",
									className: "cursor-pointer hover:opacity-80 transition-opacity",
									onClick: () => setSelectedProduct(entry.raw)
								}, `cell-${index}`))
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 border-t border-border/40 pt-3 text-[11px] text-muted-foreground flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Top Product: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "text-foreground",
					children: topProducts[0]?.product.product_name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-primary font-semibold",
					children: formatCompactPKR(topProducts[0]?.revenue || 0)
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!selectedProduct,
		onOpenChange: (open) => !open && setSelectedProduct(null),
		children: selectedProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[440px] rounded-3xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-base font-bold text-foreground",
				children: selectedProduct.product.product_name
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "SKU Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: selectedProduct.product.sku
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: selectedProduct.product.category
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Unit Price"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: formatPKR(selectedProduct.product.unit_price)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Unit Cost"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: formatPKR(selectedProduct.product.unit_cost)
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Period Revenue:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground font-mono",
								children: formatPKR(selectedProduct.revenue)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Units Sold:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground font-mono",
								children: selectedProduct.units.toLocaleString()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Gross Profit:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-success font-mono",
								children: formatPKR(selectedProduct.grossProfit)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Gross Margin %:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-success font-mono",
								children: [selectedProduct.marginPct.toFixed(2), "%"]
							})]
						})
					]
				})]
			})]
		})
	})] });
}
function TopCustomersCard() {
	const { dataset, dateRange, setInfoMetricKey } = useDataset();
	const router = useRouter();
	const [selectedCustomer, setSelectedCustomer] = (0, import_react.useState)(null);
	if (!dataset) return null;
	const topCustomers = getTopCustomers(dataset, dateRange, 5);
	const chartData = topCustomers.map((c, idx) => ({
		rank: `#${idx + 1}`,
		name: c.customer.customer_name,
		shortName: c.customer.customer_name.length > 18 ? `${c.customer.customer_name.slice(0, 16)}...` : c.customer.customer_name,
		revenue: c.revenue,
		outstanding: c.outstanding,
		orders: c.orders,
		raw: c
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), " Key Accounts Ranking"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setInfoMetricKey("topCustomers"),
						className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
						title: "Metric info [i]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Ranked by qualifying purchase volume"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => router.navigate({ to: "/customers" }),
					className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
					children: "View all →"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[210px] w-full my-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						layout: "vertical",
						data: chartData,
						margin: {
							top: 5,
							right: 20,
							left: 10,
							bottom: 5
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "category",
								dataKey: "shortName",
								width: 120,
								tickLine: false,
								axisLine: false,
								tick: {
									fontSize: 11,
									fill: "var(--color-foreground)",
									fontWeight: 600
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								if (!active || !payload?.length) return null;
								const item = payload[0].payload.raw;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-foreground",
											children: item.customer.customer_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground font-mono",
											children: [
												item.customer.city,
												" • ",
												item.customer.customer_segment
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-primary font-mono font-bold",
											children: ["Revenue: ", formatPKR(item.revenue)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-foreground font-mono",
											children: ["Orders: ", item.orders]
										}),
										item.outstanding > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-warning font-mono font-bold",
											children: ["Outstanding: ", formatPKR(item.outstanding)]
										})
									]
								});
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "revenue",
								radius: [
									0,
									8,
									8,
									0
								],
								barSize: 18,
								children: chartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: "oklch(0.6 0.135 152)",
									className: "cursor-pointer hover:opacity-80 transition-opacity",
									onClick: () => setSelectedCustomer(entry.raw)
								}, `cell-${index}`))
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 border-t border-border/40 pt-3 text-[11px] text-muted-foreground flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Top Account: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "text-foreground",
					children: topCustomers[0]?.customer.customer_name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-success font-semibold",
					children: formatCompactPKR(topCustomers[0]?.revenue || 0)
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!selectedCustomer,
		onOpenChange: (open) => !open && setSelectedCustomer(null),
		children: selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[440px] rounded-3xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-base font-bold text-foreground",
				children: selectedCustomer.customer.customer_name
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Customer ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: selectedCustomer.customer.customer_id
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "City / Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: selectedCustomer.customer.city
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Segment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: selectedCustomer.customer.customer_segment
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Industry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: selectedCustomer.customer.industry
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Total Revenue:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground font-mono",
								children: formatPKR(selectedCustomer.revenue)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Qualifying Orders:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground font-mono",
								children: selectedCustomer.orders
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Credit Limit:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground font-mono",
								children: formatPKR(selectedCustomer.customer.credit_limit)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Outstanding Receivable:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-warning font-mono",
								children: formatPKR(selectedCustomer.outstanding)
							})]
						})
					]
				})]
			})]
		})
	})] });
}
function ReceivablesCard() {
	const { dataset, setInfoMetricKey } = useDataset();
	const router = useRouter();
	if (!dataset) return null;
	const records = getReceivableRecords(dataset);
	const rec = calculateReceivables(records);
	const agingChartData = rec.aging.map((b) => ({
		bucket: b.bucket,
		amount: b.amount,
		count: b.count,
		formatted: formatCompactPKR(b.amount)
	}));
	const handleNavigate = (status) => {
		if (status) router.navigate({
			to: "/receivables",
			search: { status }
		});
		else router.navigate({ to: "/receivables" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-primary" }), " Receivables Aging & Risk Distribution"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setInfoMetricKey("receivables"),
						className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
						title: "Metric info [i]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: [
						"Total Outstanding Balance: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-mono",
							children: formatCompactPKR(rec.outstanding)
						}),
						" (",
						formatPKR(rec.outstanding),
						")"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => handleNavigate(),
					className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0",
					children: "View all invoices →"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2.5 my-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleNavigate("Current"),
						className: "p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/30 transition-all cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase text-muted-foreground block",
								children: "Current"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base sm:text-lg font-extrabold font-mono text-foreground block mt-0.5",
								children: formatCompactPKR(rec.current)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground block",
								children: [rec.currentCount, " invoices"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleNavigate("Due Soon"),
						className: "p-3 rounded-2xl border border-warning/30 bg-warning/10 hover:bg-warning/20 transition-all cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase text-warning block",
								children: "Due Soon (≤14d)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base sm:text-lg font-extrabold font-mono text-warning block mt-0.5",
								children: formatCompactPKR(rec.dueSoon)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-warning/80 block",
								children: [rec.dueSoonCount, " invoices"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => handleNavigate("Overdue"),
						className: "p-3 rounded-2xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 transition-all cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase text-destructive block",
								children: "Overdue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base sm:text-lg font-extrabold font-mono text-destructive block mt-0.5",
								children: formatCompactPKR(rec.overdue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-destructive/80 block",
								children: [rec.overduePct.toFixed(1), "% of total"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-2 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Aging Bracket Breakdown" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-destructive flex items-center gap-1 font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }),
							" ",
							rec.overdueCount,
							" Overdue Invoices"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[150px] w-full pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: agingChartData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "bucket",
									tickLine: false,
									axisLine: false,
									tick: {
										fontSize: 11,
										fill: "var(--color-muted-foreground)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tickLine: false,
									axisLine: false,
									tickFormatter: (v) => compactY(v),
									tick: {
										fontSize: 10,
										fill: "var(--color-muted-foreground)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
									if (!active || !payload?.length) return null;
									const data = payload[0].payload;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/80 bg-card p-2.5 shadow-xl text-xs space-y-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-foreground",
												children: data.bucket
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-primary font-mono font-bold",
												children: ["Outstanding: ", formatPKR(data.amount)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-muted-foreground",
												children: [data.count, " invoices"]
											})
										]
									});
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "amount",
									radius: [
										6,
										6,
										0,
										0
									],
									barSize: 28,
									children: agingChartData.map((entry, index) => {
										const color = entry.bucket === "Not due" ? "oklch(0.6 0.135 152)" : entry.bucket === "1–30 days" ? "oklch(0.73 0.155 72)" : "oklch(0.577 0.208 25)";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: color }, `cell-${index}`);
									})
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Standard payment terms: 14–60 days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-destructive font-semibold",
					children: [formatCompactPKR(rec.overdue), " overdue"]
				})]
			})
		]
	});
}
function compactY(val) {
	if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
	if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
	if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
	return `${val}`;
}
function DeliveryPerformanceCard() {
	const { dataset, dateRange, setInfoMetricKey } = useDataset();
	const router = useRouter();
	if (!dataset) return null;
	const del = calculateDeliveryPerformance(dataset, dateRange);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bento-card p-6 flex flex-col justify-between h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between gap-2 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary" }), " Delivery & Operations Performance"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setInfoMetricKey("onTimeDelivery"),
						className: "h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground",
						title: "Metric info [i]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Logistics performance against promised delivery dates"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/20 border border-border/50 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-center h-24 w-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "h-full w-full transform -rotate-90",
							viewBox: "0 0 36 36",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "text-border",
								strokeWidth: "3.5",
								stroke: "currentColor",
								fill: "none",
								d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "text-primary transition-all duration-700 ease-out",
								strokeDasharray: `${del.onTimeRate}, 100`,
								strokeWidth: "3.5",
								strokeLinecap: "round",
								stroke: "currentColor",
								fill: "none",
								d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xl font-extrabold font-mono text-foreground leading-none",
								children: [del.onTimeRate.toFixed(1), "%"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] uppercase font-semibold text-muted-foreground mt-1",
								children: "On Time"
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-xl border border-border/40 bg-card flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-primary" }), " Avg Lead Time:"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "font-mono text-foreground",
								children: [del.avgLeadTimeDays.toFixed(1), " days"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => router.navigate({
								to: "/orders",
								search: { delivery: "Delayed" }
							}),
							className: "p-2.5 rounded-xl border border-warning/30 bg-warning/10 flex justify-between items-center cursor-pointer hover:bg-warning/20 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-warning flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " Delayed Deliveries:"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-mono text-warning",
								children: del.delayed.toLocaleString()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => router.navigate({
								to: "/orders",
								search: { delivery: "Overdue Open Order" }
							}),
							className: "p-2.5 rounded-xl border border-destructive/30 bg-destructive/10 flex justify-between items-center cursor-pointer hover:bg-destructive/20 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-destructive flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " Overdue Open Orders:"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-mono text-destructive",
								children: del.overdueOpenOrders
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Completed: ",
					del.completed.toLocaleString(),
					" shipments"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["On-Time: ", del.onTime.toLocaleString()] })]
			})
		]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function Index() {
	const { dataset, loading, dateRange, prevDateRange } = useDataset();
	const router = useRouter();
	if (loading || !dataset) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-64 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-96 rounded-lg" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 rounded-2xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[360px] lg:col-span-8 rounded-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[360px] lg:col-span-4 rounded-3xl" })]
			})
		]
	});
	const sales = calculateSales(dataset, dateRange);
	const salesPrev = calculateSales(dataset, prevDateRange);
	const recRecords = getReceivableRecords(dataset);
	const rec = calculateReceivables(recRecords);
	const invRecords = getInventoryRecords(dataset);
	const inv = calculateInventoryHealth(invRecords);
	const delivery = calculateDeliveryPerformance(dataset, dateRange);
	const deliveryPrev = calculateDeliveryPerformance(dataset, prevDateRange);
	const dailySparkline = calculateDailySeries(dataset, dateRange);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground",
						children: "Good morning, Team"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px] font-mono border-primary/30 text-primary bg-primary/5",
						children: "Live Operations"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs sm:text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Here's what's happening across your business today." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-[11px] text-primary/90 font-mono font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Data through Aug 31, 2026 | Reference date: Sep 1, 2026"]
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start md:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-success/30 bg-success/10 text-success text-xs font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dataset Verified (7/7 Passed)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => router.navigate({ to: "/ai-assistant" }),
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Assistant" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiBentoCard, {
						metricKey: "netSales",
						title: "Net Sales",
						value: formatCompactPKR(sales.netSales),
						subtext: `Gross: ${formatCompactPKR(sales.grossSales)}`,
						currentVal: sales.netSales,
						prevVal: salesPrev.netSales,
						sparklineData: dailySparkline,
						onClickDrillDown: () => router.navigate({ to: "/orders" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiBentoCard, {
						metricKey: "grossProfit",
						title: "Gross Profit",
						value: formatCompactPKR(sales.grossProfit),
						subtext: `Margin: ${sales.grossMarginPct.toFixed(1)}%`,
						currentVal: sales.grossProfit,
						prevVal: salesPrev.grossProfit
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiBentoCard, {
						metricKey: "totalOrders",
						title: "Total Orders",
						value: sales.totalOrders.toLocaleString(),
						subtext: `AOV: ${formatCompactPKR(sales.averageOrderValue)}`,
						currentVal: sales.totalOrders,
						prevVal: salesPrev.totalOrders,
						onClickDrillDown: () => router.navigate({ to: "/orders" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiBentoCard, {
						metricKey: "receivables",
						title: "Receivables",
						value: formatCompactPKR(rec.outstanding),
						subtext: `Overdue: ${rec.overduePct.toFixed(0)}% (${formatCompactPKR(rec.overdue)})`,
						badgeText: `${rec.overdueCount} Overdue`,
						onClickDrillDown: () => router.navigate({
							to: "/receivables",
							search: { status: "Overdue" }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiBentoCard, {
						metricKey: "inventoryValue",
						title: "Inventory Value",
						value: formatCompactPKR(inv.inventoryValue),
						subtext: `${inv.lowStock} Low / ${inv.outOfStock} Out of Stock`,
						badgeText: `${inv.healthyPct.toFixed(0)}% Healthy`,
						onClickDrillDown: () => router.navigate({ to: "/inventory" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiBentoCard, {
						metricKey: "onTimeDelivery",
						title: "On-Time Delivery",
						value: `${delivery.onTimeRate.toFixed(1)}%`,
						subtext: `${delivery.delayed} Delayed / ${delivery.avgLeadTimeDays.toFixed(1)}d Lead`,
						currentVal: delivery.onTimeRate,
						prevVal: deliveryPrev.onTimeRate,
						onClickDrillDown: () => router.navigate({
							to: "/orders",
							search: { delivery: "Delayed" }
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesPerformanceCard, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCenterCard, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryHealthCard, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderStatusCard, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopProductsCard, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopCustomersCard, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivablesCard, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryPerformanceCard, {})
				})]
			})
		]
	});
}
//#endregion
export { Index as component };
