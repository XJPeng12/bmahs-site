---
title: "Endpoint & Data Stream Interface"
description: "Endpoint objects, stream joining / relay procedures, format, session lifecycle, and preemption."
eyebrow: "Specification · Chapter 14"
---

<p class="eyebrow">Specification · Chapter 14</p>

# Endpoint & Data Stream Interface

<p>Applies to devices that <b>provide or consume</b> continuous media to/from other devices. Devices not participating in media interconnection <b>MUST NOT</b> declare <code>endpoints</code>.</p>

<p>The normative object of this interface: <b>how a protocol client connects one <code>dir=output</code> endpoint to one <code>dir=input</code> endpoint</b>.</p>

<ul>
<li><b>Two real BMAHS ends</b>: the agent / protocol client interconnects per this chapter; a gateway is <b>not</b> required.</li>
<li><b>One end is a gateway virtual device</b>: issue the same interconnection to that virtual device's <code>control</code>; bytes enter the gateway because that endpoint implementation runs in the gateway process.</li>
<li><code>occupancy</code> constrains <b>control methods</b> only; active streams on endpoints are <b>independent sessions</b>: song change, volume adjustment, and a last-wins <code>holder</code> change <b>MUST NOT</b> tear down streams.</li>
<li>Merely declaring <code>endpoints</code> does <b>not</b> make the device <code>exclusive</code>.</li>
</ul>

### 14.1 Declaration obligations

<ul>
<li>provide <code>endpoints[]</code> (complete objects, including <code>description</code>) in the <code>hello</code> notification params / <code>describe</code> <code>result</code>;</li>
<li><code>capabilities</code> includes the stream-opening method names; with <code>input</code>, it <b>SHOULD</b> include <code>stream.join</code>;</li>
<li>return the <code>stream</code> URI only after a successful open (<b>MUST NOT</b> appear in UDP / TXT / unopened <code>hello</code> / <code>who</code> / <code>describe</code>).</li>
</ul>

### 14.2 Endpoint object definition

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>id</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>e.g. <code>stream_out</code>, <code>a2dp_in</code></td></tr>
<tr><td style="white-space:nowrap"><code>dir</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>output</code> or <code>input</code></td></tr>
<tr><td style="white-space:nowrap"><code>kind</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>Commonly <code>audio</code> in this version; also <code>video</code> / <code>frame</code> / <code>byte</code></td></tr>
<tr><td><code>media</code></td><td>string[]</td><td style="white-space:nowrap">yes</td><td>At least 1 IANA type (e.g. <code>audio/L16</code>; <code>audio/pcm</code> is the de-facto compatible spelling)</td></tr>
<tr><td><code>access</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>provide</code> for output, <code>consume</code> for input</td></tr>
<tr><td><code>max_sessions</code></td><td style="white-space:nowrap">int</td><td>SHOULD</td><td>Default 1</td></tr>
<tr><td><code>preempt</code></td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">MAY</td><td>Whether a new open preempts old streams when sessions are full. Default <code>true</code> (home casting); meeting recording, etc. may set <code>false</code> (return <code>busy</code>)</td></tr>
<tr><td><code>description</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><b>Natural language</b>: what this endpoint produces/consumes, for whom</td></tr>
<tr><td><code>open</code> / <code>close</code></td><td>string</td><td>SHOULD</td><td>Defaults output=<code>stream.start</code>, input=<code>stream.accept</code>, close=<code>stream.stop</code></td></tr>
<tr><td><code>close_on_release</code></td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">MAY</td><td><b>Meaningful for exclusive only</b>. Default <code>false</code>: <code>release</code> does not stop the data stream. Not applicable to UI</td></tr>
</tbody>
</table>
</div>

<p>Example:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Endpoint object example</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream_out&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;dir&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;output&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;audio&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;media&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span><span class="tok-s">&quot;audio/L16&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;access&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;provide&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;max_sessions&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;preempt&quot;</span><span class="tok-p">:</span> true<span class="tok-p">,</span>
  <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Audio output of the music currently playing; other devices or protocol clients may pull it.&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;open&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream.start&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;close&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream.stop&quot;</span>
<span class="tok-p">}</span></pre>
</div>

### 14.3 Interconnection procedure (MUST)

<p>One interconnection = connecting <b>one output</b> to <b>one input</b>, until stopped or preempted.</p>

<p><b>Preconditions</b> (do not open if not satisfied): both ends share the same <code>kind</code>; <code>media[]</code> has a common element (choose one as <code>format.media</code>); each end acquires the open right per that device's <code>occupancy</code>; a capture endpoint listed in <code>confirm</code> must be confirmed first.</p>

<p><b>Open rights</b>:</p>

<div class="table-wrap">
<table>
<thead><tr><th>Device occupancy</th><th><code>stream.start</code> / <code>accept</code> / <code>join</code></th></tr></thead>
<tbody>
<tr><td><code>last-wins</code></td><td>Any agent that can send control may open; no occupy, no token</td></tr>
<tr><td><code>exclusive</code></td><td>Only the current occupant, with a valid token</td></tr>
</tbody>
</table>
</div>

<p><b>Method A: Sink self-connect (real devices SHOULD use this by default)</b></p>

<p>The Sink acts as a BMAHS client and pulls from the Source. The agent never touches the URI.</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Example</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>Protocol Client → Sink:   stream.join  { params: { peer: {...}, media } }
Sink     → Source: stream.start (as the Sink's agent)
Source   → Sink:   result containing stream URI + format
Sink connects to the URI and pulls bytes per format</pre>
</div>

<p><code>stream.join</code> request example:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">stream.join request</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-n">7</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream.join&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span> <span class="tok-p">{</span>
    <span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;alice-runtime&quot;</span><span class="tok-p">,</span>
    <span class="tok-f">&quot;endpoint&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;a2dp_in&quot;</span><span class="tok-p">,</span>
    <span class="tok-f">&quot;peer&quot;</span><span class="tok-p">:</span> <span class="tok-p">{</span>
      <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs-qqmusicstream-01&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;control&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;tcp://192.168.1.20:9527&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;endpoint&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream_out&quot;</span>
    <span class="tok-p">}</span><span class="tok-p">,</span>
    <span class="tok-f">&quot;media&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;audio/L16&quot;</span>
  <span class="tok-p">}</span>
<span class="tok-p">}</span></pre>
</div>

<p>The success response <code>result</code> contains only the <code>format</code> summary and public <code>streams</code> items — <b>no</b> URI. The Source-side <code>streams[].agent</code> <b>SHOULD</b> be the Sink's device <code>id</code>.</p>

<p>A real device with <code>input</code> endpoints <b>SHOULD</b> implement <code>stream.join</code>; if an MCU cannot, it must not declare <code>join</code>, and the client falls back to Method B. A virtual Sink's <code>stream.join</code> is implemented by the gateway code.</p>

<p><b>Method B: protocol-client relay (MUST always work)</b></p>

<p>When neither device can act as a TCP client, or transcoding at the client is required:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Example</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>Client → Source: stream.start  → result yields URI; pull
Client → Sink:   stream.accept → result yields URI; push
The client process copies bytes (still not the model)</pre>
</div>

<p>If the peer declares <code>stream.join</code>, the client <b>SHOULD</b> prefer Method A.</p>

<p><b>Prohibitions</b>:</p>

<ul>
<li>PCM, stream URIs, or occupancy tokens appearing in model return values;</li>
<li>mandating that real-device interconnection must first occupy a gateway and then <code>route</code>;</li>
<li>forwarding an occupancy token to a third party as a long-lived credential.</li>
</ul>

<p>Transcoding, 1-to-N fan-out streaming, and display-name routing tables are <b>not</b> discovery-layer objects. The client may copy PCM locally; the Source's <code>max_sessions</code> only constrains how many TCP connections that device is willing to open.</p>

### 14.4 Stream opening, format and media TCP

<div class="table-wrap">
<table>
<thead><tr><th>Method</th><th style="white-space:nowrap">Rule</th></tr></thead>
<tbody>
<tr><td><code>stream.start</code> (output)</td><td>Success <code>result</code> contains the <code>stream</code> URI and <code>format</code>. The port is separate from <code>control</code>, recommended default <b>9532</b>; <b>each open SHOULD use a new port or ensure the old URI is invalidated immediately</b></td></tr>
<tr><td><code>stream.accept</code> (input, Method B)</td><td>Success <code>result</code> contains the URI for the peer to push into, plus <code>format</code></td></tr>
<tr><td><code>stream.stop</code></td><td>Tear down this end's session</td></tr>
<tr><td>Timeout</td><td>If no TCP connects <b>within 10 seconds</b> after opening: the device <b>MUST</b> invalidate the URI and stop listening</td></tr>
</tbody>
</table>
</div>

<p><b><code>format</code> object (all fields required)</b>:</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>mode</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>raw</code> or <code>framed</code></td></tr>
<tr><td><code>media</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>Must match one entry of the endpoint's <code>media[]</code></td></tr>
<tr><td><code>sample_rate</code> / <code>channels</code> / <code>bits</code> / <code>signed</code></td><td>int / bool</td><td>required for audio</td><td></td></tr>
<tr><td><code>endian</code></td><td>string</td><td>required when bit depth &gt; 8</td><td><code>le</code> / <code>be</code></td></tr>
</tbody>
</table>
</div>

<p><code>framed</code> mode: each packet is <code>[u32 BE payload_len][payload]</code>; <b>wrapping JSON inside the payload is forbidden</b>.</p>

<p><b>Data stream TCP</b>: after the client connects to an unpublished <code>stream</code> URI, it <b>immediately</b> transfers the payload per <code>format</code>, with <b>no</b> occupancy-token / stream-ticket handshake. The URI itself must not appear in the discovery layer; holding the URI is considered to have passed stream-open authorization.</p>

<p><b>Exception</b>: the UI stream still performs the occupancy-token handshake per §13.4.</p>

<p><b>Forbidding</b> continuous media inside JSON-RPC control messages.</p>

### 14.5 Session lifecycle, preemption and stopping

<p>The device records for each active stream: <code>id</code>, <code>endpoint</code>, opening <code>agent</code>, <code>since</code>. The <code>who</code> / <code>describe</code> <code>result</code> <b>SHOULD</b> include <code>streams[]</code> (no URIs). <code>announce.busy</code> is <code>true</code> when an active stream, UI stream, or exclusive occupancy exists.</p>

<p>Data streams <b>MUST NOT</b> be torn down automatically for:</p>

<ul>
<li>a last-wins <code>holder</code> change;</li>
<li>an exclusive <code>release</code> / finite-lease expiry (unless that endpoint has <code>close_on_release=true</code>);</li>
<li>a control TCP disconnect.</li>
</ul>

<p>Stream teardown <b>MUST</b> happen when:</p>

<ul>
<li><code>stream.stop</code>;</li>
<li>the peer TCP disconnects;</li>
<li><code>goodbye</code> / process exit;</li>
<li>a legal preemption on the same endpoint;</li>
<li>nobody connects after opening (timeout).</li>
</ul>

<p><b>Who may stop a stream</b>:</p>

<ol>
<li>the opener of that session (Method A: the Sink; Method B: the protocol client) sending <code>stream.stop</code>;</li>
<li>a new open / <code>join</code> on the same endpoint with <code>preempt=true</code> (or default true): the new stream succeeds, the old TCP disconnects, the old URI is invalidated;</li>
<li>the device itself: <code>goodbye</code>, timeout, hardware removal.</li>
</ol>

<p><code>preempt=false</code> with sessions full: a new open returns <code>busy</code> (<code>-32003</code>); the old stream is untouched.</p>

<p>The <b>only</b> signal that an old stream was preempted or its peer disappeared is a TCP disconnect; the forwarder <b>MUST</b> tear down its side and <b>MUST NOT</b> keep a half-open connection while pushing. The protocol sends <b>no</b> separate JSON notification on the data stream layer.</p>

<p>With <code>max_sessions&gt;1</code>, fill the sessions first, then handle preemption per the rules above.</p>

<p><b>Failure cases</b>: Source <code>goodbye</code> or no-heartbeat removal → the stream URI is invalidated and the peer <b>SHOULD</b> see a TCP disconnect; no common <code>kind</code> / <code>media</code> → <code>bad-arg</code>.</p>

### 14.6 Endpoint security requirements

<ul>
<li><code>security.allow</code> <b>SHOULD</b> include the corresponding tags (e.g. <code>local-audio-stream</code>);</li>
<li>capture opens <b>SHOULD</b> be listed in <code>confirm</code>;</li>
<li><code>stream</code> URIs are <b>forbidden</b> in UDP / TXT / unopened <code>hello</code> / <code>who</code> / <code>describe</code>.</li>
</ul>
