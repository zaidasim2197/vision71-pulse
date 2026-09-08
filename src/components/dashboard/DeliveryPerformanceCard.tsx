import { Info, Truck, Clock, AlertTriangle } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import { calculateDeliveryPerformance } from "@/services/metrics";
import { Button } from "../ui/button";

export function DeliveryPerformanceCard() {
  const { dataset, dateRange, setInfoMetricKey } = useDataset();
  const router = useRouter();

  if (!dataset) return null;

  const del = calculateDeliveryPerformance(dataset, dateRange);

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" /> Delivery & Operations Performance
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInfoMetricKey("onTimeDelivery")}
              className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
              title="Metric info [i]"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Logistics performance against promised delivery dates
          </p>
        </div>
      </div>

      {/* Main Metric Radial & Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 items-center">
        {/* On-Time Delivery Gauge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/20 border border-border/50 text-center">
          <div className="relative flex items-center justify-center h-24 w-24">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-border"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary transition-all duration-700 ease-out"
                strokeDasharray={`${del.onTimeRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold font-mono text-foreground leading-none">
                {del.onTimeRate.toFixed(1)}%
              </span>
              <span className="text-[9px] uppercase font-semibold text-muted-foreground mt-1">On Time</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl border border-border/40 bg-card flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" /> Avg Lead Time:
            </span>
            <strong className="font-mono text-foreground">{del.avgLeadTimeDays.toFixed(1)} days</strong>
          </div>

          <div
            onClick={() => router.navigate({ to: "/orders" as any, search: { delivery: "Delayed" } as any })}
            className="p-2.5 rounded-xl border border-warning/30 bg-warning/10 flex justify-between items-center cursor-pointer hover:bg-warning/20 transition-all"
          >
            <span className="text-warning flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Delayed Deliveries:
            </span>
            <strong className="font-mono text-warning">{del.delayed.toLocaleString()}</strong>
          </div>

          <div
            onClick={() => router.navigate({ to: "/orders" as any, search: { delivery: "Overdue Open Order" } as any })}
            className="p-2.5 rounded-xl border border-destructive/30 bg-destructive/10 flex justify-between items-center cursor-pointer hover:bg-destructive/20 transition-all"
          >
            <span className="text-destructive flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Overdue Open Orders:
            </span>
            <strong className="font-mono text-destructive">{del.overdueOpenOrders}</strong>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center">
        <span>Completed: {del.completed.toLocaleString()} shipments</span>
        <span>On-Time: {del.onTime.toLocaleString()}</span>
      </div>
    </div>
  );
}
