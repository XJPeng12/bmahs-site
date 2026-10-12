---
title: "占用与租约"
description: "多个智能体同时指挥一台设备时听谁的：exclusive（独占 + 租约 token），或 last-wins（后到优先、后写覆盖）。"
eyebrow: "核心概念 / L3 信任就绪"
---

<p class="eyebrow">核心概念 / L3 信任就绪</p>

# 占用与租约

<p class="lead">
  并发控制是“普通话”里最容易被忽视、却最影响可靠性的一节。
  核心冲突很简单：<b>两个智能体同时要指挥一台设备，听谁的？</b>
  BMAHS 给出两种模式，按设备性质选择。
</p>

## 两种并发模式

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">模式</th><th style="white-space:nowrap">适用设备</th><th style="white-space:nowrap">行为</th><th style="white-space:nowrap">归还</th></tr></thead>
<tbody>
<tr>
<td><span class="badge badge--accent">exclusive</span></td>
<td>网关等<b>管理类</b>设备</td>
<td>先占先得，占用即取得 token，附带租约时钟</td>
<td>到期自动归还 / 主动 <code>release</code></td>
</tr>
<tr>
<td><span class="badge badge--neutral">last-wins</span></td>
<td>音箱等<b>播放类</b>设备</td>
<td>后写覆盖，最后一条命令生效</td>
<td style="white-space:nowrap">无需归还</td>
</tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">两种比喻</div>
<b>exclusive</b>：谁占到谁做主，按时归还 —— 像一把带计时器的钥匙。<br>
<b>last-wins</b>：后到优先，后一条命令覆盖前一条 —— 不需要抢，也不需要还。
</div>
</div>

## exclusive 的生命周期

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项</th><th style="white-space:nowrap">值</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">默认租约</td><td><b>60 秒</b>：未带 <code>ttl</code> 的 <code>occupy</code>，到期自动空闲、旧 token 作废</td></tr>
<tr><td><code>ttl</code> 合法范围</td><td><b>10–9999</b>；越界回 <code>bad-arg</code></td></tr>
<tr><td style="white-space:nowrap">无限期</td><td><code>ttl=9999</code>：<code>lease_security=9999</code>、<code>until=0</code>，必须显式 <code>release</code></td></tr>
<tr><td style="white-space:nowrap">刷新</td><td>有限租约下，占用方后续<b>带 token</b> 的调用自动刷新 <code>until</code></td></tr>
<tr><td style="white-space:nowrap">自动受管</td><td>空闲时第一条控制调用也会被纳入管理并签发 token</td></tr>
<tr><td>token 规格</td><td>≥16 个十六进制字符；与签发时的 <code>agent</code> <b>绑定</b>，不一致一律 <code>unauthorized</code></td></tr>
<tr><td>并发 TCP</td><td>设备必须至少支持 <b>2 路</b>（占用方控制 + 其它方只读）；只读方法任何连接可调</td></tr>
<tr><td style="white-space:nowrap">卡住恢复</td><td>默认 60 秒到期兜底；仅 <code>ttl=9999</code> 且丢失 token 时需<b>重启设备进程</b>（协议不提供强夺）</td></tr>
</tbody>
</table>
</div>

<div class="figure">
<svg viewBox="0 0 680 220" role="img" aria-label="exclusive 占用的租约时间轴">
<line class="dg-tick" x1="40" y1="150" x2="640" y2="150"/>

<text class="dg-mk" x="34" y="170">T0</text>
<text class="dg-mk" x="250" y="170">占用中（租约有效）</text>
<text class="dg-mk" x="500" y="170">租约到期 / 主动释放</text>

<rect class="dg-proto" x="40" y="96" width="360" height="42" rx="8"/>
<text class="dg-s-inv" x="56" y="122">exclusive 持有中 · token 有效</text>

<rect class="dg-gray" x="400" y="96" width="240" height="42" rx="8"/>
<text class="dg-s" x="416" y="122">其他智能体等待：occupied（-32001）</text>

<line class="dg-tick" x1="40" y1="80" x2="40" y2="150"/>
<line class="dg-tick" x1="400" y1="80" x2="400" y2="150"/>

<text class="dg-m" x="40" y="70">occupy</text>
<text class="dg-m" x="366" y="70">until=…</text>

<rect class="dg-dev" x="400" y="40" width="240" height="38" rx="8"/>
<text class="dg-s" x="416" y="64">租约到期自动收回 —— 不存在“占着不放”</text>

<text class="dg-m" x="40" y="196">带 token 的后续调用会刷新 until；主动 release 可提前归还</text>
</svg>
<p class="figure__cap">图 1 · 占用即取得带租约的 token，到点自动归还；礼貌的智能体会提前 release</p>
</div>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">占用 → 操作 → 释放</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-c">// 1) 占用独占设备，取得 token 与到期时间（until 为 Unix 秒）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"event"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">,</span>
  <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">,</span> <span class="tok-f">"lease_security"</span><span class="tok-p">:</span><span class="tok-n">60</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>

<span class="tok-c">// 2) 在持有期间做需要独占的事（后续调用自动刷新 until）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"bt.scan"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>

<span class="tok-c">// 3) 用完立即归还 —— 这是智能体的基本礼貌</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span></pre>
</div>

## last-wins 的适用场景

<p>
  播放类设备不需要抢占语义：用户说“播放”、又说“暂停”，后者自然覆盖前者，
  中间没有“资源独占”的概念。<b>强行引入锁反而会让简单的交互变复杂</b>。
</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">场景</th><th style="white-space:nowrap">推荐模式</th><th style="white-space:nowrap">理由</th></tr></thead>
<tbody>
<tr><td>扫描并连接蓝牙设备</td><td><span class="badge badge--accent">exclusive</span></td><td>扫描期间状态会变化，必须独占，否则两个智能体互相干扰</td></tr>
<tr><td>发布 / 下线虚拟设备</td><td><span class="badge badge--accent">exclusive</span></td><td>涉及设备注册表，属结构性变更</td></tr>
<tr><td>播放 / 暂停 / 换曲</td><td><span class="badge badge--neutral">last-wins</span></td><td>意图天然是“最新优先”，无独占必要</td></tr>
<tr><td style="white-space:nowrap">调音量</td><td><span class="badge badge--neutral">last-wins</span></td><td>数值型最终状态，后写覆盖即正解</td></tr>
</tbody>
</table>
</div>

## 礼貌守则

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">规范</th><th style="white-space:nowrap">做法</th><th style="white-space:nowrap">反例</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">用完释放</td><td>任务结束（含失败 / 取消）主动 <code>release</code></td><td>占着不还，其他智能体一直拿不到 token</td></tr>
<tr><td>不拆别人的流</td><td>只对<b>本端开启</b>的流发 <code>stream.stop</code></td><td>停掉别人的流，导致他人播放中断</td></tr>
<tr><td>多步任务查 who</td><td>last-wins 每步前调 <code>who</code>；<code>holder</code> 已不是自己即停</td><td>设备不拒绝旧 agent 的下一条调用，继续发会互相覆盖</td></tr>
<tr><td>不滥用长租约</td><td>按任务时长申请 <code>ttl</code>，够用即可</td><td>为图省事申请 <code>ttl=9999</code>（无限期），丢失 token 后只能重启设备</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">租约设多长才合理</div>
    租约过长 = 故障时设备被长期占用；租约过短 = 任务做到一半被收回。
    默认 60 秒配合“带 token 的调用自动刷新”已经覆盖大多数任务 ——
    需要更长时按任务<b>最坏耗时</b>申请 <code>ttl</code>（10–9999），并配合主动 <code>release</code> 提前归还。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/discovery.html">
<div class="card__title">设备发现 →</div>
<div class="card__desc">零配置：上电连发 3 次 announce（约 0.3 s 间隔），数秒内出现在列表里。</div>
</a>
<a class="card" href="/docs/streaming.html">
<div class="card__title">数据流：推与拉 →</div>
<div class="card__desc">stream_out / stream_in 与两种传输方式。</div>
</a>
</div>
