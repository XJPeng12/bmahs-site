---
title: "Quickstart"
description: "Six steps to run bmahs/1.2 — discover, connect, read hello, describe, (for exclusive) occupy, call and release."
eyebrow: "Getting Started / Quickstart"
---

<p class="eyebrow">Getting Started / Quickstart</p>

# Quickstart

<p class="lead">
  Goal: bring a BMAHS device from zero to running — discover, connect, understand, (if needed) occupy, call, release.
  Everything uses <b>JSON-RPC 2.0 over TCP</b> plus UDP multicast discovery; no particular agent is required.
</p>

## Step 0: install and run

<p>
  BMAHS is a <b>wire protocol</b>, not a package — anything that can speak TCP + JSON and UDP multicast can implement it.
  The messages below are taken from a <b>real device session</b>; the peer is a device or gateway that already speaks BMAHS.
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">Reference implementation and self-test suite in preparation</div>
    The official reference implementation and the open-source self-test suite are <b>not published yet</b>;
    download links and startup commands will land here once they are.
</div>
</div>

<p>Until then, pick the path that matches what you have:</p>

<ul>
<li><b>You already have a BMAHS device or gateway</b>: jump straight to the six steps below — the messages can be copied verbatim.</li>
<li><b>You only have legacy hardware</b> (Bluetooth / AirPlay / IR): publish it as a BMAHS device through a gateway first — see <a href="/en/docs/architecture.html">Architecture &amp; Ecosystem</a>.</li>
<li><b>You want to implement your own</b>: build it against chapters 5–18 of the <a href="/en/docs/spec-index.html">specification</a>, then self-test with the <a href="/en/docs/spec-conform.html">chapter 18 conformance checklist</a>.</li>
</ul>

## Prerequisites

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Item</th><th>Requirement</th></tr></thead>
<tbody>
<tr><td>Network</td><td>Client and device on the same LAN (discovery via UDP multicast, control via LAN TCP)</td></tr>
<tr><td>Client</td><td>Any <b>protocol client</b> that speaks TCP + JSON: a script, SDK, or agent runtime</td></tr>
<tr><td>Bridging</td><td>Legacy devices (Bluetooth / AirPlay …) need a BMAHS gateway to translate and publish</td></tr>
<tr><td>Accounts</td><td>Some devices (e.g. music sources) require QR login; sessions expire — a mechanism of the source service itself, unrelated to the BMAHS protocol</td></tr>
</tbody>
</table>
</div>

## Six steps

<ol class="steps">
<li>
<div class="steps__title">Discover: multicast query</div>
    Send a <code>query</code> to <code>239.255.42.42:5354</code> (IPv6: <code>ff02::4242</code>).
    Matching devices each answer an <code>announce</code>: who they are, their <code>service</code>, where their <code>control</code> is, and their <code>occupancy</code>.
    Pick by <code>name</code> + <code>summary</code>.
</li>
<li>
<div class="steps__title">Connect: TCP to control</div>
    Connect to the <code>announce.control</code> URI (default port 9527).
    On connect the device <b>immediately</b> pushes a one-line <code>hello</code> notification — a <b>connect-time snapshot</b> of the self-description (same fields as <code>announce</code>). Call <code>describe</code> for the <b>live authoritative list</b>, since capabilities may have changed.
</li>
<li>
<div class="steps__title">Understand: the hello notification</div>
<code>hello</code> is a JSON-RPC notification with no <code>id</code> — do not reply.
    Register <code>operations</code> as callable methods; hand <code>summary</code> / <code>constraint</code> / each <code>description</code> to the model.
    Call <code>describe</code> whenever you need the authoritative, complete list.
</li>
<li>
<div class="steps__title">Occupy (exclusive only)</div>
    Check <code>security.occupancy</code> first: for <code>last-wins</code> (last write wins), call business methods directly, <b>don't</b> occupy;
<code>exclusive</code> — check <code>who</code>, then <code>occupy</code> for a token.
</li>
<li>
<div class="steps__title">Call: business methods</div>
    Send JSON-RPC requests per the <code>operations</code> list; <code>params</code> must be an <b>object</b> whose names match <code>args[].name</code>.
    For <code>confirm</code>-level methods, the device waits locally for the user — don't re-send while waiting.
</li>
<li>
<div class="steps__title">Release (exclusive only)</div>
    When the task ends — <b>including failure or cancellation</b> — you must <code>release</code> and void the token.
    The default 60-second lease is a safety net, not a plan.
</li>
</ol>

## Full call chain (terminal view)

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Quickstart · all messages</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-c">// 1) Discovery: UDP multicast query (239.255.42.42:5354)</span>
<span class="tok-p">{</span><span class="tok-f">"version"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"query"</span><span class="tok-p">,</span>
 <span class="tok-f">"timestamp"</span><span class="tok-p">:</span><span class="tok-n">1791000000</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"want"</span><span class="tok-p">:</span><span class="tok-s">"*"</span><span class="tok-p">}</span>

<span class="tok-c">// Device answers announce (excerpt)</span>
<span class="tok-p">{</span><span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"announce"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"type"</span><span class="tok-p">:</span><span class="tok-s">"speaker"</span><span class="tok-p">,</span>
 <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span> <span class="tok-f">"name"</span><span class="tok-p">:</span><span class="tok-s">"Desk Speaker"</span><span class="tok-p">,</span> <span class="tok-f">"port"</span><span class="tok-p">:</span><span class="tok-n">9527</span><span class="tok-p">,</span>
 <span class="tok-f">"control"</span><span class="tok-p">:</span><span class="tok-s">"tcp://192.168.1.42:9527"</span><span class="tok-p">,</span>
 <span class="tok-f">"security"</span><span class="tok-p">:{</span><span class="tok-f">"scope"</span><span class="tok-p">:</span><span class="tok-s">"lan"</span><span class="tok-p">,</span> <span class="tok-f">"auth"</span><span class="tok-p">:</span><span class="tok-s">"none"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">},</span>
 <span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">false</span><span class="tok-p">}</span>

<span class="tok-c">// 2) After connecting to control, hello arrives immediately (no id — don't reply)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"hello"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span>
  <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span>
  <span class="tok-f">"operations"</span><span class="tok-p">:[</span><span class="tok-c">/* full list */</span><span class="tok-p">],</span> <span class="tok-f">"security"</span><span class="tok-p">:{</span><span class="tok-c">/* incl. occupancy */</span><span class="tok-p">},</span> <span class="tok-c">/* … */</span> <span class="tok-p">}}</span>

<span class="tok-c">// 3) last-wins device: call business methods directly, params as object</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"volume"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"level"</span><span class="tok-p">:</span><span class="tok-n">35</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"level"</span><span class="tok-p">:</span><span class="tok-n">35</span><span class="tok-p">}}</span>

<span class="tok-c">// 4) Exclusive device (e.g. gateway): occupy → control (with token) → release</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"bt.scan"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">}}</span></pre>
</div>

## Success criteria

<div class="table-wrap">
<table>
<thead><tr><th>Check</th><th>Expected</th></tr></thead>
<tbody>
<tr><td>Discovery answer</td><td>Prints <code>id</code> / <code>occupancy</code> / <code>control</code> / <code>state=online</code></td></tr>
<tr><td>First line on connect</td><td>A <code>hello</code> notification (has <code>jsonrpc:"2.0"</code>, no <code>id</code>)</td></tr>
<tr><td>Response correlation</td><td>Response <code>id</code> matches request <code>id</code> one-to-one (order may vary)</td></tr>
<tr><td>last-wins control</td><td>Business methods callable without occupy; <code>result.holder</code> becomes you</td></tr>
<tr><td>Endpoint open</td><td><code>result</code> carries a <code>stream</code> URI and <code>format</code>; both ends share <code>kind</code> and intersect on <code>media</code></td></tr>
</tbody>
</table>
</div>

## Common errors and remedies

<div class="table-wrap">
<table>
<thead><tr><th>Error (bmahs_code / code)</th><th>Cause</th><th>Remedy</th></tr></thead>
<tbody>
<tr>
<td><code>invalid-request</code> / <code>-32600</code></td>
<td>Envelope missing <code>jsonrpc</code>, positional params, or batch arrays used</td>
<td>Use object-form <code>params</code>; never batch</td>
</tr>
<tr>
<td><code>unknown-action</code> / <code>-32601</code></td>
<td><code>method</code> not in this device's <code>operations</code></td>
<td>Re-run <code>describe</code>; call only listed methods</td>
</tr>
<tr>
<td><code>bad-arg</code> / <code>-32602</code></td>
<td>Missing args, wrong type, out of <code>min</code>-<code>max</code>, not in <code>enum</code></td>
<td>Fix per <code>args</code>; for pairing, check kind / media intersection</td>
</tr>
<tr>
<td><code>occupied</code> / <code>-32001</code></td>
<td>Exclusive device held by another (<code>data</code> has <code>holder</code> / <code>until</code>)</td>
<td>Wait per <code>until</code> or reschedule; never force-preempt</td>
</tr>
<tr>
<td><code>unauthorized</code> / <code>-32004</code></td>
<td><code>token</code> missing / expired / agent-mismatched</td>
<td>Re-<code>occupy</code> for a fresh token</td>
</tr>
<tr>
<td><code>denied</code> / <code>-32005</code></td>
<td>Hit a <code>deny</code> line, or <code>confirm</code> timed out / was vetoed</td>
<td><b>Stop and report honestly</b>; do not attempt to bypass</td>
</tr>
<tr>
<td>Device vanished from the list</td>
<td>No <code>announce</code> within the expiry window, or <code>goodbye</code> was sent</td>
<td>Re-send <code>query</code>: either it's back, or it's confirmed offline</td>
</tr>
<tr>
<td>Music source says "login expired"</td>
<td>Device-side session expiry (normal)</td>
<td>Re-scan the QR code and retry</td>
</tr>
<tr>
<td>Music source says <code>no play permission</code></td>
<td>Track licensing / membership required</td>
<td><b>A licensing boundary, not a fault</b> — switch to your own playlist; don't bypass</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">Advice for demo-givers</div>
    Pick examples that <b>preset scenes cannot do</b> — cross-brand, multi-device, un-preconfigured combinations.
    When all three appear at once, the audience finally sees the difference.
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/orchestration.html">
<div class="card__title">Grasp the breakthrough →</div>
<div class="card__desc">NL orchestration: why this isn't "another smart speaker".</div>
</a>
<a class="card" href="/en/docs/tools.html">
<div class="card__title">Methods & Messages →</div>
<div class="card__desc">Five universal methods, error-code mapping and default ports.</div>
</a>
<a class="card" href="/en/docs/architecture.html">
<div class="card__title">Connect your own devices →</div>
<div class="card__desc">How a gateway publishes legacy hardware as BMAHS devices, plus the four roles and their boundaries.</div>
</a>
</div>
