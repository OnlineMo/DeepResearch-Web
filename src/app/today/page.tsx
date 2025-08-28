'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Filter,
  TrendingUp,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { githubService } from '@/lib/github';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import { TodayReport, ReportCategory } from '@/types';

export default function TodayPage() {
  const [todayReports, setTodayReports] = useState<TodayReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTodayReports();
  }, []);

  const loadTodayReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 模拟今日报告数据
      const mockReports: TodayReport[] = [
        {
          title: "2025年AI发展趋势深度分析报告",
          date: "2025-01-28",
          path: "AI_Reports/shi-zheng-yu-guo-ji/ai-trends-2025-01-28--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/ai-trends-2025",
          category: "shi-zheng-yu-guo-ji"
        },
        {
          title: "ChatGPT-5发布对行业影响分析",
          date: "2025-01-28", 
          path: "AI_Reports/xing-ye-yu-gong-si/chatgpt5-impact-2025-01-28--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/chatgpt5-impact",
          category: "xing-ye-yu-gong-si"
        },
        {
          title: "AI监管政策最新动态解读",
          date: "2025-01-28",
          path: "AI_Reports/she-hui-yu-fa-zhi/ai-regulation-2025-01-28--v1.md",
          version: "v1", 
          sourceUrl: "https://example.com/ai-regulation",
          category: "she-hui-yu-fa-zhi"
        },
        {
          title: "AI在娱乐行业的最新应用",
          date: "2025-01-28",
          path: "AI_Reports/yu-le-yu-ming-xing/ai-entertainment-2025-01-28--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/ai-entertainment",
          category: "yu-le-yu-ming-xing"
        },
        {
          title: "智能旅游助手发展现状分析",
          date: "2025-01-28",
          path: "AI_Reports/lv-you-yu-chu-xing/smart-travel-2025-01-28--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/smart-travel",
          category: "lv-you-yu-chu-xing"
        }
      ];
      
      // 尝试真实的 API 调用，如果失败则使用模拟数据
      try {
        const response = await githubService.getTodayReports();
        setTodayReports(response.reports);
      } catch (error) {
        console.warn('GitHub API 调用失败，使用模拟数据:', error);
        setTodayReports(mockReports);
      }
    } catch (err) {
      console.error('Error loading today reports:', err);
      setError('加载今日报告失败，请稍后重试');
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = selectedCategory === 'all' 
    ? todayReports 
    : todayReports.filter(report => report.category === selectedCategory);

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full px-4 py-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300">今日更新</span>
              </div>
              
              <h1 className="text-4xl font-bold text-foreground">
                今日报告
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {formatDate(todayDate)} • 实时同步最新的AI研究报告和分析
              </p>
            </div>

            {/* Statistics */}
            <div className="flex justify-center">
              <div className="bg-muted/50 rounded-lg px-6 py-3 inline-flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-foreground">
                    今日新增 {filteredReports.length} 篇报告
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    最后更新: {formatTime(todayDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">筛选分类:</span>
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              全部 ({todayReports.length})
            </button>
            {REPORT_CATEGORIES.map((category) => {
              const categoryReports = todayReports.filter(report => report.category === category.slug);
              const colors = getCategoryColor(category.slug);
              
              return (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  style={selectedCategory === category.slug ? { backgroundColor: colors.primary } : {}}
                >
                  {category.display} ({categoryReports.length})
                </button>
              );
            })}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="text-center">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">正在加载今日报告...</p>
              </div>
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-32"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <button 
                onClick={loadTodayReports}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>重新加载</span>
              </button>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-6">
                {filteredReports.map((report, index) => {
                  const categoryInfo = getCategoryInfo(report.category);
                  const colors = getCategoryColor(report.category);
                  
                  return (
                    <div key={index} className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <span
                              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: colors.light,
                                color: colors.primary
                              }}
                            >
                              {categoryInfo.display}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              版本 {report.version}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(report.date)}
                          </div>
                        </div>
                        
                        {/* Title and Description */}
                        <div className="space-y-2">
                          <Link href={`/report/${encodeURIComponent(report.path)}`}>
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {report.title}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground line-clamp-2">
                            {categoryInfo.description}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <Link
                            href={`/report/${encodeURIComponent(report.path)}`}
                            className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
                          >
                            <BookOpen className="h-4 w-4" />
                            <span>阅读全文</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          
                          {report.sourceUrl && (
                            <a
                              href={report.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              查看原文
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Load More */}
              <div className="text-center pt-8">
                <p className="text-muted-foreground mb-4">
                  已显示今日全部 {filteredReports.length} 篇报告
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center space-x-2 bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <span>浏览更多分类</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">今日暂无新报告</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {selectedCategory === 'all' 
                  ? '今天还没有新的报告发布，请稍后再来查看。'
                  : `在「${getCategoryInfo(selectedCategory).display}」分类中今日暂无新报告。`
                }
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span>查看全部分类</span>
                </button>
                <Link
                  href="/categories"
                  className="inline-flex items-center space-x-2 bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <span>浏览历史报告</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}