import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/defi-vc-dapp',
  assetPrefix: '/defi-vc-dapp/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
