# BMAHS 官网（VitePress 版）

BMAHS（Big Model Agent Hardware Specification，大模型智能体硬件规范 `bmahs/1.2`）官方网站。
由旧站（`bmahs-site-old`，Python 自建构建器 + JS 渲染防抓取架构）迁移至 VitePress 静态站，中文 / 英文双语，部署在 GitHub Pages，绑定域名 **www.bmahs.com**。

## 技术栈

- [VitePress](https://vitepress.dev/) 1.x（Vite + Vue 3 默认主题，深度定制样式）
- pnpm 包管理，Node.js 22
- GitHub Actions 自动构建 → GitHub Pages 发布（`actions/deploy-pages` 官方工作流）

## 本地开发

```bash
pnpm install        # 安装依赖
pnpm run dev        # 开发服务器（http://localhost:5173）
pnpm run build      # 构建产物到 docs/.vitepress/dist
pnpm run preview    # 预览构建产物（http://localhost:4173）
```

## 目录结构

```
docs/
├── .vitepress/
│   ├── config.mts          # 站点配置：导航 / 侧边栏 / i18n / SEO / sitemap
│   └── theme/
│       ├── index.ts        # 主题入口（默认主题 + 代码块复制按钮）
│       └── custom.css      # 旧站设计体系移植（变量 + 组件 + 暗色模式）
├── public/                 # 静态资源：CNAME、robots.txt、favicon、logo
├── docs/                   # 中文文档页（/docs/{slug}.html）
├── en/docs/                # 英文文档页（/en/docs/{slug}.html）
├── index.md                # 中文首页
└── en/index.md             # 英文首页
scripts/
├── convert.mjs             # 旧站内容迁移脚本（content/*.html → Markdown）
└── check-tags.mjs          # HTML 标签配平检查
.github/workflows/deploy.yml # Pages 自动部署
```

## 内容迁移说明

正文 HTML 保存在旧站 `E:\deepseek\bmahs-site-old\bmahs-site\content{,-en}\`。
`scripts/convert.mjs` 完成四类转换：

1. frontmatter → VitePress frontmatter（title/description）；
2. 相对链接 → 站内绝对路径（含 `slug-en.html` 跨语言链接），保留 `.html` 后缀以适配 GitHub Pages；
3. `<h2>/<h3>` 标题 → Markdown 标题（自动获得锚点与右侧大纲）；
4. 旧式 `<pre>` 代码块结构保护（空行/缩进处理），SVG 空元素自闭合。

改动内容请直接编辑 `docs/**/*.md`；若旧站内容更新，重跑 `pnpm run convert` 再合并。

## 部署

推送到 `main` 分支即触发 GitHub Actions 自动构建发布。首次启用步骤：

1. GitHub 仓库 → Settings → Pages → Source 选择 **GitHub Actions**；
2. 自定义域名：Settings → Pages → Custom domain 填 `www.bmahs.com`（仓库已含 `public/CNAME`）；
3. DNS 解析添加：`www` 的 CNAME 记录 → `xjpeng12.github.io`；
   （可选） apex 域 `bmahs.com` 添加 A 记录指向 `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`，GitHub 会自动 301 到 www；
4. 域名生效后勾选 **Enforce HTTPS**。

## 许可

站点内容 CC BY 4.0；示例代码 CC0。详见 `/docs/about.html`。
