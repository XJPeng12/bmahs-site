---
title: "协议总体架构"
description: "发现层 / 使用层 / 数据流层的分层模型、角色约束、交互总览与新硬件类型接入要求。"
eyebrow: "规范全文 · 第 5 章"
---

<p class="eyebrow">规范全文 · 第 5 章</p>

# 协议总体架构


### 5.1 分层模型

<div class="figure">
<svg viewBox="0 0 680 340" role="img" aria-label="BMAHS 分层模型：发现层、使用层，以及数据流层的两个可选剖面">
<rect class="dg-agent" x="20" y="10" width="640" height="62" rx="10"/>
<rect x="36" y="24" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="41" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">01</text>
<text class="dg-t" x="74" y="38">发现层</text>
<text class="dg-m" x="74" y="56">Discovery</text>
<rect class="dg-chip" x="150" y="24" width="172" height="24" rx="6"/>
<text class="dg-m" x="158" y="40">UDP 组播 + Bonjour（非 RPC）</text>
<text class="dg-m" x="150" y="62">普通 JSON，一报文一对象 ≤1400 字节</text>
<text class="dg-m" x="654" y="40" text-anchor="end">第 6、15 章</text>

<line class="dg-tick" x1="340" y1="74" x2="340" y2="82"/>

<rect class="dg-proto" x="20" y="84" width="640" height="62" rx="10"/>
<rect x="36" y="98" width="26" height="26" rx="7" style="fill:rgba(255,255,255,.92)"/>
<text x="49" y="115" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:var(--accent-text)">02</text>
<text class="dg-t-inv" x="74" y="108">使用层</text>
<text class="dg-m-inv" x="74" y="126">Control</text>
<rect x="150" y="98" width="210" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="158" y="114">JSON-RPC 2.0 over TCP（一行一消息）</text>
<text class="dg-m-inv" x="150" y="136">occupancy + operations 语义约束贯穿本层与数据流层</text>
<text class="dg-m-inv" x="654" y="110" text-anchor="end">第 8、9、16 章</text>
<text class="dg-m-inv" x="654" y="126" text-anchor="end">第 10、11 章</text>

<line class="dg-tick" x1="340" y1="148" x2="340" y2="156"/>

<rect x="20" y="158" width="640" height="166" rx="12" style="fill:none;stroke:var(--border-strong);stroke-dasharray:5 4"/>
<text class="dg-t" x="34" y="180">数据流层 · 二进制帧</text>
<text class="dg-s" x="34" y="196">不走 JSON-RPC · 可选剖面，设备按需声明</text>

<rect class="dg-dev" x="34" y="204" width="612" height="52" rx="8"/>
<text class="dg-l" x="50" y="234">UI接口（可选）</text>
<rect class="dg-chip" x="210" y="214" width="126" height="24" rx="6"/>
<text class="dg-m" x="218" y="230">exclusive + token 握手</text>
<rect class="dg-chip" x="344" y="214" width="92" height="24" rx="6"/>
<text class="dg-m" x="352" y="230">JPEG 二进制帧</text>
<text class="dg-m" x="654" y="234" text-anchor="end">第 13 章</text>

<rect class="dg-dev" x="34" y="264" width="612" height="52" rx="8"/>
<text class="dg-l" x="50" y="294">端点与数据流（可选）</text>
<rect class="dg-chip" x="210" y="274" width="140" height="24" rx="6"/>
<text class="dg-m" x="218" y="290">会话与 occupancy 正交</text>
<rect class="dg-chip" x="358" y="274" width="88" height="24" rx="6"/>
<text class="dg-m" x="366" y="290">join / 中继对接</text>
<text class="dg-m" x="654" y="294" text-anchor="end">第 14 章</text>
</svg>
<p class="figure__cap">图 5-1 · 分层模型：发现层组播身份，使用层承载控制，数据流层提供两个可选剖面</p>
</div>

### 5.2 角色与数据流层边界

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">角色</th><th style="white-space:nowrap">职责</th><th style="white-space:nowrap">约束</th></tr></thead>
<tbody>
<tr><td>BMAHS 设备</td><td>发布自己、应答发现、发 <code>hello</code> 通知、按 occupancy 接受 JSON-RPC 控制、按声明提供 UI/端点流</td><td>虚拟设备与真实设备同构</td></tr>
<tr><td style="white-space:nowrap">智能体</td><td>发起发现、选型、下发控制方法调用</td><td><b>不得</b>承担数据流层（不得经手 PCM、帧、流 URI）</td></tr>
<tr><td>协议客户端</td><td>执行 JSON-RPC 调用序列；对接两端点时拷贝字节或驱动 Sink 自连</td><td>与智能体使用同一套协议规则</td></tr>
<tr><td style="white-space:nowrap">转发者</td><td>任意能完成 §14.3 对接规程的客户端</td><td>非特殊设备类型，无需登记</td></tr>
</tbody>
</table>
</div>

### 5.3 交互总览

<div class="figure">
<svg viewBox="0 0 680 366" role="img" aria-label="BMAHS 交互总览：发现、建立连接、hello 通知、双向 JSON-RPC，以及可选的数据流层">
<defs>
<marker id="sa1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="saA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
<marker id="saG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--green)"/>
</marker>
</defs>

<rect class="dg-dev" x="20" y="16" width="170" height="44" rx="10"/>
<text class="dg-t" x="105" y="34" text-anchor="middle">BMAHS 设备</text>
<text class="dg-s" x="105" y="50" text-anchor="middle">自述 · 发布 · 提供流</text>

<rect class="dg-agent" x="490" y="16" width="170" height="44" rx="10"/>
<text class="dg-t" x="575" y="34" text-anchor="middle">智能体 / 协议客户端</text>
<text class="dg-s" x="575" y="50" text-anchor="middle">发起发现 · 下发控制</text>

<line x1="105" y1="60" x2="105" y2="344" style="stroke:var(--border-strong);stroke-dasharray:4 4;fill:none"/>
<line x1="575" y1="60" x2="575" y2="344" style="stroke:var(--border-strong);stroke-dasharray:4 4;fill:none"/>

<text class="dg-m" x="340" y="84" text-anchor="middle">announce / goodbye —— 发现组播（UDP）</text>
<line class="dg-line" x1="109" y1="92" x2="571" y2="92" marker-end="url(#sa1)"/>

<text class="dg-m" x="340" y="114" text-anchor="middle">query —— 按需查询（UDP）</text>
<line class="dg-line" x1="571" y1="122" x2="109" y2="122" marker-end="url(#sa1)"/>

<text class="dg-m" x="340" y="154" text-anchor="middle">打开 control 连接（tcp://IP:PORT）</text>
<line class="dg-line--accent" x1="571" y1="162" x2="109" y2="162" marker-end="url(#saA)"/>

<text class="dg-m" x="340" y="184" text-anchor="middle">设备立即推送 hello 通知（JSON-RPC notification）</text>
<line class="dg-line--accent" x1="109" y1="192" x2="571" y2="192" marker-end="url(#saA)"/>

<text class="dg-m" x="340" y="220" text-anchor="middle">JSON-RPC 2.0 双向 · 一行一消息：请求 / 响应 / 错误</text>
<line class="dg-line--accent" x1="109" y1="228" x2="571" y2="228" marker-start="url(#saA)" marker-end="url(#saA)"/>

<rect x="54" y="250" width="572" height="96" rx="10" style="fill:none;stroke:var(--border-strong);stroke-dasharray:5 4"/>
<text class="dg-mk" x="70" y="266">可选 · 数据流层（由 hello 通知声明）</text>

<text class="dg-m" x="340" y="282" text-anchor="middle">声明 ui：另开 UI 流（9531）—— 画面不走 JSON-RPC</text>
<line x1="109" y1="290" x2="571" y2="290" style="stroke:var(--green);stroke-width:1.6;fill:none" marker-end="url(#saG)"/>

<text class="dg-m" x="340" y="314" text-anchor="middle">声明 endpoints：按第 14 章规程对接两端点 —— 媒体不走 JSON-RPC</text>
<line x1="109" y1="322" x2="571" y2="322" style="stroke:var(--green);stroke-width:1.6;fill:none" marker-start="url(#saG)" marker-end="url(#saG)"/>
</svg>
<p class="figure__cap">图 5-2 · 交互总览：先发现、再连接、hello 先推送、其后双向 RPC；数据流层仅在声明后打开</p>
</div>

### 5.4 新硬件类型接入要求

<p>新硬件接入本协议时<b>应当</b>：</p>

<ol>
<li>选择一个小写英文 <code>type</code>（如 <code>light</code>、<code>display</code>、<code>lock</code>、<code>phone</code>）；</li>
<li>定义 <code>service = {type}/{主版本}</code>；</li>
<li>提供完整 <code>operations</code>（操作清单）、<code>constraint</code>（使用约束，§10.6）与 <code>security</code>（安全边界，含 <code>occupancy</code>）；</li>
<li>在 <code>announce</code> 中以 <code>capabilities</code> / <code>security</code> 做摘要；</li>
<li>按第 15、16 章实现发布与 <code>control</code>；</li>
<li>有可操作画面时：<code>occupancy</code> <b>必须</b>为 <code>exclusive</code>，<code>capabilities</code> 加入 <code>ui</code>（有触控再加 <code>tap</code> / <code>swipe</code>），并实现第 13 章；</li>
<li>可产/可消费媒体时：在 <code>hello</code> 通知参数中声明 <code>endpoints</code>，并实现第 14 章。</li>
</ol>

<p>新硬件<b>不得</b>修改发现组播地址与端口。</p>
