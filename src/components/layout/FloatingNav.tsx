import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Receipt,
  Sparkles,
  Search,
  Bell,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  AlertTriangle,
  ArrowRight,
  Activity,
  Trophy,
} from "lucide-react";
import { useDataset } from "../providers/DatasetProvider";
import { useTheme } from "../providers/ThemeProvider";
import { DateRangePicker } from "./DateRangePicker";
import { buildAlerts, calculateDeliveryPerformance, calculateInventoryHealth, calculateReceivables, getInventoryRecords, getReceivableRecords } from "@/services/metrics";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export function FloatingNav() {
  const { pathname } = useLocation();
  const { dataset, setSearchOpen, setSettingsOpen, dateRange } = useDataset();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Compute live active alerts count for notifications badge
  const alerts = dataset
    ? buildAlerts(
        calculateInventoryHealth(getInventoryRecords(dataset)),
        calculateReceivables(getReceivableRecords(dataset)),
        calculateDeliveryPerformance(dataset, dateRange),
      )
    : [];

  const navItems = [
    { label: "Sales", to: "/", icon: LayoutDashboard },
    { label: "Orders", to: "/orders", icon: ShoppingBag },
    { label: "Inventory", to: "/inventory", icon: Package },
    { label: "Receivables", to: "/receivables", icon: Receipt },
    { label: "Top Performers", to: "/top-performers", icon: Trophy },
    { label: "Operations", to: "/operations", icon: Activity },
    { label: "AI Assistant", to: "/ai-assistant", icon: Sparkles, badge: "AI" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 transition-all duration-200">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-14 items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-xl">
          {/* Left: Minimalist Executive Brand Logo & Pulse */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-extrabold text-sm shadow-2xs border border-primary/20 transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-foreground">PulseOps</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground -mt-0.5 tracking-tight">Executive Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center bg-muted/40 p-1 rounded-xl border border-border/40">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              const isLast = idx === navItems.length - 1;
              return (
                <div key={item.to} className="flex items-center">
                  <Link
                    to={item.to}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary" : ""}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="px-1 py-0 text-[9px] font-mono bg-primary/10 text-primary border-0">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                  {!isLast && <div className="h-3.5 w-[1px] bg-border/50 mx-1 shrink-0" />}
                </div>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Date Filter */}
            <div className="hidden sm:block">
              <DateRangePicker />
            </div>

            {/* Global Search Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground"
              title="Search (Cmd+K)"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications / Action Center Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground"
                >
                  <Bell className="h-4 w-4" />
                  {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {alerts.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" /> Action Center
                  </h4>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {alerts.length} active alerts
                  </Badge>
                </div>
                <div className="py-2 space-y-2 max-h-[260px] overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-2.5 rounded-xl border border-border/50 bg-muted/30 flex items-start gap-2.5 text-xs"
                    >
                      <div
                        className={`h-2 w-2 rounded-full mt-1 shrink-0 ${
                          alert.severity === "critical"
                            ? "bg-destructive"
                            : alert.severity === "warning"
                            ? "bg-warning"
                            : "bg-primary"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground leading-tight">{alert.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{alert.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Settings Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="h-9 w-9 rounded-xl border-border/60 text-muted-foreground hover:text-foreground hidden sm:flex"
              title="Dashboard Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Mobile Navigation Drawer */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 rounded-l-3xl p-6">
                <SheetHeader className="pb-4 border-b border-border/40">
                  <SheetTitle className="text-base font-bold text-foreground">PulseOps Navigation</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-3">
                  <div className="pb-2">
                    <DateRangePicker />
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-50" />
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
