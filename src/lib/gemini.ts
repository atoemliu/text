import type { RegionData } from '../types/region';

/**
 * 模拟从图片中解析出地区与特产。
 * 为了保证在无后端 / 无 AI 的环境下也能正常运行，这里直接返回一组固定示例数据。
 */
export async function extractTableData(
  _imageBase64: string,
  _mimeType: string
): Promise<RegionData[]> {
  // 这里不使用图片内容，只返回示例表格，保证功能流程完整可用。
  return [
    {
      region: '北京',
      specialties: ['北京烤鸭', '六必居酱菜', '稻香村点心', '茯苓饼'],
    },
    {
      region: '四川',
      specialties: ['郫县豆瓣', '自贡冷吃兔', '张飞牛肉', '宜宾燃面'],
    },
    {
      region: '新疆',
      specialties: ['葡萄干', '哈密瓜', '大盘鸡', '烤全羊'],
    },
  ];
}

/**
 * 模拟搜索某个特产的简介，返回一段本地生成的说明文字。
 * 不会向任何外部服务发送请求。
 */
export async function searchSpecialtyInfo(query: string): Promise<string> {
  const baseIntro = `${query} 是当地颇具代表性的一款特色美食或特产，人们常常把它视作一座城市或地区的味觉名片。`;
  const detail =
    '它通常选用本地食材与传统工艺制作，在口感与风味上都具有鲜明的地域特色，非常适合作为伴手礼或旅行中的打卡美食。';

  return `${baseIntro}\n\n${detail}`;
}
