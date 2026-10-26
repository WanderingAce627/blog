import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, type CategoryKey } from '../consts';

export type Post = CollectionEntry<'blog'>;

/** 按发布时间倒序取全部文章；开发环境额外显示 draft */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.DEV ? true : !data.draft,
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function byCategory(posts: Post[], category: CategoryKey): Post[] {
  return posts.filter((p) => p.data.category === category);
}

export function categoryLabel(key: CategoryKey): string {
  return CATEGORIES[key].label;
}

/** 2026.10.24 */
export function fmt(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** 2026 年 10 月 24 日 */
export function fmtLong(date: Date): string {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

/** 中文按 350 字/分钟、英文按 200 词/分钟折算 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const cn = (body.match(/[\u4e00-\u9fa5]/g) || []).length;
  const en = (body.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  return Math.max(1, Math.round(cn / 350 + en / 200));
}

/** 统计标签出现次数，按次数倒序 */
export function tagCounts(posts: Post[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

/** 按年份分组，用于归档页 */
export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const map = new Map<number, Post[]>();
  for (const p of posts) {
    const y = p.data.pubDate.getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(p);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, posts: list }));
}

/** 标签转成 URL 片段 */
export function tagSlug(tag: string): string {
  return encodeURIComponent(tag);
}
