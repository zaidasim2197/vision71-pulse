import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/components/providers/DatasetProvider";
import {
  calculateHaroonReceivables,
  getTopOverdueCustomers,
  getReceivableRecords,
  formatCompactPKR,
  formatPKR,
} from "@/services/metrics";
import { KpiBentoCard } from "@/components/dashboard/KpiBentoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Receipt,
  Search,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  BarChart3,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/receivables")({
  component: ReceivablesPage,
});

const AGING_COLORS = [
  "oklch(0.68 0.14 140)", // Current - Green
  "oklch(0.65 0.18 45)",  // 1-30 - Yellow/Orange
  "oklch(0.62 0.15 25)",  // 31-60 - Orange/Red
  "oklch(0.58 0.22 25)",  // 61-90 - Red
  "oklch(0.48 0.22 25)",  // 90+ - Dark Red
];

function compactY(val: number): string {
  if (val === 0) return "0";
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
  return `${val}`;
}

function ReceivablesPage() {
  const { dataset, loading, dateRange } = useDataset();
  const [tableModalOpen, setTableModalOpen] = useState(false);

  if (loading || !dataset) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[420px]">
          <Skeleton className="h-full lg:col-span-6 rounded-3xl" />
          <Skeleton className="h-full lg:col-span-6 rounded-3xl" />
        </div>
      </div>
    );
  }

  const haroonRec = calculateHaroonReceivables(dataset, dateRange);
  const recRecords = getReceivableRecords(dataset);
  const topOverdueCustomers = getTopOverdueCustomers(dataset, 5);

  const agingChartData = [
    { name: "Current", value: recRecords.filter(r => r.status === "Current" || r.status === "Due Soon").reduce((a, b) => a + b.outstanding, 0) },
    { name: "1-30 Days", value: recRecords.filter(r => r.status === "Overdue" && r.daysOverdue <= 30).reduce((a, b) => a + b.outstanding, 0) },
    { name: "31-60 Days", value: recRecords.filter(r => r.status === "Overdue" && r.daysOverdue > 30 && r.daysOverdue <= 60).reduce((a, b) => a + b.outstanding, 0) },
    { name: "61-90 Days", value: recRecords.filter(r => r.status === "Overdue" && r.daysOverdue > 60 && r.daysOverdue <= 90).reduce((a, b) => a + b.outstanding, 0) },
    { name: "90+ Days", value: recRecords.filter(r => r.status === "Overdue" && r.daysOverdue > 90).reduce((a, b) => a + b.outstanding, 0) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-3 md:py-4 h-full flex flex-col justify-between overflow-y-auto md:overflow-hidden space-y-3.5">
      {/* Clean Page Header (No Subtitles, No Haroon text) */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" /> Accounts Receivable Dashboard
        </h1>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setTableModalOpen(true)}
          className="h-8 text-xs font-semibold gap-1.5 rounded-xl border-border/70 bg-card hover:bg-muted"
        >
          <ListFilter className="h-3.5 w-3.5 text-primary" />
          <span>Search Invoices</span>
        </Button>
      </div>

      {/* Row 1: Compact 4 KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KpiBentoCard
          metricKey="totalOutstanding"
          title="Total Outstanding"
          value={formatCompactPKR(haroonRec.totalOutstanding)}
          subtext={`Exact: ${formatPKR(haroonRec.totalOutstanding)}`}
          isSnapshot={true}
        />

        <KpiBentoCard
          metricKey="overdueAmount"
          title="Overdue Amount"
          value={formatCompactPKR(haroonRec.overdueAmount)}
          subtext={`${
            haroonRec.totalOutstanding > 0
              ? ((haroonRec.overdueAmount / haroonRec.totalOutstanding) * 100).toFixed(1)
              : "0"
          }% of total outstanding`}
          badgeText={`${haroonRec.overdueInvoicesCount} Overdue Invoices`}
          onClickDrillDown={() => setTableModalOpen(true)}
        />

        <KpiBentoCard
          metricKey="overdueInvoices"
          title="Overdue Invoices"
          value={haroonRec.overdueInvoicesCount.toLocaleString()}
          subtext={`Out of ${dataset.receivables.length} total invoices`}
        />

        <KpiBentoCard
          metricKey="avgDaysToPay"
          title="Average Days to Pay"
          value={
            haroonRec.avgDaysToPay != null
              ? `${haroonRec.avgDaysToPay.toFixed(1)} days`
              : "N/A"
          }
          subtext="Days from invoice to payment"
        />
      </div>

      {/* Row 2: Prominent Primary Supporting Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-[340px] md:min-h-0">
        {/* Visualization 1: Aging Buckets */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Aging Buckets Breakdown
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">
              Ref Date: Sep 1, 2026
            </span>
          </div>

          <div className="flex-1 w-full pt-2 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingChartData} margin={{ top: 10, right: 15, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)", fontWeight: 600 }}
                  dy={6}
                />
                <YAxis
                  width={50}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={compactY}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]!.payload;
                    return (
                      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">{d.name}</p>
                        <p className="text-primary font-mono font-bold">Amount: {formatPKR(d.value)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {agingChartData.map((_item, index: number) => (
                    <Cell key={`cell-${index}`} fill={AGING_COLORS[index % AGING_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visualization 2: Top Overdue Customers */}
        <div className="lg:col-span-6 flex flex-col min-h-[320px] md:min-h-0 bento-card p-4 justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 shrink-0">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-destructive" /> Highest Overdue Customers
            </h3>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Top 5 Overdue Accounts
            </Badge>
          </div>

          <div className="py-2 space-y-2 flex-1 overflow-y-auto">
            {topOverdueCustomers.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No overdue accounts.
              </p>
            ) : (
              topOverdueCustomers.map((cust, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl border border-border/50 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{cust.customerName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {cust.invoiceCount} Overdue Invoice{cust.invoiceCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-extrabold text-destructive">
                      {formatCompactPKR(cust.overdueAmount)}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                      {formatPKR(cust.overdueAmount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Receivables Invoices Modal */}
      <Dialog open={tableModalOpen} onOpenChange={setTableModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] rounded-3xl p-6 flex flex-col">
          <ReceivablesTableContainer records={recRecords} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReceivablesTableContainer({ records }: { records: any[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    if (!query) return records;
    const q = query.toLowerCase();
    return records.filter(
      (r) =>
        r.invoice.invoice_id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q)
    );
  }, [records, query]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      <DialogHeader>
        <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
          <span>Receivables Invoice Register</span>
          <Badge variant="outline" className="text-xs font-mono">
            {filtered.length} Invoices
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoice ID or customer name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="pl-9 text-xs h-9 rounded-xl"
        />
      </div>

      <div className="rounded-2xl border border-border/60 overflow-hidden flex-1 min-h-0">
        <div className="overflow-y-auto max-h-[450px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-semibold text-muted-foreground sticky top-0 bg-card">
              <tr>
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Invoice Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-right">Invoice Amount</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3 text-right">Outstanding</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {paged.map((r) => (
                <tr key={r.invoice.invoice_id} className="hover:bg-muted/30">
                  <td className="p-3 font-mono font-bold">{r.invoice.invoice_id}</td>
                  <td className="p-3 font-bold">{r.customerName}</td>
                  <td className="p-3 font-mono text-muted-foreground">{r.invoice.invoice_date}</td>
                  <td className="p-3 font-mono text-muted-foreground">{r.invoice.due_date}</td>
                  <td className="p-3 text-right font-mono">{formatCompactPKR(r.invoice.invoice_amount)}</td>
                  <td className="p-3 text-right font-mono text-success">{formatCompactPKR(r.invoice.amount_paid)}</td>
                  <td className="p-3 text-right font-mono font-bold text-foreground">{formatCompactPKR(r.outstanding)}</td>
                  <td className="p-3 text-center">
                    <Badge
                      variant={r.status === "Overdue" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {r.status === "Overdue" ? `${r.daysOverdue}d Overdue` : r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-8 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 text-xs"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
