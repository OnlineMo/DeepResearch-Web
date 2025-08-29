'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { githubService } from '@/lib/github';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import type { ReportCategory } from '@/types';

type FlatReport = {
  title: string;
  date: string;
  path: string;
  version: string;
  sourceUrl: string;
  category: string;
};

export default function ClientCategoryPage({ slug }: { slug: string }) {
  const categorySlug = useMemo(() => slug, [slug]);

  const [reports, setReports] = useState<FlatReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        // 1) 拉取分类 Reports.md（索引页）
        const reportsContent = await githubService.getCategoryReportsIndex(categorySlug);
        // 2) 解析为 report 列表（包含 path/title）
        const parsedReports = githubService.parseCategoryReports(reportsContent, categorySlug);

        // 3) 并发获取每篇报告的详细信息（限制并发 = 3，避免速率限制）
        const concurrency = 3;
        const results: FlatReport[] = [];
        for (let i = 0; i < parsedReports.length; i += concurrency) {
          const batch = parsedReports.slice(i, i + concurrency);
          const batchResults = await Promise.all(
            batch.map(async (rp) => {
              try {
                const content = await githubService.getReportContent(rp.path);
                return {
                  title: content.title,
                  date: content.metadata.date,
                  path: rp.path,
                  version: content.metadata.version,
                  sourceUrl: content.metadata.source,
                  category: categorySlug,
                } as FlatReport;
              } catch {
                // 后备：至少保留可点的路径与标题
                return {
                  title: rp.name,
                  date: '',
                  path: rp.path,
                  version: 'v1',
                  sourceUrl: '',
                  category: categorySlug,
                } as FlatReport;
              }
            })
          );
          results.push(...batchResults);
        }

        if (mounted) {
          setReports(results);
        }
      } catch {
        if (mounted) {
          setReports([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  const getCategoryInfo = (slugIn: string): ReportCategory => {
    return REPORT_CATEGORIES.find((cat) => cat.slug === slugIn) || REPORT_CATEGORIES[0];
  };

  const getCategoryColor = (slugIn: string) => {
    return CATEGORY_COLORS[slugIn] || CATEGORY_COLORS['shi-zheng-yu-guo-ji'];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const categoryInfo = getCategoryInfo(categorySlug);
  const colors = getCategoryColor(categorySlug);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            {/* Back Button */}
            <Link
              href="/categories"
              className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回分类</span>
            </Link>

            {/* Category Header */}
            <div className="text-center space-y-4">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
                style={{
                  backgroundColor: colors.light,
                  color: colors.primary,
                }}
              >
                <TrendingUp className="h-8 w-8" />
              </div>

              <h1 className="text-4xl font-bold text-foreground">
                {categoryInfo.display}
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {categoryInfo.description}
              </p>
            </div>

            {/* Statistics */}
            <div className="flex justify-center">
              <div className="bg-muted/50 rounded-lg px-6 py-3 inline-flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-foreground">
                    共 {reports.length} 篇报告
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    {loading ? '正在加载…' : '定期更新'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="grid gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-28 bg-muted rounded-xl" />
                ))
              ) : reports.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                  暂无报告
                </div>
              ) : (
                reports.map((report, index) => (
                  <div
                    key={index}
                    className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: colors.light,
                              color: colors.primary,
                            }}
                          >
                            版本 {report.version}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(report.date)}
                        </div>
                      </div>

                      {/* Title and Description */}
                      <div className="space-y-2">
                        <Link href={`/report?path=${encodeURIComponent(report.path)}`}>
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {report.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground">
                          深入分析{categoryInfo.display}领域的最新发展动态和技术趋势。
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <Link
                          href={`/report?path=${encodeURIComponent(report.path)}`}
                          className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>阅读全文</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>发布于 {report.date ? new Date(report.date).toLocaleDateString('zh-CN') : '—'}</span>
                          {report.sourceUrl && (
                            <a
                              href={report.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-foreground transition-colors"
                            >
                              查看原文
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination placeholder */}
            <div className="text-center pt-8">
              <p className="text-muted-foreground mb-4">
                已显示 {reports.length} 篇报告
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center space-x-2 bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span>浏览其他分类</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}