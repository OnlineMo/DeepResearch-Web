'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  BookOpen,
  Filter,
  TrendingUp,
  History,
  RefreshCw,
  AlertCircle,
  // ChevronDown,
  Search
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
// import { githubService } from '@/lib/github';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import { TodayReport, ReportCategory } from '@/types';

export default function TimelinePage() {
  const [timelineReports, setTimelineReports] = useState<TodayReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadTimelineReports();
  }, []);

  const loadTimelineReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 模拟时间线报告数据
      const mockReports: TodayReport[] = [
        // 2025年1月28日
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
        // 2025年1月27日
        {
          title: "AI监管政策最新动态解读",
          date: "2025-01-27",
          path: "AI_Reports/she-hui-yu-fa-zhi/ai-regulation-2025-01-27--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/ai-regulation",
          category: "she-hui-yu-fa-zhi"
        },
        {
          title: "虚拟现实与AI融合技术分析",
          date: "2025-01-27",
          path: "AI_Reports/yu-le-yu-ming-xing/vr-ai-2025-01-27--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/vr-ai",
          category: "yu-le-yu-ming-xing"
        },
        // 2025年1月26日
        {
          title: "智能旅游助手发展现状分析",
          date: "2025-01-26",
          path: "AI_Reports/lv-you-yu-chu-xing/smart-travel-2025-01-26--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/smart-travel",
          category: "lv-you-yu-chu-xing"
        },
        {
          title: "大模型在金融风控中的应用",
          date: "2025-01-26",
          path: "AI_Reports/xing-ye-yu-gong-si/ai-fintech-2025-01-26--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/ai-fintech",
          category: "xing-ye-yu-gong-si"
        }
      ];
      
      // 尝试真实的 API 调用，如果失败则使用模拟数据
      try {
        // const response = await githubService.getTimelineReports();
        // setTimelineReports(response.reports);
        setTimelineReports(mockReports);
      } catch (error) {
        console.warn('GitHub API 调用失败，使用模拟数据:', error);
        setTimelineReports(mockReports);
      }
    } catch (err) {
      console.error('Error loading timeline reports:', err);
      setError('加载时间线失败，请稍后重试');
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
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  // 筛选和搜索
  const filteredReports = timelineReports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesYear = formatYear(report.date) === selectedYear;
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesYear && matchesSearch;
  });

  // 按日期分组
  const groupedReports = filteredReports.reduce((acc, report) => {
    const date = report.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(report);
    return acc;
  }, {} as Record<string, TodayReport[]>);

  // 获取可用年份
  const availableYears = [...new Set(timelineReports.map(report => formatYear(report.date)))].sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={() => {}} todayReportCount={0} />
      
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full px-4 py-2 text-sm font-medium">
              <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">历史记录</span>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground">
              报告时间线
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              按时间顺序浏览所有AI研究报告，追踪技术发展脉络
            </p>
          </div>

          {/* Statistics */}
          <div className="flex justify-center">
            <div className="bg-muted/50 rounded-lg px-6 py-3 inline-flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-foreground">
                  共 {filteredReports.length} 篇报告
                </span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  {Object.keys(groupedReports).length} 个发布日期
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索报告标题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            {/* Year Filter */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">年份:</span>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedYear === year
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">分类:</span>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                全部
              </button>
              {REPORT_CATEGORIES.map((category) => {
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
                    {category.display}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Content */}
          {isLoading ? (
            <div className="space-y-6">
              <div className="text-center">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">正在加载时间线...</p>
              </div>
              <div className="space-y-6">
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
                onClick={loadTimelineReports}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>重新加载</span>
              </button>
            </div>
          ) : Object.keys(groupedReports).length > 0 ? (
            <div className="space-y-8">
              {/* Timeline */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block"></div>
                
                <div className="space-y-12">
                  {Object.entries(groupedReports)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([date, reports]) => (
                      <div key={date} className="relative">
                        {/* Date Marker */}
                        <div className="flex items-center mb-6">
                          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-primary rounded-full text-primary-foreground font-semibold text-sm mr-6">
                            {new Date(date).getDate()}
                          </div>
                          <div className="md:ml-0 ml-0">
                            <h2 className="text-xl font-bold text-foreground">
                              {formatDate(date)}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {reports.length} 篇报告发布
                            </p>
                          </div>
                        </div>

                        {/* Reports */}
                        <div className="md:ml-18 ml-0 space-y-4">
                          {reports.map((report, index) => {
                            const categoryInfo = getCategoryInfo(report.category);
                            const colors = getCategoryColor(report.category);
                            
                            return (
                              <div 
                                key={index} 
                                className="group bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all"
                              >
                                <div className="space-y-3">
                                  {/* Header */}
                                  <div className="flex items-center justify-between">
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
                                  
                                  {/* Title */}
                                  <Link href={`/report/${encodeURIComponent(report.path)}`}>
                                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {report.title}
                                    </h3>
                                  </Link>
                                  
                                  {/* Actions */}
                                  <div className="flex items-center justify-between pt-2">
                                    <Link
                                      href={`/report/${encodeURIComponent(report.path)}`}
                                      className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
                                    >
                                      <BookOpen className="h-4 w-4" />
                                      <span>阅读报告</span>
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
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">暂无匹配报告</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                在当前筛选条件下没有找到相关报告，请尝试调整筛选条件。
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span>重置筛选</span>
                </button>
                <Link
                  href="/categories"
                  className="inline-flex items-center space-x-2 bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <span>浏览分类</span>
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