'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, Tag, ArrowRight } from 'lucide-react';
import { ResearchReport } from '@/types';
import { CATEGORY_COLORS } from '@/constants';

interface ReportCardProps {
  report: ResearchReport;
  featured?: boolean;
  compact?: boolean;
}

export function ReportCard({ report, featured = false, compact = false }: ReportCardProps) {
  const categoryColors = CATEGORY_COLORS[report.category.slug] || CATEGORY_COLORS['shi-zheng-yu-guo-ji'];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getExcerpt = (content: string, length: number = 150) => {
    const plainText = content.replace(/[#*\[\]()]/g, '').trim();
    return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
  };

  const getSourceDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '未知来源';
    }
  };

  if (compact) {
    return (
      <Link
        href={`/report?path=${encodeURIComponent(report.path)}`}
        className="group block rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-border/60"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {report.title}
            </h3>
            <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(report.metadata.date)}</span>
              </span>
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: categoryColors.light,
                  color: categoryColors.primary
                }}
              >
                {report.category.display}
              </span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
        </div>
      </Link>
    );
  }

  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-6 transition-all hover:shadow-lg">
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: categoryColors.light,
              color: categoryColors.primary
            }}
          >
            <Tag className="mr-1 h-3 w-3" />
            {report.category.display}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <Link
              href={`/report?path=${encodeURIComponent(report.path)}`}
              className="block"
            >
              <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {report.title}
              </h2>
            </Link>
            <p className="mt-2 text-muted-foreground line-clamp-3">
              {getExcerpt(report.content, 200)}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(report.metadata.date)}</span>
            </span>
            {report.metadata.readTime && (
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{report.metadata.readTime} 分钟阅读</span>
              </span>
            )}
            <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
              {report.metadata.version}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              href={`/report?path=${encodeURIComponent(report.path)}`}
              className="inline-flex items-center space-x-1 text-sm font-medium text-primary hover:underline"
            >
              <span>阅读全文</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            {report.sourceUrl && (
              <a
                href={report.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>{getSourceDomain(report.sourceUrl)}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md hover:border-border/60">
      {/* Category Indicator */}
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ backgroundColor: categoryColors.primary }}
      />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
              style={{
                backgroundColor: categoryColors.light,
                color: categoryColors.primary
              }}
            >
              {report.category.display}
            </span>
            <span className="text-xs text-muted-foreground">
              {report.metadata.version}
            </span>
          </div>

          <Link
            href={`/report?path=${encodeURIComponent(report.path)}`}
            className="block"
          >
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {report.title}
            </h3>
          </Link>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {getExcerpt(report.content)}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(report.metadata.date)}</span>
          </span>
          {report.metadata.readTime && (
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{report.metadata.readTime} 分钟</span>
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Link
            href={`/report?path=${encodeURIComponent(report.path)}`}
            className="inline-flex items-center space-x-1 text-sm font-medium text-primary hover:underline"
          >
            <span>阅读详情</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          {report.sourceUrl && (
            <a
              href={report.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title={`来源: ${getSourceDomain(report.sourceUrl)}`}
            >
              <ExternalLink className="h-3 w-3" />
              <span>原文链接</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}