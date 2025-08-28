import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  // Calendar, 
  Clock, 
  ExternalLink,
  BookOpen,
  // Download,
  Share2,
  Github
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MarkdownRenderer } from '@/components/markdown-renderer';
// import { githubService } from '@/lib/github';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import { ReportCategory } from '@/types';

// 生成静态参数
export async function generateStaticParams() {
  // 返回一些示例路径用于静态生成
  return [
    { slug: ['AI_Reports', 'lv-you-yu-chu-xing', 'zhe-jiang-yi-ce-suo-gao-du-huan-yuan-yu-xu-gong-yin-liang-tan-2025-08-28--v1.md'] },
    { slug: ['AI_Reports', 'shi-zheng-yu-guo-ji', 'ai-trends-2025-01-28--v1.md'] },
    { slug: ['AI_Reports', 'xing-ye-yu-gong-si', 'chatgpt5-impact-2025-01-28--v1.md'] }
  ];
}

interface ReportPageProps {
  params: {
    slug: string[];
  };
}

interface ReportData {
  title: string;
  content: string;
  date: string;
  version: string;
  category: string;
  sourceUrl?: string;
  path: string;
  lastModified: string;
}

export default function ReportPage({ params }: ReportPageProps) {
  // 重建完整路径
  const fullPath = decodeURIComponent(params.slug.join('/'));

  // 模拟报告数据
  const reportData = {
    title: "浙江一测所高度还原预渲染技术深度分析",
    content: `# 浙江一测所高度还原预渲染技术深度分析

## 项目概述

本报告深入分析了浙江一测所在高度还原预渲染技术方面的最新进展，涵盖了技术实现、应用场景和发展前景。

## 技术特点

### 1. 高精度渲染
- **亚像素级精度**：实现了亚像素级别的渲染精度
- **多层次细节**：支持多层次细节展示
- **实时预览**：提供实时预览功能

### 2. 性能优化
- **GPU加速**：充分利用GPU并行计算能力
- **内存优化**：采用智能内存管理策略
- **缓存机制**：实现高效的缓存机制

## 结论

浙江一测所的高度还原预渲染技术在旅游出行领域展现出巨大潜力。

---

*本报告由DeepResearch团队整理，数据截至2025年8月28日*`,
    date: "2025-08-28",
    version: "v1",
    category: "lv-you-yu-chu-xing",
    sourceUrl: "https://example.com/source-report",
    path: fullPath,
    lastModified: "2025-08-28T10:30:00Z"
  };

  const getCategoryInfo = (categorySlug: string): ReportCategory => {
    return REPORT_CATEGORIES.find(cat => cat.slug === categorySlug) || REPORT_CATEGORIES[0];
  };

  const getCategoryColor = (categorySlug: string) => {
    return CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS['shi-zheng-yu-guo-ji'];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categoryInfo = getCategoryInfo(reportData.category);
  const colors = getCategoryColor(reportData.category);

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={() => {}} todayReportCount={0} />
      
      <main className="container mx-auto max-w-4xl px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            分类
          </Link>
          <span>/</span>
          <Link 
            href={`/category/${reportData.category}`} 
            className="hover:text-foreground transition-colors"
          >
            {categoryInfo.display}
          </Link>
          <span>/</span>
          <span className="text-foreground">报告详情</span>
        </nav>

        {/* Header */}
        <div className="space-y-6 mb-8">
          {/* Back Button */}
          <Link
            href="/categories"
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回分类</span>
          </Link>

          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: colors.light,
                  color: colors.primary
                }}
              >
                {categoryInfo.display}
              </span>
              <div className="flex items-center space-x-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                {reportData.sourceUrl && (
                  <a
                    href={reportData.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="查看原文"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {reportData.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatDate(reportData.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>版本 {reportData.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-8">
            <MarkdownRenderer content={reportData.content} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            来源: <a 
              href="https://github.com/OnlineMo/DeepResearch-Archive" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center space-x-1"
            >
              <Github className="h-3 w-3" />
              <span>DeepResearch Archive</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {reportData.sourceUrl && (
              <a
                href={reportData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>查看原文</span>
              </a>
            )}
            <Link
              href={`/category/${reportData.category}`}
              className="inline-flex items-center space-x-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>更多{categoryInfo.display}报告</span>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}