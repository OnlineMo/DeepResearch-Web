# DeepResearch Web

🤖 **AI 研究报告展示平台** - 自动抓取和展示 DeepResearch Archive 的研究报告

## 📖 项目简介

DeepResearch Web 是一个基于 Next.js 的现代化 Web 应用，专门用于展示和管理 AI 研究报告。本项目自动同步 [DeepResearch-Archive](https://github.com/OnlineMo/DeepResearch-Archive) 仓库的内容，并通过美观的界面为用户提供优质的阅读体验。

## ✨ 主要功能

- 🔄 **自动同步** - 通过 GitHub API 自动获取最新报告
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌓 **主题切换** - 支持明暗主题自动切换
- 🔍 **智能搜索** - 全文搜索和高级筛选功能
- 📂 **分类浏览** - 5大分类：时政国际、社会法治、娱乐明星、行业公司、旅游出行
- 📝 **Markdown 渲染** - 支持代码高亮和自定义样式
- 🚀 **静态部署** - 支持 GitHub Pages 自动部署

## 🛠 技术栈

- **框架**: Next.js 15.5.2 + React 18.3.1
- **语言**: TypeScript 5.7.2
- **样式**: Tailwind CSS 4.0
- **渲染**: Marked + Highlight.js
- **图标**: Lucide React
- **API**: GitHub REST API (@octokit/rest)
- **部署**: GitHub Pages + GitHub Actions

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/OnlineMo/DeepResearch-Web.git
cd DeepResearch-Web

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm run start
```

项目启动后访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
src/
├── app/                 # Next.js App Router 页面
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 首页
│   └── globals.css     # 全局样式
├── components/          # React 组件
│   ├── header.tsx      # 导航栏
│   ├── sidebar.tsx     # 侧边栏
│   ├── footer.tsx      # 页脚
│   ├── report-card.tsx # 报告卡片
│   └── theme-provider.tsx # 主题提供者
├── lib/                # 工具库
│   ├── github.ts       # GitHub API 服务
│   └── search.ts       # 搜索服务
├── types/              # TypeScript 类型定义
└── constants/          # 常量配置
```

## 🔧 配置说明

### GitHub API 配置

项目使用 GitHub API 获取报告内容。如需提高请求限制，可配置 GitHub Token：

```bash
# 创建 .env.local 文件
GITHUB_TOKEN=your_github_token_here
```

#### 获取 GitHub Token

1. 访问 [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 选择 "Fine-grained tokens" 或 "Classic token"
4. 对于 Fine-grained tokens:
   - 设置token名称
   - 选择资源所有者(OnlineMo)
   - 选择仓库(DeepResearch-Archive)
   - 在权限部分选择 "Contents" 并设置为 "Read"
5. 点击 "Generate token"
6. 复制生成的token并添加到 `.env.local` 文件中

#### API 速率限制

- 未认证请求: 每小时60次
- 认证请求: 每小时5000次

建议在生产环境中配置GitHub token以避免速率限制问题。

### 部署配置

项目已配置 GitHub Actions 自动部署。推送到 `main` 分支时会自动构建并部署到 GitHub Pages。

## 🎨 设计特色

- **现代化 UI** - 基于 Tailwind CSS 的组件化设计
- **类型安全** - 完整的 TypeScript 类型系统
- **性能优化** - 静态生成 + 智能缓存
- **用户体验** - 流畅的动画和交互效果

## 📖 相关项目

- [DeepResearch-Archive](https://github.com/OnlineMo/DeepResearch-Archive) - AI 研究报告存储仓库

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

⭐ 如果这个项目对您有帮助，请给个 Star！

