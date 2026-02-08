import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Only use static export for GitHub Pages
  ...(isStaticExport && {
    output: 'export',
    basePath: '/defi-vc-dapp',
    assetPrefix: '/defi-vc-dapp/',
  }),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
