---
title: "Discovery Messages"
description: "Field tables and send-timing rules for the announce / query / goodbye UDP messages."
eyebrow: "Specification · Chapter 15"
---

<p class="eyebrow">Specification · Chapter 15</p>

# Discovery Messages


### 15.1 <code>announce</code> (device → multicast)

<p>The device publishes &quot;who I am, how to connect, how to use me&quot;. Business data, user data, <code>token</code>, or stream URIs <b>MUST NOT</b> be placed in UDP.</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td>Common header</td><td style="white-space:nowrap">—</td><td style="white-space:nowrap">yes</td><td><code>kind=announce</code>; <code>protocol=bmahs/1.2</code></td></tr>
<tr><td><code>type</code> / <code>service</code> / <code>name</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>See §7.4 / §10.2</td></tr>
<tr><td><code>summary</code></td><td>string</td><td>SHOULD</td><td>Recommended ≤ 120 characters</td></tr>
<tr><td><code>model</code></td><td>string</td><td>SHOULD</td><td>Hardware model</td></tr>
<tr><td><code>ip</code> / <code>ipv6</code></td><td>string</td><td>SHOULD</td><td>LAN address; <code>127.0.0.1</code> <b>MUST NOT</b> be used; IPv6 without <code>%zone</code></td></tr>
<tr><td style="white-space:nowrap"><code>port</code></td><td>number</td><td style="white-space:nowrap">yes</td><td>Consistent with the <code>control</code> port</td></tr>
<tr><td><code>control</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>tcp://…</code></td></tr>
<tr><td><code>capabilities</code></td><td>string[]</td><td style="white-space:nowrap">yes</td><td>Method names and profile tags</td></tr>
<tr><td><code>security</code></td><td>object</td><td style="white-space:nowrap">yes</td><td>Summary: <code>scope</code> + <code>auth</code> + <code>occupancy</code></td></tr>
<tr><td><code>state</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>online</code> (<code>goodbye</code> uses <code>offline</code>)</td></tr>
<tr><td><code>event</code></td><td>string</td><td>SHOULD</td><td><code>online</code> / <code>offline</code> / <code>occupy</code> / <code>release</code></td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">yes</td><td>See §11.1</td></tr>
<tr><td><code>holder</code></td><td>string</td><td>MUST when present</td><td>Last controller or occupant</td></tr>
<tr><td><code>until</code></td><td>number</td><td>SHOULD while exclusively occupied</td><td>Lease expiry in Unix seconds; indefinite is <code>0</code></td></tr>
<tr><td style="white-space:nowrap"><code>hb</code></td><td>number</td><td style="white-space:nowrap">MAY</td><td>Steady-state interval in seconds; default 5; an increase must be announced</td></tr>
</tbody>
</table>
</div>

<p><b>Send-timing rules</b>:</p>

<div class="table-wrap">
<table>
<thead><tr><th>Timing</th><th>Requirement</th></tr></thead>
<tbody>
<tr><td>On network and <code>control</code> listening</td><td>Send <b>3</b> times in a row, about <b>0.3 s</b> apart</td></tr>
<tr><td>Steady state</td><td>Every <b>5 s</b> by default (hard lower bound, see §11.4)</td></tr>
<tr><td>On matching <code>query</code> received</td><td>Send once after <b>20–120 ms</b> jitter; answer the same sender at most once per second</td></tr>
<tr><td>On state change</td><td>Re-send <b>immediately</b> when <code>state</code> / <code>busy</code> / <code>holder</code> / address changes</td></tr>
<tr><td>Loopback</td><td>Ignore your own <code>announce</code></td></tr>
</tbody>
</table>
</div>

<p>Example (<code>last-wins</code> lamp):</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">announce message</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;version&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;announce&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;timestamp&quot;</span><span class="tok-p">:</span> <span class="tok-n">1791000000</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;acme-lamp-00a1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;service&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light/1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Living Room Lamp&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;summary&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Living room ceiling lamp; can be switched and dimmed. Later control takes effect immediately; no occupy needed.&quot;</span><span class="tok-p">,</span>
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

<p>When nobody is controlling, <code>holder</code> <b>MUST NOT</b> be carried.</p>

### 15.2 <code>query</code> (agent → multicast)

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">query message</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;version&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;query&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;timestamp&quot;</span><span class="tok-p">:</span> <span class="tok-n">1791000000</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs-ctl&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;want&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;*&quot;</span>
<span class="tok-p">}</span></pre>
</div>

<p>If still no result after <b>0.2 s</b>, it may be re-sent once quickly; the same <code>want</code> is sent <b>at most twice within 1 second</b> (first send + fast re-send); total wait <b>2–4 s</b>.</p>

### 15.3 <code>goodbye</code> (device → multicast)

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">goodbye message</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;version&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;goodbye&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;timestamp&quot;</span><span class="tok-p">:</span> <span class="tok-n">1791000000</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;acme-lamp-00a1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;service&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;light/1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Living Room Lamp&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;ip&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;192.168.1.42&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;port&quot;</span><span class="tok-p">:</span> <span class="tok-n">9527</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;offline&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;offline&quot;</span>
<span class="tok-p">}</span></pre>
</div>

<p><b>MUST</b> send <b>2</b> times in a row, about <b>0.3 s</b> apart; <b>MUST</b> simultaneously stop all UI streams and media sessions.</p>
