import { i as __toESM } from "../_runtime.mjs";
import { _ as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as getTopCustomers, N as useDataset, g as formatCompactPKR, n as Button, t as Badge, y as formatPKR } from "./badge-Bl18eSKb.mjs";
import { t as Input } from "./input-ihffJmEB.mjs";
import { A as Eye, B as ChevronLeft, j as CreditCard, r as Users, t as X, v as Search, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-B2VMkDTk.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYsW5vrb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-Cf-pXizl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const { dataset, dateRange } = useDataset();
	const searchParams = useSearch({ from: "/customers" });
	const [query, setQuery] = (0, import_react.useState)(searchParams.search || "");
	const [segmentFilter, setSegmentFilter] = (0, import_react.useState)(searchParams.segment || "ALL");
	const [industryFilter, setIndustryFilter] = (0, import_react.useState)("ALL");
	const [page, setPage] = (0, import_react.useState)(1);
	const pageSize = 15;
	const [selectedCustomer, setSelectedCustomer] = (0, import_react.useState)(null);
	const customerPerformances = (0, import_react.useMemo)(() => {
		if (!dataset) return [];
		return getTopCustomers(dataset, dateRange);
	}, [dataset, dateRange]);
	const filteredCustomers = (0, import_react.useMemo)(() => {
		return customerPerformances.filter((cp) => {
			if (segmentFilter !== "ALL" && cp.customer.customer_segment !== segmentFilter) return false;
			if (industryFilter !== "ALL" && cp.customer.industry !== industryFilter) return false;
			if (query) {
				const q = query.toLowerCase();
				return cp.customer.customer_name.toLowerCase().includes(q) || cp.customer.city.toLowerCase().includes(q) || cp.customer.industry.toLowerCase().includes(q);
			}
			return true;
		});
	}, [
		customerPerformances,
		segmentFilter,
		industryFilter,
		query
	]);
	if (!dataset) return null;
	const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
	const currentPage = Math.min(page, totalPages);
	const pagedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const segments = Array.from(new Set(dataset.customers.map((c) => c.customer_segment)));
	const industries = Array.from(new Set(dataset.customers.map((c) => c.industry)));
	const totalRev = customerPerformances.reduce((a, b) => a + b.revenue, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 text-primary" }), " Customer Directory & Accounts"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Key accounts, credit terms, purchase volume, and outstanding balances"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs font-mono px-3 py-1 bg-card",
						children: ["Total Revenue: ", formatCompactPKR(totalRev)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "text-xs font-mono px-3 py-1 bg-primary/10 text-primary",
						children: [dataset.customers.length, " Accounts"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					{
						label: "Total Accounts",
						count: filteredCustomers.length,
						valStr: `${filteredCustomers.length} B2B Accounts`,
						sub: "Active customer portfolio",
						icon: Users
					},
					{
						label: "Enterprise Accounts",
						count: filteredCustomers.filter((c) => c.customer.customer_segment === "Enterprise").length,
						valStr: `${filteredCustomers.filter((c) => c.customer.customer_segment === "Enterprise").length} Key Accounts`,
						sub: "High volume strategic partners",
						icon: CreditCard
					},
					{
						label: "Total Period Revenue",
						count: filteredCustomers.reduce((a, b) => a + b.orders, 0),
						valStr: formatCompactPKR(filteredCustomers.reduce((a, b) => a + b.revenue, 0)),
						sub: "Realized sales from qualifying orders",
						icon: Users
					},
					{
						label: "Total Account Receivables",
						count: filteredCustomers.filter((c) => c.outstanding > 0).length,
						valStr: formatCompactPKR(filteredCustomers.reduce((a, b) => a + b.outstanding, 0)),
						sub: "Outstanding account balances",
						icon: CreditCard
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
								children: [kpi.count, " Accounts"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground",
								children: kpi.valStr
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
							placeholder: "Search customer name, city or industry...",
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
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: segmentFilter,
							onValueChange: (v) => {
								setSegmentFilter(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[180px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Segments" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "rounded-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "ALL",
									children: "All Segments"
								}), segments.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: s,
									children: ["Segment: ", s]
								}, s))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: industryFilter,
							onValueChange: (v) => {
								setIndustryFilter(v);
								setPage(1);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[180px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Industries" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "rounded-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "ALL",
									children: "All Industries"
								}), industries.map((ind) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: ind,
									children: ["Industry: ", ind]
								}, ind))]
							})]
						}),
						(segmentFilter !== "ALL" || industryFilter !== "ALL" || query) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setSegmentFilter("ALL");
								setIndustryFilter("ALL");
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
									children: "Customer Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "City"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Segment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Industry"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "Orders"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Credit Limit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "Terms"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Net Sales"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Outstanding"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-center",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/40 font-medium text-foreground",
							children: pagedCustomers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 10,
								className: "py-12 text-center text-muted-foreground text-xs",
								children: "No customers matching selected search criteria."
							}) }) : pagedCustomers.map((cp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-bold text-foreground",
										children: cp.customer.customer_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: cp.customer.city
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] font-normal",
											children: cp.customer.customer_segment
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-muted-foreground",
										children: cp.customer.industry
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center font-mono font-bold",
										children: cp.orders
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono text-muted-foreground",
										children: formatCompactPKR(cp.customer.credit_limit)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-4 text-center font-mono text-muted-foreground",
										children: [cp.customer.payment_terms_days, "d"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono font-bold text-foreground",
										children: formatCompactPKR(cp.revenue)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono font-bold text-warning",
										children: cp.outstanding > 0 ? formatCompactPKR(cp.outstanding) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setSelectedCustomer(cp),
											className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
										})
									})
								]
							}, cp.customer.customer_id))
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
							filteredCustomers.length,
							" accounts)"
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
				open: !!selectedCustomer,
				onOpenChange: (open) => !open && setSelectedCustomer(null),
				children: selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[480px] rounded-3xl p-6",
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
									children: "City"
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
							className: "p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1 font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Period Revenue:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: formatPKR(selectedCustomer.revenue)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Order Count:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: selectedCustomer.orders
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Credit Limit:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: formatPKR(selectedCustomer.customer.credit_limit)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Payment Terms:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [selectedCustomer.customer.payment_terms_days, " days net"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Outstanding Balance:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-warning",
										children: formatPKR(selectedCustomer.outstanding)
									})]
								})
							]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { CustomersPage as component };
