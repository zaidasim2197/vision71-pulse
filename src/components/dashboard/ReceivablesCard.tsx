import { Info, Receipt, ArrowRight, AlertTriangle } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import { calculateReceivables, formatCompactPKR, formatPKR, getReceivableRecords } from "@/services/metrics";
import { Button } from "../ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export function ReceivablesCard() {
  const { dataset, setInfoMetricKey } = useDataset();
  const router = useRouter();

  if (!dataset) return null;

  const records = getReceivableRecords(dataset);
  const rec = calculateReceivables(records);

  const agingChartData = rec.aging.map((b) => ({
    bucket: b.bucket,
    amount: b.amount,
    count: b.count,
    formatted: formatCompactPKR(b.amount),
  }));

  const handleNavigate = (status?: string) => {
    if (status) router.navigate({ to: "/receivables" as any, search: { status } as any });
    else router.navigate({ to: "/receivables" as any });
  };

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" /> Receivables Aging & Risk Distribution
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInfoMetricKey("receivables")}
              className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
              title="Metric info [i]"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total Outstanding Balance: <strong className="text-foreground font-mono">{formatCompactPKR(rec.outstanding)}</strong> ({formatPKR(rec.outstanding)})
          </p>
        </div>
        <button
          onClick={() => handleNavigate()}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          View all invoices &rarr;
        </button>
      </div>

      {/* 3 Executive Metric Callout Cards */}
      <div className="grid grid-cols-3 gap-2.5 my-2">
        <div
          onClick={() => handleNavigate("Current")}
          className="p-3 rounded-2xl border border-border/60 bg-card hover:bg-muted/30 transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Current</span>
          <span className="text-base sm:text-lg font-extrabold font-mono text-foreground block mt-0.5">
            {formatCompactPKR(rec.current)}
          </span>
          <span className="text-[10px] text-muted-foreground block">{rec.currentCount} invoices</span>
        </div>

        <div
          onClick={() => handleNavigate("Due Soon")}
          className="p-3 rounded-2xl border border-warning/30 bg-warning/10 hover:bg-warning/20 transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold uppercase text-warning block">Due Soon (&le;14d)</span>
          <span className="text-base sm:text-lg font-extrabold font-mono text-warning block mt-0.5">
            {formatCompactPKR(rec.dueSoon)}
          </span>
          <span className="text-[10px] text-warning/80 block">{rec.dueSoonCount} invoices</span>
        </div>

        <div
          onClick={() => handleNavigate("Overdue")}
          className="p-3 rounded-2xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold uppercase text-destructive block">Overdue</span>
          <span className="text-base sm:text-lg font-extrabold font-mono text-destructive block mt-0.5">
            {formatCompactPKR(rec.overdue)}
          </span>
          <span className="text-[10px] text-destructive/80 block">{rec.overduePct.toFixed(1)}% of total</span>
        </div>
      </div>

      {/* Recharts Bar Chart for Aging Buckets */}
      <div className="my-2 space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
          <span>Aging Bracket Breakdown</span>
          <span className="text-[11px] text-destructive flex items-center gap-1 font-mono">
            <AlertTriangle className="h-3 w-3" /> {rec.overdueCount} Overdue Invoices
          </span>
        </div>

        <div className="h-[150px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="bucket"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => compactY(v)}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0]!.payload;
                  return (
                    <div className="rounded-xl border border-border/80 bg-card p-2.5 shadow-xl text-xs space-y-0.5">
                      <p className="font-bold text-foreground">{data.bucket}</p>
                      <p className="text-primary font-mono font-bold">Outstanding: {formatPKR(data.amount)}</p>
                      <p className="text-muted-foreground">{data.count} invoices</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={28}>
                {agingChartData.map((entry, index) => {
                  const color =
                    entry.bucket === "Not due"
                      ? "oklch(0.6 0.135 152)"
                      : entry.bucket === "1–30 days"
                      ? "oklch(0.73 0.155 72)"
                      : "oklch(0.577 0.208 25)";
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center">
        <span>Standard payment terms: 14–60 days</span>
        <span className="font-mono text-destructive font-semibold">{formatCompactPKR(rec.overdue)} overdue</span>
      </div>
    </div>
  );
}

function compactY(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
  return `${val}`;
}
