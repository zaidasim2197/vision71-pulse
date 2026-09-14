import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Detect platform from CI env vars injected by each platform
const preset = process.env.VERCEL
  ? "vercel"
  : process.env.NETLIFY
    ? "netlify"
    : "node-server";

export default defineConfig({
  resolve: {
    alias: {
      tslib: "tslib/tslib.es6.mjs",
    },
  },
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
    react(),
    tailwindcss(),
    ...nitro({
      preset,
      // Inline all packages so tslib is bundled into the server build
      noExternals: true,
      minify: true,
    }),
  ],
  build: {
    cssMinify: false,
  },
});