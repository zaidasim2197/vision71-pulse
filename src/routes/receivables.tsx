import { useState, useMemo } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateReceivables,
  formatCompactPKR,
  formatPKR,
  getReceivableRecords,
  type ReceivableRecord,
  type ReceivableStatus,
} from "@/services/metrics";
import { Receipt, Search, Filter, X, ChevronLeft, ChevronRight, Eye, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/receivables")({
  component: ReceivablesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    search: search["search"] ? String(search["search"]) : undefined,
    status: search["status"] ? String(search["status"]) : undefined,
  }),
});

function ReceivablesPage() {
  const { dataset } = useDataset();
  const searchParams = useSearch({ from: "/receivables" });

  const [query, setQuery] = useState(searchParams.search || "");
  const [activeStatus, setActiveStatus] = useState<string>(searchParams.status || "ALL");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [selectedReceivable, setSelectedReceivable] = useState<ReceivableRecord | null>(null);

  const records = useMemo(() => {
    if (!dataset) return [];
    return getReceivableRecords(dataset);
  }, [dataset]);

  const summary = useMemo(() => calculateReceivables(records), [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (activeStatus !== "ALL" && r.status !== activeStatus) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          r.invoice.invoice_id.toLowerCase().includes(q) ||
          r.invoice.order_id.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, activeStatus, query]);

  if (!dataset) return null;

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const pagedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" /> Receivables & Invoices
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Invoice balances, due date tracking, payment reconciliations, and overdue aging
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono px-3 py-1 bg-card">
            Total Outstanding: {formatCompactPKR(summary.outstanding)}
          </Badge>
          <Badge variant="destructive" className="text-xs font-mono px-3 py-1">
            Overdue: {formatCompactPKR(summary.overdue)} ({summary.overduePct.toFixed(1)}%)
          </Badge>
        </div>
      </div>

      {/* Status Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "All Invoices",
            statusKey: "ALL",
            count: records.length,
            amount: summary.outstanding,
            sub: "Total outstanding dataset balance",
            icon: Receipt,
            activeColor: "border-primary bg-primary/10 ring-2 ring-primary/20",
            inactiveColor: "border-border/60 bg-card hover:bg-muted/30",
          },
          {
            label: "Current Invoices",
            statusKey: "Current",
            count: summary.currentCount,
            amount: summary.current,
            sub: "Not yet due for payment",
            icon: CheckCircle2,
            activeColor: "border-primary bg-primary/10 ring-2 ring-primary/20",
            inactiveColor: "border-border/60 bg-card hover:bg-muted/30",
          },
          {
            label: "Due Soon (≤14 Days)",
            statusKey: "Due Soon",
            count: summary.dueSoonCount,
            amount: summary.dueSoon,
            sub: "Upcoming due dates",
            icon: Clock,
            activeColor: "border-warning bg-warning/10 ring-2 ring-warning/20",
            inactiveColor: "border-border/60 bg-card hover:bg-warning/5",
          },
          {
            label: "Overdue Invoices",
            statusKey: "Overdue",
            count: summary.overdueCount,
            amount: summary.overdue,
            sub: `${summary.overduePct.toFixed(1)}% of total outstanding`,
            icon: AlertTriangle,
            activeColor: "border-destructive bg-destructive/10 ring-2 ring-destructive/20",
            inactiveColor: "border-border/60 bg-card hover:bg-destructive/5",
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStatus === tab.statusKey;
          return (
            <button
              key={tab.statusKey}
              onClick={() => {
                setActiveStatus(tab.statusKey);
                setPage(1);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all text-left flex flex-col justify-between shadow-2xs group relative overflow-hidden ${
                isActive ? tab.activeColor : tab.inactiveColor
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl ${isActive ? "bg-card/60" : "bg-muted/50 text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight">{tab.label}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {tab.count} Invoices
                </Badge>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                  {formatCompactPKR(tab.amount)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">{tab.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/60 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice ID, order ID, or customer..."
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

        {(activeStatus !== "ALL" || query) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveStatus("ALL");
              setQuery("");
              setPage(1);
            }}
            className="h-9 text-xs"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 font-semibold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Invoice Amount</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium text-foreground">
              {pagedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground text-xs">
                    No invoice records matching criteria.
                  </td>
                </tr>
              ) : (
                pagedRecords.map((r) => (
                  <tr key={r.invoice.invoice_id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold">{r.invoice.invoice_id}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{r.invoice.order_id}</td>
                    <td className="py-3 px-4 font-bold">{r.customerName}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{r.invoice.invoice_date}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{r.invoice.due_date}</td>
                    <td className="py-3 px-4">
                      <ReceivableBadge status={r.status} daysOverdue={r.daysOverdue} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                      {formatCompactPKR(r.invoice.invoice_amount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-success">
                      {formatCompactPKR(r.invoice.amount_paid)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-warning">
                      {formatCompactPKR(r.outstanding)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReceivable(r)}
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
            Page {currentPage} of {totalPages} ({filteredRecords.length} invoices)
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

      {/* Invoice Detail Drawer */}
      <Dialog open={!!selectedReceivable} onOpenChange={(open) => !open && setSelectedReceivable(null)}>
        {selectedReceivable && (
          <InvoicePaymentsModal record={selectedReceivable} dataset={dataset} onClose={() => setSelectedReceivable(null)} />
        )}
      </Dialog>
    </div>
  );
}

function ReceivableBadge({ status, daysOverdue }: { status: ReceivableStatus; daysOverdue: number }) {
  if (status === "Paid") {
    return <Badge variant="default" className="text-[10px] bg-success/15 text-success">Paid</Badge>;
  }
  if (status === "Current") {
    return <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Current</Badge>;
  }
  if (status === "Due Soon") {
    return <Badge variant="outline" className="text-[10px] bg-warning/15 text-warning border-warning/30">Due Soon</Badge>;
  }
  return (
    <Badge variant="destructive" className="text-[10px]">
      Overdue ({daysOverdue}d)
    </Badge>
  );
}

function InvoicePaymentsModal({ record, dataset, onClose }: { record: ReceivableRecord; dataset: any; onClose: () => void }) {
  const payments = dataset.payments.filter((p: any) => p.invoice_id === record.invoice.invoice_id);

  return (
    <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
      <DialogHeader>
        <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
          <span>Invoice Details #{record.invoice.invoice_id}</span>
          <ReceivableBadge status={record.status} daysOverdue={record.daysOverdue} />
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2 text-xs">
        <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono">
          <div>
            <span className="text-[10px] text-muted-foreground block">Customer</span>
            <strong className="text-foreground">{record.customerName}</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Order ID</span>
            <strong className="text-foreground">{record.invoice.order_id}</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Invoice Date</span>
            <strong className="text-foreground">{record.invoice.invoice_date}</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Due Date</span>
            <strong className="text-foreground">{record.invoice.due_date}</strong>
          </div>
        </div>

        <div className="p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice Amount:</span>
            <strong className="text-foreground">{formatPKR(record.invoice.invoice_amount)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid:</span>
            <strong className="text-success">{formatPKR(record.invoice.amount_paid)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Outstanding Balance:</span>
            <strong className="text-warning font-bold">{formatPKR(record.outstanding)}</strong>
          </div>
        </div>

        {/* Payments Reconciled History */}
        <div className="space-y-2">
          <h4 className="font-bold text-foreground">Payment Reconciliation History ({payments.length})</h4>
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 font-semibold text-muted-foreground text-[11px]">
                <tr>
                  <th className="p-2.5">Payment ID</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Method</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground font-sans">
                      No payment records recorded for this invoice yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p: any) => (
                    <tr key={p.payment_id}>
                      <td className="p-2.5 font-bold text-foreground">{p.payment_id}</td>
                      <td className="p-2.5 text-muted-foreground">{p.payment_date}</td>
                      <td className="p-2.5 font-sans text-muted-foreground">{p.payment_method}</td>
                      <td className="p-2.5 text-right font-bold text-success">
                        {formatPKR(p.payment_amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
