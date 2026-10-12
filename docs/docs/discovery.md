---
title: "设备发现"
description: "组播 query + announce 自述 + Bonjour：上电即发现、描述即能力，全程零配置。"
eyebrow: "核心概念 / L1"
---

<p class="eyebrow">核心概念 / L1</p>

# 设备发现

<p class="lead">
<b>零配置，是 BMAHS 给用户的第一份礼物。</b>
  新设备上电后不需要配对、不需要填表、不需要安装 App —— 它自己喊一声，就出现在智能体的设备列表里。
</p>

## 发现三件套

<div class="grid3">
<div class="tile">
<p class="tile__num">01</p>
<div class="tile__title">组播 query</div>
<p class="tile__desc">智能体在局域网发一条组播：“谁在线？” —— 一次问全网，不做逐台轮询。</p>
</div>
<div class="tile">
<p class="tile__num">02</p>
<div class="tile__title">announce 自述</div>
<p class="tile__desc">设备逐台回应自己的名片：我是谁、我会什么。见 <a href="/docs/self-description.html">设备自述</a>。</p>
</div>
<div class="tile">
<p class="tile__num">03</p>
<div class="tile__title">Bonjour 注册（mDNS/DNS-SD）</div>
<p class="tile__desc">协议自述之外，同时以 mDNS/DNS-SD 向操作系统注册服务（组播）；系统自带的 Bonjour（macOS / iOS）或 Avahi（Linux）都能发现它。</p>
</div>
</div>

## 发现时序

<div class="figure">
<svg viewBox="0 0 680 260" role="img" aria-label="设备发现时序：组播 query、announce 自述、列表刷新">
<defs>
<marker id="a5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="a5a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<text class="dg-mk" x="20" y="20">智能体</text>
<text class="dg-mk" x="272" y="20">局域网（组播）</text>
<text class="dg-mk" x="540" y="20">设备</text>

<line class="dg-tick" x1="60" y1="34" x2="60" y2="228"/>
<line class="dg-tick" x1="360" y1="34" x2="360" y2="228"/>
<line class="dg-tick" x1="600" y1="34" x2="600" y2="228"/>

<line class="dg-line--accent" x1="60" y1="62" x2="600" y2="62" marker-end="url(#a5)"/>
<text class="dg-m" x="70" y="56">组播 query：谁在线？</text>

<line class="dg-line" x1="600" y1="98" x2="60" y2="98" marker-end="url(#a5)"/>
<text class="dg-m" x="330" y="92" text-anchor="middle">announce：我是谁、我会什么</text>

<line class="dg-line" x1="600" y1="134" x2="200" y2="134"/>
<text class="dg-m" x="330" y="128" text-anchor="middle">Bonjour：mDNS/DNS-SD 注册（组播 · 双轨并行）</text>

<rect class="dg-agent" x="20" y="150" width="200" height="62" rx="8"/>
<text class="dg-s" x="36" y="174">列表逐行填入设备</text>
<text class="dg-m" x="36" y="194">state=online · busy=false</text>

<text class="dg-m" x="250" y="178">稳态每 5 秒</text>
<line class="dg-tick" x1="250" y1="186" x2="330" y2="186"/>
<text class="dg-m" x="250" y="204">announce 保活</text>

<text class="dg-m" x="20" y="246">掉线时设备从列表消失；重发 query 重新扫描：要么找回，要么确认下线</text>
</svg>
<p class="figure__cap">图 1 · 上电 → 组播 query → 逐台 announce 自述 → 列表刷新，全程无需配置</p>
</div>

## 组播参数

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项</th><th style="white-space:nowrap">IPv4</th><th style="white-space:nowrap">IPv6</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">组播地址</td><td class="mono">239.255.42.42</td><td class="mono">ff02::4242（链路本地）</td></tr>
<tr><td style="white-space:nowrap">端口</td><td class="mono" style="white-space:nowrap">5354</td><td style="white-space:nowrap">同左</td></tr>
<tr><td>TTL / Hop Limit</td><td style="white-space:nowrap"><code>2</code></td><td style="white-space:nowrap"><code>2</code></td></tr>
<tr><td style="white-space:nowrap">报文上限</td><td colspan="2">单报文 ≤ <b>1400 字节</b>（避免 IP 分片），一个 UDP 数据报只承载一个 UTF-8 JSON 对象</td></tr>
</tbody>
</table>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">报文</th><th style="white-space:nowrap">方向</th><th>节奏（必须）</th></tr></thead>
<tbody>
<tr><td class="mono">announce</td><td>设备 → 组播</td><td>入网连发 <b>3 次</b>（间隔约 0.3s）；稳态默认每 <b>5 秒</b>（硬性下限，只允许调大并公告 <code>hb</code>）；状态变化立刻重发</td></tr>
<tr><td class="mono">query</td><td>智能体 → 组播</td><td>发出后 0.2s 无结果可快速重发 1 次；同一 <code>want</code> 1 秒内至多发送 2 次（首次 + 快速重发）；总等待 2–4s</td></tr>
<tr><td class="mono">goodbye</td><td>设备 → 组播</td><td>下线前连发 <b>2 次</b>（间隔约 0.3s），同时停止全部 UI 流与媒体会话</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">设备应答 query 的方式</div>
    收到匹配的 <code>query</code> 后，设备<b>抖动 20–120ms</b> 再发一次 <code>announce</code>（避免全网同时应答造成风暴），
    同一发送方 1 秒内只应答一次。<code>want</code> 按 <code>type</code> 过滤：空、<code>*</code> 或 <code>bmahs</code> 即全部。
</div>
</div>

## 调用方式

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">发现 · UDP 报文</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-c">// 智能体发 query（普通 JSON，不是 JSON-RPC）</span>
<span class="tok-p">{</span><span class="tok-f">"version"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"query"</span><span class="tok-p">,</span>
 <span class="tok-f">"timestamp"</span><span class="tok-p">:</span><span class="tok-n">1791000000</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"want"</span><span class="tok-p">:</span><span class="tok-s">"speaker,bridge"</span><span class="tok-p">}</span>

<span class="tok-c">// 匹配的设备应答 announce（节选）</span>
<span class="tok-p">{</span><span class="tok-f">"version"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"announce"</span><span class="tok-p">,</span>
 <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"type"</span><span class="tok-p">:</span><span class="tok-s">"speaker"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span>
 <span class="tok-f">"name"</span><span class="tok-p">:</span><span class="tok-s">"电脑音箱"</span><span class="tok-p">,</span> <span class="tok-f">"control"</span><span class="tok-p">:</span><span class="tok-s">"tcp://192.168.1.42:9527"</span><span class="tok-p">,</span>
 <span class="tok-f">"security"</span><span class="tok-p">:{</span><span class="tok-f">"scope"</span><span class="tok-p">:</span><span class="tok-s">"lan"</span><span class="tok-p">,</span> <span class="tok-f">"auth"</span><span class="tok-p">:</span><span class="tok-s">"none"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">},</span>
 <span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">false</span><span class="tok-p">,</span> <span class="tok-f">"hb"</span><span class="tok-p">:</span><span class="tok-n">5</span><span class="tok-p">}</span>

<span class="tok-c">// 掉线排查：重发 query —— 要么找回，要么确认下线</span></pre>
</div>

## 状态字段

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">含义</th></tr></thead>
<tbody>
<tr><td class="mono">state</td><td><code>online</code> / <code>offline</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td><code>true</code> 当且仅当：exclusive 被占用，或存在活动 UI 流 / 媒体会话</td></tr>
<tr><td class="mono">occupancy</td><td>占用策略：<code>exclusive</code>（独占）或 <code>last-wins</code>（后到优先），见 <a href="/docs/occupancy.html">占用与租约</a></td></tr>
<tr><td class="mono">service</td><td>协议服务及版本，决定可调用的操作集</td></tr>
<tr><td class="mono" style="white-space:nowrap">hb</td><td>稳态 announce 间隔（秒）。缺省 5；调大时必须公告。删除时限 = <code>clamp(12×hb, 60s, 30min)</code></td></tr>
</tbody>
</table>
</div>

## 掉线排查

<ol class="steps">
<li><div class="steps__title">确认现象</div>设备从列表消失 —— 记录它上一次 <code>announce</code> 的时间与当时的操作。</li>
<li><div class="steps__title">重发 query</div>再发一条 <code>query</code>，等待一轮应答（总等待 2–4 秒）。</li>
<li><div class="steps__title">两种结论</div><b>找回</b>：设备已恢复，继续原任务；<b>确认下线</b>：如实告知用户，不要用其他设备静默顶替。</li>
</ol>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">真实案例</div>
    下午还在列表里的 AirPlay 设备，晚间发现已消失 —— 原因是设备自身掉线，不是协议问题。
<b>如实上报比强行补救更重要</b>：编排的每一环都建立在真实状态之上。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/streaming.html">
<div class="card__title">数据流：推与拉 →</div>
<div class="card__desc">发现之后，声音是怎么流动的。</div>
</a>
<a class="card" href="/docs/tools.html">
<div class="card__title">方法与报文参考 →</div>
<div class="card__desc">JSON-RPC 信封、五个通用方法与错误码映射。</div>
</a>
</div>
