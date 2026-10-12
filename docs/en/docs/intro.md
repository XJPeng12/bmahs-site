---
title: "What is BMAHS?"
description: "BMAHS (Big Model Agent Hardware Specification, bmahs/1.2) is the common language between agents and hardware — a JSON-RPC 2.0 control channel, Ready for AGI, orchestratable with one sentence."
eyebrow: "Getting Started / Intro"
---

<p class="eyebrow">Getting Started / Intro</p>

# What is BMAHS?

<p class="lead">
<b>BMAHS</b> (Big Model Agent Hardware Specification)
  is the <b>common language</b> between agents and hardware devices: it defines how devices introduce
  themselves, what they can do, what they must never do, and what happens when several agents contend
  for the same device. The control channel is <b>JSON-RPC 2.0 over TCP</b>, protocol identifier <code>bmahs/1.2</code>.
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">One-sentence positioning</div>
<b>BMAHS gives hardware a common language, Ready for AGI</b> — and then one sentence can orchestrate it all.
</div>
</div>

## Three layers of one idea

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">#</th><th>One-line description</th><th>Answers</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">①</td><td>BMAHS is the <b>common language</b> between agents and hardware</td><td style="white-space:nowrap">What</td></tr>
<tr><td style="white-space:nowrap">②</td><td>Speaking it well makes hardware <b>Ready for AGI</b> (understandable / controllable / delegable)</td><td style="white-space:nowrap">Why</td></tr>
<tr><td style="white-space:nowrap">③</td><td>Once ready, <b>natural-language orchestration</b> becomes possible</td><td>What you get</td></tr>
</tbody>
</table>
</div>

## What it is, what it isn't

<p>Drawing the boundary matters more than listing capabilities — it decides whether people misjudge what you're building.</p>

<div class="cols2">
<div class="compare compare--b">
<div class="compare__head">BMAHS is</div>
<div class="compare__body">
<ul>
<li>An <b>open protocol specification</b>: UDP multicast + Bonjour discovery, TCP + JSON-RPC 2.0 control</li>
<li>Designed for <b>agent semantics</b>: letting AI read capabilities, boundaries and intent</li>
<li>A <b>translation layer</b>: legacy hardware, translated for agents</li>
<li><b>Brand-neutral</b>: bound to no vendor and no single agent</li>
<li>Connectable through <b>any protocol client</b> (scripts, SDKs, agent runtimes)</li>
</ul>
</div>
</div>
<div class="compare compare--a">
<div class="compare__head">BMAHS is not</div>
<div class="compare__body">
<ul>
<li>Not a new Bluetooth / Wi-Fi / IR — it <b>invents no physical layer</b></li>
<li>Not a demand to replace devices — legacy hardware joins via a gateway</li>
<li>Not a closed black box, not a cloud-AI onboarding protocol</li>
<li>Not an add-on to any existing protocol ecosystem — an independent spec that evolves on its own</li>
<li>Not scene automation: that is IF-THAN frozen at dev time; BMAHS composes at runtime</li>
</ul>
</div>
</div>
</div>

## Four core capabilities

<div class="grid4">
<div class="tile">
<p class="tile__num">L1</p>
<div class="tile__title">Self-description</div>
<p class="tile__desc">A card on power-up: <code>id / type / service / summary / constraint</code>.</p>
</div>
<div class="tile">
<p class="tile__num">L2</p>
<div class="tile__title">Operations</div>
<p class="tile__desc"><code>operations</code>: the action list — order from the menu.</p>
</div>
<div class="tile">
<p class="tile__num">L3</p>
<div class="tile__title">Security</div>
<p class="tile__desc"><code>security</code>: the allow / deny / confirm undertaking.</p>
</div>
<div class="tile">
<p class="tile__num">L2</p>
<div class="tile__title">Control & media</div>
<p class="tile__desc"><code>endpoints</code> + calls: commands and audio streams.</p>
</div>
</div>

<p style="color:var(--text-muted);font-size:13.5px;margin:14px 0 0;line-height:1.7">
  Readiness levels: <b>L1</b> self-description → <b>L2</b> operations and business methods → <b>L3</b> security.
  The fourth tile (control &amp; media) is also <b>L2</b> — declared via <code>endpoints</code>, it is part of the L2 capability list.
</p>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/architecture.html">
<div class="card__title">Architecture & Ecosystem →</div>
<div class="card__desc">Three layers, four roles, and the data-stream-layer boundary.</div>
</a>
<a class="card" href="/en/docs/quickstart.html">
<div class="card__title">Quickstart →</div>
<div class="card__desc">Six steps to your first orchestrated call, with real error handling.</div>
</a>
</div>
