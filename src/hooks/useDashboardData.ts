import { useMemo } from "react";
import { useDataset } from "./useDataset";
import { useDateRange } from "@/components/providers/DateRangeProvider";
import { previousRange } from "@/services/dateRange";
import {
  buildAlerts,
  calculateDeliveryPerformance,
  calculateInventoryHealth,
  calculateMonthlySeries,
  calculateReceivables,
  calculateSales,
  getInventoryRecords,
  getOrderStatusSummary,
  getReceivableRecords,
  getTopCustomers,
  getTopProducts,
} from "@/services/metrics";

/** Single memoised entry point for every derived dashboard metric. */
export function useDashboardData() {
  const { data, isLoading, isError, refetch } = useDataset();
  const { range } = useDateRange();

  const metrics = useMemo(() => {
    if (!data) return null;
    const prev = previousRange(range);
    const inventoryRecords = getInventoryRecords(data);
    const receivableRecords = getReceivableRecords(data);
    const inventory = calculateInventoryHealth(inventoryRecords);
    const receivables = calculateReceivables(receivableRecords);
    const delivery = calculateDeliveryPerformance(data, range);
    return {
      sales: calculateSales(data, range),
      previousSales: calculateSales(data, prev),
      monthly: calculateMonthlySeries(data, range),
      orderStatus: getOrderStatusSummary(data, range),
      inventoryRecords,
      inventory,
      receivableRecords,
      receivables,
      delivery,
      previousDelivery: calculateDeliveryPerformance(data, prev),
      topProducts: getTopProducts(data, range, 10),
      topCustomers: getTopCustomers(data, range, 10),
      alerts: buildAlerts(inventory, receivables, delivery),
    };
  }, [data, range]);

  return { data, metrics, isLoading, isError, refetch, range };
}
