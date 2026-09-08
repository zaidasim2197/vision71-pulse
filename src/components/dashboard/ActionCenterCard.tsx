import { AlertTriangle, Info, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import {
  buildAlerts,
  calculateDeliveryPerformance,
  calculateInventoryHealth,
  calculateReceivables,
  getInventoryRecords,
  getReceivableRecords,
} from "@/services/metrics";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function ActionCenterCard() {
  const { dataset, dateRange, setInfoMetricKey } = useDataset();
  const router = useRouter();

  if (!dataset) return null;

  const inventory = calculateInventoryHealth(getInventoryRecords(dataset));
  const receivables = calculateReceivables(getReceivableRecords(dataset));
  const delivery = calculateDeliveryPerformance(dataset, dateRange);

  const alerts = buildAlerts(inventory, receivables, delivery);

  return (
    <div className="bento-card p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Action Center
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setInfoMetricKey("actionCenter")}
            className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
            title="Metric info [i]"
          >
            <Info className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Badge variant="outline" className="text-xs font-mono font-semibold border-warning/30 text-warning">
          {alerts.length} Attention Needed
        </Badge>
      </div>

      {/* Alerts list */}
      <div className="space-y-2.5 my-2 max-h-[280px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <p className="font-semibold text-foreground">All operational indicators healthy!</p>
            <p>No critical stockouts or overdue bottlenecks detected.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-2xl border border-border/60 bg-muted/20 flex items-start justify-between gap-3 hover:border-border transition-all"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg shrink-0 mt-0.5 ${
                    alert.severity === "critical"
                      ? "bg-destructive/15 text-destructive"
                      : alert.severity === "warning"
                      ? "bg-warning/15 text-warning"
                      : "bg-primary/15 text-primary"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground leading-tight truncate">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{alert.detail}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.navigate({ to: alert.to as any, search: (alert.search ?? {}) as any });
                }}
                className="h-7 text-[11px] font-semibold rounded-lg px-2.5 gap-1 shrink-0 bg-card hover:bg-accent"
              >
                <span>{alert.actionLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
        Real-time dataset rule validation & issue identification
      </div>
    </div>
  );
}
