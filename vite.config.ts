import { defineConfig } from "@Lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },
  nitro: {
    preset: "vercel",
    noExternals: true,
  },
});