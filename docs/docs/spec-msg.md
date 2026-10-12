---
title: "发现报文定义"
description: "announce / query / goodbye 三种 UDP 报文的字段表与发送时机规范。"
eyebrow: "规范全文 · 第 15 章"
---

<p class="eyebrow">规范全文 · 第 15 章</p>

# 发现报文定义


### 15.1 <code>announce</code>（设备 → 组播）

<p>设备发布“我是谁、怎么连、怎么用”。<b>不得</b>在 UDP 中放业务数据、用户数据、<code>token</code> 或流 URI。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">公共头</td><td style="white-space:nowrap">—</td><td style="white-space:nowrap">是</td><td><code>kind=announce</code>；<code>protocol=bmahs/1.2</code></td></tr>
<tr><td><code>type</code> / <code>service</code> / <code>name</code></td><td>string</td><td style="white-space:nowrap">是</td><td>见 §7.4 / §10.2</td></tr>
<tr><td><code>summary</code></td><td>string</td><td style="white-space:nowrap">应当</td><td>建议 ≤ 120 字</td></tr>
<tr><td><code>model</code></td><td>string</td><td style="white-space:nowrap">应当</td><td style="white-space:nowrap">硬件型号</td></tr>
<tr><td><code>ip</code> / <code>ipv6</code></td><td>string</td><td style="white-space:nowrap">应当</td><td>局域网地址；<b>不得</b>用 <code>127.0.0.1</code>；IPv6 不带 <code>%zone</code></td></tr>
<tr><td style="white-space:nowrap"><code>port</code></td><td>number</td><td style="white-space:nowrap">是</td><td>与 <code>control</code> 端口一致</td></tr>
<tr><td><code>control</code></td><td>string</td><td style="white-space:nowrap">是</td><td><code>tcp://…</code></td></tr>
<tr><td><code>capabilities</code></td><td>string[]</td><td style="white-space:nowrap">是</td><td>方法名与剖面标签</td></tr>
<tr><td><code>security</code></td><td>object</td><td style="white-space:nowrap">是</td><td>摘要：<code>scope</code> + <code>auth</code> + <code>occupancy</code></td></tr>
<tr><td><code>state</code></td><td>string</td><td style="white-space:nowrap">是</td><td><code>online</code>（goodbye 用 <code>offline</code>）</td></tr>
<tr><td><code>event</code></td><td>string</td><td style="white-space:nowrap">应当</td><td><code>online</code> / <code>offline</code> / <code>occupy</code> / <code>release</code></td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">是</td><td>见 §11.1</td></tr>
<tr><td><code>holder</code></td><td>string</td><td style="white-space:nowrap">有则必须</td><td>最后控制者或占用方</td></tr>
<tr><td><code>until</code></td><td>number</td><td>exclusive 占用中应当</td><td>租约到期 Unix 秒；无限期为 <code>0</code></td></tr>
<tr><td style="white-space:nowrap"><code>hb</code></td><td>number</td><td style="white-space:nowrap">可以</td><td>稳态间隔秒；缺省 5；调大时必须公告</td></tr>
</tbody>
</table>
</div>

<p><b>发送时机规范</b>：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">时机</th><th style="white-space:nowrap">要求</th></tr></thead>
<tbody>
<tr><td>入网且 <code>control</code> 已监听</td><td>连发 <b>3</b> 次，间隔约 <b>0.3 s</b></td></tr>
<tr><td style="white-space:nowrap">稳态</td><td>默认每 <b>5 秒</b>（硬性下限，见 §11.4）</td></tr>
<tr><td>收到匹配 <code>query</code></td><td>抖动 <b>20–120 ms</b> 后发 1 次；同一发送方 1 秒内只应答一次</td></tr>
<tr><td style="white-space:nowrap">状态变化</td><td><code>state</code> / <code>busy</code> / <code>holder</code> / 地址变化时<b>立刻</b>再发</td></tr>
<tr><td style="white-space:nowrap">自环</td><td>忽略自己的 <code>announce</code></td></tr>
</tbody>
</table>
</div>

<p>示例（<code>last-wins</code> 灯）：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">announce 报文</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;version&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;announce&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;timestamp&quot;</span><span class="tok-p">:</span> <span class="tok-n">1791000000</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;acme-lamp-00a1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;service&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light/1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;客厅灯&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;summary&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;客厅吸顶灯，可开关和调节亮度。后来的控制立即生效，不必 occupy。&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;model&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;ACME-BULB-1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;ip&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;192.168.1.42&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;ipv6&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;fd12:3456:789a:1::42&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;port&quot;</span><span class="tok-p">:</span> <span class="tok-n">9527</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;capabilities&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span><span class="tok-s">&quot;on&quot;</span><span class="tok-p">,</span> <span class="tok-s">&quot;off&quot;</span><span class="tok-p">,</span> <span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span> <span class="tok-s">&quot;describe&quot;</span><span class="tok-p">,</span> <span class="tok-s">&quot;info&quot;</span><span class="tok-p">,</span> <span class="tok-s">&quot;who&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;security&quot;</span><span class="tok-p">:</span> <span class="tok-p">{</span><span class="tok-f">&quot;scope&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;lan&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;auth&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;none&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;occupancy&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;last-wins&quot;</span><span class="tok-p">}</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;control&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;tcp://192.168.1.42:9527&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span> false<span class="tok-p">,</span>
  <span class="tok-f">&quot;hb&quot;</span><span class="tok-p">:</span> <span class="tok-n">5</span>
<span class="tok-p">}</span></pre>
</div>

<p>无人控制时<b>不得</b>携带 <code>holder</code>。</p>

### 15.2 <code>query</code>（智能体 → 组播）

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">query 报文</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;version&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;query&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;timestamp&quot;</span><span class="tok-p">:</span> <span class="tok-n">1791000000</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs-ctl&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;want&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;*&quot;</span>
<span class="tok-p">}</span></pre>
</div>

<p>发出后 <b>0.2 s</b> 仍无结果可快速重发 <b>1 次</b>；同一 <code>want</code> 在 <b>1 秒内至多发送 2 次</b>（首次 + 快速重发）；总等待 <b>2–4 s</b>。</p>

### 15.3 <code>goodbye</code>（设备 → 组播）

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">goodbye 报文</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;version&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;goodbye&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;timestamp&quot;</span><span class="tok-p">:</span> <span class="tok-n">1791000000</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;acme-lamp-00a1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;service&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light/1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;客厅灯&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;ip&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;192.168.1.42&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;port&quot;</span><span class="tok-p">:</span> <span class="tok-n">9527</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;offline&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;offline&quot;</span>
<span class="tok-p">}</span></pre>
</div>

<p><b>必须</b>连发 <b>2</b> 次，间隔约 <b>0.3 s</b>；<b>必须</b>同时停止全部 UI 流与媒体会话。</p>
