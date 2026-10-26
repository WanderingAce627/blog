import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ▸ 换成你自己的域名时，只改 site 和 base 两行。
//   项目子路径（当前）：repo 叫 blog → 地址 https://用户名.github.io/blog
//   根域名：            repo 叫 用户名.github.io → site 填 https://用户名.github.io，base 删掉
export default defineConfig({
  site: 'https://wanderingace627.github.io',
  base: '/blog',

  integrations: [sitemap()],

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
