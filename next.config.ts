import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const isGhProject = process.env.NEXT_PUBLIC_GH_PAGES === 'true'; // 构建“项目页”版本时设为 'true'
const repo = 'DeepResearch-Web';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  basePath: isProd && isGhProject ? `/${repo}` : '',
  assetPrefix: isProd && isGhProject ? `/${repo}/` : '',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
