---
title: "Conformance Checklist"
description: "Device conformance checklist, default ports, integration acceptance points, and the prohibition list."
eyebrow: "Specification · Chapter 18"
---

<p class="eyebrow">Specification · Chapter 18</p>

# Conformance Checklist


### 18.1 Device firmware / embedded software conformance checklist

<ul>
<li>☐ Obtain IPv4 / IPv6 and write them to <code>ip</code> / <code>ipv6</code></li>
<li>☐ Fix <code>id</code>, <code>type</code>, <code>service</code>, natural-language <code>name</code> / <code>summary</code>, <code>model</code></li>
<li>☐ Choose and announce <code>security.occupancy</code> (<code>exclusive</code> when <code>ui</code> is present)</li>
<li>☐ Dual-stack listen on the business port; send <code>announce</code> per §15.1 (<code>protocol=bmahs/1.2</code>, <code>state=online</code>); steady-state interval default 5 s</li>
<li>☐ Answer <code>query</code>; refresh the announcement on address change (§6.4); on exit send two <code>goodbye</code>s and stop all streams</li>
<li>☐ Bonjour <code>_bmahs._tcp</code>, TXT per §17</li>
<li>☐ Immediately after a TCP connection, send the <code>hello</code> <b>notification</b> (JSON-RPC, no id); params contain the complete <code>operations</code> / <code>security</code> (incl. occupancy), no token / stream URIs</li>
<li>☐ Request parsing complies with JSON-RPC 2.0: <code>jsonrpc</code> validation, <code>id</code> correlation, object-form <code>params</code>, invalid JSON answered with <code>-32700</code>, invalid envelope answered with <code>-32600</code></li>
<li>☐ Implement <code>describe</code> / <code>info</code> / <code>who</code>; exclusive additionally implements <code>occupy</code> / <code>release</code> with token</li>
<li>☐ Error responses carry an integer <code>code</code> (Chapter 9 mapping), a natural-language <code>message</code>, <code>data.bmahs_code</code> and <code>data.retryable</code></li>
<li>☐ Do not treat <code>register</code> as mandatory; do not use <code>registered</code> / <code>managed</code></li>
<li>☐ <code>last-wins</code>: control executes immediately and updates <code>holder</code>; no <code>occupied</code> returned; no token issued</li>
<li>☐ <code>exclusive</code>: validate token-to-agent binding; default lease 60 s; at least 2 TCP connections</li>
<li>☐ Provide <code>constraint</code> (usage constraints, §10.6) in the <code>hello</code> notification params / <code>describe</code> result; consistent in both places, no secrets, no conflict with <code>operations</code> / <code>security</code></li>
<li>☐ Optional <code>confirm</code> (§10.7); optional <code>event</code> notification</li>
<li>☐ (With UI) exclusive + §13 binary stream + occupancy token handshake; release must stop the UI</li>
<li>☐ (With endpoints) §14: <code>input</code> SHOULD implement <code>stream.join</code>; media TCP has no handshake; URIs returned only after opening; control does not tear down streams; preemption per <code>preempt</code></li>
</ul>

### 18.2 Recommended default ports

<div class="table-wrap">
<table>
<thead><tr><th>Purpose</th><th>Default port</th></tr></thead>
<tbody>
<tr><td><code>control</code> (JSON-RPC over TCP)</td><td style="white-space:nowrap"><b>9527</b></td></tr>
<tr><td>UI stream</td><td style="white-space:nowrap"><b>9531</b></td></tr>
<tr><td>Data stream</td><td><b>9532</b> (the open response returns the actual port; each session uses a fresh URI and an invalidated URI MUST NOT be reused — see §14.4)</td></tr>
</tbody>
</table>
</div>

### 18.3 Integration acceptance points

<p>Within the same LAN:</p>

<ol>
<li>discovery should print <code>id</code>, <code>occupancy</code>, <code>control</code>, <code>state=online</code>;</li>
<li>immediately after TCP connects, the <code>hello</code> notification arrives (with <code>jsonrpc:&quot;2.0&quot;</code>, no <code>id</code>);</li>
<li>sending an invalid JSON line yields a <code>-32700</code> error; sending an invalid envelope yields <code>-32600</code>; an unknown method yields <code>-32601</code>;</li>
<li>a <code>last-wins</code> device's business methods can be called without occupy; response <code>id</code>s correspond one-to-one with request <code>id</code>s;</li>
<li>when interconnecting two endpoints, no stream URI appears in the model-side context.</li>
</ol>

### 18.4 Prohibited behaviors (normative)

<ul>
<li>Sending passwords, <code>token</code>, stream URIs, user accounts, or screen content in multicast;</li>
<li>Using <code>announce</code> as a business-state push;</li>
<li>Using <code>127.0.0.1</code> as the external <code>ip</code>;</li>
<li>Modifying the multicast address / port;</li>
<li>Replacing <code>announce</code> / <code>query</code> / <code>goodbye</code> with new <code>kind</code>s;</li>
<li>Writing <code>register</code> as a mandatory method for all devices; writing <code>registered</code> as an online-idle state;</li>
<li>Letting a <code>last-wins</code> device refuse control for not having occupied;</li>
<li>Mandating that real-device interconnection must go through a gateway <code>route</code>;</li>
<li>Letting the model relay media or hold stream URIs / tokens;</li>
<li>Inventing an extra credential for data streams; forcing an occupancy-token handshake on media TCP (except UI streams);</li>
<li>Tearing down data streams when a <code>last-wins</code> holder changes;</li>
<li>Passing full-frame images in the control JSON;</li>
<li>Using machine codes alone as descriptions;</li>
<li>Replacing IP-based discovery and <code>control</code> with USB bulk or pure serial;</li>
<li>Using JSON-RPC batch arrays or positional parameters on the control channel (<code>params</code> MUST be an object).</li>
</ul>
