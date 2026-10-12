#!/usr/bin/env node
/** 用 VitePress 官方 createMarkdownRenderer 渲染，再检查标签配平 */
import fs from 'node:fs';
import { createMarkdownRenderer } from 'vitepress';

const file = process.argv[2];
let text = fs.readFileSync(file, 'utf8').replace(/^---\n.*?\n---\n/s, '');
const md = await createMarkdownRenderer('docs', {}, '/', false);
const html = md.render(text);
fs.writeFileSync('rendered.html', html);

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const clean = html.replace(/<pre[\s>][\s\S]*?<\/pre>/g, ' <pre></pre> ');
const stack = [];
const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g;
let m;
const errors = [];
while ((m = re.exec(clean))) {
  const name = m[1].toLowerCase();
  const closing = m[0][1] === '/';
  const selfClose = /\/>$/.test(m[0]);
  if (VOID.has(name)) continue;
  if (!closing && !selfClose) stack.push({ name, idx: m.index });
  else if (closing) {
    let i = stack.length - 1;
    while (i >= 0 && stack[i].name !== name) i--;
    if (i === -1) errors.push(`多余的 </${name}> @${m.index}: ...${clean.slice(Math.max(0, m.index - 80), m.index + 20).replace(/\n/g, '⏎')}...`);
    else {
      for (let j = stack.length - 1; j > i; j--) errors.push(`未闭合 <${stack[j].name}> @${stack[j].idx}: ...${clean.slice(Math.max(0, stack[j].idx - 60), stack[j].idx + 80).replace(/\n/g, '⏎')}...`);
      stack.length = i;
    }
  }
}
for (const s of stack) errors.push(`EOF 未闭合 <${s.name}> @${s.idx}: ...${clean.slice(Math.max(0, s.idx - 60), s.idx + 100).replace(/\n/g, '⏎')}...`);
if (errors.length) {
  console.log(`${file}: ${errors.length} 处`);
  for (const e of [...new Set(errors)].slice(0, 10)) console.log('  ' + e);
} else {
  console.log(`${file}: ✓ 配平`);
}
