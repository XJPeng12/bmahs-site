#!/usr/bin/env node
/** 检查 docs 下所有 md 的 HTML 标签是否配平（排除 void 元素与 pre 内容） */
import fs from 'node:fs';
import path from 'node:path';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const root = path.resolve('docs');
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) files.push(p);
  }
})(root);

let bad = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  // 去掉 frontmatter
  text = text.replace(/^---\n.*?\n---\n/s, '');
  // 去掉 markdown 标题行
  text = text.replace(/^#{1,6} .*$/gm, '');
  // 去掉 <pre>…</pre> 内部内容（报文示例含大量伪 JSON 标点）
  text = text.replace(/<pre[\s>][\s\S]*?<\/pre>/g, ' <pre></pre> ');
  const stack = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)(\/?)>/g;
  let m;
  const errors = [];
  while ((m = re.exec(text))) {
    const name = m[1].toLowerCase();
    const closing = m[0][1] === '/';
    const selfClose = /\/>$/.test(m[0]);
    if (VOID.has(name)) continue;
    if (name === 'html' || name === 'body') continue;
    if (!closing && !selfClose) stack.push({ name, pos: m.index });
    else if (closing) {
      // 弹栈到匹配（浏览器式宽容：隐式闭合中间未闭合标签也记为问题）
      let i = stack.length - 1;
      while (i >= 0 && stack[i].name !== name) i--;
      if (i === -1) {
        errors.push(`多余的 </${name}> @${m.index}`);
      } else {
        for (let j = stack.length - 1; j > i; j--) {
          errors.push(`未闭合 <${stack[j].name}>（被 </${name}> 隐式闭合）@${stack[j].pos}`);
        }
        stack.length = i;
      }
    }
  }
  for (const s of stack) errors.push(`未闭合 <${s.name}> @${s.pos}`);
  if (errors.length) {
    bad++;
    console.log(`✗ ${path.relative(root, file)}`);
    for (const e of [...new Set(errors)].slice(0, 6)) console.log(`   ${e}`);
  }
}
console.log(bad ? `\n${bad} 个文件存在问题` : '所有文件标签配平 ✓');
