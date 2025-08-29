'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, TrendingUp, BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { githubService } from '@/lib/github';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import { TodayReport, ReportCategory } from '@/types';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [todayReports, setTodayReports] = useState<TodayReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [totalReports, setTotalReports] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(REPORT_CATEGORIES.length);
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | undefined>(undefined);

  useEffect(() => {
    loadTodayReports();
  }, []);

  // 拉取 NAVIGATION.md，计算分类报告数量与总数
  useEffect(() => {
    const loadCategoryCounts = async () => {
      try {
        const nav = await githubService.getNavigationData();
        const map: Record<string, number> = {};
        let total = 0;
        for (const section of nav.categories) {
          const slug = section.slug;
          const count = section.reports?.length || 0;
          map[slug] = (map[slug] || 0) + count;
          total += count;
        }
        setCategoryCounts(map);
        setTotalReports(total);
        setCategoriesCount(nav.categories.length || REPORT_CATEGORIES.length);
      } catch {
        // 忽略错误，保持默认值
        setTotalReports(0);
        setCategoriesCount(REPORT_CATEGORIES.length);
      }
    };
    loadCategoryCounts();
  }, []);

  const loadTodayReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 尝试真实的 API 调用
      const response = await githubService.getTodayReports();
      setTodayReports(response.reports);
    } catch (error: unknown) {
      console.warn('GitHub API 调用失败:', error);
      // 如果是速率限制错误，显示更友好的错误信息
      if (error instanceof Error && error.message.includes('API速率限制')) {
        setError('API速率限制，请稍后再试');
      } else {
        setError('加载今日报告失败，请稍后重试');
      }
      // 使用空数组而不是模拟数据
      setTodayReports([]);
    } finally {
      setIsLoading(false);
    }
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

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMobileMenuToggle={setIsSidebarOpen}
        todayReportCount={todayReports.length}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCategoryChange={(slug) => router.push(`/category/${slug}`)}
          onDateRangeChange={(range) => {
            if (!range) {
              const y = new Date().getFullYear().toString();
              router.push(`/timeline/all/${y}/`);
              return;
            }
            const y = new Date(range.start).getFullYear().toString();
            const pad = (n: number) => String(n).padStart(2, '0');
            const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            const start = fmt(new Date(range.start));
            const end = fmt(new Date(range.end ?? range.start));
            const qs = new URLSearchParams({ start, end }).toString();
            router.push(`/timeline/all/${y}/?${qs}`);
          }}
          categoryCounts={categoryCounts}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">DeepResearch Archive</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
                AI研究报告
                <span className="block text-2xl lg:text-3xl font-normal text-muted-foreground mt-2">
                  洞察科技发展趋势
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                自动同步最新的AI研究报告，涵盖时政、社会、娱乐、行业、旅游等多个领域，
                为您提供全面的科技发展洞察。
              </p>
            </div>
          </div>

          {/* Today's Reports Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">今日报告</h2>
                </div>
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  {formatDate(todayDate)}
                </span>
              </div>
              
              {todayReports.length > 0 && (
                <Link 
                  href="/today"
                  className="inline-flex items-center space-x-1 text-sm font-medium text-primary hover:underline"
                >
                  <span>查看全部</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{error}</p>
                <button 
                  onClick={loadTodayReports}
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  <span>重新加载</span>
                </button>
              </div>
            ) : todayReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todayReports.slice(0, 3).map((report, index) => {
                  const categoryInfo = getCategoryInfo(report.category);
                  const colors = getCategoryColor(report.category);
                  
                  return (
                    <div key={index} className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
                      <div 
                        className="absolute left-0 top-0 h-1 w-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                      
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span
                            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: colors.light,
                              color: colors.primary
                            }}
                          >
                            {categoryInfo.display}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {report.version}
                          </span>
                        </div>
                        
                        <Link href={`/report?path=${encodeURIComponent(report.path)}`}>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {report.title}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <Link
                            href={`/report?path=${encodeURIComponent(report.path)}`}
                            className="inline-flex items-center space-x-1 text-sm font-medium text-primary hover:underline"
                          >
                            <span>阅读详情</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          
                          <span className="text-xs text-muted-foreground">
                            {formatDate(report.date).split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">今日暂无新报告</p>
              </div>
            )}
          </section>

          {/* Categories Section */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">分类浏览</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {REPORT_CATEGORIES.map((category) => {
                const colors = getCategoryColor(category.slug);
                
                return (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all group-hover:shadow-lg group-hover:border-border/60">
                      <div className="space-y-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: colors.light,
                            color: colors.primary
                          }}
                        >
                          <TrendingUp className="h-6 w-6" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {category.display}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{categoryCounts[category.slug] ?? 0} 篇报告</span>
                          <ArrowRight className="h-3 w-3 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Statistics Section */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {totalReports}
                    </p>
                    <p className="text-sm text-muted-foreground">总报告数</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{categoriesCount}</p>
                    <p className="text-sm text-muted-foreground">分类数量</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">每日</p>
                    <p className="text-sm text-muted-foreground">自动更新</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
