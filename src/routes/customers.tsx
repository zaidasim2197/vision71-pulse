import { useState, useMemo } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import { formatCompactPKR, formatPKR, getTopCustomers, type CustomerPerformance } from "@/services/metrics";
import { type Customer } from "@/lib/dataset";
import { Users, Search, Filter, X, ChevronLeft, ChevronRight, Eye, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/customers")({
  component: CustomersPage,
  validateSearch: (search: Record<string, unknown>) => ({
    search: search["search"] ? String(search["search"]) : undefined,
    segment: search["segment"] ? String(search["segment"]) : undefined,
  }),
});

function CustomersPage() {
  const { dataset, dateRange } = useDataset();
  const searchParams = useSearch({ from: "/customers" });

  const [query, setQuery] = useState(searchParams.search || "");
  const [segmentFilter, setSegmentFilter] = useState(searchParams.segment || "ALL");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerPerformance | null>(null);

  const customerPerformances = useMemo(() => {
    if (!dataset) return [];
    return getTopCustomers(dataset, dateRange);
  }, [dataset, dateRange]);

  const filteredCustomers = useMemo(() => {
    return customerPerformances.filter((cp) => {
      if (segmentFilter !== "ALL" && cp.customer.customer_segment !== segmentFilter) return false;
      if (industryFilter !== "ALL" && cp.customer.industry !== industryFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          cp.customer.customer_name.toLowerCase().includes(q) ||
          cp.customer.city.toLowerCase().includes(q) ||
          cp.customer.industry.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customerPerformances, segmentFilter, industryFilter, query]);

  if (!dataset) return null;

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const pagedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const segments = Array.from(new Set(dataset.customers.map((c) => c.customer_segment)));
  const industries = Array.from(new Set(dataset.customers.map((c) => c.industry)));

  const totalRev = customerPerformances.reduce((a, b) => a + b.revenue, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Customer Directory & Accounts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Key accounts, credit terms, purchase volume, and outstanding balances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono px-3 py-1 bg-card">
            Total Revenue: {formatCompactPKR(totalRev)}
          </Badge>
          <Badge variant="secondary" className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary">
            {dataset.customers.length} Accounts
          </Badge>
        </div>
      </div>

      {/* Top Customer KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Accounts",
            count: filteredCustomers.length,
            valStr: `${filteredCustomers.length} B2B Accounts`,
            sub: "Active customer portfolio",
            icon: Users,
          },
          {
            label: "Enterprise Accounts",
            count: filteredCustomers.filter((c) => c.customer.customer_segment === "Enterprise").length,
            valStr: `${filteredCustomers.filter((c) => c.customer.customer_segment === "Enterprise").length} Key Accounts`,
            sub: "High volume strategic partners",
            icon: CreditCard,
          },
          {
            label: "Total Period Revenue",
            count: filteredCustomers.reduce((a, b) => a + b.orders, 0),
            valStr: formatCompactPKR(filteredCustomers.reduce((a, b) => a + b.revenue, 0)),
            sub: "Realized sales from qualifying orders",
            icon: Users,
          },
          {
            label: "Total Account Receivables",
            count: filteredCustomers.filter((c) => c.outstanding > 0).length,
            valStr: formatCompactPKR(filteredCustomers.reduce((a, b) => a + b.outstanding, 0)),
            sub: "Outstanding account balances",
            icon: CreditCard,
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl border border-border/60 bg-card hover:bg-muted/30 transition-all text-left flex flex-col justify-between shadow-2xs"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-muted/50 text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight">{kpi.label}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {kpi.count} Accounts
                </Badge>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                  {kpi.valStr}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/60 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer name, city or industry..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9 text-xs h-9 rounded-xl"
          />
          {query && (
            <X
              onClick={() => setQuery("")}
              className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
            />
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={segmentFilter}
            onValueChange={(v) => {
              setSegmentFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium">
              <SelectValue placeholder="All Segments" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="ALL">All Segments</SelectItem>
              {segments.map((s) => (
                <SelectItem key={s} value={s}>
                  Segment: {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={industryFilter}
            onValueChange={(v) => {
              setIndustryFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl border-border/70 bg-card font-medium">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="ALL">All Industries</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  Industry: {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(segmentFilter !== "ALL" || industryFilter !== "ALL" || query) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSegmentFilter("ALL");
                setIndustryFilter("ALL");
                setQuery("");
                setPage(1);
              }}
              className="h-9 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 font-semibold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Segment</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4 text-center">Terms</th>
                <th className="py-3 px-4 text-right">Net Sales</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium text-foreground">
              {pagedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground text-xs">
                    No customers matching selected search criteria.
                  </td>
                </tr>
              ) : (
                pagedCustomers.map((cp) => (
                  <tr key={cp.customer.customer_id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">{cp.customer.customer_name}</td>
                    <td className="py-3 px-4">{cp.customer.city}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {cp.customer.customer_segment}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{cp.customer.industry}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">{cp.orders}</td>
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                      {formatCompactPKR(cp.customer.credit_limit)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-muted-foreground">
                      {cp.customer.payment_terms_days}d
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      {formatCompactPKR(cp.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-warning">
                      {cp.outstanding > 0 ? formatCompactPKR(cp.outstanding) : "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedCustomer(cp)}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages} ({filteredCustomers.length} accounts)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-[480px] rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                {selectedCustomer.customer.customer_name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Customer ID</span>
                  <strong className="text-foreground">{selectedCustomer.customer.customer_id}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">City</span>
                  <strong className="text-foreground">{selectedCustomer.customer.city}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Segment</span>
                  <strong className="text-foreground">{selectedCustomer.customer.customer_segment}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Industry</span>
                  <strong className="text-foreground">{selectedCustomer.customer.industry}</strong>
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period Revenue:</span>
                  <strong className="text-foreground">{formatPKR(selectedCustomer.revenue)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Count:</span>
                  <strong className="text-foreground">{selectedCustomer.orders}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credit Limit:</span>
                  <strong className="text-foreground">{formatPKR(selectedCustomer.customer.credit_limit)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Terms:</span>
                  <strong className="text-foreground">{selectedCustomer.customer.payment_terms_days} days net</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outstanding Balance:</span>
                  <strong className="text-warning">{formatPKR(selectedCustomer.outstanding)}</strong>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
