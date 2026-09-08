import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";

import appCss from "../styles.css?url";
import { reportAppError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { DatasetProvider } from "../components/providers/DatasetProvider";
import { FloatingNav } from "../components/layout/FloatingNav";
import { GlobalSearch } from "../components/layout/GlobalSearch";
import { InfoModal } from "../components/modals/InfoModal";
import { SettingsModal } from "../components/modals/SettingsModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested route doesn't exist in the PulseOps Dashboard.
        </p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong loading the component.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PulseOps — Executive Sales & Operations Intelligence Dashboard" },
      {
        name: "description",
        content: "Modern Executive Sales & Operations Analytics Dashboard powered by PulseOps Intelligence Engine.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const router = useRouter();
  const isAi = location.pathname === "/ai-assistant";
  const mainRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top helper function
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  // 1. Trigger scroll to top on router navigation resolution
  useEffect(() => {
    return router.subscribe("onResolved", () => {
      scrollToTop();
      // Second attempt after DOM paint
      requestAnimationFrame(() => scrollToTop());
    });
  }, [router]);

  // 2. Trigger scroll to top on location pathname/search change
  useEffect(() => {
    scrollToTop();
    const timer = setTimeout(scrollToTop, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  // Monitor scroll position to toggle floating button
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      setShowScrollTop(mainEl.scrollTop > 200);
    };

    mainEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <DatasetProvider>
          <div className="h-screen max-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-primary overflow-hidden relative">
            {/* Modern Floating Header Navigation */}
            <FloatingNav />

            {/* Main Page Body */}
            <main
              ref={mainRef}
              className={`flex-1 min-h-0 ${isAi ? "overflow-hidden flex flex-col" : "overflow-y-auto pb-12"}`}
            >
              <Outlet />
            </main>

            {/* Floating Scroll To Top Button */}
            {!isAi && showScrollTop && (
              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            )}

            {/* Footer (Hidden on fixed AI Assistant page to prevent scroll jumping) */}
            {!isAi && (
              <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground bg-card/40 shrink-0">
                <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p>&copy; {new Date().getFullYear()} PulseOps Technologies. All rights reserved.</p>
                  <p className="font-mono text-[11px]">
                    Data through Aug 31, 2026 | Reference date: Sep 1, 2026
                  </p>
                </div>
              </footer>
            )}

            {/* Global Modals */}
            <GlobalSearch />
            <InfoModal />
            <SettingsModal />
          </div>
        </DatasetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
