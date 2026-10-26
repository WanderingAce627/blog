import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../consts';
import { getPosts } from '../lib/posts';

const BASE = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/+$/, '');

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    // site 带上 base，channel 的 link 才会是 .../blog/；item.link 已含 base，不受影响
    site: new URL(`${BASE}/`, context.site ?? 'https://example.com'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${BASE}/posts/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>zh-cn</language>',
  });
};
