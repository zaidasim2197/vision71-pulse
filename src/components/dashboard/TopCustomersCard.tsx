import { useState } from "react";
import { Info, Users, ArrowRight } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import { getTopCustomers, formatCompactPKR, formatPKR, type CustomerPerformance } from "@/services/metrics";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export function TopCustomersCard() {
  const { dataset, dateRange, setInfoMetricKey } = useDataset();
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerPerformance | null>(null);

  if (!dataset) return null;

  const topCustomers = getTopCustomers(dataset, dateRange, 5);

  const chartData = topCustomers.map((c, idx) => ({
    rank: `#${idx + 1}`,
    name: c.customer.customer_name,
    shortName: c.customer.customer_name.length > 18 ? `${c.customer.customer_name.slice(0, 16)}...` : c.customer.customer_name,
    revenue: c.revenue,
    outstanding: c.outstanding,
    orders: c.orders,
    raw: c,
  }));

  return (
    <>
      <div className="bento-card p-6 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Key Accounts Ranking
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInfoMetricKey("topCustomers")}
                className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
                title="Metric info [i]"
              >
                <Info className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked by qualifying purchase volume
            </p>
          </div>
          <button
            onClick={() => router.navigate({ to: "/customers" as any })}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            View all &rarr;
          </button>
        </div>

        {/* Recharts Horizontal Bar Chart */}
        <div className="h-[210px] w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="shortName"
                width={120}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-foreground)", fontWeight: 600 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0]!.payload.raw as CustomerPerformance;
                  return (
                    <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1">
                      <p className="font-bold text-foreground">{item.customer.customer_name}</p>
                      <p className="text-muted-foreground font-mono">{item.customer.city} • {item.customer.customer_segment}</p>
                      <p className="text-primary font-mono font-bold">Revenue: {formatPKR(item.revenue)}</p>
                      <p className="text-foreground font-mono">Orders: {item.orders}</p>
                      {item.outstanding > 0 && (
                        <p className="text-warning font-mono font-bold">Outstanding: {formatPKR(item.outstanding)}</p>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey="revenue" radius={[0, 8, 8, 0]} barSize={18}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="oklch(0.6 0.135 152)"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedCustomer(entry.raw)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Footer */}
        <div className="space-y-1.5 border-t border-border/40 pt-3 text-[11px] text-muted-foreground flex justify-between items-center">
          <span>Top Account: <strong className="text-foreground">{topCustomers[0]?.customer.customer_name}</strong></span>
          <span className="font-mono text-success font-semibold">{formatCompactPKR(topCustomers[0]?.revenue || 0)}</span>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-[440px] rounded-3xl p-6">
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
                  <span className="text-[10px] text-muted-foreground block">City / Location</span>
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

              <div className="p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Revenue:</span>
                  <strong className="text-foreground font-mono">{formatPKR(selectedCustomer.revenue)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qualifying Orders:</span>
                  <strong className="text-foreground font-mono">{selectedCustomer.orders}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credit Limit:</span>
                  <strong className="text-foreground font-mono">{formatPKR(selectedCustomer.customer.credit_limit)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outstanding Receivable:</span>
                  <strong className="text-warning font-mono">{formatPKR(selectedCustomer.outstanding)}</strong>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
