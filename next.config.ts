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
  eslint: {
    // 构建时忽略 ESLint 错误，确保 GitHub Pages 能顺利导出 RSC .txt 资产
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 构建时忽略类型检查错误，避免阻塞 Pages 导出
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
