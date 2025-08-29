'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, ExternalLink, BookOpen, Share2, Github } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { githubService } from '@/lib/github';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import type { ReportCategory } from '@/types';

type LoadedReport = {
  title: string;
  content: string;
  date: string;
  version: string;
  category: string;
  sourceUrl: string;
  path: string;
  lastModified: string;
};

export default function ReportViewerPage() {
  const searchParams = useSearchParams();
  const pathParam = searchParams.get('path');

  const decodedPath = useMemo(() => {
    if (!pathParam) return '';
    try {
      return decodeURIComponent(pathParam);
    } catch {
      return pathParam;
    }
  }, [pathParam]);

  const [reportData, setReportData] = useState<LoadedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!decodedPath) return;
      setLoading(true);
      setError(null);
      try {
        const reportContent = await githubService.getReportContent(decodedPath);
        setReportData({
          title: reportContent.title,
          content: reportContent.content,
          date: reportContent.metadata.date,
          version: reportContent.metadata.version,
          category: reportContent.metadata.category_slug,
          sourceUrl: reportContent.metadata.source,
          path: decodedPath,
          lastModified: new Date().toISOString(),
        });
      } catch (err: unknown) {
        console.error('Failed to fetch report (client):', err);
        if (err instanceof Error && err.message.includes('API速率限制')) {
          setReportData({
            title: 'API速率限制',
            content: '# API速率限制\n\n当前请求频率过高，请稍后再试。',
            date: new Date().toISOString().split('T')[0],
            version: 'v1',
            category: 'shi-zheng-yu-guo-ji',
            sourceUrl: '',
            path: decodedPath,
            lastModified: new Date().toISOString(),
          });
        } else {
          setReportData({
            title: '报告未找到',
            content: '# 报告未找到\n\n抱歉，您请求的报告不存在或暂时无法访问。',
            date: new Date().toISOString().split('T')[0],
            version: 'v1',
            category: 'shi-zheng-yu-guo-ji',
            sourceUrl: '',
            path: decodedPath,
            lastModified: new Date().toISOString(),
          });
        }
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [decodedPath]);

  const getCategoryInfo = (categorySlug: string): ReportCategory => {
    return REPORT_CATEGORIES.find((cat) => cat.slug === categorySlug) || REPORT_CATEGORIES[0];
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
      weekday: 'long',
    });
  };

  if (!pathParam) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-3xl px-6 py-12">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">缺少参数</h1>
            <p className="text-muted-foreground">请通过 /report?path=AI_Reports/... 访问具体报告。</p>
            <Link
              href="/categories"
              className="inline-flex items-center space-x-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回分类浏览</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categorySlug = reportData?.category || 'shi-zheng-yu-guo-ji';
  const categoryInfo = getCategoryInfo(categorySlug);
  const colors = getCategoryColor(categorySlug);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-4xl px-6 py-8">
        {/* Breadcrumb */ }
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            分类
          </Link>
          <span>/</span>
          <span className="text-foreground">报告详情</span>
        </nav>

        {/* Header */ }
        <div className="space-y-6 mb-8">
          {/* Back Button */ }
          <Link
            href="/categories"
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回分类</span>
          </Link>

          {/* Title Section */ }
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: colors.light,
                  color: colors.primary,
                }}
              >
                {categoryInfo.display}
              </span>
              <div className="flex items-center space-x-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                {reportData?.sourceUrl && (
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
              {reportData?.title || (loading ? '加载中…' : '报告')}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{reportData?.date ? formatDate(reportData.date) : '—'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>版本 {reportData?.version || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */ }
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-8">
            {loading ? (
              <div className="animate-pulse h-64 bg-muted rounded-md"/>
            ) : (
              <MarkdownRenderer content={reportData?.content || '加载失败'} />
            )}
          </div>
        </div>

        {/* Footer Actions */ }
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            来源:{' '}
            <a
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
            {reportData?.sourceUrl && (
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
              href={`/category/${categorySlug}`}
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