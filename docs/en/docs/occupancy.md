---
title: "Occupancy & Leases"
description: "When several agents command one device at once, whose word wins: exclusive with lease tokens, or last-wins where the last write overwrites."
eyebrow: "Core Concepts / L3 Trust Readiness"
---

<p class="eyebrow">Core Concepts / L3 Trust Readiness</p>

# Occupancy & Leases

<p class="lead">
  Concurrency control is the section of the common language most easily overlooked and most consequential for reliability.
  The core conflict is simple: <b>two agents want to command the same device — whose word wins?</b>
  BMAHS offers two modes, chosen by the nature of the device.
</p>

## Two concurrency modes

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Mode</th><th>Suitable devices</th><th>Behavior</th><th>Return</th></tr></thead>
<tbody>
<tr>
<td><span class="badge badge--accent">exclusive</span></td>
<td><b>Management-class</b> devices such as gateways</td>
<td>First come, first served; occupying yields a token with a lease clock</td>
<td>Auto-returned at expiry / proactive <code>release</code></td>
</tr>
<tr>
<td><span class="badge badge--neutral">last-wins</span></td>
<td><b>Playback-class</b> devices such as speakers</td>
<td>Last write wins; the final command takes effect</td>
<td>Nothing to return</td>
</tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">Two metaphors</div>
<b>exclusive</b>: whoever holds it makes the calls, and returns it on time — like a key with a built-in timer.<br>
<b>last-wins</b>: last write wins — a later command overrides an earlier one; nothing to grab, nothing to return.
</div>
</div>

## The exclusive lifecycle

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Item</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Default lease</td><td><b>60 s</b>: an <code>occupy</code> without <code>ttl</code> goes idle at expiry and the old token is voided</td></tr>
<tr><td>Valid <code>ttl</code> range</td><td><b>10–9999</b>; out of range → <code>bad-arg</code></td></tr>
<tr><td>Indefinite</td><td><code>ttl=9999</code>: <code>lease_security=9999</code>, <code>until=0</code>; must be explicitly <code>release</code>d</td></tr>
<tr><td>Refresh</td><td>Under a finite lease, the holder's subsequent calls <b>with the token</b> auto-refresh <code>until</code></td></tr>
<tr><td>Auto-managed</td><td>The first control call on an idle device is also taken under management and issued a token</td></tr>
<tr><td>Token spec</td><td>≥16 hex characters; <b>bound</b> to the <code>agent</code> it was issued to; any mismatch → <code>unauthorized</code></td></tr>
<tr><td>Concurrent TCP</td><td>The device must support at least <b>2</b> connections (holder's control + others read-only); read-only methods are callable from any connection</td></tr>
<tr><td>Stuck recovery</td><td>The default 60-s expiry is the safety net; only <code>ttl=9999</code> with a lost token requires <b>restarting the device process</b> (the protocol offers no forceful preemption)</td></tr>
</tbody>
</table>
</div>

<div class="figure">
<svg viewBox="0 0 680 220" role="img" aria-label="Lease timeline for exclusive occupancy">
<line class="dg-tick" x1="40" y1="150" x2="640" y2="150"/>

<text class="dg-mk" x="34" y="170">T0</text>
<text class="dg-mk" x="250" y="170">Occupied (lease valid)</text>
<text class="dg-mk" x="500" y="170">Lease expired / released</text>

<rect class="dg-proto" x="40" y="96" width="360" height="42" rx="8"/>
<text class="dg-s-inv" x="56" y="122">exclusive held · token valid</text>

<rect class="dg-gray" x="400" y="96" width="240" height="42" rx="8"/>
<text class="dg-s" x="416" y="122">others wait: occupied (-32001)</text>

<line class="dg-tick" x1="40" y1="80" x2="40" y2="150"/>
<line class="dg-tick" x1="400" y1="80" x2="400" y2="150"/>

<text class="dg-m" x="40" y="70">occupy</text>
<text class="dg-m" x="366" y="70">until=…</text>

<rect class="dg-dev" x="400" y="40" width="240" height="38" rx="8"/>
<text class="dg-s" x="416" y="64">Lease auto-reclaims at expiry</text>

<text class="dg-m" x="40" y="196">Calls refresh the lease; an explicit release returns it early — nothing is held hostage</text>
</svg>
<p class="figure__cap">Fig. 1 · Occupying yields a lease-bound token; it auto-returns at expiry — polite agents release early</p>
</div>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Occupy → operate → release</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-c">// 1) Occupy the exclusive device: get a token and the expiry (until is Unix seconds)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"event"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">,</span>
  <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">,</span> <span class="tok-f">"lease_security"</span><span class="tok-p">:</span><span class="tok-n">60</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>

<span class="tok-c">// 2) Do exclusive work while holding (subsequent calls auto-refresh the lease)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"bt.scan"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>

<span class="tok-c">// 3) Return it immediately when done — basic agent etiquette</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span></pre>
</div>

## Where last-wins applies

<p>
  Playback-class devices need no preemption semantics: the user says "play", then says "pause",
  and the latter naturally overrides the former — there is no notion of "exclusive resource" in between.
<b>Forcing a lock in would only complicate simple interactions.</b>
</p>

<div class="table-wrap">
<table>
<thead><tr><th>Scenario</th><th>Recommended mode</th><th style="white-space:nowrap">Why</th></tr></thead>
<tbody>
<tr><td>Scan and connect Bluetooth devices</td><td><span class="badge badge--accent">exclusive</span></td><td>State changes while scanning; must be exclusive, or two agents interfere with each other</td></tr>
<tr><td>Publish / unpublish virtual devices</td><td><span class="badge badge--accent">exclusive</span></td><td>Touches the device registry — a structural change</td></tr>
<tr><td>Play / pause / switch track</td><td><span class="badge badge--neutral">last-wins</span></td><td>The intent is naturally "latest first"; no exclusivity needed</td></tr>
<tr><td>Adjust volume</td><td><span class="badge badge--neutral">last-wins</span></td><td>A numeric final state; last write winning is exactly right</td></tr>
</tbody>
</table>
</div>

## Etiquette rules

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Rule</th><th style="white-space:nowrap">Do</th><th>Don't</th></tr></thead>
<tbody>
<tr><td>Release when done</td><td><code>release</code> proactively when the task ends (including failure / cancellation)</td><td>Hold the token and never release it, so other agents can never get one</td></tr>
<tr><td>Don't cut others' streams</td><td><code>stream.stop</code> only streams <b>opened by your own end</b></td><td>Stop someone else's stream and interrupt their playback</td></tr>
<tr><td>Multi-step tasks: check who</td><td>On last-wins, call <code>who</code> before each step; stop if <code>holder</code> is no longer you</td><td>Assume the old agent keeps working — the device won't reject the stale agent's next call, and continued sending just overwrites back and forth</td></tr>
<tr><td>Don't abuse long leases</td><td>Request a <code>ttl</code> that matches the task duration — no longer</td><td>Ask for <code>ttl=9999</code> (indefinite) for convenience — if the token is lost, only a device restart helps</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">How long should a lease be?</div>
    Too long = a fault pins the device for a long time; too short = a task is reclaimed halfway through.
    The default 60 s, combined with "token calls auto-refresh", already covers most tasks —
    when more is needed, request <code>ttl</code> (10–9999) for the task's <b>worst-case duration</b>, and pair it with a proactive <code>release</code> to return early.
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/discovery.html">
<div class="card__title">Device Discovery →</div>
<div class="card__desc">Zero configuration: devices burst 3 announces at power-up (~0.3 s apart) and appear in the list within seconds.</div>
</a>
<a class="card" href="/en/docs/streaming.html">
<div class="card__title">Data Streams: Push & Pull →</div>
<div class="card__desc">stream_out / stream_in and the two transport modes.</div>
</a>
</div>
