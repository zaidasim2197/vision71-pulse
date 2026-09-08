import { useState } from "react";
import { Info, Package, ArrowRight } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import { getTopProducts, formatCompactPKR, formatPKR, type ProductPerformance } from "@/services/metrics";
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

export function TopProductsCard() {
  const { dataset, dateRange, setInfoMetricKey } = useDataset();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<ProductPerformance | null>(null);

  if (!dataset) return null;

  const topProducts = getTopProducts(dataset, dateRange, 5);

  const chartData = topProducts.map((p, idx) => ({
    rank: `#${idx + 1}`,
    name: p.product.product_name,
    shortName: p.product.product_name.length > 20 ? `${p.product.product_name.slice(0, 18)}...` : p.product.product_name,
    revenue: p.revenue,
    units: p.units,
    marginPct: p.marginPct,
    raw: p,
  }));

  return (
    <>
      <div className="bento-card p-6 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> Top Products Ranking
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInfoMetricKey("topProducts")}
                className="h-6 w-6 rounded-lg text-muted-foreground/60 hover:text-foreground"
                title="Metric info [i]"
              >
                <Info className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked by qualifying sales order revenue
            </p>
          </div>
          <button
            onClick={() => router.navigate({ to: "/inventory" as any })}
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
                  const item = payload[0]!.payload.raw as ProductPerformance;
                  return (
                    <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xl text-xs space-y-1">
                      <p className="font-bold text-foreground">{item.product.product_name}</p>
                      <p className="text-muted-foreground font-mono">{item.product.sku} • {item.product.category}</p>
                      <p className="text-primary font-mono font-bold">Revenue: {formatPKR(item.revenue)}</p>
                      <p className="text-foreground font-mono">Units Sold: {item.units.toLocaleString()}</p>
                      <p className="text-success font-mono font-bold">Margin: {item.marginPct.toFixed(1)}%</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="revenue" radius={[0, 8, 8, 0]} barSize={18}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="oklch(0.52 0.128 178)"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedProduct(entry.raw)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products List Summary Pill */}
        <div className="space-y-1.5 border-t border-border/40 pt-3 text-[11px] text-muted-foreground flex justify-between items-center">
          <span>Top Product: <strong className="text-foreground">{topProducts[0]?.product.product_name}</strong></span>
          <span className="font-mono text-primary font-semibold">{formatCompactPKR(topProducts[0]?.revenue || 0)}</span>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-[440px] rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                {selectedProduct.product.product_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-2xl border border-border/50 font-mono">
                <div>
                  <span className="text-[10px] text-muted-foreground block">SKU Code</span>
                  <strong className="text-foreground">{selectedProduct.product.sku}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Category</span>
                  <strong className="text-foreground">{selectedProduct.product.category}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Unit Price</span>
                  <strong className="text-foreground">{formatPKR(selectedProduct.product.unit_price)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Unit Cost</span>
                  <strong className="text-foreground">{formatPKR(selectedProduct.product.unit_cost)}</strong>
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-primary/20 bg-primary/5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period Revenue:</span>
                  <strong className="text-foreground font-mono">{formatPKR(selectedProduct.revenue)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Units Sold:</span>
                  <strong className="text-foreground font-mono">{selectedProduct.units.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Profit:</span>
                  <strong className="text-success font-mono">{formatPKR(selectedProduct.grossProfit)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Margin %:</span>
                  <strong className="text-success font-mono">{selectedProduct.marginPct.toFixed(2)}%</strong>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
