---
title: "Data Streams: Push & Pull"
description: "The stream_out / stream_in endpoint model, plus the two transport modes: stream.join (pull) and stream.accept (push)."
eyebrow: "Core Concepts / L2"
---

<p class="eyebrow">Core Concepts / L2</p>

# Data Streams: Push & Pull

<p class="lead">
  This is the basis for BMAHS devices to carry all kinds of data streams — and the prerequisite for multi-room playback (one source, many streams); playback-clock sync across devices is guaranteed on the device side.<code>stream_out</code> is a <b>faucet</b>, <code>stream_in</code> is a <b>cup</b>;
<code>stream.join</code> is going to the tap yourself, <code>stream.accept</code> is letting someone pour for you.
</p>

## The endpoint object

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">id</td><td>string</td><td>Endpoint identifier, e.g. <code>stream_out</code> / <code>a2dp_in</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">dir</td><td style="white-space:nowrap">enum</td><td><code>output</code> (can provide a stream, <b>faucet</b>) or <code>input</code> (can receive a stream, <b>cup</b>)</td></tr>
<tr><td class="mono" style="white-space:nowrap">kind</td><td>string</td><td>Usually <code>audio</code>; also <code>video</code> / <code>frame</code> / <code>byte</code></td></tr>
<tr><td class="mono">media</td><td>string[]</td><td>At least one IANA media type, e.g. <code>audio/L16</code> (<code>audio/pcm</code> is the de-facto compatible spelling)</td></tr>
<tr><td class="mono">access</td><td style="white-space:nowrap">enum</td><td><code>provide</code> for output, <code>consume</code> for input</td></tr>
<tr><td class="mono">max_sessions</td><td style="white-space:nowrap">int</td><td>Simultaneous-stream cap, <b>default 1</b></td></tr>
<tr><td class="mono">preempt</td><td style="white-space:nowrap">bool</td><td>When sessions are full, may a new stream preempt an old one, <b>default true</b> (home playback); set <code>false</code> for meeting recording etc. (returns <code>busy</code>)</td></tr>
<tr><td class="mono">open / close</td><td>string</td><td>Open / close stream method names; defaults output=<code>stream.start</code>, input=<code>stream.accept</code>, close=<code>stream.stop</code></td></tr>
<tr><td class="mono">close_on_release</td><td style="white-space:nowrap">bool</td><td>Meaningful for exclusive only; default <code>false</code>: release does not stop the data stream</td></tr>
<tr><td class="mono">description</td><td>string</td><td>Natural language: what this endpoint produces / consumes, and for whom</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">The URI appears only after the stream opens</div>
    The <code>stream</code> URI is returned only in the <code>result</code> of the open-stream method; it <b>must not</b> appear in UDP, Bonjour TXT,
    or in <code>hello</code> / <code>who</code> / <code>describe</code> when no stream is open. Possessing the URI is treated as having passed open-stream authorization.
</div>
</div>

<div class="figure">
<svg viewBox="0 0 680 268" role="img" aria-label="The two audio stream transport modes: pull and push">
<text class="dg-mk" x="20" y="16">Mode A · stream.join (pull)</text>
<text class="dg-mk" x="20" y="156">Mode B · stream.accept (push)</text>

<rect class="dg-dev" x="20" y="30" width="150" height="66" rx="10"/>
<text class="dg-l" x="38" y="56">Source</text>
<text class="dg-m" x="38" y="76">stream_out · provide</text>

<line class="dg-line--accent" x1="174" y1="63" x2="266" y2="63"/>
<polygon points="266,63 256,58 256,68" style="fill:var(--accent)"/>
<text class="dg-m" x="180" y="55">4-part request</text>

<rect class="dg-agent" x="272" y="30" width="150" height="66" rx="10"/>
<text class="dg-l" x="290" y="56">Speaker</text>
<text class="dg-m" x="290" y="76">stream_in · consume</text>

<line class="dg-line" x1="266" y1="112" x2="174" y2="112"/>
<polygon points="174,112 184,107 184,117" style="fill:var(--border-strong)"/>
<text class="dg-m" x="180" y="130">PCM stream back to the speaker</text>

<text class="dg-s" x="440" y="52">The speaker pulls itself: whom /</text>
<text class="dg-s" x="440" y="70">where / which port / what format</text>
<text class="dg-m" x="440" y="90">Best when: speaker can go outbound</text>

<rect class="dg-agent" x="20" y="170" width="150" height="66" rx="10"/>
<text class="dg-l" x="38" y="196">Speaker</text>
<text class="dg-m" x="38" y="216">stream_in · consume</text>

<line class="dg-line--accent" x1="272" y1="203" x2="174" y2="203"/>
<polygon points="174,203 184,198 184,208" style="fill:var(--accent)"/>
<text class="dg-m" x="184" y="195">pushes in</text>

<rect class="dg-dev" x="272" y="170" width="150" height="66" rx="10"/>
<text class="dg-l" x="290" y="196">Source</text>
<text class="dg-m" x="290" y="216">stream_out · provide</text>

<text class="dg-s" x="440" y="192">Have the peer push the stream over</text>
<text class="dg-s" x="440" y="210">Best when: speaker can't go outbound</text>
</svg>
<p class="figure__cap">Fig. 1 · Pull (join) is initiated by the consumer, push (accept) by the provider — choose by network conditions</p>
</div>

## stream.join: the sink pulls itself

<p>Here <b>Sink</b> means the receiver / puller (the <code>dir=input</code> endpoint), as opposed to the <b>Source</b>.</p>

<p>A real device with an <code>input</code> endpoint <b>should</b> implement <code>stream.join</code> (Mode A, the default first choice);
if an MCU cannot do it, it must not declare <code>join</code>, and the client falls back to Mode B (relay).</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Speaker pulling from the source (stream.join)</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"stream.join"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span>
  <span class="tok-f">"agent"</span><span class="tok-p">:</span> <span class="tok-s">"alice-runtime"</span><span class="tok-p">,</span>          <span class="tok-c">// ① who initiates</span>
  <span class="tok-f">"endpoint"</span><span class="tok-p">:</span> <span class="tok-s">"stream_in"</span><span class="tok-p">,</span>            <span class="tok-c">// ② which local port to feed</span>
  <span class="tok-f">"peer"</span><span class="tok-p">:</span> <span class="tok-p">{</span>                        <span class="tok-c">// ③ whom to pull from (peer profile)</span>
    <span class="tok-f">"id"</span><span class="tok-p">:</span> <span class="tok-s">"bmahs-qqmusicstream-01"</span><span class="tok-p">,</span>
    <span class="tok-f">"control"</span><span class="tok-p">:</span> <span class="tok-s">"tcp://192.168.1.20:9527"</span><span class="tok-p">,</span>
    <span class="tok-f">"endpoint"</span><span class="tok-p">:</span> <span class="tok-s">"stream_out"</span>
  <span class="tok-p">},</span>
  <span class="tok-f">"media"</span><span class="tok-p">:</span> <span class="tok-s">"audio/L16"</span>                  <span class="tok-c">// ④ in what format</span>
<span class="tok-p">}}</span>

<span class="tok-c">// A successful result carries only the format summary and public streams entries — the URI never enters the model's context</span></pre>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">The model only decides "who connects to whom"</div>
    The agent sends a <b>control command</b> like <code>stream.join</code>; the bytes are fetched by the Sink device itself.
    If neither end can act as a TCP client (or transcoding is needed), the protocol client relays via Mode B — the process copying bytes is the client, <b>not the model</b>.
</div>
</div>

## format: the format must be complete

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">The format object in the open-stream result</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-f">"format"</span><span class="tok-p">:</span> <span class="tok-p">{</span>
  <span class="tok-f">"mode"</span><span class="tok-p">:</span> <span class="tok-s">"raw"</span><span class="tok-p">,</span>            <span class="tok-c">// raw or framed (framed: each packet [u32 BE len][payload])</span>
  <span class="tok-f">"media"</span><span class="tok-p">:</span> <span class="tok-s">"audio/L16"</span><span class="tok-p">,</span>     <span class="tok-c">// must match one of the endpoint's media[]</span>
  <span class="tok-f">"sample_rate"</span><span class="tok-p">:</span><span class="tok-n">48000</span><span class="tok-p">,</span>      <span class="tok-c">// required for audio</span>
  <span class="tok-f">"channels"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span>
  <span class="tok-f">"bits"</span><span class="tok-p">:</span><span class="tok-n">16</span><span class="tok-p">,</span>
  <span class="tok-f">"signed"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">,</span>
  <span class="tok-f">"endian"</span><span class="tok-p">:</span><span class="tok-s">"le"</span>           <span class="tok-c">// required when bit depth &gt; 8 (le / be)</span>
<span class="tok-p">}</span></pre>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">Why format must be validated</div>
    The two ends must share the same <code>kind</code> and their <code>media[]</code> must intersect (one entry is chosen as <code>format.media</code>); otherwise opening returns <code>bad-arg</code>.
<b>No handshake of any kind happens over the media TCP</b> (unlike UI streams) — once the URI is connected, payloads flow per <code>format</code>,
    so format validation must happen at the open stage.
</div>
</div>

## Multi-sink playback and preemption

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td class="mono">max_sessions</td><td>The cap on simultaneous streams one endpoint can carry, <b>default 1</b></td></tr>
<tr><td class="mono">streams[]</td><td>Active session records <code>{id, endpoint, agent, since}</code>, no URI (visible in <code>who</code>)</td></tr>
<tr><td class="mono">preempt</td><td>When sessions are full, may a new stream <b>preempt</b> an old one. Declared on the writer endpoint, <b>default true</b>; when <code>false</code>, returns <code>busy</code> (-32003)</td></tr>
</tbody>
</table>
</div>

<div class="figure">
<svg viewBox="0 0 680 168" role="img" aria-label="One source, many streams: the same song delivered to multiple speakers at once">
<rect class="dg-dev" x="20" y="44" width="150" height="76" rx="10"/>
<text class="dg-l" x="38" y="70">Source</text>
<text class="dg-m" x="38" y="90">stream_out</text>
<text class="dg-m" x="38" y="106">max_sessions=3</text>

<path class="dg-line--accent" d="M174 82 C 220 82, 230 34, 286 34"/>
<polygon points="286,34 275,29 277,39" style="fill:var(--accent)"/>
<path class="dg-line--accent" d="M174 82 L 286 82"/>
<polygon points="286,82 276,77 276,87" style="fill:var(--accent)"/>
<path class="dg-line--accent" d="M174 82 C 220 82, 230 130, 286 130"/>
<polygon points="286,130 275,125 277,135" style="fill:var(--accent)"/>

<rect class="dg-agent" x="292" y="12" width="180" height="44" rx="8"/>
<text class="dg-s" x="308" y="39">PC speaker · stream.join</text>

<rect class="dg-agent" x="292" y="60" width="180" height="44" rx="8"/>
<text class="dg-s" x="308" y="87">Huawei speaker · stream.join</text>

<rect class="dg-agent" x="292" y="108" width="180" height="44" rx="8"/>
<text class="dg-s" x="308" y="135">Third one · may trigger preempt</text>

<text class="dg-m" x="496" y="86">One song,</text>
<text class="dg-m" x="496" y="104">many streams</text>
<text class="dg-m" x="496" y="122">= multi-room sync</text>
</svg>
<p class="figure__cap">Fig. 2 · One source, many streams: the same song to several sinks at once — the distribution prerequisite of multi-room playback</p>
</div>

## The discipline of stopping streams

<div class="callout callout--danger">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">Only stop streams you opened</div>
    Do not send <code>stream.stop</code> for streams <b>not opened by your own end</b> — that would interrupt someone else's playback.
    Also, media sessions and occupancy are <b>orthogonal</b>: a last-wins <code>holder</code> change, an exclusive <code>release</code> / lease expiry
    must <b>not</b> automatically tear down established streams (unless the endpoint declared <code>close_on_release=true</code>).
    The only signal that an old stream was preempted or its peer vanished is a <b>TCP disconnect</b> — a forwarder must tear down its side; it MUST NOT keep the half-open connection and keep feeding.
</div>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">A common misconception</div>
    Track switching and pausing happen on the <b>source</b>; the speaker only produces sound.
    Sending "next track" to a speaker will not work — it doesn't have that capability (see <code>operations</code>).
</div>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/tools.html">
<div class="card__title">Methods & Messages →</div>
<div class="card__desc">describe / who parameter and return structures.</div>
</a>
<a class="card" href="/en/docs/fields.html">
<div class="card__title">Fields & Messages →</div>
<div class="card__desc">The complete field definitions and state machine for endpoints.</div>
</a>
</div>
