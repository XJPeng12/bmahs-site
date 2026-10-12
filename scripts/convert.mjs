#!/usr/bin/env node
/**
 * BMAHS 内容迁移脚本
 * 旧站（E:/deepseek/bmahs-site-old/bmahs-site）content 下的 HTML → VitePress docs 下的 Markdown
 *
 * 转换规则：
 *   1. frontmatter（title/slug/eyebrow/desc）→ VitePress frontmatter（title/description）
 *   2. 正文相对链接（slug.html / docs/slug.html / slug-en.html）→ 站内绝对路径（.html 结尾，GitHub Pages 友好）
 *   3. <h2>/<h2 class="as-h3">/<h3>/<h3 class="as-h4"> → Markdown 标题（##/###/####），
 *      使 VitePress 自动生成锚点与右侧大纲（<pre> 内一律不动）
 *   4. 其余正文 HTML 原样保留（VitePress 原生支持 Markdown 内嵌 HTML）
 *
 * 用法：node scripts/convert.mjs [旧站目录]
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(process.argv[2] ?? 'E:/deepseek/bmahs-site-old/bmahs-site');
const DOCS = path.resolve('docs');

// 与旧站 build.py 同源的已知 slug（用于链接改写与死链校验）
const SPEC_SLUGS = [
  'spec-index', 'spec-scope', 'spec-refs', 'spec-terms', 'spec-keywords',
  'spec-arch', 'spec-transport', 'spec-udp', 'spec-jsonrpc', 'spec-errors',
  'spec-desc', 'spec-occ', 'spec-agent', 'spec-ui', 'spec-endpoint',
  'spec-msg', 'spec-flow', 'spec-bonjour', 'spec-conform', 'spec-compat',
  'spec-sec', 'spec-appendix',
];
const DOC_SLUGS = [
  'intro', 'quickstart', 'architecture', 'orchestration', 'self-description',
  'operations', 'occupancy', 'discovery', 'streaming', 'tools', 'fields',
  'ready', 'about',
];
const KNOWN = new Set([...SPEC_SLUGS, ...DOC_SLUGS]);

/** 解析旧站 frontmatter（--- 块中的 key: value） */
function parseFrontMatter(raw) {
  const meta = {};
  let body = raw;
  const m = raw.match(/^---\s*\n(.*?)\n---\s*\n/s);
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    body = raw.slice(m[0].length);
  }
  return { meta, body: body.trim() };
}

/** YAML 双引号安全转义 */
const yq = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/**
 * SVG 空元素自闭合：旧站 HTML 里 <rect>/<line>/<path> 等依赖浏览器隐式闭合，
 * Vue 模板编译器（VitePress 渲染管线）要求显式闭合，这里统一补 "/"。
 * 已有 </tag> 配对或已自闭合的保持原样。
 */
const SVG_VOID = ['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'stop', 'use'];
const SVG_RE = new RegExp(
  `<(?:${SVG_VOID.join('|')})\\b(?:"[^"]*"|'[^']*'|[^">])*\\s*/?>\\s*(?:</(?:${SVG_VOID.join('|')})>)?`,
  'g',
);

function fixSvgSelfClose(text) {
  return text.replace(SVG_RE, (m) => {
    const tag = m.match(/^<([a-z]+)/i)[1].toLowerCase();
    if (new RegExp(`</${tag}>\\s*$`, 'i').test(m)) return m; // 已显式配对闭合
    if (/\/>\s*$/.test(m)) return m; // 已自闭合
    return m.replace(/\s*>$/, '/>'); // 补自闭合斜杠
  });
}

/** 正文处理：链接改写 + 标题转 Markdown（<pre> 内不动） */
function convertBody(body, lang) {
  const isZh = lang === 'zh';
  const lines = body.split('\n');
  const out = [];
  let inPre = false;

  for (let line of lines) {
    // 1) 链接改写：slug.html / docs/slug.html / ../slug.html（可选 #fragment）
    //    slug-en.html → 英文站对应页（跨语言链接）
    line = line.replace(
      /href="(?:\.\.\/)?(?:docs\/)?([a-z0-9][a-z0-9-]*)\.html(#[^"]*)?"/g,
      (m0, slug, frag = '') => {
        if (slug.endsWith('-en') && KNOWN.has(slug.slice(0, -3))) {
          return `href="/en/docs/${slug.slice(0, -3)}.html${frag}"`;
        }
        if (KNOWN.has(slug)) {
          return isZh ? `href="/docs/${slug}.html${frag}"` : `href="/en/docs/${slug}.html${frag}"`;
        }
        return m0; // 未知 slug 原样保留，构建期死链检查会报告
      },
    );

    // 3) <pre> 外以标签开头的行去掉前导缩进：HTML 里缩进无意义，
    //    但 markdown 会把空行后 4+ 空格的行解析成代码块，破坏结构。
    if (!inPre && /^\s+</.test(line)) line = line.trimStart();

    // 4) <pre> 状态跟踪（<pre>…</pre> 之间内容原样保留）
    //    关键：<pre> 开启行前若非空行，先补一个空行 —— 让 <pre> 开启 CommonMark
    //    type-1 HTML 块（只能被 </pre> 结束），这样 pre 内部的空行才不会被
    //    markdown-it 截断成段落（否则渲染时会插入 <p>，破坏 DOM 结构）。
    const isPreOpen = !inPre && /^<pre[\s>]/.test(line);
    if (isPreOpen && out.length && out[out.length - 1].trim() !== '') out.push('');
    if (isPreOpen) inPre = true;

    // 3) <pre> 外的 SVG 空元素补自闭合（Vue 编译器要求）
    // 4) 独占一行的 h2/h3/h4 → Markdown 标题（as-h3/as-h4 语义层级同步换算）
    if (!inPre) {
      line = fixSvgSelfClose(line);
      const m = line.match(/^<h([234])(\s+[^>]*)?>(.+)<\/h\1>\s*$/);
      if (m) {
        const tag = Number(m[1]);
        const attrs = m[2] ?? '';
        let level = tag;
        if (tag === 2 && /as-h3/.test(attrs)) level = 3;
        if (tag === 3 && /as-h4/.test(attrs)) level = 4;
        out.push('', `${'#'.repeat(level)} ${m[3].trim()}`, '');
        continue;
      }
    }

    out.push(line);
    if (/<\/pre>/.test(line)) inPre = false;
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd();
}

/** 转换一个内容目录（content=zh → docs/docs，content-en=en → docs/en/docs） */
function convertDir(srcDir, lang) {
  const zh = lang === 'zh';
  const outDir = zh ? path.join(DOCS, 'docs') : path.join(DOCS, 'en', 'docs');
  fs.mkdirSync(outDir, { recursive: true });

  let count = 0;
  for (const fn of fs.readdirSync(srcDir).sort()) {
    if (!fn.endsWith('.html')) continue;
    const { meta, body } = parseFrontMatter(
      fs.readFileSync(path.join(srcDir, fn), 'utf8'),
    );
    const slug = meta.slug ?? path.basename(fn, '.html');
    const isHome = slug === 'index';
    const fm = [];

    if (isHome) {
      fm.push('layout: page');
      fm.push('sidebar: false');
      fm.push('aside: false');
      fm.push('outline: false');
      fm.push('titleTemplate: false');
      fm.push(`title: ${yq(meta.title ?? '')}`);
    } else {
      fm.push(`title: ${yq(meta.title ?? '')}`);
    }
    if (meta.desc) fm.push(`description: ${yq(meta.desc)}`);
    if (meta.eyebrow) fm.push(`eyebrow: ${yq(meta.eyebrow)}`);

    const parts = [`---\n${fm.join('\n')}\n---\n`];

    if (isHome) {
      // 首页：hero 自带 h1，不注入标题行
      parts.push(convertBody(body, lang));
    } else {
      if (meta.eyebrow) parts.push(`<p class="eyebrow">${meta.eyebrow}</p>\n`);
      parts.push(`# ${meta.title ?? slug}\n`);
      parts.push(convertBody(body, lang));
    }

    const file = isHome
      ? (zh ? path.join(DOCS, 'index.md') : path.join(DOCS, 'en', 'index.md'))
      : path.join(outDir, `${slug}.md`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, parts.join('\n') + '\n', 'utf8');
    count++;
  }
  return count;
}

const nZh = convertDir(path.join(SRC, 'content'), 'zh');
const nEn = convertDir(path.join(SRC, 'content-en'), 'en');
console.log(`转换完成：中文 ${nZh} 页 → docs/，英文 ${nEn} 页 → docs/en/`);
