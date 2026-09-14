// Nitro auto-detects platform from env vars:
//   VERCEL=1   → vercel preset
//   NETLIFY=1  → netlify preset
export default {
  noExternals: true,
  minify: true,
};