---
title: "Device Discovery"
description: "Multicast query + announce self-description + Bonjour: discovered on power-up, described as capable, zero configuration all the way."
eyebrow: "Core Concepts / L1"
---

<p class="eyebrow">Core Concepts / L1</p>

# Device Discovery

<p class="lead">
<b>Zero configuration is BMAHS's first gift to the user.</b>
  A new device needs no pairing, no forms, no app installation after power-on — it announces itself once and shows up in the agent's device list.
</p>

## The discovery trio

<div class="grid3">
<div class="tile">
<p class="tile__num">01</p>
<div class="tile__title">Multicast query</div>
<p class="tile__desc">The agent multicasts one question over the LAN: "who's online?" — one query covers the whole network, no per-device polling.</p>
</div>
<div class="tile">
<p class="tile__num">02</p>
<div class="tile__title">announce self-description</div>
<p class="tile__desc">Each device answers with its business card: who I am, what I can do. See <a href="/en/docs/self-description.html">Device Self-Description</a>.</p>
</div>
<div class="tile">
<p class="tile__num">03</p>
<div class="tile__title">Bonjour registration (mDNS/DNS-SD)</div>
<p class="tile__desc">Beyond the protocol-level description, it also registers the service via mDNS/DNS-SD (multicast); the system's own Bonjour (macOS / iOS) or Avahi (Linux) can discover it.</p>
</div>
</div>

## Discovery sequence

<div class="figure">
<svg viewBox="0 0 680 260" role="img" aria-label="Discovery sequence: multicast query, announce self-description, list re-query">
<defs>
<marker id="a5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="a5a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<text class="dg-mk" x="20" y="20">Agent</text>
<text class="dg-mk" x="272" y="20">LAN (multicast)</text>
<text class="dg-mk" x="540" y="20">Device</text>

<line class="dg-tick" x1="60" y1="34" x2="60" y2="228"/>
<line class="dg-tick" x1="360" y1="34" x2="360" y2="228"/>
<line class="dg-tick" x1="600" y1="34" x2="600" y2="228"/>

<line class="dg-line--accent" x1="60" y1="62" x2="600" y2="62" marker-end="url(#a5)"/>
<text class="dg-m" x="70" y="56">Multicast query: who is online?</text>

<line class="dg-line" x1="600" y1="98" x2="60" y2="98" marker-end="url(#a5)"/>
<text class="dg-m" x="330" y="92" text-anchor="middle">announce: who I am, what I can do</text>

<line class="dg-line" x1="600" y1="134" x2="200" y2="134"/>
<text class="dg-m" x="330" y="128" text-anchor="middle">Bonjour: mDNS/DNS-SD registration (multicast · dual-track)</text>

<rect class="dg-agent" x="20" y="150" width="200" height="62" rx="8"/>
<text class="dg-s" x="36" y="174">List fills in, device by device</text>
<text class="dg-m" x="36" y="194">state=online · busy=false</text>

<text class="dg-m" x="250" y="178">Steady state: every 5 s</text>
<line class="dg-tick" x1="250" y1="186" x2="330" y2="186"/>
<text class="dg-m" x="250" y="204">announce keep-alive</text>

<text class="dg-m" x="20" y="246">A dropped device vanishes from the list; re-querying rescans: found again, or confirmed offline</text>
</svg>
<p class="figure__cap">Fig. 1 · Power-on → multicast query → per-device announce → list re-query — no configuration anywhere</p>
</div>

## Multicast parameters

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Item</th><th style="white-space:nowrap">IPv4</th><th style="white-space:nowrap">IPv6</th></tr></thead>
<tbody>
<tr><td>Multicast address</td><td class="mono">239.255.42.42</td><td class="mono">ff02::4242 (link-local)</td></tr>
<tr><td style="white-space:nowrap">Port</td><td class="mono" style="white-space:nowrap">5354</td><td>same as left</td></tr>
<tr><td>TTL / Hop Limit</td><td style="white-space:nowrap"><code>2</code></td><td style="white-space:nowrap"><code>2</code></td></tr>
<tr><td>Message cap</td><td colspan="2">Single message ≤ <b>1400 bytes</b> (avoiding IP fragmentation); one UDP datagram carries one UTF-8 JSON object</td></tr>
</tbody>
</table>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>Message</th><th>Direction</th><th>Cadence (mandatory)</th></tr></thead>
<tbody>
<tr><td class="mono">announce</td><td>device → multicast</td><td><b>3 sends</b> on joining the network (~0.3 s apart); steady-state default every <b>5 s</b> (hard floor — only increasing is allowed, and must be announced as <code>hb</code>); re-send immediately on state change</td></tr>
<tr><td class="mono">query</td><td>agent → multicast</td><td>May fast re-send once if no answer within 0.2 s; the same <code>want</code> at most twice within 1 s (first + fast re-send); total wait 2–4 s</td></tr>
<tr><td class="mono">goodbye</td><td>device → multicast</td><td><b>2 sends</b> before going offline (~0.3 s apart), while stopping all UI streams and media sessions</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">How a device answers a query</div>
    After receiving a matching <code>query</code>, the device <b>waits a randomized 20–120 ms</b> and then sends one <code>announce</code>
    (to avoid a storm of simultaneous answers across the network), and answers the same sender at most once per second.
<code>want</code> filters by <code>type</code>: empty, <code>*</code>, or <code>bmahs</code> means all.
</div>
</div>

## Usage

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Discovery · UDP messages</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-c">// The agent sends a query (plain JSON, not JSON-RPC)</span>
<span class="tok-p">{</span><span class="tok-f">"version"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"query"</span><span class="tok-p">,</span>
 <span class="tok-f">"timestamp"</span><span class="tok-p">:</span><span class="tok-n">1791000000</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"want"</span><span class="tok-p">:</span><span class="tok-s">"speaker,bridge"</span><span class="tok-p">}</span>

<span class="tok-c">// A matching device answers announce (excerpt)</span>
<span class="tok-p">{</span><span class="tok-f">"version"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"announce"</span><span class="tok-p">,</span>
 <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"type"</span><span class="tok-p">:</span><span class="tok-s">"speaker"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span>
 <span class="tok-f">"name"</span><span class="tok-p">:</span><span class="tok-s">"Desk Speaker"</span><span class="tok-p">,</span> <span class="tok-f">"control"</span><span class="tok-p">:</span><span class="tok-s">"tcp://192.168.1.42:9527"</span><span class="tok-p">,</span>
 <span class="tok-f">"security"</span><span class="tok-p">:{</span><span class="tok-f">"scope"</span><span class="tok-p">:</span><span class="tok-s">"lan"</span><span class="tok-p">,</span> <span class="tok-f">"auth"</span><span class="tok-p">:</span><span class="tok-s">"none"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">},</span>
 <span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">false</span><span class="tok-p">,</span> <span class="tok-f">"hb"</span><span class="tok-p">:</span><span class="tok-n">5</span><span class="tok-p">}</span>

<span class="tok-c">// Troubleshooting: re-send the query — found again, or confirmed offline</span></pre>
</div>

## State fields

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td class="mono">state</td><td><code>online</code> / <code>offline</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td><code>true</code> if and only if: exclusive is occupied, or an active UI stream / media session exists</td></tr>
<tr><td class="mono">occupancy</td><td>Occupancy policy: <code>exclusive</code> or <code>last-wins</code>; see <a href="/en/docs/occupancy.html">Occupancy & Leases</a></td></tr>
<tr><td class="mono">service</td><td>Protocol service and version; determines the callable operation set</td></tr>
<tr><td class="mono" style="white-space:nowrap">hb</td><td>Steady-state announce interval (seconds). Default 5; must be announced when increased. Removal timeout = <code>clamp(12×hb, 60s, 30min)</code></td></tr>
</tbody>
</table>
</div>

## Drop-line troubleshooting

<ol class="steps">
<li><div class="steps__title">Confirm the symptom</div>The device vanished from the list — note the time of its last <code>announce</code> and what was happening then.</li>
<li><div class="steps__title">Re-send the query</div>Send another <code>query</code> and wait for a round of answers (total wait 2–4 s).</li>
<li><div class="steps__title">Two possible conclusions</div><b>Found again</b>: the device has recovered; continue the original task. <b>Confirmed offline</b>: tell the user honestly; do not silently substitute another device.</li>
</ol>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">A real case</div>
    An AirPlay device that was in the list in the afternoon had vanished by evening — the cause was the device itself dropping, not a protocol problem.
<b>Reporting honestly matters more than forcing a workaround</b>: every link of orchestration is built on real state.
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/streaming.html">
<div class="card__title">Data Streams: Push & Pull →</div>
<div class="card__desc">After discovery, how sound flows.</div>
</a>
<a class="card" href="/en/docs/tools.html">
<div class="card__title">Methods & Messages →</div>
<div class="card__desc">The JSON-RPC envelope, five universal methods and error-code mapping.</div>
</a>
</div>
