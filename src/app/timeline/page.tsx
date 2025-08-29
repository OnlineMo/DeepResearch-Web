import {
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  Filter,
  TrendingUp,
  History
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { githubService } from '@/lib/github';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import { TodayReport, ReportCategory } from '@/types';
import Link from 'next/link';

// 移除 dynamic = 'force-dynamic' 以支持静态导出
// export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// 为静态导出生成参数
export async function generateStaticParams() {
  const categories = ['all', 'shi-zheng-yu-guo-ji', 'she-hui-yu-fa-zhi', 'yu-le-yu-ming-xing', 'xing-ye-yu-gong-si', 'lu-you-yu-chu-xing'];
  const years = ['2025', '2024']; // 可以根据实际数据调整年份
  
  // 生成所有可能的参数组合
  const params = [];
  for (const category of categories) {
    for (const year of years) {
      params.push({ category, year });
    }
  }
  
  return params;
}

// 修改页面组件，移除对searchParams的依赖
export default async function TimelinePage({ params }: { params: { category?: string; year?: string } }) {
  // 使用静态参数而不是searchParams
  const category = params?.category || 'all';
  const year = params?.year || '2025';

  // 获取真实的导航数据
  let allReports: TodayReport[] = [];
  
  try {
    // 获取导航数据（包含所有报告）
    const navigationData = await githubService.getNavigationData();
    
    // 将导航数据转换为时间线格式
    allReports = navigationData.categories.flatMap(categorySection =>
      categorySection.reports.map(report => ({
        title: report.title,
        date: report.date,
        path: report.path,
        version: report.version,
        sourceUrl: report.sourceUrl,
        category: categorySection.slug
      }))
    );
  } catch (error: unknown) {
    console.warn('Failed to fetch navigation data:', error);
    // 如果是速率限制错误，显示更友好的错误信息
    if (error instanceof Error && error.message.includes('API速率限制')) {
      allReports = [{
        title: "API速率限制",
        date: new Date().toISOString().split('T')[0],
        path: "",
        version: "v1",
        sourceUrl: "",
        category: "shi-zheng-yu-guo-ji"
      }];
    } else {
      // 使用模拟数据作为后备
      allReports = [
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
          path: "AI_Reports/lu-you-yu-chu-xing/smart-travel-2025-01-26--v1.md",
          version: "v1",
          sourceUrl: "https://example.com/smart-travel",
          category: "lu-you-yu-chu-xing"
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
    }
  }

  // 筛选和搜索
  const filteredReports = allReports.filter(report => {
    const matchesCategory = category === 'all' || report.category === category;
    const matchesYear = new Date(report.date).getFullYear().toString() === year;
    
    return matchesCategory && matchesYear;
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
  const availableYears = [...new Set(allReports.map(report => new Date(report.date).getFullYear().toString()))].sort((a, b) => b.localeCompare(a));

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
            {/* Year Filter */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">年份:</span>
                {availableYears.map((yr) => (
                  <Link
                    key={yr}
                    href={`/timeline/${category}/${yr}/`}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      yr === year
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {yr}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">分类:</span>
              </div>
              <Link
                href={`/timeline/all/${year}/`}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                全部
              </Link>
              {REPORT_CATEGORIES.map((cat) => {
                const colors = getCategoryColor(cat.slug);
                
                return (
                  <Link
                    key={cat.slug}
                    href={`/timeline/${cat.slug}/${year}/`}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      category === cat.slug
                        ? 'text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    style={category === cat.slug ? { backgroundColor: colors.primary } : {}}
                  >
                    {cat.display}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Timeline Content */}
          {Object.keys(groupedReports).length > 0 ? (
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
                                  <Link href={`/report?path=${encodeURIComponent(report.path)}`}>
                                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {report.title}
                                    </h3>
                                  </Link>
                                  
                                  {/* Actions */}
                                  <div className="flex items-center justify-between pt-2">
                                    <Link
                                      href={`/report?path=${encodeURIComponent(report.path)}`}
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
                <Link
                  href="/timeline/"
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span>重置筛选</span>
                </Link>
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