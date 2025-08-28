# DeepResearch Web 部署指南

## 🚀 快速部署步骤

### 第一步：创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - Repository name: `DeepResearch-Web`
   - Description: `AI研究报告展示平台`
   - 设置为 **Public**
   - ❌ **不要**勾选 "Add a README file"
   - ❌ **不要**勾选 "Add .gitignore"
   - ❌ **不要**勾选 "Choose a license"
4. 点击 "Create repository"

### 第二步：推送代码到 GitHub

**方法一：使用我们提供的脚本（推荐）**

Windows 用户：
```bash
# 在 deepresearch-web 目录下运行
./push-to-github.bat
```

Mac/Linux 用户：
```bash
# 在 deepresearch-web 目录下运行
chmod +x push-to-github.sh
./push-to-github.sh
```

**方法二：手动执行命令**

```bash
# 替换 YOUR_USERNAME 为您的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/DeepResearch-Web.git
git branch -M main
git push -u origin main
```

### 第三步：配置 GitHub Pages

1. 推送完成后，访问您的仓库
2. 点击 "Settings" 标签页
3. 在左侧菜单找到 "Pages"
4. 在 "Source" 部分选择 "GitHub Actions"
5. 点击 "Save"

### 第四步：等待自动部署

- 推送代码后会自动触发 GitHub Actions
- 在 "Actions" 标签页可以查看部署进度
- 部署完成后，网站将在以下地址可访问：
  `https://YOUR_USERNAME.github.io/DeepResearch-Web`

## 🔧 高级配置

### 环境变量配置（可选）

如果需要提高 GitHub API 请求限制，可以配置 GitHub Token：

1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 生成新的 token，勾选 `public_repo` 权限
3. 在仓库 Settings → Secrets and variables → Actions 中添加：
   - Name: `GITHUB_TOKEN`
   - Value: 您的 token

### 自定义域名（可选）

1. 在仓库根目录添加 `CNAME` 文件
2. 文件内容为您的域名（如 `deepresearch.example.com`）
3. 在域名 DNS 设置中添加 CNAME 记录指向 `YOUR_USERNAME.github.io`

## 📊 验证部署

部署成功后，您的网站应该包含：

- ✅ 响应式首页，支持明暗主题切换
- ✅ 5 大分类展示：时政国际、社会法治、娱乐明星、行业公司、旅游出行
- ✅ 今日报告展示区域
- ✅ 搜索和筛选功能
- ✅ 完整的导航和页脚

## 🔍 故障排除

### 常见问题

1. **推送失败 "remote: Repository not found"**
   - 检查仓库名是否正确
   - 确认仓库设置为 Public
   - 检查 GitHub 用户名拼写

2. **GitHub Actions 部署失败**
   - 检查 Actions 标签页的错误日志
   - 确认仓库设置为 Public
   - 检查 Pages 设置是否选择了 "GitHub Actions"

3. **网站无法访问**
   - 等待 5-10 分钟，GitHub Pages 可能需要时间生效
   - 检查 GitHub Pages 设置页面的状态
   - 确认 URL 格式：`https://用户名.github.io/DeepResearch-Web`

4. **样式显示异常**
   - 这是正常的，因为我们使用了模拟数据
   - 网站已准备好，一旦连接到真实的 DeepResearch-Archive 数据就会正常显示

## 🎉 完成

恭喜！您已经成功部署了 DeepResearch Web 项目。

项目特色：
- 🎨 现代化 UI 设计
- 📱 完全响应式布局
- 🌙 明暗主题自动切换
- 🔍 强大的搜索功能
- 🚀 自动化部署流程
- 📊 5 大分类智能展示

需要帮助？请查看项目 README.md 或提交 Issue。