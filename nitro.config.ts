export default {
  // Always build for Vercel serverless deployment
  preset: 'vercel',

  // Inline tslib and radix-ui dependencies into server bundle
  externals: {
    inline: [/^tslib/, /^@radix-ui\//, 'clsx', 'tailwind-merge'],
    traceInclude: [
      'node_modules/tslib/**',
      'tslib/**',
    ],
  },

  // Node compatibility for Vercel
  node: true,

  // Build settings
  minify: true,
};
