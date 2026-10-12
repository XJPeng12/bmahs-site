---
title: "互操作规范"
description: "对端行为矩阵、编码识别与传输安全（TLS 引入方式）说明。"
eyebrow: "规范全文 · 第 19 章"
---

<p class="eyebrow">规范全文 · 第 19 章</p>

# 互操作规范

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">对端</th><th style="white-space:nowrap">行为</th></tr></thead>
<tbody>
<tr><td><code>bmahs/1.2</code></td><td>按本规范处理（JSON-RPC 2.0 控制通道）</td></tr>
<tr><td style="white-space:nowrap"><code>protocol</code> 非 <code>bmahs/*</code>，或<b>主版本号</b> ≠ 1</td><td style="white-space:nowrap"><b>必须</b>丢弃</td></tr>
<tr><td style="white-space:nowrap"><code>bmahs/1.x</code>（主版本 1，次版本更高）</td><td>按本规范处理，未知字段忽略；不得假设次版本语义</td></tr>
<tr><td>未知 <code>type</code> / <code>service</code></td><td>发现层照常列出；使用层可只显示、不控制</td></tr>
</tbody>
</table>
</div>

<p><b>编码识别</b>：发现层 <code>protocol</code> 字段即编码标识（<code>bmahs/1.2</code> 为 JSON-RPC 2.0）。客户端<b>必须</b>按 <code>hello</code> 的实际形态（JSON-RPC 通知，无 <code>id</code>）自动识别，不得假设。</p>

<p><b>传输安全说明</b>：局域网占用令牌不是传输层认证。量产若需防伪造控制，<b>应当</b>叠加 TLS；TLS <b>必须</b>通过新的 <code>service</code> 修订引入，<b>不得</b>静默改变发现语义。JSON-RPC 通道同理：<code>id</code> 与 <code>method</code> 明文可见，敏感场景<b>应当</b>叠加 TLS 或本地链路加密。</p>
