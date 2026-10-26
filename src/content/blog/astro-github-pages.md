---
title: 用 Astro 和 GitHub Pages 搭一个不用管服务器的博客
description: 从空仓库到自动发布，一个纯静态博客的完整搭建过程，以及为什么我选了这条路。
pubDate: 2026-10-26
category: tech
tags: [Astro, GitHub Pages, 静态站点]
---

搭这个站花了大概一个晚上。写下来，既是备忘，也给同样想动手的人省一点时间。

## 为什么是静态站

博客的本质是「一堆几乎不变的文章 + 一个列表页」。这个特征决定了它不需要数据库，不需要后端，不需要每分钟都在跑的进程。

一旦接受这点，架构就变得非常简单：**构建时把所有页面生成为 HTML，托管在 CDN 上**。收益是实打实的：

- 打开速度快，因为返回的就是静态文件，没有服务端渲染
- 成本为零，GitHub Pages 对公开仓库免费
- 不会挂，没有服务器要维护、续费、打补丁
- 备份天然存在，全部内容就是仓库里的 Markdown

代价也明确：没有评论、没有实时搜索、没有个性化推荐。对我来说这些都不重要。

## 技术选型

主流的静态博客方案我简单比了一下：

| 方案 | 构建速度 | 上手成本 | 生态 |
| --- | --- | --- | --- |
| Astro | 快 | 低 | 现代，MDX / 组件化 |
| Hugo | 极快 | 中 | 主题多，Go 模板语法略陡 |
| Hexo | 中 | 低 | 中文社区最成熟 |
| Next.js | 慢 | 高 | 功能过剩 |

最后选 Astro，理由很朴素：**它默认不发送 JavaScript**。一个博客不需要为了显示一篇文章给浏览器塞 200KB 的运行时。同时它又保留组件化能力，以后想加一块交互内容不用换框架。

## 三个关键配置

### 1. site 和 base

如果仓库名不是 `用户名.github.io`，站点会部署在子路径下。这时候必须告诉 Astro 自己的根路径在哪：

```js
export default defineConfig({
  site: 'https://用户名.github.io',
  base: '/blog',
});
```

少配 `base` 的典型症状是：本地一切正常，线上 CSS 全部 404。因为样式表请求的是 `/assets/style.css`，而文件实际在 `/blog/assets/style.css`。

### 2. 站内链接统一走一个函数

即使配了 `base`，Astro 也**不会**自动改写你手写的链接。所以我把所有站内跳转都收进一个函数：

```ts
const RAW = import.meta.env.BASE_URL;
const BASE = RAW === '/' ? '' : RAW.replace(/\/+$/, '');

export function url(path = '/') {
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
```

以后哪怕把博客从子路径搬到根域名，改配置就行，不用全站搜索替换。

### 3. 内容集合而非手写 frontmatter

Astro 的 content collections 会在构建时校验 frontmatter。字段写错、日期格式不对，构建直接失败——而不是等到线上发现某篇文章消失。

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['tech', 'essay']),
    tags: z.array(z.string()).default([]),
  }),
});
```

这一步看起来麻烦，实际上是省事的：**错误的反馈越早越好**。

## 自动部署

在仓库里放一个 workflow，之后每次 `git push` 都会自动构建并发布：

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
```

注意 `permissions` 里的 `pages: write` 和 `id-token: write` 是必须的，少了会在部署步骤报权限错误。

## 写文章的姿势

这是我最满意的部分。整个流程是：

1. 在 `src/content/blog/` 下新建一个 `.md` 文件
2. 写 frontmatter 和正文
3. 提交、推送

就这样。不用开本地环境，在 GitHub 网页上也能直接写——因为构建发生在云端，不在我电脑上。

```yaml
---
title: 文章标题
description: 一句话摘要，会显示在列表页和搜索结果里
pubDate: 2026-10-26
category: tech
tags: [标签一, 标签二]
---
```

`category` 只有两个值：`tech` 或者 `essay`。它决定这篇文章出现在哪个栏目。

## 一点提醒

静态博客最大的敌人不是技术，是**写**。工具链搭得再漂亮，如果三个月没有新文章，那它只是个更复杂的空页面。

所以我把搭建时间压缩在一晚之内：够用就行，把剩下的时间留给写。
