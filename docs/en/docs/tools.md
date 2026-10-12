---
title: "Methods & Messages"
description: "The bmahs/1.2 control channel is JSON-RPC 2.0: universal methods describe / info / who / occupy / release, error-code mapping and default ports."
eyebrow: "Reference / Methods & Messages"
---

<p class="eyebrow">Reference / Methods & Messages</p>

# Methods & Messages

<p class="lead">
  The bmahs/1.2 control channel is <b>JSON-RPC 2.0 over TCP</b>: one UTF-8 JSON message per line, terminated by <code>\n</code>.
  A device has exactly <b>five</b> universal methods — all capability differences are carried by the device's self-described
<code>operations</code>, rather than by extending the protocol itself. A new category needs no protocol change,
  only the device stating its capabilities clearly.
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">Connecting as a protocol client</div>
    The BMAHS control channel is standard <b>JSON-RPC 2.0</b> (protocol identifier <code>bmahs/1.2</code>).
    Agents can connect through any protocol client — scripts, SDKs, or agent runtimes; the client choice never changes the protocol semantics.
</div>
</div>

## The JSON-RPC envelope

<div class="cols2" style="align-items:stretch">
<div class="code" style="margin:0">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Request →</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>{
  <span class="tok-f">"jsonrpc"</span>: <span class="tok-s">"2.0"</span>,
  <span class="tok-f">"id"</span>: <span class="tok-n">1</span>,
  <span class="tok-f">"method"</span>: <span class="tok-s">"brightness"</span>,
  <span class="tok-f">"params"</span>: { <span class="tok-f">"agent"</span>: <span class="tok-s">"alice"</span>, <span class="tok-f">"level"</span>: <span class="tok-n">40</span> }
}</pre>
</div>
<div class="code" style="margin:0">
<div class="code__head"><span class="code__dot"></span><span class="code__name">← Success response</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>{
  <span class="tok-f">"jsonrpc"</span>: <span class="tok-s">"2.0"</span>,
  <span class="tok-f">"id"</span>: <span class="tok-n">1</span>,
  <span class="tok-f">"result"</span>: { <span class="tok-f">"state"</span>: <span class="tok-s">"online"</span>, <span class="tok-f">"holder"</span>: <span class="tok-s">"alice"</span>, <span class="tok-f">"level"</span>: <span class="tok-n">40</span> }
}</pre>
</div>
</div>

### Envelope rules (mandatory)

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Rule</th><th>Description</th></tr></thead>
<tbody>
<tr><td>One message per line</td><td>UTF-8 JSON + <code>\n</code>; no BOM; no embedded newlines within a line</td></tr>
<tr><td><code>params</code> must be an object</td><td>Named Params; <b>positional parameter arrays are forbidden</b>. Business parameter names must align with <code>operations.args[].name</code></td></tr>
<tr><td>No batch calls</td><td>JSON-RPC batch arrays <code>[...]</code> must not be used — keeps parsing easy for embedded devices</td></tr>
<tr><td>Pipelining supported</td><td>Response order may differ from request order; correlate by <code>id</code>; <code>id</code> is unique within a connection</td></tr>
<tr><td>Common parameters</td><td>Control calls should carry <code>agent</code> (the agent's stable identifier); after <code>exclusive</code> takes over, <code>token</code> is mandatory</td></tr>
<tr><td>Notifications get no response</td><td><code>hello</code> / <code>event</code> are notifications without an <code>id</code>; clients must ignore unknown notifications</td></tr>
<tr><td>Discovery is not RPC</td><td>UDP discovery messages (<a href="/en/docs/discovery.html">announce / query / goodbye</a>) are plain JSON, <b>not wrapped</b> in the JSON-RPC envelope</td></tr>
</tbody>
</table>
</div>

## The five universal methods

<div class="table-wrap">
<table>
<thead><tr><th>Method</th><th>Required by</th><th>In one line</th><th>Needs token</th></tr></thead>
<tbody>
<tr><td class="mono">describe</td><td>All devices</td><td><b>Authoritative</b> operations list and security boundary</td><td style="white-space:nowrap">No</td></tr>
<tr><td class="mono" style="white-space:nowrap">info</td><td>All devices</td><td>Lean identity: what it is, what state it's in</td><td style="white-space:nowrap">No</td></tr>
<tr><td class="mono" style="white-space:nowrap">who</td><td>All devices</td><td>Who's using it: last controller and active streams</td><td style="white-space:nowrap">No</td></tr>
<tr><td class="mono">occupy</td><td>exclusive only</td><td>Take exclusivity and issue a token</td><td>— (the issuer)</td></tr>
<tr><td class="mono">release</td><td>exclusive only</td><td>Return exclusivity, void the token</td><td style="white-space:nowrap"><b>Yes</b></td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">The three read-only methods have distinct boundaries — don't mix them</div>
<b>describe</b> is the only method guaranteed to return the <b>complete</b> <code>operations</code> / <code>security</code>;
<b>info</b> may be lean; <b>who</b> has no list but does carry <code>holder</code> and active <code>streams</code>.
    To ask "who is adjusting the volume", look at <code>holder</code>; to ask "who is pulling this stream", look at <code>streams</code>.
</div>
</div>

### describe · the authoritative profile

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">describe → result (excerpt)</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">"result"</span><span class="tok-p">:{</span>
  <span class="tok-f">"id"</span><span class="tok-p">:</span> <span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"type"</span><span class="tok-p">:</span> <span class="tok-s">"speaker"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span> <span class="tok-s">"speaker/1"</span><span class="tok-p">,</span>
  <span class="tok-f">"name"</span><span class="tok-p">:</span> <span class="tok-s">"Desk Speaker"</span><span class="tok-p">,</span> <span class="tok-f">"summary"</span><span class="tok-p">:</span> <span class="tok-s">"Desk speaker; can pull audio streams and adjust volume independently"</span><span class="tok-p">,</span>
  <span class="tok-f">"occupancy"</span><span class="tok-p">:</span> <span class="tok-s">"last-wins"</span><span class="tok-p">,</span> <span class="tok-f">"state"</span><span class="tok-p">:</span> <span class="tok-s">"online"</span><span class="tok-p">,</span>
  <span class="tok-f">"operations"</span><span class="tok-p">:</span> <span class="tok-p">[</span> <span class="tok-c">/* full list: name / description / args / result / returns */</span> <span class="tok-p">],</span>
  <span class="tok-f">"security"</span><span class="tok-p">:</span> <span class="tok-p">{</span> <span class="tok-f">"scope"</span><span class="tok-p">:</span><span class="tok-s">"lan"</span><span class="tok-p">,</span> <span class="tok-f">"auth"</span><span class="tok-p">:</span><span class="tok-s">"none"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">,</span>
                 <span class="tok-f">"deny"</span><span class="tok-p">:[</span><span class="tok-s">"exec"</span><span class="tok-p">,</span><span class="tok-s">"write-filesystem"</span><span class="tok-p">,</span><span class="tok-s">"cloud-upload"</span><span class="tok-p">],</span> <span class="tok-f">"notes"</span><span class="tok-p">:</span><span class="tok-s">"…"</span> <span class="tok-p">},</span>
  <span class="tok-f">"endpoints"</span><span class="tok-p">:</span> <span class="tok-p">[</span> <span class="tok-p">{</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"stream_in"</span><span class="tok-p">,</span><span class="tok-f">"dir"</span><span class="tok-p">:</span><span class="tok-s">"input"</span><span class="tok-p">,</span><span class="tok-f">"access"</span><span class="tok-p">:</span><span class="tok-s">"consume"</span><span class="tok-p">,</span> <span class="tok-f">"media"</span><span class="tok-p">:[</span><span class="tok-s">"audio/L16"</span><span class="tok-p">]}</span> <span class="tok-p">]</span>
<span class="tok-p">}}</span></pre>
</div>

### who · who's using it

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">who → result (excerpt)</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">"result"</span><span class="tok-p">:{</span>
  <span class="tok-f">"state"</span><span class="tok-p">:</span> <span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span> <span class="tok-s">"exclusive"</span><span class="tok-p">,</span>
  <span class="tok-f">"holder"</span><span class="tok-p">:</span> <span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span> <span class="tok-n">1791000060</span><span class="tok-p">,</span> <span class="tok-f">"lease_security"</span><span class="tok-p">:</span> <span class="tok-n">60</span><span class="tok-p">,</span>
  <span class="tok-f">"streams"</span><span class="tok-p">:</span> <span class="tok-p">[</span> <span class="tok-p">{</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"s1"</span><span class="tok-p">,</span><span class="tok-f">"endpoint"</span><span class="tok-p">:</span><span class="tok-s">"stream_out"</span><span class="tok-p">,</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span><span class="tok-f">"since"</span><span class="tok-p">:</span><span class="tok-n">1790999700</span><span class="tok-p">}</span> <span class="tok-p">]</span>
<span class="tok-p">}}</span>
<span class="tok-c">// until is Unix seconds; for an indefinite lease (ttl=9999), until=0 and lease_security=9999</span></pre>
</div>

### occupy / release · exclusive only

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Occupy → control → release</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-c">// 1) Occupy (ttl optional 10–9999, default lease 60 s)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"event"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">,</span>
  <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span> <span class="tok-n">1791000060</span><span class="tok-p">,</span> <span class="tok-f">"lease_security"</span><span class="tok-p">:</span> <span class="tok-n">60</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span> <span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>

<span class="tok-c">// 2) Error response when occupied by someone else (retryable=true, data carries holder/until, no token)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span> <span class="tok-f">"error"</span><span class="tok-p">:{</span><span class="tok-f">"code"</span><span class="tok-p">:</span><span class="tok-n">-32001</span><span class="tok-p">,</span>
  <span class="tok-f">"message"</span><span class="tok-p">:</span><span class="tok-s">"Study-room phone is occupied by alice; the lease expires in about 42 seconds"</span><span class="tok-p">,</span>
  <span class="tok-f">"data"</span><span class="tok-p">:{</span><span class="tok-f">"bmahs_code"</span><span class="tok-p">:</span><span class="tok-s">"occupied"</span><span class="tok-p">,</span> <span class="tok-f">"retryable"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">,</span> <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">}}}</span>

<span class="tok-c">// 3) Release (the token must match the agent it was issued to)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">5</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">5</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"event"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">false</span><span class="tok-p">}}</span></pre>
</div>

## Error-code mapping (bmahs_code → JSON-RPC)

<div class="table-wrap">
<table>
<thead><tr><th><code>error.data.bmahs_code</code></th><th>JSON-RPC <code>code</code></th><th>retryable</th><th>Trigger</th></tr></thead>
<tbody>
<tr><td class="mono">parse-error</td><td class="mono">-32700</td><td style="white-space:nowrap">No</td><td>The line is not valid JSON</td></tr>
<tr><td class="mono">invalid-request</td><td class="mono">-32600</td><td style="white-space:nowrap">No</td><td>Malformed JSON-RPC envelope (missing <code>jsonrpc</code>, etc.)</td></tr>
<tr><td class="mono">unknown-action</td><td class="mono">-32601</td><td style="white-space:nowrap">No</td><td><code>method</code> not in <code>operations</code></td></tr>
<tr><td class="mono">bad-arg</td><td class="mono">-32602</td><td style="white-space:nowrap">No</td><td>Missing parameters, wrong type or range; kind / media mismatch when pairing</td></tr>
<tr><td class="mono">internal-error</td><td class="mono">-32603</td><td style="white-space:nowrap">No</td><td>Internal device error</td></tr>
<tr><td class="mono">occupied</td><td class="mono">-32001</td><td style="white-space:nowrap"><b>Yes</b></td><td><b>exclusive only</b>: already held by someone else; must not be used by <code>last-wins</code></td></tr>
<tr><td class="mono">offline</td><td class="mono">-32002</td><td style="white-space:nowrap">Yes</td><td>The device is offline or about to exit</td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td class="mono">-32003</td><td style="white-space:nowrap">Yes</td><td>Cannot execute for now, or the endpoint's sessions are full with <code>preempt=false</code></td></tr>
<tr><td class="mono">unauthorized</td><td class="mono">-32004</td><td style="white-space:nowrap">No</td><td><code>token</code> missing or mismatched (or not bound to the agent)</td></tr>
<tr><td class="mono">denied</td><td class="mono">-32005</td><td style="white-space:nowrap">No</td><td>Touched <code>security.deny</code>, or failed <code>confirm</code>; not retryable by default, <code>data.retryable=true</code> only on a confirmation timeout</td></tr>
<tr><td class="mono">bad-state</td><td class="mono">-32006</td><td style="white-space:nowrap">No</td><td>Method unavailable in the current state (e.g. <code>tap</code> without <code>ui.start</code>)</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">Use bmahs_code as the stable criterion</div>
    Clients should classify errors by <code>error.data.bmahs_code</code> (not the bare integer);
    errors with <code>retryable=false</code> <b>must not be auto-retried</b>.
    Note: the error code <code>busy</code> and the announce field <code>busy</code> share a name but differ in meaning.
</div>
</div>

## Profile methods (must implement if declared)

<div class="table-wrap">
<table>
<thead><tr><th>Profile</th><th>Methods</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td rowspan="4">UI interface<br><small style="color:var(--text-muted)">must be exclusive</small></td>
<td class="mono">ui.start / ui.stop</td><td>Start / stop the screen stream; <code>ui.start</code> returns the UI URI and the actual dimensions</td>
</tr>
<tr><td class="mono">screenshot</td><td>Grab a frame (the full image is never passed in control JSON)</td></tr>
<tr><td class="mono">tap / swipe</td><td>Touch injection, in the same coordinate space as the current frame</td></tr>
<tr><td colspan="2">Frames travel as <b>binary frames</b> (JPEG, token handshake), not via JSON-RPC</td></tr>
<tr>
<td rowspan="3">Endpoint & Data Stream<br><small style="color:var(--text-muted)">declares endpoints</small></td>
<td class="mono">stream.start / stream.accept</td><td>Open a stream (default methods for output / input); returns the <code>stream</code> URI and <code>format</code></td>
</tr>
<tr><td class="mono">stream.join</td><td>The sink self-connect mode: this end pulls from the peer (should be implemented by real devices with an input endpoint)</td></tr>
<tr><td class="mono">stream.stop</td><td>Tear down the local session</td></tr>
</tbody>
</table>
</div>

<p>See <a href="/en/docs/streaming.html">Data Streams: Push & Pull</a> for details; the UI interface details are in Chapter 13 of the specification.</p>

## Default ports

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Use</th><th>Default port</th><th>Encoding</th></tr></thead>
<tbody>
<tr><td>Discovery (UDP multicast)</td><td class="mono" style="white-space:nowrap">5354</td><td>Plain JSON (not RPC), ≤1400 bytes</td></tr>
<tr><td><code>control</code> (TCP)</td><td class="mono" style="white-space:nowrap">9527</td><td>JSON-RPC 2.0, one message per line</td></tr>
<tr><td>UI stream (TCP)</td><td class="mono" style="white-space:nowrap">9531</td><td>Binary frames + token handshake</td></tr>
<tr><td>Data stream (TCP)</td><td class="mono" style="white-space:nowrap">9532</td><td>Payload per <code>format</code>, no handshake</td></tr>
</tbody>
</table>
</div>

## A typical call sequence

<ol class="steps">
<li><div class="steps__title">Discover</div>Multicast <code>query</code> → receive <code>announce</code>; pick by <code>name</code> + <code>summary</code>.</li>
<li><div class="steps__title">Connect</div>TCP to <code>control</code>; the <code>hello</code> notification (no <code>id</code>) arrives immediately.</li>
<li><div class="steps__title">describe</div>Read the authoritative profiles of the participating devices: capabilities, boundaries, endpoints.</li>
<li><div class="steps__title">occupy (exclusive only)</div>Check <code>who</code> first, then get the token and keep it safe.</li>
<li><div class="steps__title">Business methods × N</div>Execute the orchestration sequence; <code>confirm</code>-level actions are handed to the human — no repeated requests while waiting.</li>
<li><div class="steps__title">release</div>Mandatory when the task ends (including failure / cancellation) — the step most easily skipped, and the one most easily blocking others.</li>
</ol>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/fields.html">
<div class="card__title">Fields & Messages →</div>
<div class="card__desc">Complete field definitions for self-description, operations, security and endpoints.</div>
</a>
</div>
