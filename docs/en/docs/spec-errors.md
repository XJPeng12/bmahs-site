---
title: "Error Codes"
description: "Mapping from BMAHS bmahs_code to JSON-RPC error codes, and retryable semantics."
eyebrow: "Specification · Chapter 09"
---

<p class="eyebrow">Specification · Chapter 09</p>

# Error Codes


### 9.1 BMAHS error code → JSON-RPC error code mapping (MUST)

<div class="table-wrap">
<table>
<thead><tr><th>BMAHS <code>bmahs_code</code></th><th>JSON-RPC <code>code</code></th><th><code>retryable</code></th><th>Trigger condition</th></tr></thead>
<tbody>
<tr><td><code>unknown-action</code></td><td><b>-32601</b> (Method not found)</td><td>false</td><td><code>method</code> not in <code>operations</code></td></tr>
<tr><td><code>bad-arg</code></td><td><b>-32602</b> (Invalid params)</td><td>false</td><td>Missing parameter, type or range error; kind/media mismatch during interconnection</td></tr>
<tr><td><code>parse-error</code></td><td><b>-32700</b> (Parse error)</td><td>false</td><td>Line is not valid JSON</td></tr>
<tr><td><code>invalid-request</code></td><td><b>-32600</b> (Invalid Request)</td><td>false</td><td>Invalid JSON-RPC envelope (missing <code>jsonrpc</code>, <code>method</code> not a string, etc.)</td></tr>
<tr><td><code>internal-error</code></td><td><b>-32603</b> (Internal error)</td><td>false</td><td>Internal device error</td></tr>
<tr><td><code>occupied</code></td><td><b>-32001</b></td><td style="white-space:nowrap">true</td><td><b>exclusive only</b>: already occupied by another agent. <b>MUST NOT</b> be used for <code>last-wins</code> control</td></tr>
<tr><td><code>offline</code></td><td><b>-32002</b></td><td style="white-space:nowrap">true</td><td>Device offline or about to exit</td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td><b>-32003</b></td><td style="white-space:nowrap">true</td><td>Temporarily unable to execute, or endpoint session full with <code>preempt=false</code></td></tr>
<tr><td><code>unauthorized</code></td><td><b>-32004</b></td><td>false</td><td>Exclusive <code>token</code> missing or mismatched</td></tr>
<tr><td><code>denied</code></td><td><b>-32005</b></td><td>false</td><td>Violates <code>security.deny</code> or has not passed <code>confirm</code>; not retryable by default, <code>data.retryable=true</code> only on a confirmation timeout</td></tr>
<tr><td><code>bad-state</code></td><td><b>-32006</b></td><td>false</td><td>Method unavailable in the current state (e.g. <code>tap</code> before <code>ui.start</code>)</td></tr>
</tbody>
</table>
</div>

<p><b>Normative requirements</b>:</p>

<ul>
<li>The device <b>MUST</b> return the BMAHS string error code in <code>error.data.bmahs_code</code>; clients <b>SHOULD</b> use <code>bmahs_code</code> (not the bare integer) as the stable discriminator.</li>
<li>Within the JSON-RPC reserved range <code>-32768 ~ -32000</code>, the codes <code>-32700 / -32600 / -32601 / -32602 / -32603</code> keep the meanings defined by the JSON-RPC 2.0 specification; BMAHS-specific codes occupy <code>-32001 ~ -32006</code>.</li>
</ul>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">Note</div>
    the error code <code>busy</code> and the announcement field <code>busy</code> share a name but have different meanings.
</div>
</div>
