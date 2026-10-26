# 拾穗 · 个人博客

基于 [Astro](https://astro.build) 的静态博客，部署在 GitHub Pages。写文章可以不碰本地环境，直接在网页后台写。

线上地址：<https://wanderingace627.github.io/blog/>
写作后台：<https://wanderingace627.github.io/blog/admin/>
仓库：<https://github.com/WanderingAce627/blog>

---

## 在网页上写文章（推荐）

打开 **<https://wanderingace627.github.io/blog/admin/>**，是一个纯前端的可视化后台（Sveltia CMS）。
它直接通过 GitHub API 读写这个仓库，没有任何服务器，也就不用担心服务挂掉。

### 第一次使用：生成一个访问令牌

只需要做一次。打开后台后，输入框会直接展开，页面顶部也有「创建令牌」的快捷入口。

1. 打开 <https://github.com/settings/personal-access-tokens/new> 新建 **Fine-grained token**
2. Token name 随便填（比如 `blog-cms`），Expiration 选 90 天或更久（也可以选不设过期）
3. **Repository access** 选 `Only select repositories` → 勾选 `blog`
4. **Permissions → Repository permissions → Contents** 改成 `Read and write`
   （Metadata 会自动变成 Read-only，是正常的）
5. 点 Generate token，复制出来的那串字符（**只显示一次**）
6. 回到后台，粘进输入框，点「登录」

令牌存在你自己浏览器的 localStorage 里，不会上传到任何地方。过期后重新生成一个粘进去就行，改权限不需要重新生成。

> 后台页面上原本还有一个「使用 GitHub 登录」按钮，已通过 `public/admin/index.html` 里的脚本隐藏。
> 原因是这个功能需要 OAuth 代理（GitHub 不支持纯前端 PKCE），没配的话点了会一直卡在「登录中……」。
> 如果哪天真的接上了 OAuth 服务，删掉那段脚本里隐藏按钮的两行即可。


### 写文章和插图

- 左侧「文章」→「新建文章」
- 图片有四种进法：**直接拖进正文**、**截图后 Ctrl+V 粘贴**、点工具栏的图片按钮、或从媒体库选
- 图片会存到仓库的 `public/uploads/` 下，记得顺手改个有意义的文件名
- 正文下面的「附件」可以挂 PDF、压缩包，会在文章末尾生成下载区
- 「存为草稿」勾上就只在本地 `npm run dev` 能看到，不会发布

保存后会以你的名义在 `main` 分支产生一次提交，GitHub Actions 自动构建发布，1～2 分钟后线上更新。

## 手动写文章

在 `src/content/blog/` 下新建一个 `.md` 文件，文件名就是 URL（`my-post.md` → `/posts/my-post/`）。

```markdown
---
title: 文章标题
description: 一句话摘要，会显示在列表页和搜索结果里
pubDate: 2026-10-26
category: tech
tags: [标签一, 标签二]
attachments:
  - name: 附件名.pdf
    url: /blog/uploads/附件名.pdf
---

正文从这里开始，用 Markdown 写。图片直接写 `/blog/uploads/xxx.png`。
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
| `attachments` | 否 | 附件列表，每项是 `{ name, url }`，会在文末生成下载区 |

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
│   │   └── PostLayout.astro   # 文章页（目录、附件、上下篇）
│   ├── components/
│   ├── lib/
│   │   ├── posts.ts           # 排序、分组、阅读时长
│   │   └── url.ts             # 站内链接统一加 base 前缀
│   ├── pages/                 # 路由，文件名即 URL
│   └── styles/global.css      # 设计令牌与全部样式
├── public/
│   ├── admin/                 # 写作后台（index.html + config.yml + CMS 本体）
│   │   ├── locales/           # 中英文语言包（本地托管，不走 CDN）
│   │   └── fonts/             # Source Sans 3 / Noto Mono / 图标字体（本地托管）
│   └── uploads/               # 后台上传的图片和附件
├── astro.config.mjs           # site / base / markdown 配置
└── .github/workflows/deploy.yml
```

## 常见修改

**改站名和简介** → `src/consts.ts` 里的 `SITE`，导航也在同一个文件。

**改配色** → `src/styles/global.css` 顶部的 CSS 变量，浅色和深色各一组。

**改后台字段** → `public/admin/config.yml`。加了新字段记得同步改 `src/content.config.ts` 里的校验规则，否则构建会报错。

**升级 Sveltia CMS** → 注意这个项目对 CMS 本体做过本地化改造，直接覆盖 `public/admin/sveltia-cms.js` 会丢。重新做一遍只需三步：

1. 从 `node_modules/@sveltia/cms/dist/` 复制 `sveltia-cms.js` 和 `chunks/`
2. 把文件里的 `https://unpkg.com/@sveltia/cms@${版本}/locales` 改成 `./locales`
3. 把三个 `https://cdn.jsdelivr.net/fontsource/fonts/*.woff2` 改成 `./fonts/*.woff2`

改完的效果是后台完全不依赖外部 CDN，国内网络下也能秒开。语言包只放了 `zh-CN` 和 `en-US`，其他语言会自动回落到英文。


**换到根域名**（`用户名.github.io`）→ 仓库改名为 `用户名.github.io`，把 `astro.config.mjs` 里的 `base: '/blog'` 删掉，把 `public/admin/config.yml` 里的 `public_folder` 改成 `/uploads`，再批量替换已有文章里的图片路径：

```bash
grep -rl '/blog/uploads' src/content/blog | xargs sed -i 's#/blog/uploads#/uploads#g'
```

**绑定自己的域名** → `public/` 下新建 `CNAME` 文件写域名，`site` 改成 `https://你的域名`，删掉 `base`，按上一条同样处理图片路径。

**加评论** → 推荐 [Giscus](https://giscus.app)，评论存在 GitHub Discussions 里，不需要后端。

## 部署

`main` 分支每次推送都会触发 `.github/workflows/deploy.yml`：安装依赖 → 构建 → 上传产物 → 发布到 GitHub Pages。

在 **Actions** 标签页能看到每次构建的日志。构建失败时线上保留上一个成功版本，不会挂掉。

### 备用方式：gh-pages 分支

如果哪天 Actions 出问题，本地跑 `npm run deploy` 也能发布 —— 它会构建并把 `dist/` 强推到 `gh-pages` 分支。
但注意 Pages 的 Source 必须相应地在 **Settings → Pages** 里切到 `gh-pages` 分支，两种方式只能用一个。
