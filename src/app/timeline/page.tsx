import { History } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { githubService } from '@/lib/github';
import { TodayReport } from '@/types';
import ClientTimelineContent from './ClientTimelineContent';

// 移除 dynamic = 'force-dynamic' 以支持静态导出
// export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// 为静态导出生成参数
export async function generateStaticParams() {
  try {
    const nav = await githubService.getNavigationData();
    const categories = ['all', ...Array.from(new Set(nav.categories.map(c => c.slug)))];
    const years = ['2025', '2024'];
    const params: { category: string; year: string }[] = [];
    for (const category of categories) {
      for (const year of years) {
        params.push({ category, year });
      }
    }
    return params;
  } catch {
    const categories = ['all', 'shi-zheng-yu-guo-ji', 'she-hui-yu-fa-zhi', 'yu-le-yu-ming-xing', 'xing-ye-yu-gong-si', 'lu-you-yu-chu-xing'];
    const years = ['2025', '2024'];
    return categories.flatMap(category => years.map(year => ({ category, year })));
  }
}

// 修改页面组件，移除对searchParams的依赖
export default async function TimelinePage({ params }: { params: { category?: string; year?: string } }) {
  // 使用静态参数而不是searchParams
  const category = params?.category || 'all';
  const year = params?.year || '2025';

  // 获取真实的导航数据
  let allReports: TodayReport[] = [];
  let categoryMap: Record<string, string> = {};
  
  try {
    // 获取导航数据（包含所有报告）
    const navigationData = await githubService.getNavigationData();
    categoryMap = Object.fromEntries(navigationData.categories.map((c) => [c.slug, c.name]));
    
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
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full px-4 py-2 text-sm font-medium">
              <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">历史记录</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">报告时间线</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              按时间顺序浏览所有AI研究报告，追踪技术发展脉络
            </p>
          </div>

          <ClientTimelineContent category={category} year={year} allReports={allReports} categoryMap={categoryMap} />
        </div>
      </main>
      <Footer />
    </div>
  );
}