import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { githubService } from '@/lib/github';
import { CATEGORY_COLORS, REPORT_CATEGORIES } from '@/constants';

export default async function CategoriesPage() {
  // 从导航动态获取全部分类（包含新分类）
  let categoryData: { slug: string; display: string; description?: string; count: number }[] = [];
  try {
    const nav = await githubService.getNavigationData();
    categoryData = nav.categories.map((section) => ({
      slug: section.slug,
      display: section.name,
      description: '来自 Archive 的自动导入分类',
      count: section.reports?.length || 0,
    }));
  } catch (error: unknown) {
    console.warn('Failed to fetch navigation data for categories page:', error);
    // 回退到常量，保证页面可渲染
    categoryData = REPORT_CATEGORIES.map((c) => ({
      slug: c.slug,
      display: c.display,
      description: c.description,
      count: 0,
    }));
  }



  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full px-4 py-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">分类浏览</span>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground">
              报告分类
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              浏览不同类别的AI研究报告，深入了解各个领域的最新发展动态
            </p>
          </div>

          {/* Statistics */}
          <div className="flex justify-center">
            <div className="bg-muted/50 rounded-lg px-6 py-3 inline-flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-foreground">
                  共 {categoryData.length} 个分类
                </span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  定期更新
                </span>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.map((category) => {
              const colors = CATEGORY_COLORS[category.slug] || CATEGORY_COLORS['shi-zheng-yu-guo-ji'];
              
              return (
                <div
                  key={category.slug}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-6 space-y-4">
                    {/* Category Header */}
                    <div className="flex items-start justify-between">
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                        style={{
                          backgroundColor: colors.light,
                          color: colors.primary
                        }}
                      >
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-muted-foreground">
                          {category.count} 篇报告
                        </div>
                      </div>
                    </div>
                    
                    {/* Category Info */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {category.display}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description ?? '来自 Archive 的自动导入分类'}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="pt-4 border-t border-border">
                      <Link
                        href={`/category/${category.slug}`}
                        className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
                      >
                        <span>浏览报告</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-8 border-t border-border">
            <p className="text-muted-foreground">
              所有报告内容均来自 <a 
                href="https://github.com/OnlineMo/DeepResearch-Archive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                DeepResearch Archive
              </a> 仓库，实时同步更新
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}