---
title: "Natural-Language Orchestration"
description: "BMAHS's core breakthrough: devices declare capability lists and agents compose at runtime — coverage shifts from \"built commands\" to \"capability combinations\"."
eyebrow: "Core Concepts / Breakthrough"
---

<p class="eyebrow">Core Concepts / Breakthrough</p>

# Natural-Language Orchestration

<p class="lead">
  This is the essential dividing line between BMAHS and every existing smart device:
  existing approaches make <b>humans match what machines pre-defined</b>;
  BMAHS opens the machine-side capability list and lets the agent <b>compose on the fly</b> from natural-language intent.
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">In one sentence</div>
    Existing smart devices make <b>you speak their language</b>; BMAHS makes <b>them speak yours</b>.
</div>
</div>

## One sentence, seven actions

<p>The user says one sentence; the agent, <b>at runtime</b>, completes a full chain:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Orchestration chain · generated at runtime</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-k">discover</span> <span class="tok-p">→</span> <span class="tok-k">read capabilities</span> <span class="tok-p">→</span> <span class="tok-k">decompose task</span> <span class="tok-p">→</span> <span class="tok-k">check security</span> <span class="tok-p">→</span> <span class="tok-k">compose cross-device sequence</span> <span class="tok-p">→</span> <span class="tok-k">execute</span> <span class="tok-p">→</span> <span class="tok-k">handle errors & report</span></pre>
</div>

<p>
<b>The key word is "runtime"</b>: nobody pre-wrote this chain —
  the agent composed it <b>on the spot</b> from the devices' declared capability lists.
</p>

## Preset skills vs runtime composition

<div class="figure">
<svg viewBox="0 0 680 306" role="img" aria-label="Preset skill set versus runtime composition">
<defs>
<marker id="a4e" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
</defs>

<text class="dg-mk" x="8" y="14">Existing smart devices</text>
<text class="dg-mk" x="372" y="14">BMAHS devices</text>

<rect class="dg-gray" x="8" y="24" width="300" height="256" rx="12"/>
<text class="dg-l" x="26" y="50" style="fill:var(--text-muted)">Preset skills · closed</text>
<text class="dg-m" x="26" y="66">Capabilities enumerated at dev time</text>

<rect class="dg-chip" x="26" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="66" y="96" text-anchor="middle">play</text>
<rect class="dg-chip" x="118" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="158" y="96" text-anchor="middle">pause</text>
<rect class="dg-chip" x="210" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="250" y="96" text-anchor="middle">volume</text>

<rect class="dg-chip" x="26" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="66" y="130" text-anchor="middle">prev</text>
<rect class="dg-chip" x="118" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="158" y="130" text-anchor="middle">next</text>
<rect class="dg-chip" x="210" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="250" y="130" text-anchor="middle">timer</text>

<rect class="dg-chip" x="26" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="66" y="164" text-anchor="middle">scene A</text>
<rect class="dg-chip" x="118" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="158" y="164" text-anchor="middle">scene B</text>
<text class="dg-m" x="216" y="164">…</text>

<line class="dg-tick" x1="26" y1="192" x2="290" y2="192"/>
<text class="dg-m" x="26" y="212">Coverage = union of built commands</text>
<rect class="dg-deny" x="26" y="224" width="264" height="42" rx="6"/>
<text class="dg-s" x="42" y="242" style="fill:var(--red)">Un-enumerated combos</text>
<text class="dg-m" x="42" y="258">→ "Sorry, I can't do that yet"</text>

<rect class="dg-agent" x="372" y="24" width="300" height="256" rx="12"/>
<text class="dg-l" x="390" y="50">Capability list · open</text>
<text class="dg-m" x="390" y="66">Declared by devices, read at runtime</text>

<rect class="dg-chip" x="390" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="430" y="96" text-anchor="middle">stream.join</text>
<rect class="dg-chip" x="482" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="522" y="96" text-anchor="middle">volume</text>
<rect class="dg-chip" x="574" y="78" width="80" height="28" rx="6"/>
<text class="dg-m" x="614" y="96" text-anchor="middle">status</text>

<rect class="dg-chip" x="390" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="430" y="130" text-anchor="middle">bt.scan</text>
<rect class="dg-chip" x="482" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="522" y="130" text-anchor="middle">bt.connect</text>
<rect class="dg-chip" x="574" y="112" width="80" height="28" rx="6"/>
<text class="dg-m" x="614" y="130" text-anchor="middle" style="font-size:8.5px">playlist_play</text>

<rect class="dg-chip" x="390" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="430" y="164" text-anchor="middle" style="font-size:8.5px">auth.status</text>
<rect class="dg-chip" x="482" y="146" width="80" height="28" rx="6"/>
<text class="dg-m" x="522" y="164" text-anchor="middle" style="font-size:8px">stream.accept</text>
<text class="dg-m" x="614" y="164" text-anchor="middle">…</text>

<line class="dg-tick" x1="390" y1="192" x2="654" y2="192"/>
<text class="dg-m" x="390" y="212">Coverage = any combination of capabilities</text>
<rect class="dg-proto" x="390" y="224" width="264" height="42" rx="6"/>
<text class="dg-s-inv" x="406" y="242">Runtime composition</text>
<text class="dg-m-inv" x="406" y="258">cross-device · multi-step · conditional + error handling</text>
</svg>
<p class="figure__cap">Fig. 1 · Left: a finite enumeration. Right: an open composition — the shortest path to seeing the breakthrough</p>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>Dimension</th><th>Existing smart devices</th><th>BMAHS devices</th></tr></thead>
<tbody>
<tr><td>Capability source</td><td>Vendor-built skills / scenes</td><td>Self-declared <code>operations</code>, read at runtime</td></tr>
<tr><td>Control style</td><td>Fixed voice commands + preset IF-THEN rules</td><td>Natural-language intent, decomposed and composed live</td></tr>
<tr><td>Coverage</td><td>= union of built commands</td><td>= <b>any combination of capabilities</b></td></tr>
<tr><td>Cross-brand</td><td>Closed per ecosystem</td><td>Brand-agnostic; a gateway makes them interoperate</td></tr>
<tr><td>New devices</td><td>Reconfiguration, vendor adaptation</td><td>Found on power-up; join when capabilities are ready</td></tr>
<tr><td>Complex tasks</td><td>Users split them into rules</td><td>One sentence handed to the agent</td></tr>
<tr><td><b>Who orchestrates</b></td><td><b>Vendor</b> (dev time) + <b>user</b> (setup time)</td><td><b>Agent</b> (runtime)</td></tr>
</tbody>
</table>
</div>

## Four freedoms

<div class="grid4">
<div class="tile">
<p class="tile__num">01</p>
<div class="tile__title">Combination</div>
<p class="tile__desc">Coverage moves from "enumerated by vendors" to "composable capabilities" — usages vendors never imagined.</p>
</div>
<div class="tile">
<p class="tile__num">02</p>
<div class="tile__title">Brand</div>
<p class="tile__desc">One sentence drives devices of different brands — cross-ecosystem cooperation without per-brand adaptation or lock-in.</p>
</div>
<div class="tile">
<p class="tile__num">03</p>
<div class="tile__title">Devices</div>
<p class="tile__desc">Legacy devices join via a gateway — no forced replacement, old devices get orchestrated too.</p>
</div>
<div class="tile">
<p class="tile__num">04</p>
<div class="tile__title">Expression</div>
<p class="tile__desc">Users speak their mother tongue; the barrier drops from "learn the device" to "just say it".</p>
</div>
</div>

<p style="font-size:15px">
<b>In essence</b>: <b>control shifts from "preset" to "orchestrated"</b> —
  what used to be human-enumerated in advance is now generated on demand by the agent.
</p>

## Four clarifications

<div class="callout callout--danger">
<div class="callout__icon">!</div>
<div class="callout__body">
    Once the breakthrough is mistaken for "another smart speaker", its value is erased. This section is <b>the defensive line</b>.
</div>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>Misconception</th><th>Reality</th></tr></thead>
<tbody>
<tr>
<td>"Isn't this just Xiaoai / Alexa?"</td>
<td>Those aren't orchestration: they <b>match within preset skill sets</b>; BMAHS <b>composes from capability lists</b>. <b>Command sets are finite; capability combinations are open.</b></td>
</tr>
<tr>
<td>"It's scene automation, right?"</td>
<td>Scene automation is IF-THEN <b>frozen at dev time</b>; BMAHS composes <b>at runtime</b> — nobody pre-listed the chain.</td>
</tr>
<tr>
<td>"Same old thing — controlling devices"</td>
<td>Control is single-device, single-action; orchestration is <b>cross-device, multi-step, with conditions and error handling</b>.</td>
</tr>
<tr>
<td>"Orchestration = letting AI run wild?"</td>
<td>Every step is bounded by <code>security</code> and <code>confirm</code>. <b>Greater capability demands stronger boundaries</b> — which is exactly why BMAHS writes security into the protocol.</td>
</tr>
</tbody>
</table>
</div>

## Freedom and safety designed in the same layer

<p>Stronger composition widens the risk surface — AGI can assemble action sequences no vendor ever imagined. BMAHS therefore designs both together:</p>

<div class="cols2">
<div class="compare compare--b">
<div class="compare__head">Orchestration freedom comes from</div>
<div class="compare__body">
<ul>
<li><code>operations</code> — the capability list</li>
<li><code>endpoints</code> — media and control channels</li>
</ul>
</div>
</div>
<div class="compare compare--a">
<div class="compare__head">Orchestration safety comes from</div>
<div class="compare__body">
<ul>
<li><code>security</code> — allow / deny / confirm</li>
<li><code>occupancy</code> — leases and contention</li>
<li><code>release</code> — polite return</li>
</ul>
</div>
</div>
</div>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">The closed loop</div>
    The <a href="/en/docs/intro.html">common language</a> makes devices understandable (<b>premise</b>) →
    the <a href="/en/docs/ready.html">readiness stack</a> makes them trustworthy (<b>condition</b>) →
<b>natural-language orchestration is the value that emerges</b> (result).
</div>
</div>

## Real orchestrations that actually ran

<p>None of these are pre-written "scenes" — each was composed live from capability lists (from the 2026-09-23 device session):</p>

<div class="table-wrap">
<table>
<thead><tr><th>User's sentence</th><th>Action sequence composed at runtime</th></tr></thead>
<tbody>
<tr>
<td>"Play the 'Daughter' playlist on the desk speaker and the Huawei speaker"</td>
<td>discover → read capabilities per device → verify source login → <code>playlist_play</code> → both speakers <code>stream.join</code> → verify both stream formats → report</td>
</tr>
<tr>
<td>"Show me all BMAHS devices at home"</td>
<td>query → <code>describe</code> each → summarize capabilities and boundaries</td>
</tr>
<tr>
<td>"Bring my old Bluetooth speaker online so it can play too"</td>
<td><code>occupy</code> gateway → <code>bt.scan</code> → <code>bt.connect</code> → re-<code>query</code> → virtual speaker online → <code>stream.join</code> → <code>release</code> gateway</td>
</tr>
<tr>
<td>"Both playing, but make the Huawei one louder"</td>
<td>verify both streams → <code>volume</code> on the target only (no stream teardown) → the other stream unaffected</td>
</tr>
</tbody>
</table>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/operations.html">
<div class="card__title">Capabilities & Security →</div>
<div class="card__desc">Where compositional freedom comes from — and where its boundaries are written.</div>
</a>
<a class="card" href="/en/docs/tools.html">
<div class="card__title">Methods & Messages →</div>
<div class="card__desc">Write your first orchestration chain yourself.</div>
</a>
</div>
