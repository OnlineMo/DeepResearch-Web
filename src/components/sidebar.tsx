'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Calendar, Filter, Tag } from 'lucide-react';
import { REPORT_CATEGORIES, CATEGORY_COLORS } from '@/constants';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedCategory?: string;
  selectedDateRange?: { start: Date; end: Date };
  onCategoryChange?: (category: string) => void;
  onDateRangeChange?: (range?: { start: Date; end: Date }) => void;
  categoryCounts?: Record<string, number>;
  categories?: { slug: string; display: string; description?: string }[];
}

export function Sidebar({
  isOpen = true,
  onClose,
  selectedCategory,
  selectedDateRange,
  onCategoryChange,
  onDateRangeChange,
  categoryCounts,
  categories
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'filters'])
  );
  // 允许只选择开始或结束，不强制成对设置
  const [localRange, setLocalRange] = useState<{ start?: Date; end?: Date } | undefined>(selectedDateRange);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getCategoryIcon = () => {
    // 这里可以导入并返回相应的图标组件
    // 简化实现，使用标签图标
    return <Tag className="h-4 w-4" />;
  };

  const getCategoryColor = (categorySlug: string) => {
    return CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS['shi-zheng-yu-guo-ji'];
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform overflow-y-auto border-r border-border bg-background transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:z-0 lg:h-auto lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4 p-4">
          {/* Categories Section */}
          <div>
            <button
              onClick={() => toggleSection('categories')}
              className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              <span className="flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>分类导航</span>
              </span>
              {expandedSections.has('categories') ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedSections.has('categories') && (
              <div className="mt-2 space-y-1">
                {(() => {
                  const categoryList = (categories && categories.length > 0)
                    ? categories
                    : REPORT_CATEGORIES.map(c => ({ slug: c.slug, display: c.display, description: c.description }));
                  return categoryList.map((category: { slug: string; display: string; description?: string }) => {
                    const colors = getCategoryColor(category.slug);
                    const isSelected = selectedCategory === category.slug;

                  return (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      onClick={() => {
                        onCategoryChange?.(category.slug);
                        if (window.innerWidth < 1024) {
                          onClose?.();
                        }
                      }}
                      className={`group flex items-center space-x-3 rounded-md p-3 text-sm transition-colors ${
                        isSelected
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: isSelected ? colors.primary : colors.light,
                          color: isSelected ? 'white' : colors.primary
                        }}
                      >
                        {getCategoryIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{category.display}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {category.description ?? '来自 Archive 的自动导入分类'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(categoryCounts?.[category.slug] ?? 0)} 篇报告
                        </p>
                      </div>
                      {isSelected && (
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                      )}
                    </Link>
                  )});
                })()}
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div>
            <button
              onClick={() => toggleSection('filters')}
              className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              <span className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>筛选器</span>
              </span>
              {expandedSections.has('filters') ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedSections.has('filters') && (
              <div className="mt-2 space-y-4">
                {/* Date Range Filter */}
                <div>
                  <label className="mb-2 flex items-center space-x-2 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>日期范围</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={localRange?.start ? formatDate(localRange.start) : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const newStart = new Date(e.target.value);
                          const next = { start: newStart, end: localRange?.end };
                          setLocalRange(next);
                          if (next.end) {
                            onDateRangeChange?.({ start: newStart, end: next.end });
                          }
                        }
                      }}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="开始日期"
                    />
                    <input
                      type="date"
                      value={localRange?.end ? formatDate(localRange.end) : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const newEnd = new Date(e.target.value);
                          const start = localRange?.start;
                          const next = { start, end: newEnd };
                          setLocalRange(next);
                          if (start) {
                            onDateRangeChange?.({ start, end: newEnd });
                          }
                        }
                      }}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="结束日期"
                    />
                  </div>
                </div>

                {/* Quick Date Filters */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    快速筛选
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const today = new Date();
                        const next = { start: today, end: today };
                        setLocalRange(next);
                        onDateRangeChange?.(next);
                      }}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                    >
                      今天
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        const next = { start: lastWeek, end: today };
                        setLocalRange(next);
                        onDateRangeChange?.(next);
                      }}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                    >
                      最近7天
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        const next = { start: lastMonth, end: today };
                        setLocalRange(next);
                        onDateRangeChange?.(next);
                      }}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                    >
                      最近30天
                    </button>
                    <button
                      onClick={() => {
                        setLocalRange(undefined);
                        onDateRangeChange?.(undefined);
                      }}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                    >
                      清除
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-medium text-foreground">统计信息</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">总报告数</span>
                <span className="font-medium">
                  {typeof categoryCounts === 'object'
                    ? Object.values(categoryCounts).reduce((sum, v) => sum + (v || 0), 0)
                    : REPORT_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">分类数</span>
                <span className="font-medium">{REPORT_CATEGORIES.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">最后更新</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}