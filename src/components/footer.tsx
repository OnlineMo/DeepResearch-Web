'use client';

import React from 'react';
import Link from 'next/link';
import { Github, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-lg font-bold text-white">DR</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">DeepResearch</h3>
                <p className="text-xs text-muted-foreground">AI研究报告</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              提供最新的AI研究报告，帮助您洞察科技发展趋势。
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">导航</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  分类浏览
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  时间线
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  搜索
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">分类</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/shi-zheng-yu-guo-ji"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  时政与国际
                </Link>
              </li>
              <li>
                <Link
                  href="/category/she-hui-yu-fa-zhi"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  社会与法治
                </Link>
              </li>
              <li>
                <Link
                  href="/category/yu-le-yu-ming-xing"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  娱乐与明星
                </Link>
              </li>
              <li>
                <Link
                  href="/category/xing-ye-yu-gong-si"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  行业与公司
                </Link>
              </li>
              <li>
                <Link
                  href="/category/lu-you-yu-chu-xing"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  旅游与出行
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">资源</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/OnlineMo/DeepResearch-Archive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3 w-3" />
                  <span>Archive 仓库</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/OnlineMo/DeepResearch-Web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3 w-3" />
                  <span>Web 仓库</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  关于项目
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-border pt-6 md:flex-row">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>© {currentYear} DeepResearch. Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by OnlineMo</span>
          </div>
          
          <div className="mt-4 flex items-center space-x-4 md:mt-0">
            <span className="text-xs text-muted-foreground">
              Powered by Next.js & GitHub Pages
            </span>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">
                实时同步
              </span>
            </div>
          </div>
        </div>

        {/* Update Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            最后更新: {new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })} | 
            数据来源: <a 
              href="https://github.com/OnlineMo/DeepResearch-Archive"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              DeepResearch Archive
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}