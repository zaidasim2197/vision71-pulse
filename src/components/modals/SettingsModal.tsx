import { Settings, ShieldCheck, Sun, Moon, Laptop, Database, Clock, Server } from "lucide-react";
import { useDataset } from "../providers/DatasetProvider";
import { useTheme } from "../providers/ThemeProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen, dataset } = useDataset();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 border-border/80 bg-card shadow-2xl backdrop-blur-xl">
        <DialogHeader className="gap-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Dashboard Settings & Integrity
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Appearance preference & PulseOps dataset validation status
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Theme Preference */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Appearance Theme</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="h-10 justify-center gap-2 rounded-xl text-xs"
              >
                <Sun className="h-4 w-4" /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="h-10 justify-center gap-2 rounded-xl text-xs"
              >
                <Moon className="h-4 w-4" /> Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="h-10 justify-center gap-2 rounded-xl text-xs"
              >
                <Laptop className="h-4 w-4" /> System
              </Button>
            </div>
          </div>

          {/* Dataset Freshness & Reporting Period */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Data Freshness & Reporting Window
              </span>
              <Badge variant="outline" className="text-[10px] bg-card font-mono">
                Verified
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Reporting Range:</strong> March 1, 2025 – August 31, 2026</p>
              <p><strong className="text-foreground">Data Freshness:</strong> Data through Aug 31, 2026</p>
              <p><strong className="text-foreground">Reference Date:</strong> September 1, 2026</p>
              <p><strong className="text-foreground">Base Currency:</strong> PKR (Pakistani Rupee)</p>
            </div>
          </div>

          {/* Validation Report */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                Source Data Integrity Checks
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {dataset?.validation.filter((v) => v.status === "PASS").length ?? 0} / {dataset?.validation.length ?? 0} Passed
              </span>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-3 space-y-1.5 max-h-[160px] overflow-y-auto">
              {dataset?.validation.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                  <span className="text-foreground font-medium">{v.check}</span>
                  <Badge variant={v.status === "PASS" ? "default" : "destructive"} className="text-[10px] font-mono px-1.5 py-0">
                    {v.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* AI Server Status */}
          <div className="rounded-2xl border border-border/60 bg-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">AI Server Endpoint</p>
                <p className="text-[10px] text-muted-foreground">Secure Gemini Edge Route (/api/ai)</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] text-success border-success/30 font-mono">
              Active
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
