import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import { loadDataset, type Dataset } from "@/lib/dataset";
import { resolvePreset, previousRange, type DateRange } from "@/services/dateRange";

export interface DrillDownState {
  status?: string;
  delivery?: string;
  category?: string;
}

interface DatasetContextType {
  dataset: Dataset | null;
  loading: boolean;
  error: Error | null;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  prevDateRange: DateRange;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  infoMetricKey: string | null;
  setInfoMetricKey: (key: string | null) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  drillDown: DrillDownState | null;
  setDrillDown: (state: DrillDownState | null) => void;
}

const DatasetContext = createContext<DatasetContextType | null>(null);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>(() => resolvePreset("allTime"));
  const prevDateRange = useMemo(() => previousRange(dateRange), [dateRange]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [infoMetricKey, setInfoMetricKey] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drillDown, setDrillDown] = useState<DrillDownState | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadDataset()
      .then((data) => {
        if (isMounted) {
          setDataset(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const value: DatasetContextType = {
    dataset,
    loading,
    error,
    dateRange,
    setDateRange,
    prevDateRange,
    searchOpen,
    setSearchOpen,
    infoMetricKey,
    setInfoMetricKey,
    settingsOpen,
    setSettingsOpen,
    drillDown,
    setDrillDown,
  };

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
}

export function useDataset() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error("useDataset must be used within DatasetProvider");
  return ctx;
}
