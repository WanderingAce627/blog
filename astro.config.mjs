import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ▸ 换成你自己的域名时，只改 site 和 base 两行。
//   项目子路径（当前）：repo 叫 blog → 地址 https://用户名.github.io/blog
//   根域名：            repo 叫 用户名.github.io → site 填 https://用户名.github.io，base 删掉
//   ⚠️ 改 base 的同时，要把 public/admin/config.yml 里的 public_folder 一起改掉，
//      并把已有文章里的图片路径做一次批量替换（见 README「换到根域名」）。
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
