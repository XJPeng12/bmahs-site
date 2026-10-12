---
title: "自然语言编排"
description: "BMAHS 的核心突破点：设备自述能力清单，由智能体在运行时现场编排设备 —— 覆盖范围从“已开发指令集”变为“能力组合”。"
eyebrow: "核心概念 / 突破点"
---

<p class="eyebrow">核心概念 / 突破点</p>

# 自然语言编排

<p class="lead">
  这是 BMAHS 与所有现有智能设备最本质的分界：
  现有方案要求<b>人去匹配机器预先定义好的能力</b>；
  BMAHS 把机器侧的能力清单开放出来，由智能体按人的自然语言意图<b>现场编排设备</b>。
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">一句话说清</div>
    现有智能设备是“<b>你说它听得懂的话</b>”；BMAHS 是“<b>它听得懂你说的话</b>”。<br>
<span style="font-family:var(--font-mono);font-size:12.5px;color:var(--text-muted)">
      Old smart devices make you speak their language. BMAHS makes them speak yours.</span>
</div>
</div>

## 一句话，七个动作

<p>用户只说一句自然语言，智能体在<b>运行时</b>完成一整套动作：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">编排链路 · 运行时生成，非预设</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-k">发现设备</span> <span class="tok-p">→</span> <span class="tok-k">读懂能力</span> <span class="tok-p">→</span> <span class="tok-k">拆解任务</span> <span class="tok-p">→</span> <span class="tok-k">校验安全边界</span> <span class="tok-p">→</span> <span class="tok-k">编排跨设备动作序列</span> <span class="tok-p">→</span> <span class="tok-k">执行</span> <span class="tok-p">→</span> <span class="tok-k">异常处置与汇总回报</span></pre>
</div>

<p>
<b>关键在“运行时”三个字</b>：这条链路不是任何人预先写好的，
  而是智能体依据设备自述的能力清单<b>当场组合</b>出来的。
</p>

## 预置技能集 vs 现场编排

<div class="figure">
<svg viewBox="0 0 680 306" role="img" aria-label="预置技能集与现场编排的对比">
<defs>
<marker id="a4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
</defs>

<text class="dg-mk" x="8" y="14">现有智能设备</text>
<text class="dg-mk" x="372" y="14">BMAHS 设备</text>

<rect class="dg-gray" x="8" y="24" width="300" height="256" rx="12"/>
<text class="dg-l" x="26" y="50" style="fill:var(--text-muted)">预置技能集 · 封闭</text>
<text class="dg-m" x="26" y="66">能力在开发期被逐条枚举</text>

<rect class="dg-chip" x="26" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="66" y="96" text-anchor="middle">播放</text>
<rect class="dg-chip" x="118" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="158" y="96" text-anchor="middle">暂停</text>
<rect class="dg-chip" x="210" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="250" y="96" text-anchor="middle">音量</text>

<rect class="dg-chip" x="26" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="66" y="130" text-anchor="middle">上一首</text>
<rect class="dg-chip" x="118" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="158" y="130" text-anchor="middle">下一首</text>
<rect class="dg-chip" x="210" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="250" y="130" text-anchor="middle">定时</text>

<rect class="dg-chip" x="26" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="66" y="164" text-anchor="middle">场景 A</text>
<rect class="dg-chip" x="118" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="158" y="164" text-anchor="middle">场景 B</text>
<text class="dg-m" x="216" y="164">…</text>

<line class="dg-tick" x1="26" y1="192" x2="290" y2="192"/>
<text class="dg-m" x="26" y="212">能力范围 = 已开发指令集的并集</text>
<rect class="dg-deny" x="26" y="224" width="264" height="42" rx="6"/>
<text class="dg-s" x="42" y="242" style="fill:var(--red)">未枚举的组合</text>
<text class="dg-m" x="42" y="258">→“抱歉，我还不会”</text>

<rect class="dg-agent" x="372" y="24" width="300" height="256" rx="12"/>
<text class="dg-l" x="390" y="50">能力清单 · 开放</text>
<text class="dg-m" x="390" y="66">能力由设备自述，运行时读取</text>

<rect class="dg-chip" x="390" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="430" y="96" text-anchor="middle">stream.join</text>
<rect class="dg-chip" x="482" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="522" y="96" text-anchor="middle">volume</text>
<rect class="dg-chip" x="574" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="614" y="96" text-anchor="middle">status</text>

<rect class="dg-chip" x="390" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="430" y="130" text-anchor="middle">bt.scan</text>
<rect class="dg-chip" x="482" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="522" y="130" text-anchor="middle">bt.connect</text>
<rect class="dg-chip" x="574" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="614" y="130" text-anchor="middle" style="font-size:8.5px">playlist_play</text>

<rect class="dg-chip" x="390" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="430" y="164" text-anchor="middle" style="font-size:8.5px">auth.status</text>
<rect class="dg-chip" x="482" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="522" y="164" text-anchor="middle" style="font-size:8px">stream.accept</text>
<text class="dg-m" x="614" y="164" text-anchor="middle">…</text>

<line class="dg-tick" x1="390" y1="192" x2="654" y2="192"/>
<text class="dg-m" x="390" y="212">能力范围 = 能力清单的任意组合</text>
<rect class="dg-proto" x="390" y="224" width="264" height="42" rx="6"/>
<text class="dg-s-inv" x="406" y="242">现场编排</text>
<text class="dg-m-inv" x="406" y="258">跨设备 · 多步 · 含条件与异常处置</text>
</svg>
<p class="figure__cap">图 1 · 左边是有限的枚举，右边是开放的组合 —— 这是突破点能被一眼看懂的最短路径</p>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">维度</th><th>现有智能设备</th><th>BMAHS 设备</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">能力来源</td><td>厂商预先开发的技能 / 场景（Skill / Scene）</td><td>设备自述的能力清单（<code>operations</code>），运行时读取</td></tr>
<tr><td style="white-space:nowrap">控制方式</td><td>固定语音指令 + 预设自动化规则（IF-THEN）</td><td>自然语言意图，智能体现场拆解与编排</td></tr>
<tr><td style="white-space:nowrap">覆盖范围</td><td>= 已开发指令集的并集</td><td>= <b>能力清单的任意组合</b></td></tr>
<tr><td>跨品牌协同</td><td>生态内闭环，跨品牌基本不可行</td><td>品牌无关，网关翻译后天然互通</td></tr>
<tr><td style="white-space:nowrap">新增设备</td><td>需重新配置、等待厂商适配</td><td>上电即被发现，能力就绪即可入列</td></tr>
<tr><td style="white-space:nowrap">复杂任务</td><td>用户自己拆成多条规则</td><td>一句话交给智能体编排</td></tr>
<tr><td style="white-space:nowrap"><b>谁在编排</b></td><td><b>厂家</b>（开发期）+ <b>用户</b>（配置期）</td><td><b>智能体</b>（运行时）</td></tr>
</tbody>
</table>
</div>

## 四个自由度

<div class="grid4">
<div class="tile">
<p class="tile__num">01</p>
<div class="tile__title">组合自由</div>
<p class="tile__desc">覆盖范围从“厂商枚举”变为“能力组合”，能做出厂商从未设想的用法。</p>
</div>
<div class="tile">
<p class="tile__num">02</p>
<div class="tile__title">品牌自由</div>
<p class="tile__desc">同一句话驱动不同品牌设备：不逐家适配、不锁生态的跨品牌协同。</p>
</div>
<div class="tile">
<p class="tile__num">03</p>
<div class="tile__title">设备自由</div>
<p class="tile__desc">存量设备经网关即入列，不淘汰存量，老设备也能被编排。</p>
</div>
<div class="tile">
<p class="tile__num">04</p>
<div class="tile__title">表达自由</div>
<p class="tile__desc">用户用母语表达意图，不必学设备术语 —— 门槛从“学设备”降为“说人话”。</p>
</div>
</div>

<p style="font-size:15px">
<b>一句话概括本质</b>：<b>控制权从“预设”转移到“编排”</b> —— 过去是人把所有可能性预先枚举，
  现在是智能体按意图即时生成。
</p>

## 辨析四问

<div class="callout callout--danger">
<div class="callout__icon">!</div>
<div class="callout__body">
    突破点一旦被误认为“又一个智能音箱”，价值就被抹平。这一节是<b>防守重点</b>。
</div>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">常见误解</th><th style="white-space:nowrap">事实</th></tr></thead>
<tbody>
<tr>
<td>“不就是小爱 / Alexa 吗？”</td>
<td>那不是编排：它在<b>预置技能集里做匹配</b>；BMAHS 是<b>按能力清单现场组合</b>。<b>指令集是有限的，能力组合是开放的。</b></td>
</tr>
<tr>
<td>“就是场景联动吧？”</td>
<td>场景联动是<b>开发期写死</b>的 IF-THEN；BMAHS 的编排<b>运行时生成</b>，没有人预先列出这条链路。</td>
</tr>
<tr>
<td>“换汤不换药，还是控制设备”</td>
<td>控制是单设备、单动作；编排是<b>跨设备、多步、可含条件与异常处置的任务</b>。</td>
</tr>
<tr>
<td>“编排 = 让 AI 乱来？”</td>
<td>编排的每一步都被 <code>security</code> 边界与 <code>confirm</code> 机制约束。<b>能力越强，边界越重要</b> —— 这正是 BMAHS 把安全写进协议的原因。</td>
</tr>
</tbody>
</table>
</div>

## 编排的自由度与安全同层设计

<p>编排能力越强，风险面越大 —— AGI 能组合出厂商从未设想过的动作序列。因此 BMAHS 把二者放在同一层：</p>

<div class="cols2">
<div class="compare compare--b">
<div class="compare__head">编排的自由度来自</div>
<div class="compare__body">
<ul>
<li><code>operations</code>：能力清单</li>
<li><code>endpoints</code>：媒体与控制通道</li>
</ul>
</div>
</div>
<div class="compare compare--a">
<div class="compare__head">编排的安全来自</div>
<div class="compare__body">
<ul>
<li><code>security</code>：allow / deny / confirm</li>
<li><code>occupancy</code>：占用与租约</li>
<li><code>release</code>：礼貌归还</li>
</ul>
</div>
</div>
</div>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">全案的逻辑闭环</div>
<a href="/docs/intro.html">普通话</a>让设备可被理解（<b>前提</b>）→
<a href="/docs/ready.html">就绪度三层</a>让设备可被信任（<b>条件</b>）→
<b>自然语言编排是前两者的价值涌现</b>（结果）。
</div>
</div>

## 真实跑通的编排示例

<p>以下都不是任何人预先写死的“场景”，而是智能体依据能力清单现场组合出来的（取自 2026-09-23 真机实操）：</p>

<div class="table-wrap">
<table>
<thead><tr><th>用户一句话</th><th>智能体现场编排的动作序列</th></tr></thead>
<tbody>
<tr>
<td>“在电脑音箱和华为音箱上同时放《女儿》歌单”</td>
<td>查设备 → 逐台读能力 → 校验音源登录 → <code>playlist_play</code> → 两台音箱分别 <code>stream.join</code> → 校验两路流格式 → 汇总回报</td>
</tr>
<tr>
<td>“把家里所有 BMAHS 设备都调出来看看”</td>
<td>发现（<code>query</code>）→ 逐台 <code>describe</code> → 汇总能力清单与安全边界</td>
</tr>
<tr>
<td>“接一台老蓝牙音箱进来，让它也能唱歌”</td>
<td><code>occupy</code> 网关 → <code>bt.scan</code> → <code>bt.connect</code> → 重发 <code>query</code> → 虚拟 speaker 上线 → <code>stream.join</code> → <code>release</code> 网关</td>
</tr>
<tr>
<td>“两台一起放，但华为那台大声点”</td>
<td>校验两路流 → 对目标音箱单独 <code>volume</code>（不拆流）→ 保持另一路不受影响</td>
</tr>
</tbody>
</table>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/operations.html">
<div class="card__title">能力清单与安全边界 →</div>
<div class="card__desc">编排的自由度从哪里来，边界又写在哪里。</div>
</a>
<a class="card" href="/docs/tools.html">
<div class="card__title">方法参考 →</div>
<div class="card__desc">亲手写出第一条编排链路。</div>
</a>
</div>
