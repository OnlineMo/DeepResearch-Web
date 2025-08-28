const { Octokit } = require('@octokit/rest');

// 从环境变量获取token，如果没有则使用undefined
const token = process.env.GITHUB_TOKEN;

console.log('GitHub Token:', token && token !== 'your_github_token_here' ? '已配置' : '未配置');

const octokit = new Octokit({
  auth: token !== 'your_github_token_here' ? token : undefined
});

async function testApi() {
  try {
    console.log('测试GitHub API连接...');
    
    // 测试获取仓库内容
    const response = await octokit.rest.repos.getContent({
      owner: 'OnlineMo',
      repo: 'DeepResearch-Archive',
      path: ''
    });
    
    console.log('API调用成功!');
    console.log('仓库根目录文件数量:', Array.isArray(response.data) ? response.data.length : 1);
    
    // 检查速率限制
    const rateLimit = await octokit.rest.rateLimit.get();
    console.log('速率限制信息:');
    console.log('- 剩余请求次数:', rateLimit.data.rate.remaining);
    console.log('- 总请求限制:', rateLimit.data.rate.limit);
    console.log('- 重置时间:', new Date(rateLimit.data.rate.reset * 1000).toLocaleString());
    
    // 如果配置了token，显示更详细的速率限制信息
    if (token && token !== 'your_github_token_here') {
      console.log('\n✅ 已配置GitHub Token，API请求限制为5000次/小时');
    } else {
      console.log('\n⚠️  未配置GitHub Token，API请求限制为60次/小时');
      console.log('建议按照README.md中的说明配置GITHUB_TOKEN以提高请求限制');
    }
    
  } catch (error) {
    console.error('API调用失败:', error.message);
    
    if (error.status === 403) {
      console.error('可能是速率限制问题。建议配置GITHUB_TOKEN。');
    } else if (error.status === 404) {
      console.error('仓库未找到。请检查仓库名称和所有者。');
    }
  }
}

testApi();