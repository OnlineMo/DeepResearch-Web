'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, ArrowRight, BookOpen, Filter, TrendingUp } from 'lucide-react';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';
import { TodayReport, ReportCategory } from '@/types';

type Props = {
  category: string;
  year: string;
  allReports: TodayReport[];
};

function getCategoryInfo(categorySlug: string): ReportCategory {
  return REPORT_CATEGORIES.find(cat => cat.slug === categorySlug) || REPORT_CATEGORIES[0];
}

function getCategoryColor(categorySlug: string) {
  return CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS['shi-zheng-yu-guo-ji'];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

function parseDateOrUndefined(v?: string | null): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

const ClientTimelineContent: React.FC<Props> = ({ category, year, allReports }) => {
  const searchParams = useSearchParams();
  const startStr = searchParams.get('start');
  const endStr = searchParams.get('end');

  const startDate = parseDateOrUndefined(startStr);
  const endDate = parseDateOrUndefined(endStr);

  const filteredReports = useMemo(() => {
    let list = allReports;

    if (category !== 'all') {
      list = list.filter(r => r.category === category);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // 归零时分秒，确保比较稳定
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      list = list.filter(r => {
        const d = new Date(r.date);
        if (isNaN(d.getTime())) return false;
        return d >= start && d <= end;
      });
    } else {
      list = list.filter(r => new Date(r.date).getFullYear().toString() === year);
    }

    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [allReports, category, year, startDate?.getTime(), endDate?.getTime()]);

  const groupedReports = useMemo(() => {
    const acc: Record<string, TodayReport[]> = {};
    for (const report of filteredReports) {
      (acc[report.date] ||= []).push(report);
    }
    return acc;
  }, [filteredReports]);

  const availableYears = useMemo(
    () =>
      [...new Set(allReports.map(r => new Date(r.date).getFullYear().toString()))].sort((a, b) =>
        b.localeCompare(a)
      ),
    [allReports]
  );

  return (
    <>
      {/* Statistics */ }
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

      {/* Filters */ }
      <div className="space-y-4">
        {/* Year Filter */ }
        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">年份:</span>
            {availableYears.map((yr) => (
              <Link
                key={yr}
                href={`/timeline/${category}/${yr}/`}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${yr === year ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {yr}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Filter */ }
        <div className="flex flex-wrap justify-center items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">分类:</span>
          </div>
          <Link
            href={`/timeline/all/${year}/`}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${category === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            全部
          </Link>
          {REPORT_CATEGORIES.map((cat) => {
            const colors = getCategoryColor(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/timeline/${cat.slug}/${year}/`}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${category === cat.slug ? 'text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                style={category === cat.slug ? { backgroundColor: colors.primary } : {}}
              >
                {cat.display}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Timeline Content */ }
      {Object.keys(groupedReports).length > 0 ? (
        <div className="space-y-8">
          {/* Timeline */ }
          <div className="relative">
            {/* Timeline Line */ }
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block"></div>

            <div className="space-y-12">
              {Object.entries(groupedReports)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, reports]) => (
                  <div key={date} className="relative">
                    {/* Date Marker */ }
                    <div className="flex items-center mb-6">
                      <div className="hidden md:flex items-center justify-center w-12 h-12 bg-primary rounded-full text-primary-foreground font-semibold text-sm mr-6">
                        {new Date(date).getDate()}
                      </div>
                      <div className="md:ml-0 ml-0">
                        <h2 className="text-xl font-bold text-foreground">{formatDate(date)}</h2>
                        <p className="text-sm text-muted-foreground">{reports.length} 篇报告发布</p>
                      </div>
                    </div>

                    {/* Reports */ }
                    <div className="md:ml-18 ml-0 space-y-4">
                      {reports.map((report, index) => {
                        const categoryInfo = getCategoryInfo(report.category);
                        const colors = getCategoryColor(report.category);
                        return (
                          <div key={index} className="group bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
                            <div className="space-y-3">
                              {/* Header */ }
                              <div className="flex items-center justify-between">
                                <span
                                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                                  style={{ backgroundColor: colors.light, color: colors.primary }}
                                >
                                  {categoryInfo.display}
                                </span>
                                <span className="text-xs text-muted-foreground">版本 {report.version}</span>
                              </div>

                              {/* Title */ }
                              <Link href={`/report?path=${encodeURIComponent(report.path)}`}>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {report.title}
                                </h3>
                              </Link>

                              {/* Actions */ }
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
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
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
    </>
  );
};

export default ClientTimelineContent;