---
title: "Interoperability"
description: "Peer behavior matrix, encoding recognition, and transport-security notes."
eyebrow: "Specification · Chapter 19"
---

<p class="eyebrow">Specification · Chapter 19</p>

# Interoperability

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Peer</th><th>Behavior</th></tr></thead>
<tbody>
<tr><td><code>bmahs/1.2</code></td><td>Handle per this specification (JSON-RPC 2.0 control channel)</td></tr>
<tr><td style="white-space:nowrap"><code>protocol</code> not <code>bmahs/*</code>, or <b>major version</b> ≠ 1</td><td style="white-space:nowrap"><b>MUST</b> discard</td></tr>
<tr><td style="white-space:nowrap"><code>bmahs/1.x</code> (major 1, higher minor)</td><td>Handle per this specification, ignoring unknown fields; do not assume minor-version semantics</td></tr>
<tr><td>Unknown <code>type</code> / <code>service</code></td><td>Listed normally in the discovery layer; the usage layer may display only, without control</td></tr>
</tbody>
</table>
</div>

<p><b>Encoding recognition</b>: the discovery-layer <code>protocol</code> field is the encoding identifier (<code>bmahs/1.2</code> is JSON-RPC 2.0). Clients <b>MUST</b> auto-recognize from the actual shape of <code>hello</code> (a JSON-RPC notification with no <code>id</code>) and must not assume.</p>

<p><b>Transport-security note</b>: the LAN occupancy token is not transport-layer authentication. For mass production requiring anti-impersonation control, <b>SHOULD</b> add TLS; TLS must be introduced via a new <code>service</code> revision and <b>MUST NOT</b> silently change discovery semantics. The JSON-RPC channel is the same: <code>id</code> and <code>method</code> are visible in clear text; sensitive scenarios should add TLS or local link encryption.</p>
