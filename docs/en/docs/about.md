---
title: "About & License"
description: "What BMAHS is, its version status, licensing (spec text CC BY 4.0, example code CC0) and how to give feedback."
eyebrow: "Ecosystem / Notes"
---

<p class="eyebrow">Ecosystem / Notes</p>

# About & License

<p class="lead">
  BMAHS (Big Model Agent Hardware Specification) is a <b>hardware interaction protocol for large-model agents</b>:
  it turns a device's self-description, capability list and security boundary into a machine-readable,
  model-understandable format — so that <b>discovery, comprehension, command and safe delegation</b>
  never have to be re-adapted brand by brand.
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">In one sentence</div>
    Hardware has to speak a common language before a large model can orchestrate it. BMAHS is the grammar of that language.
</div>
</div>

## Scope and boundaries

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Dimension</th><th>Description</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">What it is</td><td>A LAN protocol between agents and hardware: the semantics and message formats for discovery, self-description, control, occupancy, data streams and UI</td></tr>
<tr><td style="white-space:nowrap">What it is not</td><td>Not a cloud platform, not a firmware solution, not a private app protocol; it neither specifies device-category business semantics nor the model itself</td></tr>
<tr><td style="white-space:nowrap">Who it is for</td><td>Hardware vendors (ship self-describing devices), agent/app developers (one integration, many categories), integrators (less adaptation work)</td></tr>
<tr><td style="white-space:nowrap">Neutrality</td><td>The specification is public; certification rests on an open self-test suite; no single vendor's ecosystem is required</td></tr>
</tbody>
</table>
</div>

## Version and status

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Item</th><th>Current value</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">Protocol version</td><td><code>bmahs/1.2</code> (major 1; forward compatibility with <code>1.x</code> is decided per Chapter 19)</td></tr>
<tr><td style="white-space:nowrap">Specification text</td><td>Revised continuously on this site; message examples are taken from real device sessions</td></tr>
<tr><td style="white-space:nowrap">Self-test suite</td><td>In preparation, not yet published</td></tr>
</tbody>
</table>
</div>

## License

<p>We want the specification to be freely cited, implemented and restated — while avoiding brand confusion that implies a certification nobody granted. Hence three classes of grant:</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Subject</th><th style="white-space:nowrap">License</th><th>What you may do</th></tr></thead>
<tbody>
<tr>
<td>Specification text</td>
<td style="white-space:nowrap"><b>CC BY 4.0</b></td>
<td>Copy, distribute, adapt and use commercially; <b>attribution is required</b>, with an indication of changes. See “How to cite” below</td>
</tr>
<tr>
<td>Example code snippets</td>
<td style="white-space:nowrap"><b>CC0 1.0</b></td>
<td>Treated as public domain — use them in products and documentation with no attribution</td>
</tr>
<tr>
<td>Name and logo</td>
<td style="white-space:nowrap">Reserved</td>
<td>“BMAHS” and its logo identify the maintainer. You <b>may</b> state truthfully that you “implement the BMAHS protocol”; you <b>MUST NOT</b> imply official certification or endorsement — certification status follows only from self-test results and badge authorization</td>
</tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">Implementing is free</div>
    Implementing this protocol carries <b>no license fee or royalty</b>. The only bar to conformance is the checklist in Chapter 18, not a commercial grant.
</div>
</div>

## How to cite

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__dot"></span><span class="code__dot"></span><span class="code__name">citation.txt</span></div>

<pre>BMAHS — Big Model Agent Hardware Specification, version bmahs/1.2.
Content on this site is licensed under CC BY 4.0.</pre>
</div>

## Maintenance and feedback

<p>The maintainer and feedback channels will be published on this page at public release. Until then, for specification clarification, errata or implementation questions, please use the contact published later.</p>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">Errata and clarifications</div>
    Errors, ambiguities and omissions in the specification text are welcome — please report them. <b>The normative text prevails</b>: where a summary on this site conflicts with the specification, the chapter wins, and we treat the conflict as a defect to fix.
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/intro.html">
<div class="card__title">What is BMAHS →</div>
<div class="card__desc">The three layers that frame the problem.</div>
</a>
<a class="card" href="/en/docs/spec-index.html">
<div class="card__title">Specification overview →</div>
<div class="card__desc">All 20 chapters and the appendix index.</div>
</a>
<a class="card" href="/en/docs/ready.html">
<div class="card__title">AGI-Ready certification →</div>
<div class="card__desc">The ready stack and the self-test suite.</div>
</a>
</div>
