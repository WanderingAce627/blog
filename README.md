# 拾穗 · 个人博客

基于 [Astro](https://astro.build) 的静态博客，部署在 GitHub Pages。写文章只需要新建一个 Markdown 文件。

线上地址：<https://wdoudou627-collab.github.io/blog/>

---

## 写一篇新文章

在 `src/content/blog/` 下新建一个 `.md` 文件，文件名就是 URL（`my-post.md` → `/posts/my-post/`）。

```markdown
---
title: 文章标题
description: 一句话摘要，会显示在列表页和搜索结果里
pubDate: 2026-10-26
category: tech
tags: [标签一, 标签二]
---

正文从这里开始，用 Markdown 写。
```

### frontmatter 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `description` | 否 | 摘要，列表页和 SEO 描述用 |
| `pubDate` | 是 | 发布日期，格式 `2026-10-26` |
| `category` | 否 | `tech`（技术笔记）或 `essay`（随笔），默认 `tech` |
| `tags` | 否 | 标签数组，会自动生成标签页 |
| `draft` | 否 | `true` 时只在本地可见，不会发布 |
| `updatedDate` | 否 | 修订日期，填了会在文章页显示「修订于」 |

写完提交推送，1~2 分钟后网站自动更新。**不需要在本地跑任何命令** —— 可以直接在 GitHub 网页上新建文件、写完提交。

## 本地预览

需要 Node 22.23+ 或 24。

```bash
npm install
npm run dev      # http://localhost:4321/blog
npm run build    # 生成静态文件到 dist/
npm run preview  # 预览构建结果
```

## 目录结构

```
.
├── src/
│   ├── consts.ts              # 站点名、简介、导航、社交链接 —— 改这里
│   ├── content/blog/          # 所有文章（Markdown）
│   ├── content.config.ts      # frontmatter 校验规则
│   ├── layouts/
│   │   ├── BaseLayout.astro   # 页面外壳
│   │   └── PostLayout.astro   # 文章页（含目录、上下篇）
│   ├── components/
│   ├── lib/
│   │   ├── posts.ts           # 排序、分组、阅读时长
│   │   └── url.ts             # 站内链接统一加 base 前缀
│   ├── pages/                 # 路由，文件名即 URL
│   └── styles/global.css      # 设计令牌与全部样式
├── public/                    # 原样复制的静态资源（favicon 等）
├── astro.config.mjs           # site / base / markdown 配置
└── .github/workflows/deploy.yml
```

## 常见修改

**改站名和简介** → `src/consts.ts` 里的 `SITE`，导航也在同一个文件。

**改配色** → `src/styles/global.css` 顶部的 CSS 变量，浅色和深色各一组。

**换到根域名**（`用户名.github.io`）→ 仓库改名为 `用户名.github.io`，然后把 `astro.config.mjs` 里的 `base: '/blog'` 删掉。其他代码不用动，因为所有链接都走 `url()` 函数。

**绑定自己的域名** → 在 `public/` 下新建 `CNAME` 文件，内容写你的域名；同时把 `site` 改成 `https://你的域名`，并删掉 `base`。

**加评论** → 推荐 [Giscus](https://giscus.app)，它把评论存在 GitHub Discussions 里，不需要后端。

## 部署

`main` 分支每次推送都会触发 `.github/workflows/deploy.yml`：
安装依赖 → 构建 → 上传产物 → 发布到 GitHub Pages。

首次部署需要在仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**（本项目已通过 API 配置好）。

在 **Actions** 标签页可以看到每次构建的日志；构建失败时网站会保留上一个成功版本，不会挂掉。
