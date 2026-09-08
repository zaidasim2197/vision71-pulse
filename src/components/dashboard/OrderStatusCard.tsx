import { Info, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import { getOrderStatusSummary, formatCompactPKR } from "@/services/metrics";
import { Button } from "../ui/button";

export function OrderStatusCard() {
  const { dataset, dateRange, setInfoMetricKey } = useDataset();
  const router = useRouter();

  if (!dataset) return null;

  const statuses = getOrderStatusSummary(dataset, dateRange);
  const totalOrders = statuses.reduce((acc, curr) => acc + curr.count, 0);

  const handleStatusClick = (status: string) => {
    router.navigate({ to: "/orders" as any, search: { status } as any });
  };

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" /> Order Operations
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInfoMetricKey("orderStatus")}
              className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
              title="Metric info [i]"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total Orders in Range: <strong className="text-foreground font-mono">{totalOrders.toLocaleString()}</strong>
          </p>
        </div>
      </div>

      {/* Status List */}
      <div className="space-y-2 my-2">
        {statuses.map((item) => {
          const pct = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
          return (
            <div
              key={item.status}
              onClick={() => handleStatusClick(item.status)}
              className="p-2.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/50 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{item.status}</span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {item.count.toLocaleString()} ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-foreground block">
                  {formatCompactPKR(item.value)}
                </span>
                <span className="text-[10px] text-muted-foreground">Value</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-border/40 text-right">
        <button
          onClick={() => router.navigate({ to: "/orders" as any })}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          View all orders <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
