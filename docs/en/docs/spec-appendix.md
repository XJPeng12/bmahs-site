---
title: "Appendix A. Index"
description: "Indexes for chapters, messages & methods, fields, and error codes."
eyebrow: "Specification · Appendix"
---

<p class="eyebrow">Specification · Appendix</p>

# Appendix A. Index


### A.1 Chapter index

<div class="table-wrap">
<table>
<thead><tr><th>Topic</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>JSON-RPC 2.0 encoding rules</td><td style="white-space:nowrap">§8</td></tr>
<tr><td>Error codes and JSON-RPC mapping</td><td style="white-space:nowrap">§9</td></tr>
<tr><td>Occupancy policy last-wins / exclusive</td><td style="white-space:nowrap">§11</td></tr>
<tr><td>Common methods mandatory scope</td><td>§10.4</td></tr>
<tr><td>Usage constraints (<code>constraint</code>)</td><td>§10.6</td></tr>
<tr><td>User confirmation mechanism</td><td>§10.7</td></tr>
<tr><td>Agent and protocol client obligations</td><td style="white-space:nowrap">§12</td></tr>
<tr><td>UI interface (exclusive required)</td><td style="white-space:nowrap">§13</td></tr>
<tr><td>Endpoint interconnection (join / relay)</td><td>§14.3</td></tr>
<tr><td>Media TCP without handshake</td><td>§14.4</td></tr>
<tr><td>Conformance checklist and prohibited behaviors</td><td style="white-space:nowrap">§18</td></tr>
<tr><td>Interoperability &amp; transport security</td><td style="white-space:nowrap">§19</td></tr>
</tbody>
</table>
</div>

### A.2 Message &amp; method index

<div class="table-wrap">
<table>
<thead><tr><th>Entry</th><th>Defined in</th></tr></thead>
<tbody>
<tr><td><code>announce</code> / <code>query</code> / <code>goodbye</code> (UDP, not RPC)</td><td style="white-space:nowrap">§15</td></tr>
<tr><td><code>hello</code> / <code>event</code> (JSON-RPC notifications)</td><td style="white-space:nowrap">§8.5</td></tr>
<tr><td><code>describe</code> / <code>info</code> / <code>who</code></td><td>§10.4</td></tr>
<tr><td><code>occupy</code> / <code>release</code></td><td>§10.4, §11.3 (mandatory for exclusive only)</td></tr>
<tr><td><code>register</code></td><td><b>not mandatory</b>; §10.4.1</td></tr>
<tr><td><code>ui.start</code> / <code>ui.stop</code> / <code>tap</code> / <code>swipe</code></td><td style="white-space:nowrap">§13</td></tr>
<tr><td><code>stream.start</code> / <code>stream.accept</code> / <code>stream.stop</code> / <code>stream.join</code></td><td style="white-space:nowrap">§14</td></tr>
</tbody>
</table>
</div>

### A.3 Field index

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Defined in</th></tr></thead>
<tbody>
<tr><td><code>occupancy</code></td><td>§10.5, §11.1</td></tr>
<tr><td><code>constraint</code> (usage constraints)</td><td>§10.2, §10.6</td></tr>
<tr><td><code>state</code> = <code>online</code> / <code>offline</code></td><td>§11.1</td></tr>
<tr><td><code>holder</code> / <code>busy</code> / <code>streams</code></td><td>§11.1, §14.5</td></tr>
<tr><td><code>token</code></td><td>§11.3, §13.4 (UI)</td></tr>
<tr><td><code>bmahs_code</code> (error.data)</td><td>§8.4, §9</td></tr>
<tr><td>Endpoint <code>preempt</code></td><td>§14.2</td></tr>
<tr><td><code>stream</code> URI</td><td>§14.4 (forbidden in the discovery layer)</td></tr>
</tbody>
</table>
</div>

### A.4 Error code index

<p>See §9. <code>occupied</code> (-32001) is exclusive-only; the error code <code>busy</code> and the announcement field <code>busy</code> share a name but have different meanings.</p>
