---
title: "错误码规范"
description: "BMAHS bmahs_code 到 JSON-RPC 错误码的映射表与 retryable 语义。"
eyebrow: "规范全文 · 第 9 章"
---

<p class="eyebrow">规范全文 · 第 9 章</p>

# 错误码规范


### 9.1 BMAHS 错误码 → JSON-RPC 错误码映射（必须）

<div class="table-wrap">
<table>
<thead><tr><th>BMAHS <code>bmahs_code</code></th><th>JSON-RPC <code>code</code></th><th><code>retryable</code></th><th style="white-space:nowrap">触发条件</th></tr></thead>
<tbody>
<tr><td><code>unknown-action</code></td><td><b>-32601</b>（Method not found）</td><td>false</td><td><code>method</code> 不在 <code>operations</code> 中</td></tr>
<tr><td><code>bad-arg</code></td><td><b>-32602</b>（Invalid params）</td><td>false</td><td>参数缺失、类型或范围错误；对接时 kind/media 不匹配</td></tr>
<tr><td><code>parse-error</code></td><td><b>-32700</b>（Parse error）</td><td>false</td><td>行不是合法 JSON</td></tr>
<tr><td><code>invalid-request</code></td><td><b>-32600</b>（Invalid Request）</td><td>false</td><td>非法 JSON-RPC 信封（缺 <code>jsonrpc</code>、<code>method</code> 非字符串等）</td></tr>
<tr><td><code>internal-error</code></td><td><b>-32603</b>（Internal error）</td><td>false</td><td>设备内部错误</td></tr>
<tr><td><code>occupied</code></td><td><b>-32001</b></td><td style="white-space:nowrap">true</td><td><b>仅 exclusive</b>：已被其它智能体占用。<code>last-wins</code> 控制<b>不得</b>使用</td></tr>
<tr><td><code>offline</code></td><td><b>-32002</b></td><td style="white-space:nowrap">true</td><td>设备已离线或即将退出</td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td><b>-32003</b></td><td style="white-space:nowrap">true</td><td>暂时无法执行，或端点会话已满且 <code>preempt=false</code></td></tr>
<tr><td><code>unauthorized</code></td><td><b>-32004</b></td><td>false</td><td>exclusive 的 <code>token</code> 缺失或不匹配</td></tr>
<tr><td><code>denied</code></td><td><b>-32005</b></td><td>false</td><td>触犯 <code>security.deny</code> 或未过 <code>confirm</code>；默认不可重试，仅确认超时时 <code>data.retryable=true</code></td></tr>
<tr><td><code>bad-state</code></td><td><b>-32006</b></td><td>false</td><td>方法在当前状态下不可用（如未 <code>ui.start</code> 即 <code>tap</code>）</td></tr>
</tbody>
</table>
</div>

<p><b>规范性要求</b>：</p>

<ul>
<li>设备<b>必须</b>在 <code>error.data.bmahs_code</code> 中回传 BMAHS 字符串错误码；客户端<b>应当</b>以 <code>bmahs_code</code>（而非裸整数）作为稳定判据。</li>
<li>JSON-RPC 保留区间 <code>-32768 ~ -32000</code> 中的 <code>-32700 / -32600 / -32601 / -32602 / -32603</code> 含义与 JSON-RPC 2.0 规范一致；BMAHS 专用码占用 <code>-32001 ~ -32006</code>。</li>
</ul>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">注意</div>
    错误码 <code>busy</code> 与公告字段 <code>busy</code> 同名不同义。
</div>
</div>
