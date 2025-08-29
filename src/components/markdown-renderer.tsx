'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
import { useTheme } from './theme-provider';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 简单规则：将常见的小节标题行标准化为 Markdown 二级标题
function normalizeHeadings(src: string): string {
  const heads = [
    '摘要',
    '背景',
    '深度分析',
    '历史背景',
    '目的与意义',
    '结论与建议',
    '结论',
    '建议'
  ];
  const lines = src.split('\n').map((line) => {
    const trimmed = line.trim();
    for (const h of heads) {
      const re = new RegExp(`^${h}\\s*[:：]?\\s*$`);
      if (re.test(trimmed)) {
        return `## ${h}`;
      }
    }
    return line;
  });
  return lines.join('\n');
}

// 将裸露 URL 自动包成 <url> 让 marked/GFM 识别为链接
function autolinkBareUrls(src: string): string {
  // 避免已在 () 或 <> 或 Markdown 链接中的 URL，再次包裹
  // 简化处理：对非以 '(' '[' '<' 紧邻的裸链接加角括号
  return src.replace(/(?<!\(|\[|<)(https?:\/\/[^\s)>\]]+)/g, '<$1>');
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const { isDark } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);

  // 预处理：增强可读性（保证常见小节有正确的标题语法）+ 将裸露 URL 自动转为链接
  const preprocessed = useMemo(() => {
    const withHeadings = normalizeHeadings(content || '');
    return autolinkBareUrls(withHeadings);
  }, [content]);

  useEffect(() => {
    // 配置 marked（v16 不再支持 headerIds/highlight 等旧字段）
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    // 渲染 Markdown
    const renderMarkdown = async () => {
      try {
        const html = await marked.parse(preprocessed);
        setHtmlContent(html as string);
      } catch (error) {
        console.error('Markdown rendering error:', error);
        setHtmlContent('<p class="text-red-500">内容渲染失败</p>');
      }
    };

    renderMarkdown();
  }, [preprocessed]);

  useEffect(() => {
    // 当主题变化或 HTML 变更时：高亮代码 + 修正链接属性（新开、nofollow）
    if (htmlContent && rootRef.current) {
      // 代码高亮
      const codeBlocks = rootRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });

      // 修正链接：确保点击打开并具备安全属性与可见样式
      const anchors = rootRef.current.querySelectorAll('a[href]');
      anchors.forEach((el) => {
        const a = el as HTMLAnchorElement;
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.style.textDecoration = 'underline';
        a.style.wordBreak = 'break-word';
      });
    }
  }, [htmlContent, isDark]);

  return (
    <div
      ref={rootRef}
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