import { i as __toESM } from "../_runtime.mjs";
import { _ as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { N as useDataset, T as getReceivableRecords, f as calculateReceivables, g as formatCompactPKR, n as Button, t as Badge, y as formatPKR } from "./badge-Bl18eSKb.mjs";
import { t as Input } from "./input-ihffJmEB.mjs";
import { A as Eye, B as ChevronLeft, I as CircleCheck, N as Clock, o as TriangleAlert, t as X, v as Search, y as Receipt, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-B2VMkDTk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receivables-ea3hFMtw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReceivablesPage() {
	const { dataset } = useDataset();
	const searchParams = useSearch({ from: "/receivables" });
	const [query, setQuery] = (0, import_react.useState)(searchParams.search || "");
	const [activeStatus, setActiveStatus] = (0, import_react.useState)(searchParams.status || "ALL");
	const [page, setPage] = (0, import_react.useState)(1);
	const pageSize = 15;
	const [selectedReceivable, setSelectedReceivable] = (0, import_react.useState)(null);
	const records = (0, import_react.useMemo)(() => {
		if (!dataset) return [];
		return getReceivableRecords(dataset);
	}, [dataset]);
	const summary = (0, import_react.useMemo)(() => calculateReceivables(records), [records]);
	const filteredRecords = (0, import_react.useMemo)(() => {
		return records.filter((r) => {
			if (activeStatus !== "ALL" && r.status !== activeStatus) return false;
			if (query) {
				const q = query.toLowerCase();
				return r.invoice.invoice_id.toLowerCase().includes(q) || r.invoice.order_id.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q);
			}
			return true;
		});
	}, [
		records,
		activeStatus,
		query
	]);
	if (!dataset) return null;
	const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
	const currentPage = Math.min(page, totalPages);
	const pagedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-6 w-6 text-primary" }), " Receivables & Invoices"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Invoice balances, due date tracking, payment reconciliations, and overdue aging"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs font-mono px-3 py-1 bg-card",
						children: ["Total Outstanding: ", formatCompactPKR(summary.outstanding)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "destructive",
						className: "text-xs font-mono px-3 py-1",
						children: [
							"Overdue: ",
							formatCompactPKR(summary.overdue),
							" (",
							summary.overduePct.toFixed(1),
							"%)"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					{
						label: "All Invoices",
						statusKey: "ALL",
						count: records.length,
						amount: summary.outstanding,
						sub: "Total outstanding dataset balance",
						icon: Receipt,
						activeColor: "border-primary bg-primary/10 ring-2 ring-primary/20",
						inactiveColor: "border-border/60 bg-card hover:bg-muted/30"
					},
					{
						label: "Current Invoices",
						statusKey: "Current",
						count: summary.currentCount,
						amount: summary.current,
						sub: "Not yet due for payment",
						icon: CircleCheck,
						activeColor: "border-primary bg-primary/10 ring-2 ring-primary/20",
						inactiveColor: "border-border/60 bg-card hover:bg-muted/30"
					},
					{
						label: "Due Soon (≤14 Days)",
						statusKey: "Due Soon",
						count: summary.dueSoonCount,
						amount: summary.dueSoon,
						sub: "Upcoming due dates",
						icon: Clock,
						activeColor: "border-warning bg-warning/10 ring-2 ring-warning/20",
						inactiveColor: "border-border/60 bg-card hover:bg-warning/5"
					},
					{
						label: "Overdue Invoices",
						statusKey: "Overdue",
						count: summary.overdueCount,
						amount: summary.overdue,
						sub: `${summary.overduePct.toFixed(1)}% of total outstanding`,
						icon: TriangleAlert,
						activeColor: "border-destructive bg-destructive/10 ring-2 ring-destructive/20",
						inactiveColor: "border-border/60 bg-card hover:bg-destructive/5"
					}
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeStatus === tab.statusKey;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setActiveStatus(tab.statusKey);
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full",
								children: [tab.count, " Invoices"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground",
								children: formatCompactPKR(tab.amount)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1 font-medium",
								children: tab.sub
							})]
						})]
					}, tab.statusKey);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/60 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:w-80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search invoice ID, order ID, or customer...",
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
				}), (activeStatus !== "ALL" || query) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => {
						setActiveStatus("ALL");
						setQuery("");
						setPage(1);
					},
					className: "h-9 text-xs",
					children: "Reset Filters"
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
									children: "Invoice ID"
								}),
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
									children: "Invoice Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Due Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Invoice Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Amount Paid"
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
							children: pagedRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 10,
								className: "py-12 text-center text-muted-foreground text-xs",
								children: "No invoice records matching criteria."
							}) }) : pagedRecords.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono font-bold",
										children: r.invoice.invoice_id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono text-muted-foreground",
										children: r.invoice.order_id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-bold",
										children: r.customerName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono text-muted-foreground",
										children: r.invoice.invoice_date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 font-mono text-muted-foreground",
										children: r.invoice.due_date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivableBadge, {
											status: r.status,
											daysOverdue: r.daysOverdue
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono font-bold text-foreground",
										children: formatCompactPKR(r.invoice.invoice_amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono text-success",
										children: formatCompactPKR(r.invoice.amount_paid)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-right font-mono font-bold text-warning",
										children: formatCompactPKR(r.outstanding)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setSelectedReceivable(r),
											className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
										})
									})
								]
							}, r.invoice.invoice_id))
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
							" invoices)"
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
				open: !!selectedReceivable,
				onOpenChange: (open) => !open && setSelectedReceivable(null),
				children: selectedReceivable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoicePaymentsModal, {
					record: selectedReceivable,
					dataset,
					onClose: () => setSelectedReceivable(null)
				})
			})
		]
	});
}
function ReceivableBadge({ status, daysOverdue }) {
	if (status === "Paid") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "default",
		className: "text-[10px] bg-success/15 text-success",
		children: "Paid"
	});
	if (status === "Current") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[10px] bg-primary/10 text-primary border-primary/20",
		children: "Current"
	});
	if (status === "Due Soon") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "text-[10px] bg-warning/15 text-warning border-warning/30",
		children: "Due Soon"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "destructive",
		className: "text-[10px]",
		children: [
			"Overdue (",
			daysOverdue,
			"d)"
		]
	});
}
function InvoicePaymentsModal({ record, dataset, onClose }) {
	const payments = dataset.payments.filter((p) => p.invoice_id === record.invoice.invoice_id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-[500px] rounded-3xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
			className: "text-base font-bold text-foreground flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Invoice Details #", record.invoice.invoice_id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceivableBadge, {
				status: record.status,
				daysOverdue: record.daysOverdue
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
							children: record.customerName
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Order ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: record.invoice.order_id
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Invoice Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: record.invoice.invoice_date
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block",
							children: "Due Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: record.invoice.due_date
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1 font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Invoice Amount:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: formatPKR(record.invoice.invoice_amount)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Amount Paid:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-success",
								children: formatPKR(record.invoice.amount_paid)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Outstanding Balance:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-warning font-bold",
								children: formatPKR(record.outstanding)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "font-bold text-foreground",
						children: [
							"Payment Reconciliation History (",
							payments.length,
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
										children: "Payment ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2.5",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2.5",
										children: "Method"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2.5 text-right",
										children: "Amount"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40 font-mono text-[11px]",
								children: payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 4,
									className: "p-4 text-center text-muted-foreground font-sans",
									children: "No payment records recorded for this invoice yet."
								}) }) : payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-bold text-foreground",
										children: p.payment_id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 text-muted-foreground",
										children: p.payment_date
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 font-sans text-muted-foreground",
										children: p.payment_method
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2.5 text-right font-bold text-success",
										children: formatPKR(p.payment_amount)
									})
								] }, p.payment_id))
							})]
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { ReceivablesPage as component };
