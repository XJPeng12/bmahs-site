---
title: "能力清单与安全边界"
description: "operations 是设备的遥控器按键列表，security 是“绝不做什么”的承诺书（allow / deny / confirm）。安全写在协议里，不是厂商口头承诺。"
eyebrow: "核心概念 / L2 · L3"
---

<p class="eyebrow">核心概念 / L2 · L3</p>

# 能力清单与安全边界

<p class="lead">
  两个字段决定了一台设备能不能被放心编排：<code>operations</code> 回答"<b>能做什么</b>"，
<code>security</code> 回答"<b>绝不可以做什么</b>，以及哪些必须人点头"。
  前者是能力，后者是<b>协议级的安全承诺</b>。
</p>

## operations：遥控器按键列表

<p>智能体照单点菜 —— <b>说明书上没有的，绝不瞎按</b>。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">设备</th><th style="white-space:nowrap">品类</th><th style="white-space:nowrap">操作条数</th><th style="white-space:nowrap">示例条目</th></tr></thead>
<tbody>
<tr><td class="mono">bmahs-speaker-01</td><td>speaker</td><td style="white-space:nowrap">8</td><td><code>status</code> · <code>volume</code> · <code>stream.join</code> · <code>stream.stop</code> …</td></tr>
<tr><td class="mono">bmahs-bridge-01</td><td>bridge</td><td style="white-space:nowrap">15</td><td><code>bt.scan</code> · <code>bt.connect</code> · <code>publish</code> · <code>unpublish</code> …</td></tr>
<tr><td class="mono" style="white-space:nowrap">qq</td><td>qqmusic</td><td style="white-space:nowrap">—</td><td><code>auth.status</code> · <code>auth.login</code> · <code>playlist_play</code> · <code>next</code> …</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">条数不同是正常的</div>
    管理类设备（网关）天然比播放类设备（音箱）能力多。
    能力条数不是强弱指标 —— 重要的是<b>清单必须真实</b>，且清单之外的动作不会被接受。
</div>
</div>

## security：三色承诺书

<div class="grid3">
<div class="tile" style="border-color:color-mix(in srgb, var(--green) 35%, transparent)">
<p style="margin:0 0 10px"><span class="badge badge--allow">allow</span></p>
<div class="tile__title">明确可做</div>
<p class="tile__desc">绿色。无需额外确认即可执行的动作，通常与 <code>operations</code> 一一对应。</p>
</div>
<div class="tile" style="border-color:color-mix(in srgb, var(--red) 35%, transparent)">
<p style="margin:0 0 10px"><span class="badge badge--deny">deny</span></p>
<div class="tile__title">绝不可做</div>
<p class="tile__desc">红色。协议级红线：写盘、联网外发、执行命令、摄像头、麦克风等。<b>智能体绝不越界</b>。</p>
</div>
<div class="tile" style="border-color:color-mix(in srgb, var(--amber) 35%, transparent)">
<p style="margin:0 0 10px"><span class="badge badge--confirm">confirm</span></p>
<div class="tile__title">需人点头</div>
<p class="tile__desc">黄色。高风险方法由<b>设备本地</b>确认（按键 / 屏幕弹窗 / 官方 App），缺省等待 30 秒（可配 5–300），超时作废，不由智能体替人拍板。</p>
</div>
</div>

## deny 清单因设备而异

<p>同一条红线对不同的设备有不同的含义 —— 这正是 deny 必须写在<b>设备自述</b>里的原因。</p>

<div class="cols2">
<div class="compare compare--a">
<div class="compare__head">音箱（speaker/1）的 deny</div>
<div class="compare__body">
<ul>
<li><code>write-filesystem</code>：不允许写盘</li>
<li><code>network-fetch</code>：不允许联网拉取</li>
<li><code>exec</code>：不允许执行命令</li>
<li><code>cloud-upload</code>：不允许云上传</li>
</ul>
<p style="margin:10px 0 0;color:var(--text-muted);font-size:12.5px">
        能放歌，但不能偷开摄像头 —— 安全写在协议里，不是厂商口头承诺。
</p>
</div>
</div>
<div class="compare compare--a">
<div class="compare__head">音源（qqmusic/1）的 deny</div>
<div class="compare__body">
<ul>
<li><code>system.volume</code>：不允许改系统音量</li>
<li><code>credential.share</code>：不允许共享登录凭据</li>
</ul>
<p style="margin:10px 0 0;color:var(--text-muted);font-size:12.5px">
        音源只负责播放与选曲，音量属于音箱自己的事 —— 职责边界同样写进协议。
</p>
</div>
</div>
</div>

## security 的完整字段

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono">scope</td><td style="white-space:nowrap">是</td><td>网络范围：<code>lan</code> / <code>wan</code>（开放 wan <b>必须</b>另行文档说明）</td></tr>
<tr><td class="mono" style="white-space:nowrap">auth</td><td style="white-space:nowrap">是</td><td>传输 / 身份鉴权：<code>none</code> / <code>token</code> / <code>tls</code>。<b>不是</b>占用策略</td></tr>
<tr><td class="mono">occupancy</td><td style="white-space:nowrap">是</td><td><code>last-wins</code> 或 <code>exclusive</code>；缺省按 <code>exclusive</code> 理解</td></tr>
<tr><td class="mono">allow</td><td style="white-space:nowrap">应当</td><td>明确允许的能力标签</td></tr>
<tr><td class="mono" style="white-space:nowrap">deny</td><td style="white-space:nowrap">是</td><td>明确禁止的能力。建议至少覆盖：任意读盘、任意写盘、执行命令、联网拉取、云上传、摄像头 / 麦克风偷采</td></tr>
<tr><td class="mono">confirm</td><td style="white-space:nowrap">可以</td><td>需用户确认后才执行的方法名</td></tr>
<tr><td class="mono">confirm_timeout</td><td style="white-space:nowrap">可以</td><td>确认最长等待秒数，范围 <b>5–300</b>，缺省 <b>30</b></td></tr>
<tr><td class="mono">notes</td><td style="white-space:nowrap">是</td><td>自然语言边界说明，禁止空串</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">auth 与 occupancy 不得互相替代</div>
<code>auth=none</code> 的设备仍可为 <code>exclusive</code>（仅靠占用 token 互斥）；
<code>last-wins</code> 设备<b>不得</b>再要求控制调用携带占用 token。
    采集类端点（麦克风、摄像头）的开流方法即使设备是 <code>last-wins</code>，也应当列入 <code>confirm</code>。
</div>
</div>

## confirm：把人的决定权留在人手上

<p>确认通道由<b>设备本地</b>提供 —— 物理按键、设备屏幕弹窗、厂商官方 App。协议不为它新增任何控制方法。</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">confirm 级方法 · 调用时序</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-c">// 1) 智能体调用 confirm 级方法（如 system.reboot）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"system.reboot"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>

<span class="tok-c">// 2) 设备在等待期内【不回复该 id】—— 本地等待用户确认</span>
<span class="tok-c">//    最长等待 confirm_timeout（缺省 30 秒，可配 5–300）</span>

<span class="tok-c">// 3a) 本地确认完成 → 正常执行，回 result</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-c">/* … */</span><span class="tok-p">}}</span>

<span class="tok-c">// 3b) 超时或用户否决 → 错误响应 denied（默认不可重试；确认超时时 retryable=true，且不得高频重试）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"error"</span><span class="tok-p">:{</span><span class="tok-f">"code"</span><span class="tok-p">:</span><span class="tok-n">-32005</span><span class="tok-p">,</span> <span class="tok-f">"message"</span><span class="tok-p">:</span><span class="tok-s">"用户未确认重启"</span><span class="tok-p">,</span>
  <span class="tok-f">"data"</span><span class="tok-p">:{</span><span class="tok-f">"bmahs_code"</span><span class="tok-p">:</span><span class="tok-s">"denied"</span><span class="tok-p">,</span> <span class="tok-f">"retryable"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">}}}</span></pre>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">两条纪律</div>
    ① 智能体的等待超时<b>不得短于</b>设备公告的 <code>confirm_timeout</code>，也不得因用户未响应而高频重试；
    ② 设备等待期间不回复请求 —— 客户端要能容忍这段时间内该 <code>id</code> 没有响应。
</div>
</div>

## 为什么安全必须写在协议里

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">做法</th><th style="white-space:nowrap">可验证</th><th style="white-space:nowrap">可审计</th><th>跨厂商一致</th></tr></thead>
<tbody>
<tr><td>厂商口头承诺</td><td style="white-space:nowrap">否</td><td style="white-space:nowrap">否</td><td style="white-space:nowrap">否</td></tr>
<tr><td>应用层自行约束</td><td style="white-space:nowrap">部分</td><td style="white-space:nowrap">否</td><td style="white-space:nowrap">否</td></tr>
<tr><td><b>协议级 security 字段</b></td><td><b>是</b>（可读自述）</td><td><b>是</b>（可留痕）</td><td><b>是</b>（同一套语义）</td></tr>
</tbody>
</table>
</div>

<p>
  把边界写进自述的另一个好处是：<b>智能体在编排之前就能知道哪里不能走</b>，
  而不是走到一半才被拒绝。这让编排从“试错”变成“规划”。
</p>

## 下一步

<div class="cards">
<a class="card" href="/docs/occupancy.html">
<div class="card__title">占用与租约 →</div>
<div class="card__desc">多个智能体抢同一台设备时，听谁的。</div>
</a>
<a class="card" href="/docs/streaming.html">
<div class="card__title">数据流：推与拉 →</div>
<div class="card__desc">声音是怎么从音源流到音箱的。</div>
</a>
</div>
