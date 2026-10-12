---
title: "Control Messaging: JSON-RPC 2.0"
description: "The JSON-RPC 2.0 envelope on the TCP control channel: requests, results, errors, notifications (hello / event), no batch."
eyebrow: "Specification · Chapter 08"
---

<p class="eyebrow">Specification · Chapter 08</p>

# Control Messaging: JSON-RPC 2.0


### 8.1 General rules

<ul>
<li>The control channel is TCP; <b>one UTF-8 JSON message per line, terminated by <code>\n</code></b>; <b>no</b> BOM; a line <b>MUST NOT</b> contain an embedded newline.</li>
<li>Every control message <b>MUST</b> be a valid JSON-RPC 2.0 object containing the <code>&quot;jsonrpc&quot;:&quot;2.0&quot;</code> field.</li>
<li>Messages come in four kinds:<ul>
<li><b>Request</b>: carries <code>id</code>, <code>method</code>, <code>params</code> (object form) — agent/client → device;</li>
<li><b>Success response (Result)</b>: carries the same <code>id</code> as the request plus a <code>result</code> object — device → caller;</li>
<li><b>Error response (Error)</b>: carries the same <code>id</code> as the request plus an <code>error</code> object — device → caller;</li>
<li><b>Notification</b>: no <code>id</code> — one-way push device → client (<code>hello</code>, <code>event</code>).</li>
</ul></li>
<li><code>method</code> (method name) matches the BMAHS action name: lowercase, may contain <code>.</code> (e.g. <code>ui.start</code>, <code>stream.join</code>) — allowed by JSON-RPC 2.0.</li>
<li><code>params</code> <b>MUST</b> use the <b>object form</b> (Named Params); array positional parameters <b>MUST NOT</b> be used.</li>
<li>Handling invalid input: when a line is <b>not valid JSON</b>, the device <b>MUST</b> reply with an error response <code>code=-32700</code> (Parse error); when the JSON is <b>valid but the envelope is invalid</b> (missing <code>jsonrpc</code> field, <code>jsonrpc</code> not <code>&quot;2.0&quot;</code>, <code>method</code> not a string, etc.), reply with <code>code=-32600</code> (Invalid Request); in both cases, when <code>id</code> cannot be parsed, use <code>id=null</code>.</li>
<li>Clients <b>MUST</b> ignore notifications from the device with unknown <code>method</code>.</li>
<li>Request pipelining <b>MUST</b> be supported on a single TCP connection: responses need not arrive in request order; correlate by <code>id</code>.</li>
</ul>

### 8.2 Request (agent/protocol client → device)

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Request message example</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">40</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>jsonrpc</code></td><td style="white-space:nowrap">yes</td><td>Fixed <code>&quot;2.0&quot;</code></td></tr>
<tr><td style="white-space:nowrap"><code>id</code></td><td style="white-space:nowrap">yes</td><td>String or integer; <b>MUST NOT</b> be <code>null</code>; unique per connection, guaranteed by the initiator</td></tr>
<tr><td><code>method</code></td><td style="white-space:nowrap">yes</td><td>BMAHS action name (see §10.4 common actions, category-doc business actions, §13.3 UI actions, §14.4 endpoint actions)</td></tr>
<tr><td><code>params</code></td><td style="white-space:nowrap">yes</td><td><b>Object</b>. Common parameters + the business parameters declared by that action's <code>operations[].args</code></td></tr>
</tbody>
</table>
</div>

<p><b>Common <code>params</code> fields</b>:</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>agent</code></td><td>SHOULD for control</td><td>Stable agent identifier (recommended <code>[a-z0-9-]</code>). Missing on read-only methods must not be rejected</td></tr>
<tr><td><code>token</code></td><td>only when exclusive-managed</td><td>The occupancy token returned by a successful <code>occupy</code> (§11.3)</td></tr>
</tbody>
</table>
</div>

<p><b>Parameter validation</b>: if <code>params</code> contains a business parameter name not declared in <code>operations</code>, the device <b>SHOULD</b> ignore it or return <code>bad-arg</code>; missing <code>required</code>, wrong type, out of <code>min</code>/<code>max</code>, not in <code>enum</code>, or not satisfying <code>any_of</code>: <b>MUST</b> return an error response with <code>error.data.bmahs_code=&quot;bad-arg&quot;</code> (JSON-RPC <code>code=-32602</code> or <code>-32006</code>, see Chapter 9).</p>

### 8.3 Success response (device → caller)

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Success response example</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">40</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<ul>
<li><code>result</code> <b>MUST</b> be an object; the BMAHS 1.x <code>ok:true</code> / <code>action</code> fields are <b>deprecated</b> (implied by the JSON-RPC envelope's <code>result</code> plus the request <code>method</code>/<code>id</code>).</li>
<li><code>result</code> content = the fields declared by that method's <code>operations[].returns</code> (see §10.3).</li>
<li>When the exclusive occupant's control succeeds, the device <b>SHOULD</b> echo <code>token</code> in <code>result</code>; <code>last-wins</code> <b>MUST NOT</b> return an occupancy <code>token</code>.</li>
</ul>

### 8.4 Error response (device → caller)

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Error response example</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;error&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;code&quot;</span><span class="tok-p">:</span><span class="tok-n">-32001</span><span class="tok-p">,</span><span class="tok-f">&quot;message&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;Study-room phone is occupied by alice; lease expires in ~42 s&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;data&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;bmahs_code&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupied&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;retryable&quot;</span><span class="tok-p">:</span>true<span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;until&quot;</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">}</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>error.code</code></td><td style="white-space:nowrap">yes</td><td><b>Integer</b>, JSON-RPC error code (mapping in Chapter 9)</td></tr>
<tr><td><code>error.message</code></td><td style="white-space:nowrap">yes</td><td>A short <b>natural-language</b> failure reason; <b>MUST NOT</b> just repeat the uninformative error code word</td></tr>
<tr><td><code>error.data</code></td><td style="white-space:nowrap">yes</td><td>Object; <b>MUST</b> contain <code>bmahs_code</code> (string) and <code>retryable</code> (bool); <b>MAY</b> add fields associated with that error code (e.g. <code>holder</code> / <code>until</code>)</td></tr>
</tbody>
</table>
</div>

### 8.5 Notification (device → client)

<p><b><code>hello</code> notification (MUST)</b> — the first line the device sends <b>immediately</b> after the TCP connection is established, replacing the BMAHS 1.x plain-JSON <code>hello</code>:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">hello notification</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;hello&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;light&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;service&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;light/1&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;acme-lamp-00a1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;Living Room Lamp&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;summary&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;This is the living room ceiling lamp. The agent can switch it on/off and set brightness to 0–100%. This lamp is last-wins: just send the command directly.&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;constraint&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;Call on, off, brightness directly. No occupy needed.&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;capabilities&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-s">&quot;on&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;off&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;describe&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;info&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;who&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;operations&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;security&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;scope&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;lan&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;auth&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;none&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;occupancy&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;last-wins&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;allow&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-s">&quot;local-light-control&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span><span class="tok-f">&quot;deny&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-s">&quot;exec&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;network-fetch&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;cloud-upload&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;write-filesystem&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span><span class="tok-f">&quot;confirm&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-p">]</span><span class="tok-p">,</span><span class="tok-f">&quot;notes&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;Only controls this lamp's switch and brightness. Later control takes effect immediately.&quot;</span><span class="tok-p">}</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>false<span class="tok-p">,</span>
  <span class="tok-f">&quot;control&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tcp://192.168.1.42:9527&quot;</span>
<span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<ul>
<li>The notification <b>MUST NOT</b> contain an <code>id</code>; the client <b>MUST NOT</b> reply with any response after receiving it.</li>
<li>The <code>params</code> field set is identical to the BMAHS 1.x <code>hello</code> (<code>protocol</code> / <code>type</code> / <code>service</code> / <code>id</code> / <code>name</code> / <code>summary</code> / <code>constraint</code> / <code>capabilities</code> / <code>operations</code> / <code>security</code> (incl. occupancy) / <code>endpoints</code> (when endpoints exist) / <code>state</code> / <code>busy</code> / <code>event</code> (SHOULD) / <code>holder</code> (MUST when present) / <code>control</code> / <code>hb</code> / <code>width</code>, <code>height</code> (SHOULD when ui is present)).</li>
<li><code>params</code> <b>MUST NOT</b> contain <code>token</code> or an unopened <code>stream</code> / <code>ui</code> URI.</li>
</ul>

<p><b><code>event</code> notification (optional)</b> — pushes device state changes (e.g. lease expiry, passive stream teardown):</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">event notification</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;event&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupy&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>true<span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<p>A device declaring the <code>event</code> notification <b>SHOULD</b> declare it in the <code>hello</code> notification <code>params</code> as <code>notifications:[&quot;event&quot;]</code>; clients <b>MUST NOT</b> rely on <code>event</code> notifications for correctness (poll <code>who</code> / <code>describe</code> instead).</p>

### 8.6 Batch calls

<p>JSON-RPC 2.0 batch arrays (<code>[...]</code>) <b>MUST NOT</b> be used — the control channel has one-message-per-line semantics, which keeps parsing simple for embedded devices.</p>
