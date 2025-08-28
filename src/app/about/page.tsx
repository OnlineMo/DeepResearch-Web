'use client';

import React from 'react';
// import Link from 'next/link';
import { 
  Sparkles, 
  Target, 
  Zap, 
  Users, 
  Github, 
  ExternalLink, 
  BookOpen,
  TrendingUp,
  Globe,
  Coffee,
  Heart,
  Star
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={() => {}} todayReportCount={0} />
      
      <main className="container mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">DeepResearch Archive</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              关于项目
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              DeepResearch Archive 是一个开源的AI研究报告展示平台，致力于为用户提供最新、最全面的人工智能发展洞察。
            </p>
          </div>

          {/* 项目简介 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">项目愿景</h2>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">我们的使命</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    通过自动化的内容同步和现代化的展示界面，让AI研究成果更易于访问和理解，
                    促进知识共享与科技进步。
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">核心价值</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>开放透明的知识分享</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>持续跟踪AI发展趋势</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>提供高质量的研究内容</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 功能特性 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">核心特性</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <BookOpen className="h-8 w-8" />,
                  title: "自动同步",
                  description: "实时同步GitHub仓库内容，确保信息时效性",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "智能分类",
                  description: "按照时政、社会、娱乐、行业、旅游等维度分类",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: <Globe className="h-8 w-8" />,
                  title: "响应式设计",
                  description: "完美适配桌面、平板和移动设备",
                  color: "from-purple-500 to-purple-600"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-all">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 技术栈 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">技术架构</h2>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">前端技术</h3>
                  <div className="space-y-2">
                    {[
                      "React 18.3.1",
                      "Next.js 15.5.2", 
                      "TypeScript 5.7.2",
                      "Tailwind CSS 3.4.17"
                    ].map((tech, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-muted-foreground">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">集成服务</h3>
                  <div className="space-y-2">
                    {[
                      "GitHub REST API",
                      "GitHub Actions CI/CD",
                      "GitHub Pages 部署",
                      "Markdown 渲染"
                    ].map((service, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-muted-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 数据来源 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">数据来源</h2>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  本项目的所有研究报告内容均来自于 
                  <a 
                    href="https://github.com/OnlineMo/DeepResearch-Archive" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-primary hover:underline mx-1"
                  >
                    <span>DeepResearch-Archive</span>
                    <ExternalLink className="h-3 w-3" />
                  </a> 
                  仓库，该仓库包含了丰富的AI研究报告和分析文档。
                </p>
                
                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <a
                    href="https://github.com/OnlineMo/DeepResearch-Archive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>访问数据仓库</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <div className="text-sm text-muted-foreground">
                    实时同步 • 自动更新
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 开源信息 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <Github className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">开源项目</h2>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-border rounded-xl p-8">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">欢迎参与贡献</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    这是一个开源项目，我们欢迎社区的贡献和反馈。无论是代码改进、功能建议还是bug报告，都将帮助项目变得更好。
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://github.com/OnlineMo/DeepResearch-Web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>查看源码</span>
                  </a>
                  <a
                    href="https://github.com/OnlineMo/DeepResearch-Web/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 border border-border bg-background px-6 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>提交问题</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 联系信息 */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3">
              <Coffee className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">联系我们</h2>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  如果您有任何问题、建议或想法，欢迎通过以下方式与我们联系：
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Github className="h-4 w-4" />
                    <span>GitHub: OnlineMo</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>项目主页: DeepResearch Archive</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 致谢 */}
          <div className="text-center pt-8 border-t border-border">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>by OnlineMo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                感谢所有为AI研究和开源社区做出贡献的朋友们
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}