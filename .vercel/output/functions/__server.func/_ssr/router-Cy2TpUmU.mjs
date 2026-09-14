import { i as __toESM } from "../_runtime.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useLocation, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { C as getInventoryRecords, N as useDataset, T as getReceivableRecords, _ as formatDay, a as PRESET_LABELS, f as calculateReceivables, g as formatCompactPKR, i as METRIC_INFO, j as resolvePreset, l as calculateDeliveryPerformance, m as cn, n as Button, o as PRESET_ORDER, r as DatasetProvider, s as buildAlerts, t as Badge, u as calculateInventoryHealth } from "./badge-Bl18eSKb.mjs";
import { t as Input } from "./input-ihffJmEB.mjs";
import { D as Laptop, E as LayoutDashboard, F as CircleQuestionMark, G as Calculator, H as Check, I as CircleCheck, J as ArrowUp, N as Clock, O as Info, P as Circle, S as Moon, V as ChevronDown, W as Calendar, X as Activity, Y as ArrowRight, b as Package, d as Sparkles, f as ShoppingBag, g as Server, h as Settings, i as User, k as FileText, o as TriangleAlert, p as ShieldCheck, q as Bell, r as Users, t as X, u as Sun, v as Search, w as Menu, y as Receipt, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent$1, o as DialogTitle$1, r as DialogDescription$1, t as Dialog$1 } from "./dialog-B2VMkDTk.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cy2TpUmU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles--uX2c_cs.css";
function reportAppError(error, context = {}) {
	if (typeof window === "undefined") return;
	console.error("[PulseOps Error]", error, context);
}
var ThemeProviderContext = (0, import_react.createContext)({
	theme: "system",
	setTheme: () => null
});
function ThemeProvider({ children, defaultTheme = "system", storageKey = "pulseops-theme", ...props }) {
	const [theme, setThemeState] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return defaultTheme;
		return localStorage.getItem(storageKey) || defaultTheme;
	});
	(0, import_react.useEffect)(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			root.classList.add(systemTheme);
			return;
		}
		root.classList.add(theme);
	}, [theme]);
	const value = {
		theme,
		setTheme: (t) => {
			localStorage.setItem(storageKey, t);
			setThemeState(t);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProviderContext.Provider, {
		...props,
		value,
		children
	});
}
var useTheme = () => {
	const context = (0, import_react.useContext)(ThemeProviderContext);
	if (!context) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
};
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
function DateRangePicker() {
	const { dateRange, setDateRange } = useDataset();
	const [customOpen, setCustomOpen] = (0, import_react.useState)(false);
	const [customFrom, setCustomFrom] = (0, import_react.useState)(dateRange.from);
	const [customTo, setCustomTo] = (0, import_react.useState)(dateRange.to);
	const handleSelectPreset = (preset) => {
		if (preset === "custom") {
			setCustomOpen(true);
			return;
		}
		setDateRange(resolvePreset(preset));
	};
	const handleApplyCustom = () => {
		if (!customFrom || !customTo) return;
		setDateRange({
			preset: "custom",
			from: customFrom <= customTo ? customFrom : customTo,
			to: customFrom <= customTo ? customTo : customFrom
		});
		setCustomOpen(false);
	};
	const currentLabel = dateRange.preset !== "custom" ? PRESET_LABELS[dateRange.preset] : `${formatDay(dateRange.from)} – ${formatDay(dateRange.to)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			className: "h-9 gap-2 border-border/60 bg-card/80 px-3 text-xs font-medium text-foreground shadow-xs backdrop-blur-xs hover:bg-accent hover:text-accent-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate max-w-[130px] sm:max-w-[180px]",
					children: currentLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 opacity-50" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-48 rounded-xl p-1 shadow-md",
		children: [
			PRESET_ORDER.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				onClick: () => handleSelectPreset(key),
				className: `rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer ${dateRange.preset === key ? "bg-primary/10 text-primary font-semibold" : ""}`,
				children: PRESET_LABELS[key]
			}, key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				onClick: () => handleSelectPreset("custom"),
				className: `rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer ${dateRange.preset === "custom" ? "bg-primary/10 text-primary font-semibold" : ""}`,
				children: PRESET_LABELS["custom"]
			})
		]
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open: customOpen,
		onOpenChange: setCustomOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "sm:max-w-[400px] rounded-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
					className: "text-base font-semibold",
					children: "Select Custom Date Range"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "from",
							className: "text-xs font-medium text-muted-foreground",
							children: "From Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "from",
							type: "date",
							value: customFrom,
							min: "2025-03-01",
							max: "2026-09-01",
							onChange: (e) => setCustomFrom(e.target.value),
							className: "h-9 text-xs"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "to",
							className: "text-xs font-medium text-muted-foreground",
							children: "To Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "to",
							type: "date",
							value: customTo,
							min: "2025-03-01",
							max: "2026-09-01",
							onChange: (e) => setCustomTo(e.target.value),
							className: "h-9 text-xs"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setCustomOpen(false),
						className: "text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: handleApplyCustom,
						className: "text-xs bg-primary text-primary-foreground",
						children: "Apply Range"
					})]
				})
			]
		})
	})] });
}
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2$1.displayName;
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function FloatingNav() {
	const { pathname } = useLocation();
	const { dataset, setSearchOpen, setSettingsOpen, dateRange } = useDataset();
	const { theme, setTheme } = useTheme();
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const alerts = dataset ? buildAlerts(calculateInventoryHealth(getInventoryRecords(dataset)), calculateReceivables(getReceivableRecords(dataset)), calculateDeliveryPerformance(dataset, dateRange)) : [];
	const navItems = [
		{
			label: "Overview",
			to: "/",
			icon: LayoutDashboard
		},
		{
			label: "Orders",
			to: "/orders",
			icon: ShoppingBag
		},
		{
			label: "Inventory",
			to: "/inventory",
			icon: Package
		},
		{
			label: "Customers",
			to: "/customers",
			icon: Users
		},
		{
			label: "Receivables",
			to: "/receivables",
			icon: Receipt
		},
		{
			label: "AI Assistant",
			to: "/ai-assistant",
			icon: Sparkles,
			badge: "AI"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 w-full px-4 pt-3 pb-2 transition-all duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5 shrink-0 group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-extrabold text-sm shadow-2xs border border-primary/20 transition-transform group-hover:scale-105",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-extrabold tracking-tight text-foreground",
									children: "PulseOps"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-primary" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground -mt-0.5 tracking-tight",
								children: "Executive Intelligence"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40",
						children: navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.to || item.to !== "/" && pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isActive ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-card/50"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3.5 w-3.5 ${isActive ? "text-primary" : ""}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
									item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "px-1 py-0 text-[9px] font-mono bg-primary/10 text-primary border-0",
										children: item.badge
									})
								]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 sm:gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangePicker, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => setSearchOpen(true),
								className: "h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground",
								title: "Search (Cmd+K)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "icon",
									className: "relative h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground",
										children: alerts.length
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
								align: "end",
								className: "w-80 rounded-2xl p-4 shadow-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-3 border-b border-border/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs font-bold text-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-warning" }), " Action Center"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "text-[10px] font-mono",
										children: [alerts.length, " active alerts"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-2 space-y-2 max-h-[260px] overflow-y-auto",
									children: alerts.map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl border border-border/50 bg-muted/30 flex items-start gap-2.5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-2 rounded-full mt-1 shrink-0 ${alert.severity === "critical" ? "bg-destructive" : alert.severity === "warning" ? "bg-warning" : "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground leading-tight",
												children: alert.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground mt-0.5",
												children: alert.detail
											})]
										})]
									}, alert.id))
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
								className: "h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground",
								title: "Toggle theme",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4 text-warning" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => setSettingsOpen(true),
								className: "h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground hidden sm:flex",
								title: "Dashboard Settings",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
								open: mobileOpen,
								onOpenChange: setMobileOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "h-9 w-9 rounded-xl md:hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
									side: "right",
									className: "w-72 rounded-l-3xl p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
										className: "pb-4 border-b border-border/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
											className: "text-base font-bold text-foreground",
											children: "PulseOps Navigation"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-4 space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangePicker, {})
										}), navItems.map((item) => {
											const Icon = item.icon;
											const isActive = pathname === item.to;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: item.to,
												onClick: () => setMobileOpen(false),
												className: `flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 opacity-50" })]
											}, item.to);
										})]
									})]
								})]
							})
						]
					})
				]
			})
		})
	});
}
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandDialog = ({ children, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent$1, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command$1, {
				className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
				children
			})
		})
	});
};
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
function GlobalSearch() {
	const { dataset, searchOpen, setSearchOpen } = useDataset();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setSearchOpen(!searchOpen);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [searchOpen, setSearchOpen]);
	if (!dataset) return null;
	const handleSelect = (to) => {
		setSearchOpen(false);
		router.navigate({ to });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandDialog, {
		open: searchOpen,
		onOpenChange: setSearchOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, { placeholder: "Search customers, products, orders, invoices... (Cmd+K)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, {
			className: "max-h-[380px] p-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, {
					className: "py-6 text-center text-xs text-muted-foreground",
					children: "No records matching search query."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: "Products",
					children: dataset.products.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => handleSelect(`/inventory?search=${encodeURIComponent(p.product_name)}`),
						className: "flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-foreground truncate",
									children: p.product_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: [
										p.sku,
										" • ",
										p.category
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono font-medium text-foreground",
							children: formatCompactPKR(p.unit_price)
						})]
					}, p.product_id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: "Customers",
					children: dataset.customers.slice(0, 5).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => handleSelect(`/customers?search=${encodeURIComponent(c.customer_name)}`),
						className: "flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-foreground truncate",
									children: c.customer_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: [
										c.city,
										" • ",
										c.customer_segment
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground" })]
					}, c.customer_id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: "Recent Orders",
					children: dataset.orders.slice(0, 5).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => handleSelect(`/orders?search=${encodeURIComponent(o.order_id)}`),
						className: "flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-mono font-semibold text-foreground",
								children: o.order_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground",
								children: [
									o.order_status,
									" • ",
									o.order_date
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono font-semibold text-foreground",
							children: formatCompactPKR(o.total_amount)
						})]
					}, o.order_id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
					heading: "Receivable Invoices",
					children: dataset.receivables.slice(0, 5).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => handleSelect(`/receivables?search=${encodeURIComponent(r.invoice_id)}`),
						className: "flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-7 w-7 items-center justify-center rounded-md bg-warning/10 text-warning",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-mono font-semibold text-foreground",
								children: r.invoice_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground",
								children: ["Due: ", r.due_date]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono font-semibold text-foreground",
							children: formatCompactPKR(r.invoice_amount)
						})]
					}, r.invoice_id))
				})
			]
		})]
	});
}
function InfoModal() {
	const { infoMetricKey, setInfoMetricKey } = useDataset();
	if (!infoMetricKey) return null;
	const info = METRIC_INFO[infoMetricKey];
	if (!info) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open: !!infoMetricKey,
		onOpenChange: (open) => !open && setInfoMetricKey(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "sm:max-w-[480px] rounded-3xl p-6 border-border/80 bg-card shadow-2xl backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "gap-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
						className: "text-lg font-bold tracking-tight text-foreground",
						children: info.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
						className: "text-xs text-muted-foreground",
						children: "Management metric definition & traceability rules"
					})] })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-muted/30 p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5 text-primary" }), "What this metric means"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: info.definition
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-primary/20 bg-primary/5 p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-semibold text-primary flex items-center gap-1.5 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-3.5 w-3.5" }), "Formula & Calculation"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-mono font-medium text-foreground bg-card/60 rounded-lg p-2 border border-border/40",
							children: info.formula
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-success" }), "Business & Exclusion Rules"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: info.rules.map((rule, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rule })]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-border/50 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Source Tables:"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: info.sources.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px] font-mono font-normal",
								children: src
							}, i))
						})]
					}),
					info.sample && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-accent/40 px-3 py-2 text-[11px] text-accent-foreground font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "Dataset Reconcilation:"
							}),
							" ",
							info.sample
						]
					})
				]
			})]
		})
	});
}
function SettingsModal() {
	const { settingsOpen, setSettingsOpen, dataset } = useDataset();
	const { theme, setTheme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open: settingsOpen,
		onOpenChange: setSettingsOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "sm:max-w-[500px] rounded-3xl p-6 border-border/80 bg-card shadow-2xl backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "gap-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
						className: "text-lg font-bold tracking-tight text-foreground",
						children: "Dashboard Settings & Integrity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
						className: "text-xs text-muted-foreground",
						children: "Appearance preference & PulseOps dataset validation status"
					})] })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-foreground",
							children: "Appearance Theme"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: theme === "light" ? "default" : "outline",
									size: "sm",
									onClick: () => setTheme("light"),
									className: "h-10 justify-center gap-2 rounded-xl text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }), " Light"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: theme === "dark" ? "default" : "outline",
									size: "sm",
									onClick: () => setTheme("dark"),
									className: "h-10 justify-center gap-2 rounded-xl text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" }), " Dark"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: theme === "system" ? "default" : "outline",
									size: "sm",
									onClick: () => setTheme("system"),
									className: "h-10 justify-center gap-2 rounded-xl text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4" }), " System"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-muted/30 p-3.5 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-primary" }), "Data Freshness & Reporting Window"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] bg-card font-mono",
								children: "Verified"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Reporting Range:"
								}), " March 1, 2025 – August 31, 2026"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Data Freshness:"
								}), " Data through Aug 31, 2026"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Reference Date:"
								}), " September 1, 2026"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Base Currency:"
								}), " PKR (Pakistani Rupee)"] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-success" }), "Source Data Integrity Checks"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground font-mono",
								children: [
									dataset?.validation.filter((v) => v.status === "PASS").length ?? 0,
									" / ",
									dataset?.validation.length ?? 0,
									" Passed"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-border/60 bg-card p-3 space-y-1.5 max-h-[160px] overflow-y-auto",
							children: dataset?.validation.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-medium",
									children: v.check
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: v.status === "PASS" ? "default" : "destructive",
									className: "text-[10px] font-mono px-1.5 py-0",
									children: v.status
								})]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-card p-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground",
								children: "AI Server Endpoint"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Secure Gemini Edge Route (/api/ai)"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] text-success border-success/30 font-mono",
							children: "Active"
						})]
					})
				]
			})]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The requested route doesn't exist in the PulseOps Dashboard."
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportAppError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong loading the component."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					})
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PulseOps — Executive Sales & Operations Intelligence Dashboard" },
			{
				name: "description",
				content: "Modern Executive Sales & Operations Analytics Dashboard powered by PulseOps Intelligence Engine."
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	const location = useLocation();
	const router = useRouter();
	const isAi = location.pathname === "/ai-assistant";
	const mainRef = (0, import_react.useRef)(null);
	const [showScrollTop, setShowScrollTop] = (0, import_react.useState)(false);
	const scrollToTop = () => {
		if (mainRef.current) {
			mainRef.current.scrollTop = 0;
			mainRef.current.scrollTo({
				top: 0,
				left: 0,
				behavior: "smooth"
			});
		}
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	};
	(0, import_react.useEffect)(() => {
		return router.subscribe("onResolved", () => {
			scrollToTop();
			requestAnimationFrame(() => scrollToTop());
		});
	}, [router]);
	(0, import_react.useEffect)(() => {
		scrollToTop();
		const timer = setTimeout(scrollToTop, 50);
		return () => clearTimeout(timer);
	}, [location.pathname, location.search]);
	(0, import_react.useEffect)(() => {
		const mainEl = mainRef.current;
		if (!mainEl) return;
		const handleScroll = () => {
			setShowScrollTop(mainEl.scrollTop > 200);
		};
		mainEl.addEventListener("scroll", handleScroll, { passive: true });
		return () => mainEl.removeEventListener("scroll", handleScroll);
	}, [location.pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, {
			defaultTheme: "system",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatasetProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-screen max-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-primary overflow-hidden relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						ref: mainRef,
						className: `flex-1 min-h-0 ${isAi ? "overflow-hidden flex flex-col" : "overflow-y-auto pb-12"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					!isAi && showScrollTop && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: scrollToTop,
						"aria-label": "Scroll to top",
						className: "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-5 w-5" })
					}),
					!isAi && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "border-t border-border/40 py-4 text-center text-xs text-muted-foreground bg-card/40 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" PulseOps Technologies. All rights reserved."
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px]",
								children: "Data through Aug 31, 2026 | Reference date: Sep 1, 2026"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearch, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoModal, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsModal, {})
				]
			}) })
		})
	});
}
var $$splitComponentImporter$5 = () => import("./routes-Cc7sZYL0.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./ai-assistant-CVIIMqDI.mjs");
var Route$4 = createFileRoute("/ai-assistant")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./customers-Cf-pXizl.mjs");
var Route$3 = createFileRoute("/customers")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	validateSearch: (search) => ({
		search: search["search"] ? String(search["search"]) : void 0,
		segment: search["segment"] ? String(search["segment"]) : void 0
	})
});
var $$splitComponentImporter$2 = () => import("./inventory-DBhsR04o.mjs");
var Route$2 = createFileRoute("/inventory")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	validateSearch: (search) => ({
		search: search["search"] ? String(search["search"]) : void 0,
		status: search["status"] ? String(search["status"]) : void 0
	})
});
var $$splitComponentImporter$1 = () => import("./orders-DVDKBfLs.mjs");
var Route$1 = createFileRoute("/orders")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	validateSearch: (search) => ({
		search: search["search"] ? String(search["search"]) : void 0,
		status: search["status"] ? String(search["status"]) : void 0,
		delivery: search["delivery"] ? String(search["delivery"]) : void 0
	})
});
var $$splitComponentImporter = () => import("./receivables-ea3hFMtw.mjs");
var Route = createFileRoute("/receivables")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (search) => ({
		search: search["search"] ? String(search["search"]) : void 0,
		status: search["status"] ? String(search["status"]) : void 0
	})
});
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	AiAssistantRoute: Route$4.update({
		id: "/ai-assistant",
		path: "/ai-assistant",
		getParentRoute: () => Route$6
	}),
	CustomersRoute: Route$3.update({
		id: "/customers",
		path: "/customers",
		getParentRoute: () => Route$6
	}),
	InventoryRoute: Route$2.update({
		id: "/inventory",
		path: "/inventory",
		getParentRoute: () => Route$6
	}),
	OrdersRoute: Route$1.update({
		id: "/orders",
		path: "/orders",
		getParentRoute: () => Route$6
	}),
	ReceivablesRoute: Route.update({
		id: "/receivables",
		path: "/receivables",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
