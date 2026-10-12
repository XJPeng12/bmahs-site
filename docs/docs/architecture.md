---
title: "架构与生态位"
description: "BMAHS 的三层架构（发现层 / 使用层 / 数据流层）、四种角色，以及“智能体不搬字节”的数据流层边界。"
eyebrow: "核心概念 / 架构"
---

<p class="eyebrow">核心概念 / 架构</p>

# 架构与生态位

<p class="lead">
  BMAHS 是一份<b>独立的协议规范</b>：发现层用 UDP 组播 + Bonjour，
  使用层是 TCP 上的 JSON-RPC 2.0，数据流层走二进制的 UI 流与数据流。
  三层架构各司其职，<b>智能体只做决策，不搬字节</b>。
</p>

## 三层架构

<div class="figure">
<svg viewBox="0 0 680 486" role="img" aria-label="BMAHS 三层架构：发现层、使用层、数据流层，以及智能体不搬字节的角色边界">
<defs>
<marker id="ar1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="arA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<rect class="dg-agent" x="20" y="10" width="296" height="54" rx="10"/>
<text class="dg-t" x="38" y="32">智能体（LLM）</text>
<text class="dg-s" x="38" y="51">只做决策 · 不搬字节</text>

<rect class="dg-gray" x="364" y="10" width="296" height="54" rx="10"/>
<text class="dg-t" x="382" y="32">协议客户端 / 转发者</text>
<text class="dg-s" x="382" y="51">执行调用序列 · 可经手字节</text>

<line class="dg-line--accent" x1="320" y1="37" x2="358" y2="37" marker-end="url(#arA)"/>

<line class="dg-line" x1="340" y1="66" x2="340" y2="86" marker-start="url(#ar1)" marker-end="url(#ar1)"/>
<text class="dg-mk" x="352" y="80">发现 · 控制</text>

<rect class="dg-agent" x="20" y="88" width="640" height="92" rx="10"/>
<rect x="36" y="102" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="119" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">01</text>
<text class="dg-t" x="74" y="117">发现层</text>
<text class="dg-m" x="74" y="135">Discovery</text>
<rect class="dg-chip" x="170" y="102" width="120" height="24" rx="6"/>
<text class="dg-m" x="178" y="118">UDP 组播 + Bonjour</text>
<rect class="dg-chip" x="298" y="102" width="150" height="24" rx="6"/>
<text class="dg-m" x="306" y="118">普通 JSON ≤ 1400 B</text>
<rect class="dg-chip" x="482" y="102" width="162" height="24" rx="12"/>
<text class="dg-m" x="563" y="118" text-anchor="middle">组播 · 非 RPC</text>
<rect class="dg-chip" x="170" y="132" width="170" height="24" rx="6"/>
<text class="dg-m" x="178" y="148">announce / query / goodbye</text>
<rect class="dg-chip" x="348" y="132" width="60" height="24" rx="6"/>
<text class="dg-m" x="356" y="148">组播身份</text>
<text class="dg-m" x="170" y="168">无 token · 无流 URI · 无账号 · 无画面</text>

<line class="dg-tick" x1="340" y1="178" x2="340" y2="188"/>

<rect class="dg-proto" x="20" y="186" width="640" height="92" rx="10"/>
<rect x="36" y="200" width="26" height="26" rx="7" style="fill:rgba(255,255,255,.92)"/>
<text x="49" y="217" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:var(--accent-text)">02</text>
<text class="dg-t-inv" x="74" y="215">使用层</text>
<text class="dg-m-inv" x="74" y="233">Control</text>
<rect x="170" y="200" width="136" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="178" y="216">TCP · 默认 9527</text>
<rect x="314" y="200" width="88" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="322" y="216">JSON-RPC 2.0</text>
<rect x="482" y="200" width="162" height="24" rx="12" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="563" y="216" text-anchor="middle">请求 / 响应 · 双向</text>
<rect x="170" y="230" width="186" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="178" y="246">hello · describe · info / who</text>
<rect x="364" y="230" width="110" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="372" y="246">occupy / release</text>
<text class="dg-m-inv" x="170" y="266">occupancy + operations 语义约束贯穿本层与数据流层</text>

<line class="dg-tick" x1="340" y1="276" x2="340" y2="286"/>

<rect class="dg-dev" x="20" y="284" width="640" height="92" rx="10"/>
<rect x="36" y="298" width="26" height="26" rx="7" style="fill:var(--green)"/>
<text x="49" y="315" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">03</text>
<text class="dg-t" x="74" y="313">数据流层</text>
<text class="dg-m" x="74" y="331">Data</text>
<rect class="dg-chip" x="170" y="298" width="140" height="24" rx="6"/>
<text class="dg-m" x="178" y="314">UI 流 9531 · JPEG 帧</text>
<rect class="dg-chip" x="318" y="298" width="58" height="24" rx="6"/>
<text class="dg-m" x="326" y="314">二进制帧</text>
<rect class="dg-chip" x="482" y="298" width="162" height="24" rx="12"/>
<text class="dg-m" x="563" y="314" text-anchor="middle">单向流 · 二进制</text>
<rect class="dg-chip" x="170" y="328" width="186" height="24" rx="6"/>
<text class="dg-m" x="178" y="344">数据流 9532 · format 载荷</text>
<text class="dg-m" x="170" y="364">UI接口：exclusive + token 握手 ｜ 端点与数据流：会话与 occupancy 正交</text>

<line class="dg-line" x1="340" y1="378" x2="340" y2="398" marker-start="url(#ar1)" marker-end="url(#ar1)"/>
<text class="dg-mk" x="352" y="392">UI 流 · 数据流</text>

<rect class="dg-dev" x="20" y="400" width="640" height="54" rx="10"/>
<text class="dg-t" x="38" y="422">BMAHS 设备</text>
<text class="dg-s" x="38" y="440">原生或经网关 · 自述发布 · 按 occupancy 接受控制 · 按声明提供 UI / 端点流</text>
<rect class="dg-chip" x="482" y="414" width="162" height="24" rx="12"/>
<text class="dg-m" x="563" y="430" text-anchor="middle">虚拟与真实设备同构</text>

<text class="dg-m" x="20" y="474">智能体只走发现层与使用层 —— 数据流层字节由协议客户端与设备（Sink）直接传输，模型上下文永远不含 PCM / 帧</text>
</svg>
<p class="figure__cap">图 1 · 三层架构：发现层组播身份，控制承载指令，数据只传帧与媒体 —— 智能体只做决策，不搬字节</p>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">层</th><th style="white-space:nowrap">承载</th><th style="white-space:nowrap">编码</th><th>绝不允许出现在这里</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><b>发现层</b></td><td>UDP 组播（239.255.42.42:5354 / ff02::4242）+ Bonjour <code>_bmahs._tcp</code></td><td>普通 JSON / TXT</td><td><code>token</code>、流 URI、账号、画面</td></tr>
<tr><td style="white-space:nowrap"><b>使用层</b></td><td>TCP（默认 9527）</td><td>JSON-RPC 2.0，一行一消息</td><td>整帧图像、连续媒体载荷</td></tr>
<tr><td style="white-space:nowrap"><b>数据流层</b></td><td>UI 流（9531）/ 数据流（9532）</td><td>二进制帧 / <code>format</code> 载荷</td><td>JSON 信封</td></tr>
</tbody>
</table>
</div>

## 四种角色与数据流层边界

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">角色</th><th style="white-space:nowrap">职责</th><th style="white-space:nowrap">约束</th></tr></thead>
<tbody>
<tr><td><b>BMAHS 设备</b></td><td>发布自己、应答发现、发 <code>hello</code> 通知、按 occupancy 接受控制、按声明提供 UI / 端点流</td><td>虚拟设备与真实设备<b>同构</b></td></tr>
<tr><td style="white-space:nowrap"><b>智能体</b></td><td>发起发现、选型、下发控制方法调用</td><td><b>不得承担数据流层</b>：不得经手 PCM、帧、流 URI</td></tr>
<tr><td><b>协议客户端</b></td><td>执行 JSON-RPC 调用序列；对接两端点时拷贝字节或驱动 Sink 自连</td><td>与智能体使用<b>同一套</b>协议规则</td></tr>
<tr><td style="white-space:nowrap"><b>转发者</b></td><td>任意能完成端点对接规程的客户端</td><td>非特殊设备类型，无需登记</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">模型只决定“把谁接到谁”，不搬字节</div>
    这是 BMAHS 最重要的一条数据流层边界：编排是<b>决策</b>，传输是<b>执行</b>。
    把一条音源接到两只音箱，智能体发出的是 <code>stream.join</code> 这样的<b>控制指令</b>，
    字节流由协议客户端或 Sink 设备自己走 —— 模型的上下文里永远不该出现 PCM。
</div>
</div>

## 网关的位置：南向（southbound）也是普通智能体

<p>
  网关把存量硬件（蓝牙、AirPlay、红外…）翻译成统一的 BMAHS 自述对外发布。这里<b>南向（southbound）</b>指网关面向被接入存量设备的一侧，与之相对的北向才是智能体看到的一侧。
  关键在于：网关做南向控制时，走的也是<b>同一套协议规则</b>，没有特权通道 ——
  对 <code>last-wins</code> 设备不得再自动 occupy；对 <code>exclusive</code> 设备可代为 occupy，
  但 token 留在运行时，<b>不得交给模型</b>。
</p>

<div class="figure">
<svg viewBox="0 0 680 404" role="img" aria-label="三层部署：智能体层、BMAHS 设备层（原生设备与网关同层）、传统设备层（蓝牙 / Wi-Fi / 其他存量设备）">
<defs>
<marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="aA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<rect class="dg-agent" x="20" y="10" width="640" height="54" rx="10"/>
<rect x="36" y="24" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="41" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">01</text>
<text class="dg-t" x="74" y="34">智能体层</text>
<text class="dg-s" x="74" y="52">任何协议客户端 · 发起发现、选型 · 下发控制</text>
<rect class="dg-chip" x="482" y="24" width="162" height="24" rx="12"/>
<text class="dg-m" x="563" y="40" text-anchor="middle">同一套协议规则 · 无特权</text>

<line class="dg-line--accent" x1="340" y1="66" x2="340" y2="90" marker-start="url(#aA)" marker-end="url(#aA)"/>
<text class="dg-mk" x="352" y="82">BMAHS 协议 · 发现 / 控制 / 数据流层</text>

<rect x="20" y="96" width="640" height="124" rx="12" style="fill:var(--bg);stroke:var(--border-strong);stroke-width:1.2"/>
<rect x="36" y="110" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="127" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">02</text>
<text class="dg-t" x="74" y="124">BMAHS 设备层</text>
<text class="dg-s" x="74" y="142">原生设备与网关同构 —— 统一发布为 BMAHS 自述</text>

<rect class="dg-dev" x="34" y="152" width="296" height="56" rx="8"/>
<text class="dg-l" x="50" y="174">原生 BMAHS 设备</text>
<text class="dg-m" x="50" y="192">speaker/1 · 自述发布 · 按 occupancy 接受控制</text>

<rect class="dg-proto" x="346" y="152" width="300" height="56" rx="8"/>
<text class="dg-l-inv" x="362" y="174">BMAHS 网关</text>
<rect x="478" y="160" width="152" height="24" rx="12" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="554" y="176" text-anchor="middle">南向也是普通智能体</text>
<text class="dg-m-inv" x="362" y="192">存量硬件 → 统一 BMAHS 自述 · 无特权通道</text>

<line class="dg-line" x1="496" y1="220" x2="496" y2="244"/>
<line class="dg-line" x1="134" y1="244" x2="546" y2="244"/>
<line class="dg-line" x1="134" y1="244" x2="134" y2="268" marker-end="url(#a3)"/>
<line class="dg-line" x1="340" y1="244" x2="340" y2="268" marker-end="url(#a3)"/>
<line class="dg-line" x1="546" y1="244" x2="546" y2="268" marker-end="url(#a3)"/>
<text class="dg-mk" x="340" y="238" text-anchor="middle">南向 · 存量物理层（蓝牙 / Wi-Fi / 红外…）</text>

<rect x="20" y="272" width="640" height="96" rx="12" style="fill:var(--bg);stroke:var(--border-strong);stroke-width:1.2"/>
<rect x="36" y="284" width="26" height="26" rx="7" style="fill:var(--green)"/>
<text x="49" y="301" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">03</text>
<text class="dg-t" x="74" y="298">传统设备层</text>
<text class="dg-s" x="74" y="316">智能体不可见 · 品牌与物理层差异被吸收在网关内</text>

<rect class="dg-dev" x="34" y="324" width="196" height="40" rx="8"/>
<text class="dg-l" x="50" y="341">存量蓝牙音箱</text>
<text class="dg-m" x="50" y="356">蓝牙 · 即插即用，存量保留</text>

<rect class="dg-dev" x="242" y="324" width="196" height="40" rx="8"/>
<text class="dg-l" x="258" y="341">AirPlay / 网络音箱</text>
<text class="dg-m" x="258" y="356">Wi-Fi · 网关发布为 speaker/1</text>

<rect class="dg-dev" x="450" y="324" width="196" height="40" rx="8"/>
<text class="dg-l" x="466" y="341">红外 / 其他存量硬件</text>
<text class="dg-m" x="466" y="356">存量物理层 · 网关内吸收</text>

<text class="dg-m" x="20" y="392">原生设备与智能体直接说 BMAHS；传统设备对智能体不可见 —— 品牌与物理层差异全部被吸收在网关内</text>
</svg>
<p class="figure__cap">图 2 · 三层部署：网关与原生设备同属 BMAHS 设备层；传统设备层对智能体不可见，差异被吸收在网关内</p>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">设计取向</div>
    品牌与协议的差异被<b>集中吸收在网关</b>里，越往上越统一。
    智能体这一侧永远只面对一套语义 —— 这也是“能力组合”能跨品牌成立的前提。
</div>
</div>

## 生态坐标

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">对比对象</th><th>它解决什么</th><th>BMAHS 的差异化</th></tr></thead>
<tbody>
<tr><td>Matter / HomeKit</td><td>设备 ↔ 设备互联（控制指令互通）</td><td>面向<b>智能体语义</b>：自然语言自述、操作清单、协议级安全边界、占用租约、任务编排</td></tr>
<tr><td>米家等厂商生态</td><td>单一品牌闭环</td><td><b>品牌无关</b>，存量设备经网关即可接入</td></tr>
<tr><td>Home Assistant</td><td style="white-space:nowrap">平台软件</td><td>BMAHS 是协议规范、平台中立，HA 可作为接入方之一</td></tr>
<tr><td>小爱 / Alexa 等语音助手</td><td>在预置技能集里匹配指令</td><td><b>按能力清单现场编排</b>：覆盖范围 = 能力组合，而非已开发指令集</td></tr>
<tr><td>“AI-Ready” 类营销概念</td><td>通常指“接入某家云 AI”</td><td><b>BMAHS Ready</b> 是可自测、可验证、品牌无关的开放标准</td></tr>
</tbody>
</table>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/orchestration.html">
<div class="card__title">自然语言编排 ★ →</div>
<div class="card__desc">三层就绪之后，价值在哪里涌现。</div>
</a>
<a class="card" href="/docs/self-description.html">
<div class="card__title">设备自述 →</div>
<div class="card__desc">L1 语义就绪：设备上电递上的那张名片。</div>
</a>
</div>
