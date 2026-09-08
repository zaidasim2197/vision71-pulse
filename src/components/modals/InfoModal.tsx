import { Info, CheckCircle2, FileText, Calculator, HelpCircle } from "lucide-react";
import { useDataset } from "../providers/DatasetProvider";
import { METRIC_INFO } from "@/services/metrics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Badge } from "../ui/badge";

export function InfoModal() {
  const { infoMetricKey, setInfoMetricKey } = useDataset();

  if (!infoMetricKey) return null;
  const info = METRIC_INFO[infoMetricKey];
  if (!info) return null;

  return (
    <Dialog open={!!infoMetricKey} onOpenChange={(open) => !open && setInfoMetricKey(null)}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 border-border/80 bg-card shadow-2xl backdrop-blur-xl">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                {info.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Management metric definition & traceability rules
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Definition */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-3.5">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              What this metric means
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{info.definition}</p>
          </div>

          {/* Formula */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
            <h4 className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-1">
              <Calculator className="h-3.5 w-3.5" />
              Formula & Calculation
            </h4>
            <p className="text-xs font-mono font-medium text-foreground bg-card/60 rounded-lg p-2 border border-border/40">
              {info.formula}
            </p>
          </div>

          {/* Business Rules */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              Business & Exclusion Rules
            </h4>
            <ul className="space-y-1.5">
              {info.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Source CSV Tables */}
          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Source Tables:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {info.sources.map((src, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] font-mono font-normal">
                  {src}
                </Badge>
              ))}
            </div>
          </div>

          {info.sample && (
            <div className="rounded-xl bg-accent/40 px-3 py-2 text-[11px] text-accent-foreground font-mono">
              <span className="font-semibold">Dataset Reconcilation:</span> {info.sample}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
