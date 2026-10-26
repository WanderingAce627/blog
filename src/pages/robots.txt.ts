import type { APIRoute } from 'astro';

const BASE = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/+$/, '');

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${BASE}/sitemap-index.xml`, site ?? 'https://example.com').href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
