---
title: "Terms & Conventions"
description: "Core terms: BMAHS device, agent, protocol client, discovery layer, usage layer, data stream layer."
eyebrow: "Specification · Chapter 03"
---

<p class="eyebrow">Specification · Chapter 03</p>

# Terms & Conventions

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Term</th><th>Definition</th></tr></thead>
<tbody>
<tr><td><b>BMAHS device</b></td><td>Real hardware that implements announcement and control per this specification, or a node virtualized by a gateway</td></tr>
<tr><td><b>Agent</b></td><td>The software entity carrying the big model, responsible for device selection and task orchestration</td></tr>
<tr><td><b>Protocol client</b></td><td>The agent runtime, an SDK, the Sink device itself, or a gateway process; executes control sequences and media interconnection; it is <b>not</b> the big model</td></tr>
<tr><td><b>Forwarder</b></td><td>Any protocol client holding endpoint sessions on both sides; not a special device type</td></tr>
<tr><td><b>control</b></td><td>The device's control-entry TCP endpoint, URI of the form <code>tcp://IP:PORT</code>, carrying JSON-RPC 2.0 messages</td></tr>
<tr><td><b>hello</b></td><td>The JSON-RPC <b>notification</b> the device sends immediately after the TCP connection is established, <code>method=&quot;hello&quot;</code></td></tr>
<tr><td><b>occupancy</b></td><td>The occupancy policy declaration: <code>last-wins</code> or <code>exclusive</code></td></tr>
<tr><td><b>holder</b></td><td>The <code>agent</code> of the last control command (last-wins) or the current occupant (exclusive)</td></tr>
<tr><td><b>token</b></td><td>The occupancy token issued by an <code>exclusive</code> device; forbidden from appearing in the discovery layer</td></tr>
<tr><td><b>Endpoint</b></td><td>A channel a device declares for providing (output) or consuming (input) continuous media</td></tr>
<tr><td><b>Discovery layer</b></td><td>The device announcement/discovery layer formed by UDP multicast + Bonjour (<b>not</b> JSON-RPC)</td></tr>
<tr><td><b>Usage layer</b></td><td>The JSON-RPC 2.0 control layer over TCP</td></tr>
<tr><td><b>Data stream layer</b></td><td>The binary transport layer carrying UI streams and data streams</td></tr>
</tbody>
</table>
</div>
