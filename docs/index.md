---
layout: page
sidebar: false
aside: false
outline: false
titleTemplate: false
title: "BMAHS · 大模型智能体硬件规范（Big Model Agent Hardware Specification）"
description: "BMAHS 让硬件说“普通话”，为 AGI 就绪 —— 然后，一句话就能现场编排它们。"
---

<section class="hero">
<div class="hero__inner">
<div class="hero__grid">
<div>
<h1>让硬件说“普通话”，<br>为 AGI <em>就绪</em>。</h1>
<p class="hero__lead">
          AGI 站在物理世界门口，缺的不是智能，是<b>就绪度</b>——智能体读不懂设备、指挥不动设备、不敢授权设备。
          BMAHS 把设备的自述、能力清单与安全边界写成协议：<b>一句话，跨设备、跨品牌，现场编排</b>。
</p>
<div class="hero__cta">
<a class="btn btn--primary" href="/docs/quickstart.html">快速开始 →</a>
<a class="btn btn--ghost" href="/docs/intro.html">BMAHS 是什么</a>
</div>
</div>

<div class="code" style="margin:0">
<div class="code__head">
<span class="code__dot"></span><span class="code__dot"></span><span class="code__dot"></span>
<span class="code__name">orchestration.log</span>
<button class="code__copy" type="button">复制</button>
</div>

<pre><span class="tok-c"># 用户只说了一句话</span>
<span class="tok-s">"在电脑音箱和华为音箱上同时放《女儿》歌单"</span>

<span class="tok-c"># 智能体在运行时现场编排（非任何预设场景）</span>
<span class="tok-c"># 控制通道：TCP + JSON-RPC 2.0（bmahs/1.2）</span>
<span class="tok-f">describe</span> <span class="tok-s">"speaker-01"</span>   <span class="tok-p">→</span> stream.join · volume · last-wins（后到优先）
<span class="tok-f">describe</span> <span class="tok-s">"qq"</span>                <span class="tok-p">→</span> stream_out · max_sessions=<span class="tok-n">3</span>
<span class="tok-f">call</span> <span class="tok-s">"qq"</span>.<span class="tok-k">playlist_play</span>        <span class="tok-p">→</span> playback=playing
<span class="tok-f">call</span> <span class="tok-s">"speaker-01"</span>.<span class="tok-k">stream.join</span>   <span class="tok-p">→</span> audio/L16 · 48000Hz · 2ch
<span class="tok-f">call</span> <span class="tok-s">"speaker-02"</span>.<span class="tok-k">stream.join</span>    <span class="tok-p">→</span> audio/L16 · 48000Hz · 2ch

<span class="tok-c"># 两路流已就绪，跨品牌同步出声 —— 媒体字节不经过模型</span></pre>
</div>
</div>
</div>
</section>

<section class="section">
<div class="section__head">
<p class="section__kicker">问题</p>

## AGI 到物理世界，还有三道门没打开

<p>这三道门的根子是同一个：<b>设备与智能体之间没有共同语言</b>。方言不统一，就绪就无从谈起。</p>
</div>
<div class="grid3">
<div class="tile">
<p class="tile__num">01 / 感知</p>
<div class="tile__title">感知缺口 · 读不懂</div>
<p class="tile__desc">设备状态、传感器读数散落在私有格式里，没有面向智能体的统一自述。智能体无从知道现场正在发生什么。</p>
</div>
<div class="tile">
<p class="tile__num">02 / 行动</p>
<div class="tile__title">行动缺口 · 指挥不动</div>
<p class="tile__desc">能规划、能决策，却无法在物理世界“动手”：蓝牙、Wi-Fi、红外各说各话，硬件层没有面向智能体的统一协议。</p>
</div>
<div class="tile">
<p class="tile__num">03 / 信任</p>
<div class="tile__title">信任缺口 · 不敢授权</div>
<p class="tile__desc">如何授权、边界在哪、是否按规程操作、是否留痕 —— 没有共同语法可写，只能靠厂商口头承诺。</p>
</div>
</div>
</section>

<section class="section--subtle">
<div class="section__inner section--tight">
<div class="section__head">
<p class="section__kicker">核心突破点</p>

## 智能体自然语言编排

<p>
        现有智能设备是“<b>你说它听得懂的话</b>”——能力范围 = 厂商已开发指令集的并集；<br>
        BMAHS 是“<b>它听得懂你说的话</b>”——能力范围 = 能力清单的任意组合。
</p>
</div>
<div class="table-wrap">
<table>
<thead>
<tr><th style="white-space:nowrap">维度</th><th>现有智能设备（米家 / HomeKit / 小爱 / Alexa）</th><th>BMAHS 设备</th></tr>
</thead>
<tbody>
<tr><td style="white-space:nowrap">能力来源</td><td>厂商预先开发的技能 / 场景</td><td>设备自述的能力清单，<b>运行时读取</b></td></tr>
<tr><td style="white-space:nowrap">控制方式</td><td>固定语音指令 + 预设 IF-THEN 规则</td><td>自然语言意图，智能体现场拆解</td></tr>
<tr><td style="white-space:nowrap">覆盖范围</td><td>= 已开发指令集的并集</td><td>= <b>能力清单的任意组合</b></td></tr>
<tr><td>跨品牌协同</td><td>生态内闭环，跨品牌通常需逐家适配（Matter 等互操作标准正在改善，但多限于品类级指令）</td><td>品牌无关，经网关翻译即可互通，无需逐家适配</td></tr>
<tr><td style="white-space:nowrap">新增设备</td><td>需重新配置、等待厂商适配</td><td>上电即被发现，能力就绪即可入列</td></tr>
<tr><td style="white-space:nowrap"><b>谁在编排</b></td><td><b>厂家</b>（开发期）+ <b>用户</b>（配置期）</td><td><b>智能体</b>（运行时）</td></tr>
</tbody>
</table>
</div>
<p style="margin:0;font-size:15px;color:var(--text-soft)">
<b>一句话概括本质</b>：控制权从“预设”转移到“编排” —— 过去是人把所有可能性预先枚举，现在是智能体按意图即时生成。
</p>
</div>
</section>

<section class="section">
<div class="section__head">
<p class="section__kicker">就绪度三层 · Ready Stack</p>

## 三层齐备，才敢把家门钥匙交给 AGI

<p>就绪度是编排的验收标准。缺一层，编排就无从发生或不敢放手。</p>
</div>

<div class="figure" style="background:transparent;border:0;padding:0">
<svg viewBox="0 0 1040 208" role="img" aria-label="就绪度三层到自然语言编排的关系">
<defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<text class="dg-mk" x="0" y="16">READY STACK</text>
<text class="dg-mk" x="620" y="16">RESULT</text>

<rect class="dg-panel" x="0" y="30" width="1002" height="140" rx="12" style="fill:var(--bg-subtle)"/>
<text class="dg-m" x="20" y="52">三层缺一不可 —— 只有语义就绪，等于一本读得懂却动不了的说明书</text>

<rect class="dg-agent" x="24" y="66" width="212" height="84" rx="10"/>
<text class="dg-l" x="42" y="92">L1 语义就绪</text>
<text class="dg-s" x="42" y="110">能被懂 · 无需预置驱动</text>
<text class="dg-m" x="42" y="130">id · type · service · summary · constraint</text>

<line class="dg-line" x1="244" y1="108" x2="272" y2="108" marker-end="url(#ah)"/>

<rect class="dg-agent" x="280" y="66" width="212" height="84" rx="10"/>
<text class="dg-l" x="298" y="92">L2 动作就绪</text>
<text class="dg-s" x="298" y="110">能指挥 · 照单点菜</text>
<text class="dg-m" x="298" y="130">operations · endpoints</text>

<line class="dg-line" x1="500" y1="108" x2="528" y2="108" marker-end="url(#ah)"/>

<rect class="dg-agent" x="536" y="66" width="212" height="84" rx="10"/>
<text class="dg-l" x="554" y="92">L3 信任就绪</text>
<text class="dg-s" x="554" y="110">敢授权 · 有边界可撤销</text>
<text class="dg-m" x="554" y="130">security · occupancy · release</text>

<line class="dg-line--accent" x1="756" y1="108" x2="788" y2="108" marker-end="url(#aha)"/>

<rect class="dg-proto" x="796" y="66" width="222" height="84" rx="10"/>
<text class="dg-l-inv" x="816" y="92">自然语言编排</text>
<text class="dg-s-inv" x="816" y="110">价值涌现 · 一句话跨品牌</text>
<text class="dg-m-inv" x="816" y="130">运行时生成，非预设</text>

<text class="dg-m" x="24" y="192">前提：先说好普通话（统一语言）</text>
<text class="dg-m" x="796" y="192">结果：能力组合 &gt; 已开发指令集</text>
</svg>
<p class="figure__cap">图 1 · 就绪度三层（Ready Stack）与自然语言编排的关系</p>
</div>

<div class="grid3" style="margin-top:24px">
<div class="tile">
<div class="tile__title">L1 语义就绪 · 能被懂</div>
<p class="tile__desc">设备上电即递名片：<code>id / type / service / summary / constraint</code>。智能体不必为每个型号背文档。</p>
<p style="margin:10px 0 0"><span class="badge badge--accent">对应比喻：名片</span></p>
</div>
<div class="tile">
<div class="tile__title">L2 动作就绪 · 能指挥</div>
<p class="tile__desc"><code>operations</code> 是遥控器按键列表，<code>endpoints</code> 是媒体端口。清单上没有的，绝不瞎按。</p>
<p style="margin:10px 0 0"><span class="badge badge--accent">对应比喻：遥控器</span></p>
</div>
<div class="tile">
<div class="tile__title">L3 信任就绪 · 敢授权</div>
<p class="tile__desc"><code>security</code>（allow / deny / confirm）+ 占用租约 + 用完释放。安全写在协议里，不是口头承诺。</p>
<p style="margin:10px 0 0"><span class="badge badge--accent">对应比喻：承诺书</span></p>
</div>
</div>
</section>

<section class="section--subtle">
<div class="section__inner section--tight">
<div class="section__head">
<p class="section__kicker">协议能力</p>

## 六个机制，构成一门可被信赖的“普通话”

</div>
<div class="grid3">
<a class="card" href="/docs/self-description.html">
<div class="card__title">设备自述 <span class="card__tag">L1</span></div>
<div class="card__desc">上电即自我介绍，智能体读自述即可正确调用，不必匹配型号。</div>
</a>
<a class="card" href="/docs/operations.html">
<div class="card__title">能力与安全边界 <span class="card__tag">L2 · L3</span></div>
<div class="card__desc">operations 能力清单 + security 三色边界（allow / deny / confirm）。</div>
</a>
<a class="card" href="/docs/occupancy.html">
<div class="card__title">占用与租约 <span class="card__tag">L3</span></div>
<div class="card__desc">exclusive（独占 + 租约 token）或 last-wins（后到优先、后写覆盖）—— 解决资源争抢。</div>
</a>
<a class="card" href="/docs/streaming.html">
<div class="card__title">数据流：推与拉 <span class="card__tag">L2</span></div>
<div class="card__desc">stream_out / stream_in 端点模型，stream.join 拉流与 stream.accept 推流。</div>
</a>
<a class="card" href="/docs/discovery.html">
<div class="card__title">设备发现 <span class="card__tag">L1</span></div>
<div class="card__desc">组播 query + announce 自述 + Bonjour，上电连发 3 次 announce（约 0.3 s 间隔），数秒内入列，零配置。</div>
</a>
<a class="card" href="/docs/orchestration.html">
<div class="card__title">自然语言编排 <span class="card__tag">突破点</span></div>
<div class="card__desc">以上机制齐备后的结果：一句话拆成跨设备、多步、含异常处置的任务序列。</div>
</a>
</div>
</div>
</section>

<section class="section">
<div class="section__head">
<p class="section__kicker">快速开始</p>

## 接入即说话：发现、连接、读懂、编排

<p>BMAHS 是开放协议：发现走 UDP 组播，控制走 TCP + JSON-RPC 2.0。智能体经任意协议客户端接入；对用户来说全程自然语言，不写一行代码。</p>
</div>

<div class="cols2" style="align-items:start">
<ol class="steps">
<li><div class="steps__title">发现（query）</div><div class="card__desc">组播一条 query，全网设备用 announce 自报家门与占用策略。</div></li>
<li><div class="steps__title">连接（control TCP）</div><div class="card__desc">连上 <code>control</code> 端口，立刻收到 <code>hello</code> 通知 —— 完整自述都在里面。</div></li>
<li><div class="steps__title">读能力（describe）</div><div class="card__desc">读单台设备的操作清单与安全边界，登记为可调用方法。</div></li>
<li><div class="steps__title">说一句人话</div><div class="card__desc">智能体拆解意图、校验边界、编排动作序列并执行。</div></li>
<li><div class="steps__title">用完释放</div><div class="card__desc">exclusive 设备主动 <code>release</code>（默认租约 60 秒兜底）—— 这是智能体的基本礼貌。</div></li>
</ol>

<div class="code" style="margin:0">
<div class="code__head"><span class="code__dot"></span><span class="code__name">终端 · 协议层看到的动作</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-c">// 1. 发现：UDP query → announce（节选）</span>
<span class="tok-p">{</span><span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"query"</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"want"</span><span class="tok-p">:</span><span class="tok-s">"*"</span><span class="tok-p">}</span>
<span class="tok-c">// 设备应答（节选）：</span>
<span class="tok-p">{</span><span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"announce"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span> <span class="tok-c">/* … */</span> <span class="tok-p">}</span>

<span class="tok-c">// 2. 连接 control TCP，首行即 hello 通知（节选）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"hello"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">,</span> <span class="tok-c">/* … */</span> <span class="tok-p">}}</span>

<span class="tok-c">// 3. 读能力 + 调用（JSON-RPC，params 必须是对象）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"describe"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{}</span> <span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"volume"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"level"</span><span class="tok-p">:</span><span class="tok-n">35</span><span class="tok-p">}}</span>

<span class="tok-c">// 4. 独占设备：先占用，用完归还</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>
<span class="tok-c">// 应答 result：token=…（租约 until=…）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span><span class="tok-n">1791000000</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">}}</span></pre>
</div>
</div>

<div class="callout callout--info" style="margin-top:26px">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">编码纪律</div>
<code>params</code> 必须用<b>对象形式</b>（命名参数），业务参数名与 <code>operations.args[].name</code> 对齐；
      禁止位置参数数组与批量调用。非法<b>信封</b>（JSON-RPC 外层结构：<code>jsonrpc</code> / <code>id</code> / <code>method</code> / <code>params</code>）会直接回 <code>-32600</code> —— 严格校验让错误尽早暴露，而不是在链路中途悄悄失败。
</div>
</div>
</section>

<section class="section--subtle">
<div class="section__inner section--tight">
<div class="section__head">
<p class="section__kicker">生态与认证</p>

## AGI-Ready 徽标：三级徽标背后，标准只有一句 —— 这台设备能不能被编排

</div>
<div class="grid3">
<div class="tile">
<p class="tile__num">①</p>
<div class="tile__title">BMAHS Compatible</div>
<p class="tile__desc">可被协议发现与描述（L1）。面向存量设备 —— 经网关翻译即可接入。</p>
</div>
<div class="tile tile--accent">
<p class="tile__num">②</p>
<div class="tile__title">BMAHS Ready</div>
<p class="tile__desc">L1 + L2 + L3 三就绪，通过开源自测套件。面向新硬件与厂商产品。</p>
</div>
<div class="tile">
<p class="tile__num">③</p>
<div class="tile__title">BMAHS Ready+</div>
<p class="tile__desc">额外支持多设备并发、流媒体、审计日志 —— 即支持复杂编排。面向旗舰与行业设备。</p>
</div>
</div>

<div class="stats" style="margin-top:34px">
<div class="stat"><div class="stat__num">5<span>个</span></div><div class="stat__label">通用方法（describe / info / who / occupy / release）</div></div>
<div class="stat"><div class="stat__num">3<span>层</span></div><div class="stat__label">发现层 UDP · 使用层 JSON-RPC · 数据流层二进制</div></div>
<div class="stat"><div class="stat__num">5<span>秒</span></div><div class="stat__label">稳态 announce 间隔（硬性下限，只允许调大）</div></div>
<div class="stat"><div class="stat__num">0<span>行</span></div><div class="stat__label">用户代码 —— 全程自然语言</div></div>
</div>
</div>
</section>

<section class="section">
<div class="section__head" style="max-width:34em">

## 从读一页文档开始

<p>先理解定位，再跑通第一条指令。</p>
</div>
<div class="cards cards--3">
<a class="card" href="/docs/intro.html">
<div class="card__title">① 理解定位</div>
<div class="card__desc">BMAHS 是什么、不是什么，三层架构与数据流层边界。</div>
</a>
<a class="card" href="/docs/orchestration.html">
<div class="card__title">② 看懂突破点</div>
<div class="card__desc">自然语言编排的机制、四个自由度与辨析四问。</div>
</a>
<a class="card" href="/docs/tools.html">
<div class="card__title">③ 动手调用</div>
<div class="card__desc">JSON-RPC 信封、五个通用方法与错误码映射。</div>
</a>
</div>
</section>
