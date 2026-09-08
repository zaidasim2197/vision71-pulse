import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { resolvePreset, type DateRange, type PresetKey } from "@/services/dateRange";

interface Ctx {
  range: DateRange;
  setPreset: (preset: PresetKey) => void;
  setCustom: (from: string, to: string) => void;
}

const DateRangeContext = createContext<Ctx | null>(null);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange>(() => resolvePreset("thisYear"));

  const value = useMemo<Ctx>(
    () => ({
      range,
      setPreset: (preset) => setRange(resolvePreset(preset)),
      setCustom: (from, to) =>
        setRange({ preset: "custom", from: from <= to ? from : to, to: from <= to ? to : from }),
    }),
    [range],
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange(): Ctx {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used inside DateRangeProvider");
  return ctx;
}
