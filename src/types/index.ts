// 研究报告数据模型
export interface ResearchReport {
  id: string;
  path: string;
  title: string;
  content: string;
  metadata: ReportMetadata;
  category: ReportCategory;
  lastModified: Date;
  sourceUrl: string;
  slug: string;
}

// 报告元数据
export interface ReportMetadata {
  date: string;           // 2025-08-28
  edition: string;        // v1, v2, etc.
  version: string;        // 头版（v1）
  category_slug: string;  // shi-zheng-yu-guo-ji
  category_display: string; // 时政与国际
  source: string;         // 来源链接
  readTime?: number;      // 估算阅读时间
}

// 报告分类
export interface ReportCategory {
  slug: string;           // shi-zheng-yu-guo-ji
  display: string;        // 时政与国际
  icon: string;           // 分类图标
  description: string;    // 分类描述
  count: number;          // 报告数量
  lastUpdated: Date;      // 最后更新时间
}

// GitHub API 相关类型
export interface RepositoryItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size: number;
  download_url: string | null;
}

// 今日报告响应
export interface TodayReportsResponse {
  date: string;
  rawContent: string;
  reports: TodayReport[];
}

// 今日报告项
export interface TodayReport {
  title: string;
  date: string;
  path: string;
  version: string;
  sourceUrl: string;
  category: string;
}

// 导航响应
export interface NavigationResponse {
  rawContent: string;
  categories: CategorySection[];
}

// 分类章节
export interface CategorySection {
  name: string;
  slug: string;
  reports: NavigationReport[];
}

// 导航报告项
export interface NavigationReport {
  title: string;
  date: string;
  path: string;
  version: string;
  sourceUrl: string;
}

// 报告文件
export interface ReportFile {
  name: string;
  path: string;
  content: string;
  sha: string;
}

// 报告内容
export interface ReportContent {
  raw: string;
  metadata: ReportMetadata;
  content: string;
  title: string;
}

// 搜索相关类型
export interface SearchOptions {
  categories?: string[];
  dateRange?: DateRange;
  versions?: string[];
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'title';
}

export interface SearchResult {
  report: ResearchReport;
  score: number;
  matches: SearchMatch[];
  highlightedTitle: string;
  excerpt: string;
}

export interface SearchMatch {
  content: string;
  startIndex: number;
  endIndex: number;
  type: 'title' | 'content' | 'metadata';
}

export interface SearchSuggestion {
  text: string;
  category?: string;
  count: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// 更新检查相关
export interface UpdateStatus {
  hasUpdates: boolean;
  lastUpdateTime: Date;
  changedFiles: ChangedFile[];
  newReports: string[];
  updatedReports: string[];
}

export interface ChangedFile {
  path: string;
  status: 'added' | 'modified' | 'removed';
  sha: string;
}

// 缓存统计
export interface CacheStats {
  totalSize: number;
  reportCount: number;
  searchResultCount: number;
  hitRate: number;
  lastCleanup: Date;
}

// 分类颜色系统
export interface CategoryColors {
  primary: string;
  light: string;
  dark: string;
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 页面属性
export interface PageProps {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}