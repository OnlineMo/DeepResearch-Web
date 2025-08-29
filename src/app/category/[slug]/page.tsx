import React from 'react';
import { REPORT_CATEGORIES } from '@/constants';
import { githubService } from '@/lib/github';
import ClientCategoryPage from './ClientCategoryPage';

// 动态生成静态参数：从 Archive NAVIGATION.md 获取全部分类，包含新增分类
export async function generateStaticParams() {
  try {
    const nav = await githubService.getNavigationData();
    const slugs = Array.from(new Set(nav.categories.map((c) => c.slug)));
    return slugs.map((slug) => ({ slug }));
  } catch {
    // 回退到内置的默认分类，保证构建可用
    return REPORT_CATEGORIES.map((c) => ({ slug: c.slug }));
  }
}

// 服务端包装组件：仅负责渲染客户端页面，避免 SSR 期间去请求 GitHub API
export default function Page({ params }: { params: { slug: string } }) {
  return <ClientCategoryPage slug={params.slug} />;
}