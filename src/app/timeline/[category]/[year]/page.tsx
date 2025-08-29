import TimelinePage, { generateStaticParams as _generateStaticParams } from '../../page';

export default TimelinePage;

// 明确在动态路由下导出静态参数，确保静态导出生成对应路径
export const dynamic = "force-static";
export async function generateStaticParams() {
  const categories = ['all','shi-zheng-yu-guo-ji','she-hui-yu-fa-zhi','yu-le-yu-ming-xing','xing-ye-yu-gong-si','lu-you-yu-chu-xing'];
  const years = ['2025','2024'];
  const params: { category: string; year: string }[] = [];
  for (const category of categories) {
    for (const year of years) {
      params.push({ category, year });
    }
  }
  return params;
}

export const dynamicParams = false;