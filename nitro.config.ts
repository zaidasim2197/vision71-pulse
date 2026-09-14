// Fallback nitro config (primary config is in vite.config.ts)
// Platform is auto-detected via env vars: VERCEL=1 or NETLIFY=true
export default {
  noExternals: true,
  minify: true,
};