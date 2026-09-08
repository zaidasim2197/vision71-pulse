import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useDataset } from "../providers/DatasetProvider";
import { trend } from "@/services/metrics";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Button } from "../ui/button";

interface KpiBentoCardProps {
  metricKey: string;
  title: string;
  value: string;
  subtext?: string;
  currentVal?: number;
  prevVal?: number;
  sparklineData?: { date: string; value: number }[];
  accentColor?: string;
  badgeText?: string;
  onClickDrillDown?: () => void;
}

export function KpiBentoCard({
  metricKey,
  title,
  value,
  subtext,
  currentVal,
  prevVal,
  sparklineData,
  accentColor = "hsl(var(--primary))",
  badgeText,
  onClickDrillDown,
}: KpiBentoCardProps) {
  const { setInfoMetricKey } = useDataset();

  const tr = currentVal != null && prevVal != null ? trend(currentVal, prevVal) : null;

  return (
    <div
      onClick={onClickDrillDown}
      className={`bento-card group relative flex flex-col justify-between p-4 sm:p-5 transition-all ${
        onClickDrillDown ? "cursor-pointer hover:border-primary/40" : ""
      }`}
    >
      {/* Top row: Full Title & Info Icon (Title is NEVER truncated) */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-muted-foreground leading-tight">
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setInfoMetricKey(metricKey);
          }}
          className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:bg-muted hover:text-foreground shrink-0"
          title="Metric definition & rules [i]"
        >
          <Info className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Optional Badge Row */}
      {badgeText && (
        <div className="mt-1">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20 leading-none">
            {badgeText}
          </span>
        </div>
      )}

      {/* Middle row: Large Primary Number */}
      <div className="my-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground tabular">
          {value}
        </div>
        {subtext && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{subtext}</p>}
      </div>

      {/* Bottom row: Trend & Sparkline */}
      <div className="flex items-end justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {tr ? (
            <>
              {tr.direction === "up" ? (
                <span className="flex items-center gap-0.5 text-success">
                  <TrendingUp className="h-3.5 w-3.5" /> +{tr.pct.toFixed(1)}%
                </span>
              ) : tr.direction === "down" ? (
                <span className="flex items-center gap-0.5 text-destructive">
                  <TrendingDown className="h-3.5 w-3.5" /> {tr.pct.toFixed(1)}%
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Minus className="h-3.5 w-3.5" /> 0.0%
                </span>
              )}
              <span className="text-[10px] text-muted-foreground font-normal">vs prev period</span>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground font-normal">No prev comparison</span>
          )}
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 2 && (
          <div className="h-8 w-16 opacity-80 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`spark-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.52 0.128 178)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.52 0.128 178)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.52 0.128 178)"
                  strokeWidth={2}
                  fill={`url(#spark-${metricKey})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
