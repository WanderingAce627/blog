// ▸ 站点身份信息。想改名、换简介、换导航，都只改这一个文件。
export const SITE = {
  /** 站点名，显示在页头与浏览器标签 */
  title: '拾穗',
  /** 站点名下方的英文小字，可留空 */
  titleEn: 'GLEANINGS',
  /** 一句话简介，用于首页与 SEO 描述 */
  description: '代码与生活的双重笔记。写技术，也写点别的。',
  /** 作者署名 */
  author: 'Harry',
  /** 页脚一句话 */
  footerNote: '用 Astro 构建，托管在 GitHub Pages。',
  /** 建站年份，用于页脚版权 */
  since: 2026,
  /** 社交链接，留空数组则不显示 */
  socials: [
    { label: 'GitHub', href: 'https://github.com/WanderingAce627' },
    { label: 'RSS', href: '/rss.xml' },
  ],
  /** 导航 */
  nav: [
    { label: '技术', href: '/tech' },
    { label: '随笔', href: '/essay' },
    { label: '标签', href: '/tags' },
    { label: '归档', href: '/archive' },
    { label: '关于', href: '/about' },
  ],
} as const;

/** 两个栏目的显示名与说明。category 字段在文章 frontmatter 里填 tech 或 essay。 */
export const CATEGORIES = {
  tech: { label: '技术笔记', desc: '踩过的坑、跑通的方案、值得写下来的细节。' },
  essay: { label: '随笔', desc: '读过的东西，走过的路，以及一些没想清楚的想法。' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
