---
title: "一致性要求与实现清单"
description: "设备一致性清单、建议默认端口、联调验收要点与禁止行为清单。"
eyebrow: "规范全文 · 第 18 章"
---

<p class="eyebrow">规范全文 · 第 18 章</p>

# 一致性要求与实现清单


### 18.1 设备固件 / 嵌入式软件一致性清单

<ul>
<li>☐ 取得 IPv4 / IPv6 并写入 <code>ip</code> / <code>ipv6</code></li>
<li>☐ 固化 <code>id</code>、<code>type</code>、<code>service</code>、自然语言 <code>name</code> / <code>summary</code>、<code>model</code></li>
<li>☐ 选定并公告 <code>security.occupancy</code>（有 <code>ui</code> 则必须 <code>exclusive</code>）</li>
<li>☐ 业务端口双栈监听；按 §15.1 发 <code>announce</code>（<code>protocol=bmahs/1.2</code>，<code>state=online</code>）；稳态间隔默认 5 秒</li>
<li>☐ 应答 <code>query</code>；地址变化刷新发布（§6.4）；退出发两次 <code>goodbye</code> 并停全部流</li>
<li>☐ Bonjour <code>_bmahs._tcp</code>，TXT 按 §17</li>
<li>☐ TCP 连接后立刻发 <code>hello</code> <b>通知</b>（JSON-RPC，无 id），params 含完整 <code>operations</code> / <code>security</code>（含 occupancy），不含 token / 流 URI</li>
<li>☐ 请求解析符合 JSON-RPC 2.0：<code>jsonrpc</code> 校验、<code>id</code> 关联、对象形式 <code>params</code>、非法 JSON 回 <code>-32700</code>、非法信封回 <code>-32600</code></li>
<li>☐ 实现 <code>describe</code> / <code>info</code> / <code>who</code>；<code>exclusive</code> 另实现 <code>occupy</code> / <code>release</code> 与 token</li>
<li>☐ 错误响应含整数 <code>code</code>（第 9 章映射）、自然语言 <code>message</code>、<code>data.bmahs_code</code> 与 <code>data.retryable</code></li>
<li>☐ 不把 <code>register</code> 当作必选；不使用 <code>registered</code> / <code>managed</code></li>
<li>☐ <code>last-wins</code>：控制立即执行并更新 <code>holder</code>；不回 <code>occupied</code>；不发 token</li>
<li>☐ <code>exclusive</code>：校验 token 与 agent 绑定；默认租约 60 s；至少 2 路 TCP</li>
<li>☐ 在 <code>hello</code> 通知 params / <code>describe</code> result 中给出 <code>constraint</code>（使用约束，§10.6）；两处一致，遵守不写密钥，不与 <code>operations</code> / <code>security</code> 冲突</li>
<li>☐ 可选 <code>confirm</code>（§10.7）；可选 <code>event</code> 通知</li>
<li>☐ （有 UI）exclusive + §13 二进制流 + 占用 token 握手；release 必停 UI</li>
<li>☐ （有端点）§14：input <b>应当</b>实现 <code>stream.join</code>；媒体 TCP 无握手；URI 仅开流后返回；控制不拆流；抢占按 <code>preempt</code></li>
</ul>

### 18.2 建议默认端口

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">用途</th><th style="white-space:nowrap">默认端口</th></tr></thead>
<tbody>
<tr><td><code>control</code>（JSON-RPC over TCP）</td><td style="white-space:nowrap"><b>9527</b></td></tr>
<tr><td style="white-space:nowrap">UI 流</td><td style="white-space:nowrap"><b>9531</b></td></tr>
<tr><td style="white-space:nowrap">数据流</td><td><b>9532</b>（开流响应如实返回实际端口；每次会话使用新 URI，作废的 URI 不得复用，见 §14.4）</td></tr>
</tbody>
</table>
</div>

### 18.3 联调验收要点

<p>同一局域网内：</p>

<ol>
<li>发现<b>应当</b>打印 <code>id</code>、<code>occupancy</code>、<code>control</code>、<code>state=online</code>；</li>
<li>TCP 连上立刻收到 <code>hello</code> 通知（含 <code>jsonrpc:&quot;2.0&quot;</code>、无 <code>id</code>）；</li>
<li>发送非法 JSON 行应当得到 <code>-32700</code> 错误；发送非法信封应当得到 <code>-32600</code>；未知方法应当得到 <code>-32601</code>；</li>
<li><code>last-wins</code> 设备不 occupy 即可调用业务方法；响应 <code>id</code> 与请求 <code>id</code> 一一对应；</li>
<li>对接两端点时，模型侧上下文<b>不应当</b>出现流 URI。</li>
</ol>

### 18.4 禁止行为清单（规范性）

<ul>
<li>不得在组播里发送密码、<code>token</code>、流 URI、用户账号、画面；</li>
<li>不得把 <code>announce</code> 当业务状态推送；</li>
<li>不得以 <code>127.0.0.1</code> 作为对外 <code>ip</code>；</li>
<li>不得修改组播地址 / 端口；</li>
<li>不得用新 <code>kind</code> 代替 <code>announce</code> / <code>query</code> / <code>goodbye</code>；</li>
<li>不得把 <code>register</code> 写成所有设备的必选方法；不得把 <code>registered</code> 写成在线空闲态；</li>
<li>不得让 <code>last-wins</code> 设备因未 occupy 而拒绝控制；</li>
<li>不得规定真实设备对接必须经网关 <code>route</code>；</li>
<li>不得让模型中继媒体或持有流 URI / token；</li>
<li>不得为数据流再发明流票；不得在媒体 TCP 上强制占用 token 握手（UI 流除外）；</li>
<li>不得在 <code>last-wins</code> 更换 holder 时拆掉数据流；</li>
<li>不得在控制 JSON 里传整帧图像；</li>
<li>不得只用机器码冒充说明；</li>
<li>不得用 USB bulk 或纯串口代替 IP 上的发现与 <code>control</code>；</li>
<li><b>不得</b>在控制通道使用 JSON-RPC 批量数组或位置参数（<code>params</code> 必须为对象）。</li>
</ul>
