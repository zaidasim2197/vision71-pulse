import { useMemo } from "react";
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
  isSnapshot?: boolean;
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
  isSnapshot,
  onClickDrillDown,
}: KpiBentoCardProps) {
  const { setInfoMetricKey } = useDataset();

  const tr = currentVal != null && prevVal != null ? trend(currentVal, prevVal) : null;

  const smoothSparkline = useMemo(() => {
    if (!sparklineData || sparklineData.length <= 15) return sparklineData;
    const step = Math.ceil(sparklineData.length / 15);
    return sparklineData.filter((_, i) => i % step === 0);
  }, [sparklineData]);

  return (
    <div
      onClick={onClickDrillDown}
      className={`bento-card group relative flex flex-col justify-between p-3 sm:p-3.5 transition-all ${
        onClickDrillDown ? "cursor-pointer hover:border-primary/40" : ""
      }`}
    >
      {/* Top row: Full Title & Info Icon (Title is NEVER truncated) */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground leading-tight">
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setInfoMetricKey(metricKey);
          }}
          className="h-5 w-5 rounded-md text-muted-foreground/60 hover:bg-muted hover:text-foreground shrink-0"
          title="Metric definition & rules [i]"
        >
          <Info className="h-3 w-3" />
        </Button>
      </div>

      {/* Optional Badge Row */}
      {(badgeText || isSnapshot) && (
        <div className="mt-0.5">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 leading-none">
            {isSnapshot ? "⚡ Live Snapshot" : badgeText}
          </span>
        </div>
      )}

      {/* Middle row: Primary Number */}
      <div className="my-1">
        <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground tabular">
          {value}
        </div>
        {subtext && <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight truncate">{subtext}</p>}
      </div>

      {/* Bottom row: Trend & Sparkline */}
      <div className="flex items-end justify-between pt-1.5 border-t border-border/40">
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          {isSnapshot ? (
            <span className="text-[9px] text-muted-foreground font-normal">Real-time status</span>
          ) : tr ? (
            <>
              {tr.direction === "up" ? (
                <span className="flex items-center gap-0.5 text-success">
                  <TrendingUp className="h-3 w-3" /> +{tr.pct.toFixed(1)}%
                </span>
              ) : tr.direction === "down" ? (
                <span className="flex items-center gap-0.5 text-destructive">
                  <TrendingDown className="h-3 w-3" /> {tr.pct.toFixed(1)}%
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Minus className="h-3 w-3" /> 0.0%
                </span>
              )}
              <span className="text-[9px] text-muted-foreground font-normal">vs prev</span>
            </>
          ) : (
            <span className="text-[9px] text-muted-foreground font-normal">No prev comparison</span>
          )}
        </div>

        {/* Sparkline Trend Wave */}
        {smoothSparkline && smoothSparkline.length > 2 && (
          <div className="h-7 w-14 opacity-85 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={smoothSparkline}>
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
                  strokeWidth={1.8}
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
