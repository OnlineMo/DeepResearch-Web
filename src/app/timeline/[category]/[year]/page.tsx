import TimelinePage, { generateStaticParams as _generateStaticParams } from '../../page';

export default TimelinePage;

// 明确在动态路由下导出静态参数，确保静态导出生成对应路径
export async function generateStaticParams() {
 return _generateStaticParams();
}

export const dynamicParams = true;