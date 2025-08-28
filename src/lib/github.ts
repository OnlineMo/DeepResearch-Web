import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';
import {
  RepositoryItem,
  TodayReportsResponse,
  NavigationResponse,
  ReportFile,
  ReportContent,
  TodayReport,
  CategorySection,
  NavigationReport,
  UpdateStatus,
  ReportMetadata
} from '@/types';
import { GITHUB_CONFIG, API_PATHS } from '@/constants';

class GitHubService {
  private octokit: Octokit;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });
  }

  // 通用缓存方法
  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // 获取仓库根目录内容
  async getRepositoryRoot(): Promise<RepositoryItem[]> {
    const cacheKey = 'repo-root';
    const cached = this.getCached<RepositoryItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        path: '',
      });

      const items = Array.isArray(response.data) ? response.data : [response.data];
      const result = items.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type as 'file' | 'dir',
        sha: item.sha,
        size: item.size || 0,
        download_url: item.download_url,
      }));

      this.setCache(cacheKey, result);
      return result;
    } catch (error: unknown) {
      console.error('Error fetching repository root:', error);
      // 提供更详细的错误信息
      if (typeof error === 'object' && error !== null && 'status' in error) {
        const err = error as { status: number; message?: string };
        if (err.status === 403) {
          throw new Error('API速率限制 exceeded. 请配置GITHUB_TOKEN以提高限制。');
        } else if (err.status === 404) {
          throw new Error('仓库未找到。请检查仓库配置。');
        }
      }
      throw new Error(`获取仓库内容失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 获取今日报告 (README.md)
  async getTodayReports(): Promise<TodayReportsResponse> {
    const cacheKey = 'today-reports';
    const cached = this.getCached<TodayReportsResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        path: API_PATHS.README,
      });

      if (Array.isArray(response.data) || response.data.type !== 'file') {
        throw new Error('README.md is not a file');
      }

      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const reports = this.parseReadmeReports(content);
      
      const result: TodayReportsResponse = {
        date: new Date().toISOString().split('T')[0],
        rawContent: content,
        reports
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching today reports:', error);
      throw new Error('获取今日报告失败');
    }
  }

  // 解析README中的报告信息
  private parseReadmeReports(content: string): TodayReport[] {
    const reports: TodayReport[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      // 匹配报告链接格式: [标题](路径)
      const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [, title, path] = match;
        
        // 从路径中提取信息
        const pathParts = path.split('/');
        if (pathParts.length >= 3 && pathParts[0] === 'AI_Reports') {
          const category = pathParts[1];
          const filename = pathParts[2];
          
          // 解析文件名: title-date--version.md
          const filenameMatch = filename.match(/^(.+)-(\d{4}-\d{2}-\d{2})--(.+)\.md$/);
          if (filenameMatch) {
            const [, , date, version] = filenameMatch;
            
            reports.push({
              title,
              date,
              path,
              version,
              sourceUrl: this.extractSourceUrl(title, content),
              category
            });
          }
        }
      }
    }
    
    return reports;
  }

  // 从内容中提取来源链接
  private extractSourceUrl(title: string, content: string): string {
    // 这里可以根据实际格式调整解析逻辑
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(title)) {
        // 查找后续几行中的URL
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          const urlMatch = lines[j].match(/https?:\/\/[^\s\)]+/);
          if (urlMatch) {
            return urlMatch[0];
          }
        }
      }
    }
    return '';
  }

  // 获取完整导航 (NAVIGATION.md)
  async getNavigationData(): Promise<NavigationResponse> {
    const cacheKey = 'navigation-data';
    const cached = this.getCached<NavigationResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        path: API_PATHS.NAVIGATION,
      });

      if (Array.isArray(response.data) || response.data.type !== 'file') {
        throw new Error('NAVIGATION.md is not a file');
      }

      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const categories = this.parseNavigationData(content);
      
      const result: NavigationResponse = {
        rawContent: content,
        categories
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      throw new Error('获取导航数据失败');
    }
  }

  // 解析导航数据
  private parseNavigationData(content: string): CategorySection[] {
    const categories: CategorySection[] = [];
    const lines = content.split('\n');
    let currentCategory: CategorySection | null = null;
    
    for (const line of lines) {
      // 匹配分类标题
      const categoryMatch = line.match(/^##\s+(.+)/);
      if (categoryMatch) {
        if (currentCategory) {
          categories.push(currentCategory);
        }
        currentCategory = {
          name: categoryMatch[1],
          slug: this.getCategorySlug(categoryMatch[1]),
          reports: []
        };
        continue;
      }
      
      // 匹配报告链接
      if (currentCategory) {
        const reportMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (reportMatch) {
          const [, title, path] = reportMatch;
          const report = this.parseReportFromPath(title, path);
          if (report) {
            currentCategory.reports.push(report);
          }
        }
      }
    }
    
    if (currentCategory) {
      categories.push(currentCategory);
    }
    
    return categories;
  }

  // 从路径解析报告信息
  private parseReportFromPath(title: string, path: string): NavigationReport | null {
    const pathParts = path.split('/');
    if (pathParts.length < 3) return null;
    
    const filename = pathParts[pathParts.length - 1];
    const filenameMatch = filename.match(/^(.+)-(\d{4}-\d{2}-\d{2})--(.+)\.md$/);
    
    if (filenameMatch) {
      const [, , date, version] = filenameMatch;
      return {
        title,
        date,
        path,
        version,
        sourceUrl: '' // 这里需要从报告内容中获取
      };
    }
    
    return null;
  }

  // 获取分类slug
  private getCategorySlug(categoryName: string): string {
    const slugMap: Record<string, string> = {
      '时政与国际': 'shi-zheng-yu-guo-ji',
      '社会与法治': 'she-hui-yu-fa-zhi',
      '娱乐与明星': 'yu-le-yu-ming-xing',
      '行业与公司': 'xing-ye-yu-gong-si',
      '旅游与出行': 'lu-you-yu-chu-xing'
    };
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  }

  // 获取分类下的所有报告
  async getCategoryReports(categorySlug: string): Promise<ReportFile[]> {
    const cacheKey = `category-${categorySlug}`;
    const cached = this.getCached<ReportFile[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        path: `${API_PATHS.AI_REPORTS}/${categorySlug}`,
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Category path is not a directory');
      }

      const reports: ReportFile[] = [];
      for (const item of response.data) {
        if (item.type === 'file' && item.name.endsWith('.md')) {
          const content = await this.getFileContent(item.path);
          reports.push({
            name: item.name,
            path: item.path,
            content,
            sha: item.sha
          });
        }
      }

      this.setCache(cacheKey, reports);
      return reports;
    } catch (error) {
      console.error('Error fetching category reports:', error);
      throw new Error(`获取分类 ${categorySlug} 的报告失败`);
    }
  }

  // 获取单个报告内容
  async getReportContent(path: string): Promise<ReportContent> {
    const cacheKey = `report-${path}`;
    const cached = this.getCached<ReportContent>(cacheKey);
    if (cached) return cached;

    try {
      const content = await this.getFileContent(path);
      const parsed = matter(content);
      
      const result: ReportContent = {
        raw: content,
        metadata: this.parseReportMetadata(path, parsed.data),
        content: parsed.content,
        title: this.extractTitleFromPath(path)
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Error fetching report content for path ${path}:`, error);
      // 返回默认的报告内容而不是抛出错误
      return {
        raw: '',
        metadata: {
          date: '',
          edition: '',
          version: '',
          category_slug: this.extractCategoryFromPath(path),
          category_display: this.getCategoryDisplay(this.extractCategoryFromPath(path)),
          source: '',
          readTime: 0
        },
        content: '# 报告未找到\n\n抱歉，您请求的报告不存在或暂时无法访问。',
        title: '报告未找到'
      };
    }
  }

  // 获取文件内容
  private async getFileContent(path: string): Promise<string> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        path,
      });

      if (Array.isArray(response.data) || response.data.type !== 'file') {
        throw new Error(`${path} is not a file`);
      }

      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } catch (error: unknown) {
      console.error(`Error fetching file content for path ${path}:`, error);
      // 如果是404错误，提供更具体的错误信息
      if (typeof error === 'object' && error !== null && 'status' in error && (error as { status: number }).status === 404) {
        throw new Error(`File not found: ${path}`);
      }
      throw error;
    }
  }

  // 解析报告元数据
  private parseReportMetadata(path: string, frontmatter: Record<string, unknown>): ReportMetadata {
    const pathParts = path.split('/');
    const filename = pathParts[pathParts.length - 1];
    const categorySlug = pathParts[pathParts.length - 2];
    
    // 从文件名解析信息
    const filenameMatch = filename.match(/^(.+)-(\d{4}-\d{2}-\d{2})--(.+)\.md$/);
    
    return {
      date: filenameMatch?.[2] || '',
      edition: filenameMatch?.[3] || '',
      version: filenameMatch?.[3] || '',
      category_slug: categorySlug,
      category_display: this.getCategoryDisplay(categorySlug),
      source: (frontmatter.source as string) || '',
      readTime: frontmatter.readTime as number || this.estimateReadTime((frontmatter.content as string) || '')
    };
  }

  // 获取分类显示名称
  private getCategoryDisplay(slug: string): string {
    const displayMap: Record<string, string> = {
      'shi-zheng-yu-guo-ji': '时政与国际',
      'she-hui-yu-fa-zhi': '社会与法治',
      'yu-le-yu-ming-xing': '娱乐与明星',
      'xing-ye-yu-gong-si': '行业与公司',
      'lu-you-yu-chu-xing': '旅游与出行'
    };
    return displayMap[slug] || slug;
  }

  // 从路径提取分类
  private extractCategoryFromPath(path: string): string {
    const pathParts = path.split('/');
    return pathParts[pathParts.length - 2] || '';
  }

  // 从路径提取标题
  private extractTitleFromPath(path: string): string {
    const filename = path.split('/').pop() || '';
    const match = filename.match(/^(.+)-\d{4}-\d{2}-\d{2}--(.+)\.md$/);
    return match?.[1] || filename.replace('.md', '');
  }

  // 估算阅读时间
  private estimateReadTime(content: string): number {
    const wordsPerMinute = 200; // 中文约200字/分钟
    const wordCount = content.length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // 批量获取报告
  async getBatchReports(paths: string[]): Promise<Map<string, ReportContent>> {
    const results = new Map<string, ReportContent>();
    
    // 并发获取所有报告
    const promises = paths.map(async (path) => {
      try {
        const content = await this.getReportContent(path);
        results.set(path, content);
      } catch (error) {
        console.error(`Error fetching report ${path}:`, error);
      }
    });

    await Promise.all(promises);
    return results;
  }

  // 检查更新
  async checkForUpdates(): Promise<UpdateStatus> {
    try {
      const response = await this.octokit.rest.repos.listCommits({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        per_page: 1
      });

      const latestCommit = response.data[0];
      const lastUpdateTime = new Date(latestCommit.commit.committer?.date || Date.now());

      // 这里可以实现更复杂的更新检查逻辑
      return {
        hasUpdates: true, // 简化实现
        lastUpdateTime,
        changedFiles: [],
        newReports: [],
        updatedReports: []
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      throw new Error('检查更新失败');
    }
  }

  // 获取Reports.md文件内容
  async getCategoryReportsIndex(categorySlug: string): Promise<string> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        path: `AI_Reports/${categorySlug}/Reports.md`,
      });

      if (Array.isArray(response.data) || response.data.type !== 'file') {
        throw new Error('Reports.md is not a file');
      }

      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } catch (error) {
      console.error(`Error fetching Reports.md for category ${categorySlug}:`, error);
      // 返回默认的Reports.md内容
      return `# ${this.getCategoryDisplay(categorySlug)} Reports

## 报告总数：0

暂无报告。
`;
    }
  }

  // 解析Reports.md文件内容，提取报告列表
  parseCategoryReports(content: string, categorySlug: string): ReportFile[] {
    const reports: ReportFile[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      // 匹配报告链接格式: - [标题](路径) - 日期 (版本) [来源](链接)
      // 注意前面有 "- " 前缀
      // 改进的正则表达式，更灵活地匹配路径
      const match = line.match(/-\s*\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [, title, path] = match;
        
        // 确保路径是正确的完整路径
        let fullPath = path;
        // 如果路径已经以 AI_Reports/ 开头，则认为它是完整路径，直接使用
        if (path.startsWith('AI_Reports/')) {
          fullPath = path;
        }
        // 如果路径包含当前分类名称，则认为它是完整路径，直接使用
        else if (path.includes(categorySlug)) {
          fullPath = path;
        }
        // 否则，认为它是相对路径，添加前缀
        else {
          fullPath = `AI_Reports/${categorySlug}/${path}`;
        }
        
        reports.push({
          name: title,
          path: fullPath,
          content: '', // 内容需要单独获取
          sha: '' // SHA需要单独获取
        });
      }
    }
    
    // 使用categorySlug参数以避免ESLint警告
    console.log(`Parsed ${reports.length} reports for category: ${categorySlug}`);
    
    return reports;
  }

  // 获取最后的commit SHA
  async getLastCommitSha(): Promise<string> {
    try {
      const response = await this.octokit.rest.repos.listCommits({
        owner: GITHUB_CONFIG.ARCHIVE_REPO.owner,
        repo: GITHUB_CONFIG.ARCHIVE_REPO.repo,
        per_page: 1
      });

      return response.data[0].sha;
    } catch (error) {
      console.error('Error getting last commit SHA:', error);
      throw new Error('获取最新提交失败');
    }
  }
}

// 导出单例实例
export const githubService = new GitHubService();
export default GitHubService;