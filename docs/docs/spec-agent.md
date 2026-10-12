---
title: "智能体与协议客户端义务"
description: "实现 BMAHS 的智能体 / 协议客户端必须遵守的十二条义务。"
eyebrow: "规范全文 · 第 12 章"
---

<p class="eyebrow">规范全文 · 第 12 章</p>

# 智能体与协议客户端义务

<p>实现 BMAHS 的智能体运行时 / 协议客户端<b>必须</b>遵守：</p>

<ol>
<li>收到 <code>hello</code> 通知后，仅把 <code>operations</code> 登记为可用方法；<b>必须</b>把 <code>name</code> / <code>summary</code> / <code>constraint</code> / 各 <code>description</code> / <code>result</code> / <code>security.notes</code> 交给模型。参数 schema <b>必须</b>来自 <code>args</code>。把 <code>security.deny</code> / <code>confirm</code> / <code>occupancy</code> 当作硬约束。</li>
<li>发现列表选型优先使用 <code>name</code> + <code>summary</code>。</li>
<li><b>先读 <code>security.occupancy</code></b>（及 announce 摘要）：<ul>
<li><code>last-wins</code>：直接发业务方法调用，<code>params</code> 带 <code>agent</code>；<b>不要</b>走 occupy-token-release；不要因清单中没有 <code>occupy</code> 而拒绝控制。多步任务每步前调 <code>who</code>；<code>holder</code> 变了即停。</li>
<li><code>exclusive</code>：先查是否已被占用；使用前 <code>occupy</code> 并保存 <code>token</code>；后续控制与 <code>release</code> 带同一 <code>token</code> 与 <code>agent</code>；任务结束（含失败/取消）<b>必须</b> <code>release</code>。默认 60 s 租约兜底；仅 <code>ttl=9999</code> 卡住时才需重启设备。</li>
</ul></li>
<li>网关南向（southbound：面向被接入存量设备的一侧）使用设备时是普通 <code>agent</code>，<b>遵循同一套协议</b>，不得另开特权控制口：对 <code>last-wins</code> <b>不得</b>再自动 occupy；对 <code>exclusive</code> 可代 occupy，但 token 留在运行时，<b>不得</b>交给模型。</li>
<li>收到 <code>goodbye</code>，或超过删除时限未收到 <code>announce</code> 更新，从列表删除该 <code>id</code>，丢弃对应 token。</li>
<li>未知 <code>service</code> 时只展示（<code>describe</code> / <code>info</code> / <code>who</code>），<b>不得</b>猜测未声明的 <code>method</code>。</li>
<li><b>不得</b>把 <code>token</code>、流 URI 写入组播、日志聚合或离开本机的遥测；<b>不得</b>将其放入模型上下文。</li>
<li>无 <code>ui</code> <b>不得</b>猜测画面通道；有 <code>ui</code> 则仅按第 13 章收帧；<code>tap</code> / <code>swipe</code> 按<b>当前帧</b>逻辑分辨率映射。</li>
<li>无 <code>endpoints</code> <b>不得</b>猜测媒体通道；有则按第 14 章由<b>协议客户端</b>对接两端点：优先 <code>stream.join</code>（Sink 自连），否则客户端中继。<b>模型只决定“把谁接到谁”，不搬字节。</b> 真实 BMAHS 两端不必经网关产品的 <code>route</code>；一端为网关虚拟设备时，对该虚拟设备的 <code>control</code> 发同一套对接。</li>
<li><b>不得</b>要求智能体理解虚拟设备背后的蓝牙 / GATT 等私有协议。</li>
<li><b>不得</b>使用 JSON-RPC 批量数组（§8.6）；<code>id</code> 关联的响应与请求必须在同一 TCP 连接上匹配。</li>
<li>收到错误响应时<b>应当</b>以 <code>error.data.bmahs_code</code> 判定错误类别并决定重试策略（<code>retryable=false</code> 的错误不得自动重试）。</li>
</ol>
