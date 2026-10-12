---
title: "附录 A · 索引"
description: "章节、报文与方法、字段、错误码四张索引表。"
eyebrow: "规范全文 · 附录"
---

<p class="eyebrow">规范全文 · 附录</p>

# 附录 A · 索引


### A.1 章节索引

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">主题</th><th style="white-space:nowrap">章节</th></tr></thead>
<tbody>
<tr><td>JSON-RPC 2.0 编码规范</td><td style="white-space:nowrap">§8</td></tr>
<tr><td>错误码与 JSON-RPC 映射</td><td style="white-space:nowrap">§9</td></tr>
<tr><td>占用策略 last-wins / exclusive</td><td style="white-space:nowrap">§11</td></tr>
<tr><td>通用方法必选范围</td><td>§10.4</td></tr>
<tr><td>使用约束（<code>constraint</code>）</td><td>§10.6</td></tr>
<tr><td>用户确认机制</td><td>§10.7</td></tr>
<tr><td>智能体与协议客户端义务</td><td style="white-space:nowrap">§12</td></tr>
<tr><td>UI接口（必须 exclusive）</td><td style="white-space:nowrap">§13</td></tr>
<tr><td>端点对接（join / 中继）</td><td>§14.3</td></tr>
<tr><td>媒体 TCP 无握手</td><td>§14.4</td></tr>
<tr><td>一致性清单与禁止行为</td><td style="white-space:nowrap">§18</td></tr>
<tr><td>互操作与传输安全</td><td style="white-space:nowrap">§19</td></tr>
</tbody>
</table>
</div>

### A.2 报文与方法索引

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">条目</th><th style="white-space:nowrap">定义位置</th></tr></thead>
<tbody>
<tr><td><code>announce</code> / <code>query</code> / <code>goodbye</code>（UDP，非 RPC）</td><td style="white-space:nowrap">§15</td></tr>
<tr><td><code>hello</code> / <code>event</code>（JSON-RPC 通知）</td><td style="white-space:nowrap">§8.5</td></tr>
<tr><td><code>describe</code> / <code>info</code> / <code>who</code></td><td>§10.4</td></tr>
<tr><td><code>occupy</code> / <code>release</code></td><td>§10.4、§11.3（仅 exclusive 必选）</td></tr>
<tr><td><code>register</code></td><td><b>非必选</b>；§10.4.1</td></tr>
<tr><td><code>ui.start</code> / <code>ui.stop</code> / <code>tap</code> / <code>swipe</code></td><td style="white-space:nowrap">§13</td></tr>
<tr><td><code>stream.start</code> / <code>stream.accept</code> / <code>stream.stop</code> / <code>stream.join</code></td><td style="white-space:nowrap">§14</td></tr>
</tbody>
</table>
</div>

### A.3 字段索引

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">定义位置</th></tr></thead>
<tbody>
<tr><td><code>occupancy</code></td><td>§10.5、§11.1</td></tr>
<tr><td><code>constraint</code>（使用约束）</td><td>§10.2、§10.6</td></tr>
<tr><td><code>state</code> = <code>online</code> / <code>offline</code></td><td>§11.1</td></tr>
<tr><td><code>holder</code> / <code>busy</code> / <code>streams</code></td><td>§11.1、§14.5</td></tr>
<tr><td><code>token</code></td><td>§11.3、§13.4（UI）</td></tr>
<tr><td><code>bmahs_code</code>（error.data）</td><td>§8.4、§9</td></tr>
<tr><td>端点 <code>preempt</code></td><td>§14.2</td></tr>
<tr><td><code>stream</code> URI</td><td>§14.4（禁止出现在发现层）</td></tr>
</tbody>
</table>
</div>

### A.4 错误码索引

<p>见 §9。<code>occupied</code>（-32001）仅限 exclusive 使用；错误码 <code>busy</code> 与公告字段 <code>busy</code> 同名不同义。</p>
