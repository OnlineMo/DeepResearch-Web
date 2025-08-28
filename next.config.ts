import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/DeepResearch-Web' : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: isProd ? '/DeepResearch-Web/' : '',
};

export default nextConfig;
