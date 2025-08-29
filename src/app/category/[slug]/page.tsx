import React from 'react';
import { REPORT_CATEGORIES } from '@/constants';
import ClientCategoryPage from './ClientCategoryPage';

// 生成静态参数，确保 /category/[slug] 路由被静态导出，从而不再请求 *.txt 失败
export async function generateStaticParams() {
  return REPORT_CATEGORIES.map((c) => ({ slug: c.slug }));
}

// 服务端包装组件：仅负责渲染客户端页面，避免 SSR 期间去请求 GitHub API
export default function Page({ params }: { params: { slug: string } }) {
  return <ClientCategoryPage slug={params.slug} />;
}