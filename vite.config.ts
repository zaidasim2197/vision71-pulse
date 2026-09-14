import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Detect platform: Vercel sets VERCEL=1, Netlify sets NETLIFY=true
const preset = process.env.VERCEL
  ? "vercel"
  : process.env.NETLIFY
    ? "netlify"
    : "node-server";

export default defineConfig({
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
      noExternals: true,
      minify: true,
    }),
  ],
  build: {
    cssMinify: false,
  },
});