export default {
  // Detect environment automatically
  preset: process.env.VERCEL ? 'vercel' : 'cloudflare-module',
  
  // Inline tslib and radix-ui dependencies into server bundle
  externals: {
    inline: ['tslib', '@radix-ui/react-dialog', '@radix-ui/primitive', 'clsx', 'tailwind-merge'],
  },

  // Node compatibility for Vercel
  node: Boolean(process.env.VERCEL),

  // Build settings
  minify: true,
};
