# 拾穗 · 个人博客

基于 [Astro](https://astro.build) 的静态博客，部署在 GitHub Pages。写文章只需要新建一个 Markdown 文件。

线上地址：<https://wanderingace627.github.io/blog/>

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

写完提交推送。想完全在 GitHub 网页上写作、不碰本地环境，先按文末「方式二」开启 Actions 自动部署；否则在本地跑一次 `npm run deploy` 发布。

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

本站当前使用 **gh-pages 分支发布**：GitHub Pages 的 Source 设为 `gh-pages` 分支根目录。

### 方式一：本地一条命令发布（现在可用）

```bash
npm run deploy
```

它会自动构建，把 `dist/` 推到 `gh-pages` 分支，约 1 分钟后线上更新。

### 方式二：推送即发布（推荐，需一次性开启）

仓库里已经准备好了 `.github/workflows/deploy.yml`，但因为 GitHub 的 OAuth token 默认没有 `workflow` 权限，它暂时还没能提交上去。开启方式二选一：

**A. 命令行授权后推送**

```bash
gh auth refresh -h github.com -s workflow
git add .github && git commit -m "ci: 开启 Actions 自动部署" && git push
```

**B. 网页上手动添加**

打开 <https://github.com/WanderingAce627/blog/new/main/.github/workflows>，文件名填 `deploy.yml`，把本地 `.github/workflows/deploy.yml` 的内容粘进去提交。

然后到仓库 **Settings → Pages → Build and deployment → Source** 改成 **GitHub Actions**。

之后每次 `git push` 到 `main` 都会自动构建发布 —— 连本地环境都不需要，直接在 GitHub 网页上新建 `.md` 文件提交就行。

> 两种方式不要同时开：切到 GitHub Actions 后，`gh-pages` 分支的内容就不再影响线上了。
