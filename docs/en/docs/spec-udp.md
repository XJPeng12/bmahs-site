---
title: "Discovery Encoding"
description: "JSON encoding, common header, device id rules, and key machine fields for UDP discovery messages."
eyebrow: "Specification · Chapter 07"
---

<p class="eyebrow">Specification · Chapter 07</p>

# Discovery Encoding


### 7.1 JSON encoding

<ul>
<li>Every UDP message <b>MUST</b> be a JSON object, UTF-8 encoded, with <b>no</b> BOM.</li>
<li>Field names <b>MUST</b> be all lowercase and are case-sensitive.</li>
<li>Receivers <b>MUST</b> ignore unknown fields (forward extensibility).</li>
<li>Receivers <b>MUST</b> discard any message that: is not a JSON object; has an illegal <code>kind</code>; has <code>version</code> other than <code>1</code>; or has <code>protocol</code> not starting with <code>bmahs</code>.</li>
</ul>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">Boundary note</div>
    UDP discovery messages are one-way multicast datagrams and do <b>NOT</b> use the JSON-RPC 2.0 envelope (no request/response correlation semantics). JSON-RPC 2.0 applies only to the TCP control channel defined in Chapter 8.
</div>
</div>

### 7.2 Common header (all UDP messages)

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>version</code></td><td>number</td><td style="white-space:nowrap">yes</td><td>Discovery major version; currently fixed at <code>1</code></td></tr>
<tr><td><code>protocol</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>bmahs/1.2</code> in this version</td></tr>
<tr><td style="white-space:nowrap"><code>kind</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>announce</code> / <code>query</code> / <code>goodbye</code></td></tr>
<tr><td><code>timestamp</code></td><td>number</td><td style="white-space:nowrap">yes</td><td>Unix seconds (integer is fine)</td></tr>
<tr><td style="white-space:nowrap"><code>id</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>Stable device (or client) identifier</td></tr>
</tbody>
</table>
</div>

### 7.3 Device identifier <code>id</code> rules

<ul>
<li><code>id</code> <b>MUST</b> remain unchanged for the device's lifetime.</li>
<li>Only the characters <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>-</code> are allowed; all lowercase is recommended.</li>
<li>When generated from a display name: <b>lowercase first</b>, then replace disallowed characters with <code>-</code>, strip leading/trailing <code>-</code>; if the result is empty, use <code>bmahs-device</code>.</li>
<li>It <b>SHOULD</b> be written to factory configuration or fixed in Flash.</li>
<li>Example: <code>ACME-Lamp-00A1</code> → <code>acme-lamp-00a1</code>.</li>
<li><b>MUST NOT</b> exceed <b>63 bytes</b> (the <code>id</code> is used as a DNS label, <code>{id}.local.</code>); truncate and append a short hash if longer.</li>
</ul>

### 7.4 Key machine-field rules

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Rule</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>type</code></td><td>Lowercase English word; self-reported by the vendor; the agent matches on the string</td></tr>
<tr><td><code>service</code></td><td><code>{type}/{major-version}</code>, e.g. <code>light/1</code>; the same <code>type</code> may evolve to <code>light/2</code></td></tr>
<tr><td style="white-space:nowrap"><code>want</code></td><td><code>query</code> only. <code>*</code> / <code>bmahs</code> / empty = all devices; otherwise a comma-separated <code>type</code> list, matched case-insensitively</td></tr>
<tr><td><code>control</code></td><td>URI. IPv4: <code>tcp://&lt;ipv4&gt;:&lt;port&gt;</code>; IPv6 MUST be bracketed: <code>tcp://[&lt;ipv6&gt;]:&lt;port&gt;</code>; on dual-stack, prefer writing IPv4</td></tr>
<tr><td><code>capabilities</code></td><td>Array of capability tags: method names + profile tags (<code>ui</code> / <code>tap</code> / <code>swipe</code>); profile tags are declaration-only — the invocable surface is defined by <code>operations</code></td></tr>
<tr><td><code>security</code></td><td>Security-boundary summary object: <code>{&quot;scope&quot;:&quot;lan&quot;,&quot;auth&quot;:&quot;none&quot;,&quot;occupancy&quot;:&quot;last-wins&quot;}</code></td></tr>
<tr><td style="white-space:nowrap"><code>port</code></td><td>Integer 1–65535, consistent with the <code>control</code> port</td></tr>
</tbody>
</table>
</div>

<p><b><code>query</code> matching algorithm (device side)</b>:</p>

<ol>
<li>split <code>want</code> on commas, trim whitespace, lowercase;</li>
<li>if the list is empty, or contains <code>*</code> / <code>bmahs</code> → respond;</li>
<li>otherwise respond only if this device's <code>type</code> appears in the list.</li>
</ol>
