---
title: "AGI-Ready Certification"
description: "The three readiness layers (Ready Stack) and the BMAHS AGI-Ready badge (BMAHS Compatible / BMAHS Ready / BMAHS Ready+) — the standard is one sentence: can this device be orchestrated?"
eyebrow: "Ecosystem / Standards"
---

<p class="eyebrow">Ecosystem / Standards</p>

# AGI-Ready Certification

<p class="lead">
  The bottleneck of the AGI era is not intelligence but <b>readiness</b>: model capabilities iterate by the quarter, costs fall by the year,
  but a 2016 speaker will not be read automatically just because models get stronger.
<b>Whoever brings the physical world's readiness cost down to near zero owns the last mile of the AGI era.</b>
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">BMAHS's engineering goal</div>
    Bring the cost of "making a device safely usable by AGI" down from <b>custom development</b> to <b>a single declaration</b>.
</div>
</div>

## The three readiness layers (Ready Stack)

<div class="table-wrap">
<table>
<thead><tr><th>Layer</th><th>Dimension</th><th>BMAHS mechanism</th><th>Readiness signal</th><th>Plain metaphor</th></tr></thead>
<tbody>
<tr>
<td><b>L3 Trust ready</b></td>
<td>Dare to delegate</td>
<td><code>security</code> (allow / deny / confirm) · <code>occupancy</code> leases · <code>release</code></td>
<td>Bounded, revocable, auditable</td>
<td>A written undertaking plus ground rules</td>
</tr>
<tr>
<td><b>L2 Action ready</b></td>
<td>Can direct</td>
<td><code>operations</code> capability list · <code>endpoints</code> media endpoints · <code>call</code></td>
<td>Order from the menu, no guessing</td>
<td>A remote control</td>
</tr>
<tr>
<td><b>L1 Semantic ready</b></td>
<td>Can be understood</td>
<td><code>id</code> · <code>type</code> · <code>service</code> · <code>summary</code> · <code>constraint</code></td>
<td>No preset drivers</td>
<td>A business card / product detail page</td>
</tr>
</tbody>
</table>
</div>

<p>
  No layer can be missing: semantic readiness alone is a <b>readable but immovable product manual</b>;
  add action readiness and it becomes an <b>obedient remote</b>;
  only with all three present would you dare hand AGI the house key and let it <a href="/en/docs/orchestration.html">orchestrate on the spot</a>.
</p>

<div class="figure">
<svg viewBox="0 0 680 200" role="img" aria-label="What goes wrong when one readiness layer is missing">
<rect class="dg-gray" x="14" y="20" width="204" height="160" rx="10"/>
<text class="dg-l" x="32" y="48" style="fill:var(--text-muted)">Only L1</text>
<text class="dg-s" x="32" y="70">Readable, not movable</text>
<text class="dg-m" x="32" y="100">= a product manual</text>
<line class="dg-tick" x1="32" y1="116" x2="200" y2="116"/>
<text class="dg-m" x="32" y="138">Can describe, not execute</text>
<text class="dg-m" x="32" y="158">Orchestration never starts</text>

<rect class="dg-gray" x="238" y="20" width="204" height="160" rx="10"/>
<text class="dg-l" x="256" y="48" style="fill:var(--text-muted)">L1 + L2</text>
<text class="dg-s" x="256" y="70">Can be commanded, but not delegated</text>
<text class="dg-m" x="256" y="100">= an obedient remote</text>
<line class="dg-tick" x1="256" y1="116" x2="424" y2="116"/>
<text class="dg-m" x="256" y="138">Single steps OK, no combos</text>
<text class="dg-m" x="256" y="158">Orchestration held back</text>

<rect class="dg-proto" x="462" y="20" width="204" height="160" rx="10"/>
<text class="dg-l-inv" x="480" y="48">L1 + L2 + L3</text>
<text class="dg-s-inv" x="480" y="70">Understood · directed · delegated</text>
<text class="dg-m-inv" x="480" y="100">= Ready</text>
<line x1="480" y1="116" x2="648" y2="116" style="stroke:rgba(255,255,255,.35);stroke-width:1"/>
<text class="dg-m-inv" x="480" y="138">Cross-device · multi-step</text>
<text class="dg-m-inv" x="480" y="158">NL orchestration is possible</text>
</svg>
<p class="figure__cap">Fig. 1 · Only with all three layers is a device "Ready" — and only then can orchestration be entrusted to AGI</p>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">Behind the three badges, the standard is one sentence</div>
<b>Can this device be orchestrated.</b> Can be read, can be called, can be delegated to — then it can enter orchestration.
</div>
</div>

## The self-test suite

<p>Certification relies not on submitting to a lab but on <b>self-testing</b>. The suite is open source; any vendor can run it, and results are reproducible. <b>(The suite is still in preparation and not yet published; the repository link and run instructions will appear here once it ships.)</b></p>

<div class="table-wrap">
<table>
<thead><tr><th>Check item</th><th>Layer</th><th>Pass condition</th></tr></thead>
<tbody>
<tr><td>Discoverability</td><td style="white-space:nowrap">L1</td><td>Found by the multicast query after power-on and listed in the device list</td></tr>
<tr><td>Self-description completeness</td><td style="white-space:nowrap">L1</td><td><code>id / type / service / summary</code> all present, <code>summary</code> understandable</td></tr>
<tr><td>Capability list consistency</td><td style="white-space:nowrap">L2</td><td>Every capability declared in <code>operations</code> is callable; off-list operations are rejected</td></tr>
<tr><td>Parameter validation</td><td style="white-space:nowrap">L2</td><td>Type errors are explicitly rejected with <code>bad-arg</code> (e.g. passing an object for <code>device</code>)</td></tr>
<tr><td>Security boundary</td><td style="white-space:nowrap">L3</td><td>All <code>deny</code> entries are unexecutable; <code>confirm</code> entries do not reply while pending; the device replies <code>result</code> after local confirmation, or <code>denied</code> on timeout or rejection</td></tr>
<tr><td>Occupancy semantics</td><td style="white-space:nowrap">L3</td><td><code>exclusive</code> devices are mutually exclusive, leases auto-return at expiry, and <code>release</code> takes effect</td></tr>
<tr><td>Concurrency and streams (Ready+)</td><td style="white-space:nowrap">L2</td><td>Multi-stream behavior matches the <code>max_sessions</code> / <code>preempt</code> declarations</td></tr>
<tr><td>Audit trail (Ready+)</td><td style="white-space:nowrap">L3</td><td>Key operations can export self-proving records</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--danger">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">Wording discipline: say "ready", not "compatible"</div>
<b>Compatible</b> only guarantees it can be discovered and understood (L1); <b>ready</b> means all three layers — "can be understood + can be directed + safe to delegate" — are in place.
    Mixing the two in external messaging erases the differentiation directly — this is the line most easily drifted on in execution.
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/orchestration.html">
<div class="card__title">Natural-Language Orchestration →</div>
<div class="card__desc">Where the value of the three readiness layers emerges.</div>
</a>
</div>
