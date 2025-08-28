'use client';

import React from 'react';
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={() => {}} todayReportCount={0} />
      
      <main className="container mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full px-4 py-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">隐私保护</span>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground">
              隐私政策
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              我们致力于保护您的隐私和个人信息安全，本政策说明我们如何收集、使用和保护您的信息。
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* 信息收集 */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">信息收集</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">我们收集的信息类型：</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>访问日志：</strong>包括IP地址、浏览器类型、访问时间等基本信息</li>
                  <li>• <strong>使用数据：</strong>页面浏览量、点击行为、搜索关键词等匿名统计数据</li>
                  <li>• <strong>Cookie信息：</strong>用于改善用户体验的必要技术信息</li>
                  <li>• <strong>反馈信息：</strong>您主动提供的意见建议和联系信息</li>
                </ul>
              </div>
            </section>

            {/* 信息使用 */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">信息使用</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">我们使用收集的信息来：</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 提供、维护和改进我们的服务</li>
                  <li>• 分析网站使用情况以优化用户体验</li>
                  <li>• 发送重要的服务通知和更新</li>
                  <li>• 防止欺诈和滥用行为</li>
                  <li>• 遵守法律法规要求</li>
                </ul>
              </div>
            </section>

            {/* 信息保护 */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">信息保护</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">安全措施：</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 使用HTTPS加密传输保护数据安全</li>
                  <li>• 采用安全的云服务提供商（GitHub Pages）</li>
                  <li>• 定期更新安全配置和依赖项</li>
                  <li>• 最小化数据收集和存储</li>
                  <li>• 不存储敏感个人信息</li>
                </ul>
              </div>
            </section>

            {/* 信息共享 */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">信息共享</h2>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">我们的承诺：</h3>
                <p className="text-muted-foreground">
                  <strong>我们不会</strong>向任何第三方出售、交易或转让您的个人信息。我们仅在以下情况下可能共享信息：
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 获得您的明确同意</li>
                  <li>• 法律要求或法院命令</li>
                  <li>• 保护我们的权利和财产</li>
                  <li>• 紧急情况下保护用户安全</li>
                </ul>
              </div>
            </section>

            {/* Cookie 政策 */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Cookie 使用</h2>
              
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <p className="text-muted-foreground">
                  我们使用Cookie来改善您的浏览体验：
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>必要Cookie：</strong>确保网站正常运行</li>
                  <li>• <strong>偏好Cookie：</strong>记住您的主题设置和语言偏好</li>
                  <li>• <strong>分析Cookie：</strong>帮助我们了解网站使用情况</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  您可以通过浏览器设置控制或禁用Cookie，但这可能影响某些功能的正常使用。
                </p>
              </div>
            </section>

            {/* 您的权利 */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">您的权利</h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
                <p className="text-muted-foreground">
                  根据相关法律法规，您享有以下权利：
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>访问权：</strong>了解我们收集的关于您的信息</li>
                  <li>• <strong>更正权：</strong>要求更正不准确的个人信息</li>
                  <li>• <strong>删除权：</strong>要求删除您的个人信息</li>
                  <li>• <strong>限制权：</strong>限制我们处理您的个人信息</li>
                  <li>• <strong>反对权：</strong>反对我们处理您的个人信息</li>
                </ul>
              </div>
            </section>

            {/* 政策更新 */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">政策更新</h2>
              
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <p className="text-muted-foreground">
                  我们可能会不时更新此隐私政策。重要更改时，我们会通过以下方式通知您：
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 在网站显著位置发布通知</li>
                  <li>• 更新本页面的&ldquo;最后更新日期&rdquo;</li>
                  <li>• 通过邮件通知（如适用）</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  建议您定期查看此政策以了解最新信息。
                </p>
              </div>
            </section>

            {/* 联系我们 */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">联系我们</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-border rounded-lg p-6 space-y-4">
                <p className="text-muted-foreground">
                  如果您对此隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>• GitHub Issues: <a href="https://github.com/OnlineMo/DeepResearch-Web/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">提交问题</a></p>
                  <p>• 项目仓库: <a href="https://github.com/OnlineMo/DeepResearch-Web" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DeepResearch-Web</a></p>
                  <p>• 开发者: OnlineMo</p>
                </div>
              </div>
            </section>

            {/* 最后更新 */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                最后更新时间：2025年1月28日
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}