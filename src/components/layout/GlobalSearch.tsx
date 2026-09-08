import { useState, useEffect } from "react";
import { Search, Package, User, ShoppingBag, Receipt, ArrowRight } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useDataset } from "../providers/DatasetProvider";
import { formatCompactPKR } from "@/services/metrics";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

export function GlobalSearch() {
  const { dataset, searchOpen, setSearchOpen } = useDataset();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [searchOpen, setSearchOpen]);

  if (!dataset) return null;

  const handleSelect = (to: string) => {
    setSearchOpen(false);
    router.navigate({ to });
  };

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder="Search customers, products, orders, invoices... (Cmd+K)" />
      <CommandList className="max-h-[380px] p-2">
        <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
          No records matching search query.
        </CommandEmpty>

        <CommandGroup heading="Products">
          {dataset.products.slice(0, 5).map((p) => (
            <CommandItem
              key={p.product_id}
              onSelect={() => handleSelect(`/inventory?search=${encodeURIComponent(p.product_name)}`)}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-foreground truncate">{p.product_name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sku} • {p.category}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium text-foreground">{formatCompactPKR(p.unit_price)}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Customers">
          {dataset.customers.slice(0, 5).map((c) => (
            <CommandItem
              key={c.customer_id}
              onSelect={() => handleSelect(`/customers?search=${encodeURIComponent(c.customer_name)}`)}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-foreground">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-foreground truncate">{c.customer_name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.city} • {c.customer_segment}</p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Recent Orders">
          {dataset.orders.slice(0, 5).map((o) => (
            <CommandItem
              key={o.order_id}
              onSelect={() => handleSelect(`/orders?search=${encodeURIComponent(o.order_id)}`)}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <ShoppingBag className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold text-foreground">{o.order_id}</p>
                  <p className="text-[10px] text-muted-foreground">{o.order_status} • {o.order_date}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-foreground">{formatCompactPKR(o.total_amount)}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Receivable Invoices">
          {dataset.receivables.slice(0, 5).map((r) => (
            <CommandItem
              key={r.invoice_id}
              onSelect={() => handleSelect(`/receivables?search=${encodeURIComponent(r.invoice_id)}`)}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-warning/10 text-warning">
                  <Receipt className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-mono font-semibold text-foreground">{r.invoice_id}</p>
                  <p className="text-[10px] text-muted-foreground">Due: {r.due_date}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-foreground">{formatCompactPKR(r.invoice_amount)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
