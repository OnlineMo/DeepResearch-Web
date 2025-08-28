'use client';

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
import { useTheme } from './theme-provider';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const { isDark } = useTheme();

  useEffect(() => {
    // 渲染 Markdown
    const renderMarkdown = async () => {
      try {
        const html = await marked(content);
        setHtmlContent(html);
      } catch (error) {
        console.error('Markdown rendering error:', error);
        setHtmlContent('<p class="text-red-500">内容渲染失败</p>');
      }
    };

    renderMarkdown();
  }, [content]);

  useEffect(() => {
    // 当主题变化时重新高亮代码
    if (htmlContent) {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [htmlContent, isDark]);

  return (
    <div 
      className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        // 自定义 CSS 变量来适应主题
        '--tw-prose-body': 'var(--foreground)',
        '--tw-prose-headings': 'var(--foreground)',
        '--tw-prose-lead': 'var(--muted-foreground)',
        '--tw-prose-links': 'var(--primary)',
        '--tw-prose-bold': 'var(--foreground)',
        '--tw-prose-counters': 'var(--muted-foreground)',
        '--tw-prose-bullets': 'var(--muted-foreground)',
        '--tw-prose-hr': 'var(--border)',
        '--tw-prose-quotes': 'var(--foreground)',
        '--tw-prose-quote-borders': 'var(--primary)',
        '--tw-prose-captions': 'var(--muted-foreground)',
        '--tw-prose-code': 'var(--foreground)',
        '--tw-prose-pre-code': 'var(--foreground)',
        '--tw-prose-pre-bg': 'var(--card)',
        '--tw-prose-th-borders': 'var(--border)',
        '--tw-prose-td-borders': 'var(--border)',
      } as React.CSSProperties}
    />
  );
}