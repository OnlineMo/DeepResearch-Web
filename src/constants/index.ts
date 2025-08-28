import { ReportCategory, CategoryColors } from '@/types';

// 报告分类常量
export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    slug: 'shi-zheng-yu-guo-ji',
    display: '时政与国际',
    icon: 'globe',
    description: '国际政治、外交政策、国际关系分析',
    count: 0,
    lastUpdated: new Date()
  },
  {
    slug: 'she-hui-yu-fa-zhi', 
    display: '社会与法治',
    icon: 'scale',
    description: '社会热点、法律法规、民生话题',
    count: 0,
    lastUpdated: new Date()
  },
  {
    slug: 'yu-le-yu-ming-xing',
    display: '娱乐与明星', 
    icon: 'star',
    description: '娱乐资讯、明星动态、文化现象',
    count: 0,
    lastUpdated: new Date()
  },
  {
    slug: 'xing-ye-yu-gong-si',
    display: '行业与公司',
    icon: 'building',
    description: '行业分析、企业动态、商业资讯',
    count: 0,
    lastUpdated: new Date()
  },
  {
    slug: 'lu-you-yu-chu-xing',
    display: '旅游与出行',
    icon: 'plane',
    description: '旅游资讯、交通出行、地方文化',
    count: 0,
    lastUpdated: new Date()
  }
];

// 分类专属色彩系统
export const CATEGORY_COLORS: Record<string, CategoryColors> = {
  'shi-zheng-yu-guo-ji': {
    primary: '#dc2626',   // 红色 - 政治权威
    light: '#fef2f2',
    dark: '#7f1d1d'
  },
  'she-hui-yu-fa-zhi': {
    primary: '#2563eb',   // 蓝色 - 法律正义
    light: '#eff6ff', 
    dark: '#1e3a8a'
  },
  'yu-le-yu-ming-xing': {
    primary: '#7c3aed',   // 紫色 - 娱乐魅力
    light: '#f3e8ff',
    dark: '#581c87'
  },
  'xing-ye-yu-gong-si': {
    primary: '#059669',   // 绿色 - 商业增长
    light: '#ecfdf5',
    dark: '#064e3b'
  },
  'lu-you-yu-chu-xing': {
    primary: '#ea580c',   // 橙色 - 旅行活力
    light: '#fff7ed',
    dark: '#9a3412'
  }
};

// GitHub 仓库配置
export const GITHUB_CONFIG = {
  ARCHIVE_REPO: {
    owner: 'OnlineMo',
    repo: 'DeepResearch-Archive'
  },
  WEB_REPO: {
    owner: 'OnlineMo',
    repo: 'DeepResearch-Web'
  }
};

// API 路径常量
export const API_PATHS = {
  README: 'README.md',
  NAVIGATION: 'NAVIGATION.md',
  PROJECT_OVERVIEW: 'PROJECT_OVERVIEW.md',
  AI_REPORTS: 'AI_Reports'
};

// 缓存配置
export const CACHE_CONFIG = {
  REPORTS_TTL: 30 * 60 * 1000, // 30分钟
  SEARCH_TTL: 10 * 60 * 1000,  // 10分钟
  MAX_CACHE_SIZE: 50 * 1024 * 1024 // 50MB
};

// 搜索配置
export const SEARCH_CONFIG = {
  MAX_RESULTS: 50,
  EXCERPT_LENGTH: 200,
  HIGHLIGHT_CLASS: 'bg-yellow-200 dark:bg-yellow-800'
};

// 分页配置
export const PAGINATION_CONFIG = {
  REPORTS_PER_PAGE: 12,
  MAX_PAGE_BUTTONS: 5
};

// 主题配置
export const THEME_CONFIG = {
  DEFAULT: 'system' as const,
  STORAGE_KEY: 'deepresearch-theme'
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请稍后重试',
  FETCH_ERROR: '获取数据失败，请刷新页面',
  SEARCH_ERROR: '搜索失败，请重新尝试',
  NOT_FOUND: '未找到相关内容'
};