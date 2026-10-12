---
title: "Capabilities & Security"
description: "operations is the device's remote button list; security is the undertaking for \"what must never be done\" (allow / deny / confirm). Safety is written into the protocol, not left to vendor promises."
eyebrow: "Core Concepts / L2 · L3"
---

<p class="eyebrow">Core Concepts / L2 · L3</p>

# Capabilities & Security

<p class="lead">
  Two fields decide whether a device can be orchestrated with confidence:
<code>operations</code> answers <b>"what it can do"</b>, and <code>security</code> answers
<b>"what it must never do"</b> — and which actions need a human's nod.
  The former is capability; the latter is a <b>protocol-level security commitment</b>.
</p>

## operations: the remote's button list

<p>The agent orders from the menu — <b>nothing off-list is ever pressed</b>.</p>

<div class="table-wrap">
<table>
<thead><tr><th>Device</th><th>Category</th><th>Ops count</th><th>Sample entries</th></tr></thead>
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
<div class="callout__title">Different counts are normal</div>
    Management-class devices (gateways) naturally carry more capabilities than playback-class devices (speakers).
    Op count is not a measure of strength — what matters is that <b>the list is truthful</b>, and that nothing off-list is accepted.
</div>
</div>

## security: the three-color undertaking

<div class="grid3">
<div class="tile" style="border-color:color-mix(in srgb, var(--green) 35%, transparent)">
<p style="margin:0 0 10px"><span class="badge badge--allow">allow</span></p>
<div class="tile__title">Explicitly allowed</div>
<p class="tile__desc">Green. Actions executable without extra confirmation; usually one-to-one with <code>operations</code>.</p>
</div>
<div class="tile" style="border-color:color-mix(in srgb, var(--red) 35%, transparent)">
<p style="margin:0 0 10px"><span class="badge badge--deny">deny</span></p>
<div class="tile__title">Never allowed</div>
<p class="tile__desc">Red. Protocol-level red lines: disk writes, outbound network, command execution, camera, microphone, and the like. <b>The agent never crosses them.</b></p>
</div>
<div class="tile" style="border-color:color-mix(in srgb, var(--amber) 35%, transparent)">
<p style="margin:0 0 10px"><span class="badge badge--confirm">confirm</span></p>
<div class="tile__title">Needs a human's nod</div>
<p class="tile__desc">Amber. High-risk methods are confirmed <b>locally on the device</b> (button / on-screen prompt / official app); default wait 30 s (configurable 5–300), voided on timeout — the agent never decides for the human.</p>
</div>
</div>

## The deny list varies by device

<p>The same red line means different things on different devices — which is exactly why deny must live in the <b>device's self-description</b>.</p>

<div class="cols2">
<div class="compare compare--a">
<div class="compare__head">Deny on a speaker (speaker/1)</div>
<div class="compare__body">
<ul>
<li><code>write-filesystem</code> — no disk writes</li>
<li><code>network-fetch</code> — no outbound network fetches</li>
<li><code>exec</code> — no command execution</li>
<li><code>cloud-upload</code> — no cloud uploads</li>
</ul>
<p style="margin:10px 0 0;color:var(--text-muted);font-size:12.5px">
        It can play music, but it can't sneak the camera on — safety is written into the protocol, not left to vendor promises.
</p>
</div>
</div>
<div class="compare compare--a">
<div class="compare__head">Deny on a music source (qqmusic/1)</div>
<div class="compare__body">
<ul>
<li><code>system.volume</code> — no system volume changes</li>
<li><code>credential.share</code> — no sharing login credentials</li>
</ul>
<p style="margin:10px 0 0;color:var(--text-muted);font-size:12.5px">
        A music source only plays and picks tracks; volume is the speaker's own business — the boundary of responsibility is written into the protocol as well.
</p>
</div>
</div>
</div>

## The full security fields

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono">scope</td><td style="white-space:nowrap">Yes</td><td>Network scope: <code>lan</code> / <code>wan</code> (opening wan requires a documented justification)</td></tr>
<tr><td class="mono" style="white-space:nowrap">auth</td><td style="white-space:nowrap">Yes</td><td>Transport / identity auth: <code>none</code> / <code>token</code> / <code>tls</code>. <b>Not</b> the occupancy policy</td></tr>
<tr><td class="mono">occupancy</td><td style="white-space:nowrap">Yes</td><td><code>last-wins</code> or <code>exclusive</code>; defaults to <code>exclusive</code> when absent</td></tr>
<tr><td class="mono">allow</td><td>Should</td><td>Explicitly allowed capability tags</td></tr>
<tr><td class="mono" style="white-space:nowrap">deny</td><td style="white-space:nowrap">Yes</td><td>Explicitly forbidden capabilities. Should at least cover: arbitrary disk reads, arbitrary disk writes, command execution, network fetches, cloud uploads, covert camera / microphone capture</td></tr>
<tr><td class="mono">confirm</td><td style="white-space:nowrap">May</td><td>Method names that require user confirmation before execution</td></tr>
<tr><td class="mono">confirm_timeout</td><td style="white-space:nowrap">May</td><td>Maximum confirmation wait in seconds, range <b>5–300</b>, default <b>30</b></td></tr>
<tr><td class="mono">notes</td><td style="white-space:nowrap">Yes</td><td>Natural-language boundary notes; empty strings forbidden</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">auth and occupancy must not substitute for each other</div>
    A device with <code>auth=none</code> can still be <code>exclusive</code> (mutual exclusion via the occupancy token alone);
    a <code>last-wins</code> device <b>must not</b> additionally demand an occupancy token on control calls.
    Stream-opening methods on capture-class endpoints (microphone, camera) should be listed in <code>confirm</code> even when the device is <code>last-wins</code>.
</div>
</div>

## confirm: keeping the decision with the human

<p>The confirmation channel is provided <b>locally by the device</b> — a physical button, an on-screen prompt, the vendor's official app. The protocol adds no control methods for it.</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">confirm-level method · call sequence</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-c">// 1) The agent calls a confirm-level method (e.g. system.reboot)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"system.reboot"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>

<span class="tok-c">// 2) During the wait the device sends no reply for this id — it is waiting locally for the user</span>
<span class="tok-c">//    Maximum wait is confirm_timeout (default 30 s, configurable 5–300)</span>

<span class="tok-c">// 3a) Local confirmation done → executes normally, replies with result</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-c">/* … */</span><span class="tok-p">}}</span>

<span class="tok-c">// 3b) Timeout or user veto → error response denied (not retryable by default; retryable=true on a confirmation timeout, and no rapid retries)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"error"</span><span class="tok-p">:{</span><span class="tok-f">"code"</span><span class="tok-p">:</span><span class="tok-n">-32005</span><span class="tok-p">,</span> <span class="tok-f">"message"</span><span class="tok-p">:</span><span class="tok-s">"User did not confirm the reboot"</span><span class="tok-p">,</span>
  <span class="tok-f">"data"</span><span class="tok-p">:{</span><span class="tok-f">"bmahs_code"</span><span class="tok-p">:</span><span class="tok-s">"denied"</span><span class="tok-p">,</span> <span class="tok-f">"retryable"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">}}}</span></pre>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">Two disciplines</div>
    ① The agent's wait timeout <b>must not be shorter than</b> the device's announced <code>confirm_timeout</code>, and must not retry rapidly just because the user hasn't responded;
    ② the device does not reply to the request while waiting — the client must tolerate the absence of a response for that <code>id</code> during the window.
</div>
</div>

## Why safety must live in the protocol

<div class="table-wrap">
<table>
<thead><tr><th>Approach</th><th>Verifiable</th><th>Auditable</th><th>Consistent across vendors</th></tr></thead>
<tbody>
<tr><td>Vendor verbal promises</td><td style="white-space:nowrap">No</td><td style="white-space:nowrap">No</td><td style="white-space:nowrap">No</td></tr>
<tr><td>Self-imposed app-layer constraints</td><td>Partial</td><td style="white-space:nowrap">No</td><td style="white-space:nowrap">No</td></tr>
<tr><td><b>Protocol-level security fields</b></td><td><b>Yes</b> (readable self-description)</td><td><b>Yes</b> (leaves a trace)</td><td><b>Yes</b> (one shared semantics)</td></tr>
</tbody>
</table>
</div>

<p>
  Writing the boundary into the self-description has another benefit: <b>the agent knows where it cannot go before it starts orchestrating</b>,
  rather than being rejected halfway. That turns orchestration from "trial and error" into "planning".
</p>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/occupancy.html">
<div class="card__title">Occupancy & Leases →</div>
<div class="card__desc">When several agents fight over one device, whose word wins.</div>
</a>
<a class="card" href="/en/docs/streaming.html">
<div class="card__title">Data Streams: Push & Pull →</div>
<div class="card__desc">How sound flows from a source to a speaker.</div>
</a>
</div>
