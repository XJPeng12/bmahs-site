---
title: "Fields & Messages"
description: "Core field definitions of bmahs/1.2: device self-description, operations entries, security, endpoints, occupancy leases and state fields."
eyebrow: "Reference / Fields"
---

<p class="eyebrow">Reference / Fields</p>

# Fields & Messages

<p class="lead">
  This section gathers the fields that recur throughout the protocol. There is one design principle:
<b>machine codes keep English identifiers (id / type / service / method / bmahs_code); the explanations that inform decisions must be complete natural language</b>.
</p>

## Device self-description fields (hello notification / describe)

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono">protocol</td><td>string</td><td style="white-space:nowrap">Yes</td><td>This release writes <code>bmahs/1.2</code>; also used for peer version identification</td></tr>
<tr><td class="mono" style="white-space:nowrap">id</td><td>string</td><td style="white-space:nowrap">Yes</td><td>Unique device identifier; only <code>A-Za-z0-9-</code>, unchanged over the lifecycle, ideally fixed at factory</td></tr>
<tr><td class="mono" style="white-space:nowrap">name</td><td>string</td><td style="white-space:nowrap">Yes</td><td>User-readable display name (e.g. "Living Room Light"); <b>forbidden</b> to write only a model number / SKU / internal code</td></tr>
<tr><td class="mono" style="white-space:nowrap">type</td><td>string</td><td style="white-space:nowrap">Yes</td><td>Lowercase English category: <code>speaker</code> / <code>bridge</code> / <code>qqmusic</code> / <code>light</code> …</td></tr>
<tr><td class="mono">service</td><td>string</td><td style="white-space:nowrap">Yes</td><td>Protocol service and version, e.g. <code>speaker/1</code>; determines the callable operation set</td></tr>
<tr><td class="mono">summary</td><td>string</td><td style="white-space:nowrap">Yes</td><td>One or two sentences of self-description: what it is, what it can do, usage notes (e.g. whether occupancy is required)</td></tr>
<tr><td class="mono" style="white-space:nowrap">constraint</td><td>string</td><td>Should</td><td>Usage constraint for the model: for <code>last-wins</code> write "call methods directly"; for <code>exclusive</code> write "occupy first, must release at the end"</td></tr>
<tr><td class="mono">capabilities</td><td>string[]</td><td style="white-space:nowrap">Yes</td><td>Method names + profile tags (<code>ui</code> / <code>tap</code> / <code>swipe</code>); must include at least <code>describe,info,who</code></td></tr>
<tr><td class="mono">operations</td><td>object[]</td><td style="white-space:nowrap">Yes</td><td>The operations list (below)</td></tr>
<tr><td class="mono">security</td><td>object</td><td style="white-space:nowrap">Yes</td><td>The security boundary (including <code>occupancy</code>)</td></tr>
<tr><td class="mono">state</td><td>string</td><td style="white-space:nowrap">Yes</td><td><code>online</code> / <code>offline</code> (only these two values)</td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">Yes</td><td>true if and only if: exclusive is occupied, or an active UI stream / media session exists</td></tr>
<tr><td class="mono">holder</td><td>string</td><td>If present, mandatory</td><td>Last controller (last-wins) or current holder (exclusive); omit if none</td></tr>
<tr><td class="mono">event</td><td>string</td><td style="white-space:nowrap">SHOULD</td><td>State-change event: <code>online</code> / <code>offline</code> / <code>occupy</code> / <code>release</code></td></tr>
<tr><td class="mono">control</td><td>string</td><td style="white-space:nowrap">Yes</td><td><code>tcp://IP:port</code> (IPv6 in brackets)</td></tr>
<tr><td class="mono" style="white-space:nowrap">hb</td><td>number</td><td style="white-space:nowrap">MAY</td><td>Steady-state announce interval (seconds), default 5; when increased it <b>MUST</b> be announced in this field. Agents declare a device offline per <code>clamp(12 × hb, 60 s, 30 min)</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">width</td><td>number</td><td style="white-space:nowrap">SHOULD if ui</td><td>Logical screen width in pixels; a rotation or rescale must be reflected in the next frame header</td></tr>
<tr><td class="mono" style="white-space:nowrap">height</td><td>number</td><td style="white-space:nowrap">SHOULD if ui</td><td>Logical screen height in pixels</td></tr>
<tr><td class="mono">endpoints</td><td>object[]</td><td>If endpoints exist</td><td>Complete endpoint objects (below)</td></tr>
<tr><td class="mono">notifications</td><td>string[]</td><td>Optional</td><td>Declares additional implemented notifications (e.g. <code>["event"]</code>)</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">The four "never do" rules for natural-language fields</div>
    ① Do not use <code>type=light</code> as a substitute for <code>summary</code>; ② do not embed passwords, tokens, accounts, or stream URIs;
    ③ empty strings are forbidden in <code>security.notes</code>; ④ within a device's lifecycle, <code>summary</code> must not be rewritten so often that its meaning changes —
    capability changes should bump <code>service</code> or update <code>operations</code>, followed by an immediate re-<code>announce</code>.
</div>
</div>

## Discovery-layer fields (UDP <code>announce</code> / <code>query</code>)

<p>The discovery layer is a flat UDP multicast datagram — it does not use the JSON-RPC 2.0 envelope. Beyond the table above, these fields also apply (full definition in Chapter 15).</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Field</th><th style="white-space:nowrap">Type</th><th style="white-space:nowrap">Required</th><th style="white-space:nowrap">Description</th></tr></thead>
<tbody>
<tr><td class="mono">version</td><td>number</td><td style="white-space:nowrap">yes</td><td>Discovery major version; currently fixed at <code>1</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">kind</td><td>string</td><td style="white-space:nowrap">yes</td><td><code>announce</code> / <code>query</code> / <code>goodbye</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">timestamp</td><td>number</td><td style="white-space:nowrap">yes</td><td>Unix seconds (an integer is enough)</td></tr>
<tr><td class="mono">model</td><td>string</td><td style="white-space:nowrap">SHOULD</td><td>Hardware model, to help users identify the device</td></tr>
<tr><td class="mono">ip</td><td>string</td><td style="white-space:nowrap">SHOULD</td><td>LAN IPv4 address; <b>MUST NOT</b> be <code>127.0.0.1</code></td></tr>
<tr><td class="mono">ipv6</td><td>string</td><td style="white-space:nowrap">SHOULD</td><td>LAN IPv6 address; no <code>%zone</code></td></tr>
<tr><td class="mono">port</td><td>number</td><td style="white-space:nowrap">yes</td><td>Integer <code>1–65535</code>, matching the <code>control</code> port</td></tr>
<tr><td class="mono">until</td><td>number</td><td style="white-space:nowrap">SHOULD while exclusive</td><td>Lease expiry in Unix seconds; <code>0</code> for an indefinite lease</td></tr>
<tr><td class="mono">want</td><td>string</td><td style="white-space:nowrap">query only, required</td><td><code>*</code> / <code>bmahs</code> / empty = all devices; otherwise a comma-separated <code>type</code> list, matched case-insensitively</td></tr>
</tbody>
</table>
</div>

## operations entry fields

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">name</td><td>string</td><td style="white-space:nowrap">Yes</td><td>Method name = JSON-RPC <code>method</code>; lowercase, may contain <code>.</code> and <code>_</code> (e.g. <code>stream.join</code>, <code>playlist_play</code>)</td></tr>
<tr><td class="mono">description</td><td>string</td><td style="white-space:nowrap">Yes</td><td>Natural language: what it does, when to use it; empty strings or merely repeating the name are forbidden</td></tr>
<tr><td class="mono" style="white-space:nowrap">args</td><td>object[]</td><td style="white-space:nowrap">Yes</td><td>List of parameter objects; must be <code>[]</code> when there are no parameters</td></tr>
<tr><td class="mono">any_of</td><td>string[]</td><td style="white-space:nowrap">May</td><td>Provide at least one of these parameter names, otherwise <code>bad-arg</code></td></tr>
<tr><td class="mono">result</td><td>string</td><td style="white-space:nowrap">Yes</td><td>Natural language: how the model should interpret the return on success</td></tr>
<tr><td class="mono">returns</td><td>object[]</td><td style="white-space:nowrap">Yes</td><td>Fields that will appear in the success <code>result</code> object; <code>[]</code> when there are no extra fields</td></tr>
</tbody>
</table>
</div>

### args[] / returns[] item fields

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">name</td><td>string</td><td style="white-space:nowrap">Yes</td><td>The field name in <code>params</code> (args) or <code>result</code> (returns)</td></tr>
<tr><td class="mono" style="white-space:nowrap">type</td><td>string</td><td style="white-space:nowrap">Yes</td><td><code>string</code> / <code>int</code> / <code>number</code> / <code>bool</code>; nested returns may use <code>object</code> / <code>array</code></td></tr>
<tr><td class="mono">required</td><td style="white-space:nowrap">bool</td><td>args only</td><td>Every args entry must write this field; not written for returns</td></tr>
<tr><td class="mono">description</td><td>string</td><td style="white-space:nowrap">Yes</td><td>Natural language: meaning, how to fill it, units, relationship to sibling parameters; empty strings forbidden</td></tr>
<tr><td class="mono">min / max</td><td>number</td><td>Should for numbers</td><td>Closed interval; must be written when there are bounds</td></tr>
<tr><td class="mono" style="white-space:nowrap">enum</td><td>string[]</td><td>Should for enums</td><td>Must be written when there is a fixed set</td></tr>
<tr><td class="mono" style="white-space:nowrap">unit</td><td>string</td><td style="white-space:nowrap">May</td><td>E.g. <code>%</code>, <code>K</code>, <code>s</code>, <code>Hz</code></td></tr>
<tr><td class="mono">example</td><td>same as type</td><td>Should</td><td>One legal example</td></tr>
<tr><td class="mono">default</td><td>same as type</td><td style="white-space:nowrap">May</td><td>The default value the device uses when omitted</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">The mapping discipline from operations to tool schemas</div>
    Tool descriptions take <code>description</code> only; parameter definitions take <b>only</b> <code>args</code>; return descriptions take
<b>only</b> <code>result</code> / <code>returns</code> — <b>no inventing extra parameters</b>.
    A <code>method</code> not on the list must be rejected by the device (<code>unknown-action</code>).
</div>
</div>

## security fields

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono">scope</td><td style="white-space:nowrap">Yes</td><td>Network scope: <code>lan</code> / <code>wan</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">auth</td><td style="white-space:nowrap">Yes</td><td>Authentication: <code>none</code> / <code>token</code> / <code>tls</code> (not the occupancy policy)</td></tr>
<tr><td class="mono">occupancy</td><td style="white-space:nowrap">Yes</td><td><code>last-wins</code> or <code>exclusive</code>; defaults to exclusive when absent</td></tr>
<tr><td class="mono">allow</td><td>Should</td><td>Explicitly allowed capability tags</td></tr>
<tr><td class="mono" style="white-space:nowrap">deny</td><td style="white-space:nowrap">Yes</td><td>Should at least cover: arbitrary disk reads, arbitrary disk writes, command execution, network fetches, cloud uploads, covert camera / microphone capture</td></tr>
<tr><td class="mono">confirm</td><td style="white-space:nowrap">May</td><td>Method names requiring local user confirmation</td></tr>
<tr><td class="mono">confirm_timeout</td><td style="white-space:nowrap">May</td><td>5–300 s, default 30</td></tr>
<tr><td class="mono">notes</td><td style="white-space:nowrap">Yes</td><td>Natural-language boundary notes; empty strings forbidden</td></tr>
</tbody>
</table>
</div>

## endpoints fields

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">id</td><td style="white-space:nowrap">Yes</td><td>E.g. <code>stream_out</code> / <code>a2dp_in</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">dir</td><td style="white-space:nowrap">Yes</td><td><code>output</code> (provides) / <code>input</code> (receives)</td></tr>
<tr><td class="mono" style="white-space:nowrap">kind</td><td style="white-space:nowrap">Yes</td><td><code>audio</code> (usual) / <code>video</code> / <code>frame</code> / <code>byte</code></td></tr>
<tr><td class="mono">media</td><td style="white-space:nowrap">Yes</td><td>At least one IANA type (<code>audio/L16</code>; <code>audio/pcm</code> is the compatible spelling)</td></tr>
<tr><td class="mono">access</td><td style="white-space:nowrap">Yes</td><td><code>provide</code> for output, <code>consume</code> for input</td></tr>
<tr><td class="mono">max_sessions</td><td>Should</td><td>Default 1</td></tr>
<tr><td class="mono">preempt</td><td style="white-space:nowrap">May</td><td>Whether to preempt when sessions are full; default true</td></tr>
<tr><td class="mono">description</td><td style="white-space:nowrap">Yes</td><td>Natural language: what this endpoint produces / consumes, and for whom</td></tr>
<tr><td class="mono">open / close</td><td>Should</td><td>Defaults output=<code>stream.start</code>, input=<code>stream.accept</code>, close=<code>stream.stop</code></td></tr>
<tr><td class="mono">close_on_release</td><td style="white-space:nowrap">May</td><td>Meaningful for exclusive only; default false: release does not stop the data stream</td></tr>
</tbody>
</table>
</div>

### The format object (must be complete in the open-stream result)

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">mode</td><td style="white-space:nowrap">Yes</td><td><code>raw</code> (continuous bytes) or <code>framed</code> (each packet <code>[u32 BE len][payload]</code>; no JSON nested inside the payload)</td></tr>
<tr><td class="mono">media</td><td style="white-space:nowrap">Yes</td><td>Must match one entry of the endpoint's <code>media[]</code></td></tr>
<tr><td class="mono">sample_rate / channels / bits / signed</td><td>Required for audio</td><td>E.g. 48000 / 2 / 16 / true</td></tr>
<tr><td class="mono">endian</td><td>Required when bit depth &gt; 8</td><td><code>le</code> / <code>be</code></td></tr>
</tbody>
</table>
</div>

## Occupancy and lease fields (exclusive only)

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono">token</td><td>Occupancy credential: ≥16 hex characters; bound to the issuing <code>agent</code>; <b>appears only over TCP</b>, forbidden in UDP / TXT / hello / who / describe / the model's context</td></tr>
<tr><td class="mono">until</td><td>Lease expiry in <b>Unix seconds</b>; <code>0</code> when indefinite (ttl=9999)</td></tr>
<tr><td class="mono">lease_security</td><td>Lease length in seconds (10–9999); default 60</td></tr>
<tr><td class="mono">holder</td><td>Current holder; omit if none</td></tr>
<tr><td class="mono">streams[]</td><td>Active endpoint sessions <code>{id, endpoint, agent, since}</code>, no URI</td></tr>
</tbody>
</table>
</div>

## Error codes (bmahs_code → JSON-RPC code)

<div class="table-wrap">
<table>
<thead><tr><th>bmahs_code</th><th style="white-space:nowrap">code</th><th>retryable</th><th>Trigger</th></tr></thead>
<tbody>
<tr><td class="mono">parse-error</td><td class="mono">-32700</td><td style="white-space:nowrap">No</td><td>The line is not valid JSON</td></tr>
<tr><td class="mono">invalid-request</td><td class="mono">-32600</td><td style="white-space:nowrap">No</td><td>Malformed JSON-RPC envelope</td></tr>
<tr><td class="mono">unknown-action</td><td class="mono">-32601</td><td style="white-space:nowrap">No</td><td><code>method</code> not in <code>operations</code></td></tr>
<tr><td class="mono">bad-arg</td><td class="mono">-32602</td><td style="white-space:nowrap">No</td><td>Parameter missing / type / range / enum / any_of not satisfied; pairing kind / media mismatch</td></tr>
<tr><td class="mono">internal-error</td><td class="mono">-32603</td><td style="white-space:nowrap">No</td><td>Internal device error</td></tr>
<tr><td class="mono">occupied</td><td class="mono">-32001</td><td style="white-space:nowrap">Yes</td><td>exclusive only: held by someone else (data carries holder / until)</td></tr>
<tr><td class="mono">offline</td><td class="mono">-32002</td><td style="white-space:nowrap">Yes</td><td>The device is offline or about to exit</td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td class="mono">-32003</td><td style="white-space:nowrap">Yes</td><td>Cannot execute for now, or the endpoint's sessions are full with preempt=false</td></tr>
<tr><td class="mono">unauthorized</td><td class="mono">-32004</td><td style="white-space:nowrap">No</td><td>Token missing / mismatched / not bound to the agent</td></tr>
<tr><td class="mono">denied</td><td class="mono">-32005</td><td style="white-space:nowrap">No</td><td>Touched a deny red line or failed confirm (a confirm timeout is retryable=true)</td></tr>
<tr><td class="mono">bad-state</td><td class="mono">-32006</td><td style="white-space:nowrap">No</td><td>Method unavailable in the current state (e.g. <code>tap</code> without <code>ui.start</code>)</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">The error object trio</div>
<code>code</code> (integer, mapping above) + <code>message</code> (the failure reason in <b>natural language</b>; must not merely echo the error code's synonym) +
<code>data</code> (must contain <code>bmahs_code</code> and <code>retryable</code>; related fields may be attached).
    The error code <code>busy</code> and the announce field <code>busy</code> share a name but differ in meaning.
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/ready.html">
<div class="card__title">AGI-Ready Certification →</div>
<div class="card__desc">Turning the fields above into a self-testable certification standard.</div>
</a>
</div>
