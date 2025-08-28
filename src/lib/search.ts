import {
  ResearchReport,
  SearchOptions,
  SearchResult,
  SearchMatch,
  SearchSuggestion,
  DateRange
} from '@/types';
import { SEARCH_CONFIG } from '@/constants';

interface SearchIndex {
  reports: Map<string, ResearchReport>;
  titleIndex: Map<string, Set<string>>;
  contentIndex: Map<string, Set<string>>;
  categoryIndex: Map<string, Set<string>>;
  dateIndex: Map<string, Set<string>>;
}

class SearchService {
  private index: SearchIndex;
  private cache: Map<string, SearchResult[]> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10分钟缓存

  constructor() {
    this.index = {
      reports: new Map(),
      titleIndex: new Map(),
      contentIndex: new Map(),
      categoryIndex: new Map(),
      dateIndex: new Map()
    };
  }

  // 构建搜索索引
  buildSearchIndex(reports: ResearchReport[]): void {
    console.log(`Building search index for ${reports.length} reports...`);
    
    // 清空现有索引
    this.clearIndex();

    for (const report of reports) {
      this.addReportToIndex(report);
    }

    console.log('Search index built successfully');
  }

  // 添加报告到索引
  private addReportToIndex(report: ResearchReport): void {
    this.index.reports.set(report.id, report);

    // 索引标题
    this.indexText(report.title, report.id, this.index.titleIndex);
    
    // 索引内容
    this.indexText(report.content, report.id, this.index.contentIndex);
    
    // 索引分类
    this.addToIndex(report.category.display, report.id, this.index.categoryIndex);
    this.addToIndex(report.category.slug, report.id, this.index.categoryIndex);
    
    // 索引日期
    this.addToIndex(report.metadata.date, report.id, this.index.dateIndex);
  }

  // 索引文本内容
  private indexText(text: string, reportId: string, index: Map<string, Set<string>>): void {
    // 分词处理（简化版本）
    const words = this.tokenize(text);
    
    for (const word of words) {
      this.addToIndex(word, reportId, index);
    }
  }

  // 简单分词处理
  private tokenize(text: string): string[] {
    // 移除标点符号，按空格和中文字符分割
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1); // 过滤单字符
  }

  // 添加到索引
  private addToIndex(key: string, value: string, index: Map<string, Set<string>>): void {
    if (!index.has(key)) {
      index.set(key, new Set());
    }
    index.get(key)!.add(value);
  }

  // 清空索引
  private clearIndex(): void {
    this.index.reports.clear();
    this.index.titleIndex.clear();
    this.index.contentIndex.clear();
    this.index.categoryIndex.clear();
    this.index.dateIndex.clear();
    this.cache.clear();
  }

  // 搜索报告
  async searchReports(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const cacheKey = this.getCacheKey(query, options);
    const cached = this.getCachedResults(cacheKey);
    if (cached) {
      return cached;
    }

    const results = this.performSearch(query, options);
    this.setCachedResults(cacheKey, results);
    
    return results;
  }

  // 执行搜索
  private performSearch(query: string, options: SearchOptions): SearchResult[] {
    const searchTerms = this.tokenize(query);
    if (searchTerms.length === 0) {
      return [];
    }

    // 获取候选报告ID
    const candidateIds = this.getCandidateReports(searchTerms, options);
    
    // 计算相关性分数
    const results: SearchResult[] = [];
    for (const reportId of candidateIds) {
      const report = this.index.reports.get(reportId);
      if (!report) continue;

      const matches = this.findMatches(query, report);
      const score = this.calculateRelevanceScore(searchTerms, report, matches);
      
      if (score > 0) {
        results.push({
          report,
          score,
          matches,
          highlightedTitle: this.highlightText(report.title, searchTerms),
          excerpt: this.generateExcerpt(report.content, searchTerms)
        });
      }
    }

    // 排序和限制结果数量
    return this.sortAndLimitResults(results, options);
  }

  // 获取候选报告
  private getCandidateReports(searchTerms: string[], options: SearchOptions): Set<string> {
    const candidates = new Set<string>();

    // 从标题索引搜索
    for (const term of searchTerms) {
      const titleMatches = this.index.titleIndex.get(term) || new Set();
      titleMatches.forEach(id => candidates.add(id));
    }

    // 从内容索引搜索
    for (const term of searchTerms) {
      const contentMatches = this.index.contentIndex.get(term) || new Set();
      contentMatches.forEach(id => candidates.add(id));
    }

    // 应用分类过滤
    if (options.categories && options.categories.length > 0) {
      const filteredCandidates = new Set<string>();
      for (const category of options.categories) {
        const categoryMatches = this.index.categoryIndex.get(category) || new Set();
        categoryMatches.forEach(id => {
          if (candidates.has(id)) {
            filteredCandidates.add(id);
          }
        });
      }
      return filteredCandidates;
    }

    // 应用日期过滤
    if (options.dateRange) {
      return this.filterByDateRange(candidates, options.dateRange);
    }

    return candidates;
  }

  // 按日期范围过滤
  private filterByDateRange(candidates: Set<string>, dateRange: DateRange): Set<string> {
    const filtered = new Set<string>();
    
    for (const reportId of candidates) {
      const report = this.index.reports.get(reportId);
      if (!report) continue;

      const reportDate = new Date(report.metadata.date);
      if (reportDate >= dateRange.start && reportDate <= dateRange.end) {
        filtered.add(reportId);
      }
    }

    return filtered;
  }

  // 查找匹配项
  private findMatches(query: string, report: ResearchReport): SearchMatch[] {
    const matches: SearchMatch[] = [];
    const searchTerms = this.tokenize(query);

    // 在标题中查找匹配
    for (const term of searchTerms) {
      const titleMatches = this.findTermInText(term, report.title, 'title');
      matches.push(...titleMatches);
    }

    // 在内容中查找匹配
    for (const term of searchTerms) {
      const contentMatches = this.findTermInText(term, report.content, 'content');
      matches.push(...contentMatches.slice(0, 3)); // 限制内容匹配数量
    }

    return matches;
  }

  // 在文本中查找词汇
  private findTermInText(term: string, text: string, type: 'title' | 'content' | 'metadata'): SearchMatch[] {
    const matches: SearchMatch[] = [];
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    
    let index = lowerText.indexOf(lowerTerm);
    while (index !== -1) {
      const startIndex = Math.max(0, index - 50);
      const endIndex = Math.min(text.length, index + term.length + 50);
      
      matches.push({
        content: text.substring(startIndex, endIndex),
        startIndex: index,
        endIndex: index + term.length,
        type
      });

      index = lowerText.indexOf(lowerTerm, index + 1);
      
      // 限制匹配数量
      if (matches.length >= 5) break;
    }

    return matches;
  }

  // 计算相关性分数
  private calculateRelevanceScore(searchTerms: string[], report: ResearchReport, matches: SearchMatch[]): number {
    let score = 0;

    // 标题匹配权重更高
    const titleMatches = matches.filter(m => m.type === 'title');
    score += titleMatches.length * 10;

    // 内容匹配
    const contentMatches = matches.filter(m => m.type === 'content');
    score += contentMatches.length * 2;

    // 完全匹配加分
    const titleLower = report.title.toLowerCase();
    const contentLower = report.content.toLowerCase();
    
    for (const term of searchTerms) {
      if (titleLower.includes(term.toLowerCase())) {
        score += 5;
      }
      if (contentLower.includes(term.toLowerCase())) {
        score += 1;
      }
    }

    // 新报告略微加分
    const reportDate = new Date(report.metadata.date);
    const daysSinceReport = (Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceReport < 7) {
      score += 2;
    }

    return score;
  }

  // 高亮文本
  private highlightText(text: string, searchTerms: string[]): string {
    let highlighted = text;
    
    for (const term of searchTerms) {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, `<mark class="${SEARCH_CONFIG.HIGHLIGHT_CLASS}">$1</mark>`);
    }

    return highlighted;
  }

  // 生成摘要
  private generateExcerpt(content: string, searchTerms: string[]): string {
    // 找到第一个匹配词汇的位置
    const lowerContent = content.toLowerCase();
    let bestPosition = 0;
    
    for (const term of searchTerms) {
      const position = lowerContent.indexOf(term.toLowerCase());
      if (position !== -1) {
        bestPosition = position;
        break;
      }
    }

    // 以匹配位置为中心生成摘要
    const start = Math.max(0, bestPosition - SEARCH_CONFIG.EXCERPT_LENGTH / 2);
    const end = Math.min(content.length, start + SEARCH_CONFIG.EXCERPT_LENGTH);
    
    let excerpt = content.substring(start, end);
    
    // 添加省略号
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    // 高亮搜索词
    return this.highlightText(excerpt, searchTerms);
  }

  // 排序和限制结果
  private sortAndLimitResults(results: SearchResult[], options: SearchOptions): SearchResult[] {
    // 排序
    const sortBy = options.sortBy || 'relevance';
    results.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.report.metadata.date).getTime() - new Date(a.report.metadata.date).getTime();
        case 'title':
          return a.report.title.localeCompare(b.report.title);
        case 'relevance':
        default:
          return b.score - a.score;
      }
    });

    // 限制数量
    const limit = Math.min(options.limit || SEARCH_CONFIG.MAX_RESULTS, SEARCH_CONFIG.MAX_RESULTS);
    return results.slice(0, limit);
  }

  // 获取搜索建议
  async getSuggestions(input: string): Promise<SearchSuggestion[]> {
    if (input.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];
    const inputLower = input.toLowerCase();

    // 从标题索引中查找建议
    for (const [word, reportIds] of this.index.titleIndex) {
      if (word.includes(inputLower)) {
        suggestions.push({
          text: word,
          count: reportIds.size
        });
      }
    }

    // 按匹配数量排序
    suggestions.sort((a, b) => b.count - a.count);
    
    return suggestions.slice(0, 10);
  }

  // 获取热门搜索
  async getTrendingSearches(): Promise<string[]> {
    // 这里可以基于实际使用数据实现
    // 目前返回一些常见的搜索词
    return [
      '国际政治',
      '经济分析',
      '社会热点',
      '科技发展',
      '文化现象'
    ];
  }

  // 更新搜索索引
  updateSearchIndex(newReports: ResearchReport[]): void {
    for (const report of newReports) {
      this.addReportToIndex(report);
    }
    this.cache.clear(); // 清空搜索缓存
  }

  // 缓存相关方法
  private getCacheKey(query: string, options: SearchOptions): string {
    return JSON.stringify({ query, options });
  }

  private getCachedResults(key: string): SearchResult[] | null {
    const cached = this.cache.get(key);
    return cached || null;
  }

  private setCachedResults(key: string, results: SearchResult[]): void {
    this.cache.set(key, results);
    
    // 清理过期缓存
    setTimeout(() => {
      this.cache.delete(key);
    }, this.CACHE_TTL);
  }
}

// 导出单例实例
export const searchService = new SearchService();
export default SearchService;