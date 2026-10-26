// 站内链接统一走 url()，这样部署在 /blog 子路径下也不会 404。
const RAW = import.meta.env.BASE_URL;
const BASE = RAW === '/' ? '' : RAW.replace(/\/+$/, '');

/** 站内路径 → 带 base 前缀的路径。url('/about') → '/blog/about/' */
export function url(path = '/'): string {
  if (/^https?:\/\//.test(path) || path.startsWith('#')) return path;
  let p = path.startsWith('/') ? path : `/${path}`;
  // 页面链接补尾部斜杠，和 GitHub Pages 的目录形式对齐，避免每次点击多一次 301
  // 带扩展名的静态资源（/rss.xml、/favicon.svg）不动
  if (!/\.[a-z0-9]+$/i.test(p) && !p.endsWith('/')) p += '/';
  return `${BASE}${p}`;
}

/** 站内路径 → 完整绝对地址，用于 RSS / canonical / og:url */
export function absUrl(path = '/', site: URL | undefined): string {
  return new URL(url(path), site ?? 'https://example.com').href;
}

/** 去掉首尾斜杠，用于比较当前路径 */
export function trim(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}
