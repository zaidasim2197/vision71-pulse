import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useDataset } from "../providers/DatasetProvider";
import {
  PRESET_LABELS,
  PRESET_ORDER,
  resolvePreset,
  formatDay,
  type PresetKey,
} from "@/services/dateRange";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function DateRangePicker() {
  const { dateRange, setDateRange } = useDataset();
  const [customOpen, setCustomOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(dateRange.from);
  const [customTo, setCustomTo] = useState(dateRange.to);

  const handleSelectPreset = (preset: PresetKey) => {
    if (preset === "custom") {
      setCustomOpen(true);
      return;
    }
    setDateRange(resolvePreset(preset));
  };

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) return;
    setDateRange({
      preset: "custom",
      from: customFrom <= customTo ? customFrom : customTo,
      to: customFrom <= customTo ? customTo : customFrom,
    });
    setCustomOpen(false);
  };

  const currentLabel =
    dateRange.preset !== "custom"
      ? PRESET_LABELS[dateRange.preset]
      : `${formatDay(dateRange.from)} – ${formatDay(dateRange.to)}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 border-border/60 bg-card/80 px-3 text-xs font-medium text-foreground shadow-xs backdrop-blur-xs hover:bg-accent hover:text-accent-foreground"
          >
            <CalendarIcon className="h-3.5 w-3.5 text-primary" />
            <span className="truncate max-w-[130px] sm:max-w-[180px]">{currentLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-md">
          {PRESET_ORDER.map((key) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                dateRange.preset === key ? "bg-primary/10 text-primary font-semibold" : ""
              }`}
            >
              {PRESET_LABELS[key]}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onClick={() => handleSelectPreset("custom")}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
              dateRange.preset === "custom" ? "bg-primary/10 text-primary font-semibold" : ""
            }`}
          >
            {PRESET_LABELS["custom"]}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Select Custom Date Range</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid gap-2">
              <Label htmlFor="from" className="text-xs font-medium text-muted-foreground">From Date</Label>
              <Input
                id="from"
                type="date"
                value={customFrom}
                min="2025-03-01"
                max="2026-09-01"
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to" className="text-xs font-medium text-muted-foreground">To Date</Label>
              <Input
                id="to"
                type="date"
                value={customTo}
                min="2025-03-01"
                max="2026-09-01"
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setCustomOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleApplyCustom} className="text-xs bg-primary text-primary-foreground">
              Apply Range
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
