---
title: "Bonjour TXT 记录规范"
description: "TXT 记录键与 UDP 字段的映射表，以及 dns-sd 验证命令。"
eyebrow: "规范全文 · 第 17 章"
---

<p class="eyebrow">规范全文 · 第 17 章</p>

# Bonjour TXT 记录规范

<p>全部为字符串；<code>capabilities</code> 用逗号分隔；<b>不得</b>含 <code>token</code> 或流 URI 键。建议整包 &lt; 400 字节。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">TXT 键</th><th>对应 UDP 字段</th><th style="white-space:nowrap">必须</th></tr></thead>
<tbody>
<tr><td><code>txtvers</code></td><td style="white-space:nowrap">固定 <code>1</code></td><td style="white-space:nowrap">是</td></tr>
<tr><td><code>protocol</code></td><td><code>protocol</code></td><td>是（<code>bmahs/1.2</code>）</td></tr>
<tr><td><code>type</code> / <code>service</code> / <code>id</code> / <code>name</code></td><td style="white-space:nowrap">同名</td><td style="white-space:nowrap">是</td></tr>
<tr><td><code>summary</code> / <code>model</code></td><td style="white-space:nowrap">同名</td><td style="white-space:nowrap">应当</td></tr>
<tr><td><code>capabilities</code></td><td><code>capabilities</code></td><td style="white-space:nowrap">是</td></tr>
<tr><td><code>security</code></td><td><code>scope,auth,occupancy</code></td><td style="white-space:nowrap">是</td></tr>
<tr><td><code>ip</code> / <code>ipv6</code></td><td style="white-space:nowrap">同名</td><td>应当 / 有则应当</td></tr>
<tr><td><code>state</code></td><td><code>state</code></td><td>是（<code>online</code>）</td></tr>
<tr><td><code>event</code></td><td><code>event</code></td><td style="white-space:nowrap">应当</td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td style="white-space:nowrap"><code>busy</code></td><td>是（<code>0</code> / <code>1</code>）</td></tr>
<tr><td><code>holder</code></td><td><code>holder</code></td><td style="white-space:nowrap">有则必须</td></tr>
<tr><td style="white-space:nowrap"><code>hb</code></td><td style="white-space:nowrap"><code>hb</code></td><td>调大间隔时必须</td></tr>
</tbody>
</table>
</div>

<p>验证命令：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">验证命令</span>
<button class="code__copy" type="button">复制</button></div>

<pre>dns-sd -B _bmahs._tcp local
dns-sd -L &quot;设备显示名&quot; _bmahs._tcp local</pre>
</div>
