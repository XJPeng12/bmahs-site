---
title: "Device Self-Description"
description: "Devices describe themselves on power-up: id / type / service / summary / constraint — agents read the description instead of memorizing model docs."
eyebrow: "Core Concepts / L1 Semantic Readiness"
---

<p class="eyebrow">Core Concepts / L1 Semantic Readiness</p>

# Device Self-Description

<p class="lead">
  The first thing a device does on power-up is hand over a <b>business card</b>:
  who I am, what category I belong to, which language I speak, what I can do, and what to note when using me.
  The agent reads the card and can call it correctly — that is <b>semantic readiness</b>.
</p>

## Five fields

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Meaning</th><th>Metaphor</th><th>Example</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">id</td><td>Unique device identifier</td><td>ID number</td><td><code>"bmahs-speaker-01"</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">type</td><td>Category</td><td>Profession</td><td><code>"speaker"</code></td></tr>
<tr><td class="mono">service</td><td>Which "language" it speaks (service + major version)</td><td>Language</td><td><code>"speaker/1"</code></td></tr>
<tr><td class="mono">summary</td><td>One-sentence self-introduction</td><td>Self-description</td><td><code>"Desk speaker; pulls audio streams and adjusts volume independently"</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">constraint</td><td>Usage constraints</td><td>Usage note</td><td><code>"Volume range 0–100; keep ≤ 30 at night"</code></td></tr>
</tbody>
</table>
</div>

## Why natural-language fields

<p>
  Traditional device descriptions are written for <b>developers</b>: register addresses, enum values, SDK docs.
  Agents cannot use that — they need descriptions they can <b>understand</b>.
  That's why <code>summary</code> and <code>constraint</code> deliberately use natural language, allowing vagueness and experience-based advice.
</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">hello notification / describe → self-description (excerpt)</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">"id"</span><span class="tok-p">:</span>      <span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span>
  <span class="tok-f">"type"</span><span class="tok-p">:</span>    <span class="tok-s">"speaker"</span><span class="tok-p">,</span>
  <span class="tok-f">"service"</span><span class="tok-p">:</span> <span class="tok-s">"speaker/1"</span><span class="tok-p">,</span>
  <span class="tok-f">"name"</span><span class="tok-p">:</span>    <span class="tok-s">"Desk Speaker"</span><span class="tok-p">,</span>
  <span class="tok-f">"summary"</span><span class="tok-p">:</span> <span class="tok-s">"Desk speaker; can act as a BMAHS audio endpoint, supports stream pulling and independent volume"</span><span class="tok-p">,</span>
  <span class="tok-f">"constraint"</span><span class="tok-p">:</span>    <span class="tok-s">"Confirm source state=playing before joining; volume 0–100"</span>
<span class="tok-p">}</span></pre>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">"Read the product page before ordering"</div>
    Self-description turns a device into a <b>product detail page</b>. Instead of
    "match model → dig up the manual → assemble commands", the flow becomes "read the description → call".
    This is also why the cost of making a device safely usable by AGI drops from <b>custom development</b> to <b>a single declaration</b>.
</div>
</div>

## Discovery and self-description

<p>
  Self-description isn't passive — discovery and description are two ends of one chain:
  the agent multicasts a <code>query</code> ("who's online?"), and devices each answer with <code>announce</code> ("who I am, what I can do").
  See <a href="/en/docs/discovery.html">Device Discovery</a>.
</p>

## Boundaries of self-description

<div class="table-wrap">
<table>
<thead><tr><th>Principle</th><th>Explanation</th></tr></thead>
<tbody>
<tr><td>Describes capability, never grants permission</td><td>What it can do lives in <code>operations</code>; what it must never do lives in <code>security</code> — the two must not be confused</td></tr>
<tr><td>Never substitutes for security checks</td><td>Even if the description claims "can write disk", the <code>deny</code> list still prevails</td></tr>
<tr><td>Must be truthful</td><td>A misleading <code>constraint</code> (wrong usage advice) directly causes agent misuse — a protocol violation</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">Put differently</div>
    Self-description is <b>inward-facing</b>; it is not <b>asking for trust</b> from the outside.
    Trust is the job of <a href="/en/docs/operations.html">security boundaries</a> and <a href="/en/docs/occupancy.html">occupancy leases</a>.
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/operations.html">
<div class="card__title">Capabilities & Security →</div>
<div class="card__desc">L2: <code>operations</code> and the three-color <code>security</code> undertaking.</div>
</a>
<a class="card" href="/en/docs/discovery.html">
<div class="card__title">Device Discovery →</div>
<div class="card__desc">Found on power-up: multicast query + announce + Bonjour.</div>
</a>
</div>
