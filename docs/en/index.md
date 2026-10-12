---
layout: page
sidebar: false
aside: false
outline: false
titleTemplate: false
title: "BMAHS · Big Model Agent Hardware Specification"
description: "BMAHS gives hardware a common language, makes it Ready for AGI — and lets one sentence orchestrate it all."
---

<section class="hero">
<div class="hero__inner">
<div class="hero__grid">
<div>
<h1>Give hardware a common language.<br>Make it <em>Ready for AGI</em>.</h1>
<p class="hero__lead">
          AGI stands at the door of the physical world. What's missing is not intelligence, it's <b>readiness</b> — agents can't understand devices, can't actuate them, can't trust them.
          BMAHS turns self-description, capability lists and security boundaries into a protocol:
<b>one sentence, across devices, across brands, orchestrated at runtime</b>.
</p>
<div class="hero__cta">
<a class="btn btn--primary" href="/en/docs/quickstart.html">Quickstart →</a>
<a class="btn btn--ghost" href="/en/docs/intro.html">What is BMAHS</a>
</div>
</div>

<div class="code" style="margin:0">
<div class="code__head">
<span class="code__dot"></span><span class="code__dot"></span><span class="code__dot"></span>
<span class="code__name">orchestration.log</span>
<button class="code__copy" type="button">Copy</button>
</div>

<pre><span class="tok-c"># The user said one sentence</span>
<span class="tok-s">"Play my 'Daughter' playlist on the desk speaker and the Huawei speaker"</span>

<span class="tok-c"># The agent orchestrates at runtime (no preset scene involved)</span>
<span class="tok-c"># Control channel: TCP + JSON-RPC 2.0 (bmahs/1.2)</span>
<span class="tok-f">describe</span> <span class="tok-s">"speaker-01"</span>   <span class="tok-p">→</span> stream.join · volume · last-wins (last write wins)
<span class="tok-f">describe</span> <span class="tok-s">"qq"</span>                <span class="tok-p">→</span> stream_out · max_sessions=<span class="tok-n">3</span>
<span class="tok-f">call</span> <span class="tok-s">"qq"</span>.<span class="tok-k">playlist_play</span>        <span class="tok-p">→</span> playback=playing
<span class="tok-f">call</span> <span class="tok-s">"speaker-01"</span>.<span class="tok-k">stream.join</span>   <span class="tok-p">→</span> audio/L16 · 48000Hz · 2ch
<span class="tok-f">call</span> <span class="tok-s">"speaker-02"</span>.<span class="tok-k">stream.join</span>    <span class="tok-p">→</span> audio/L16 · 48000Hz · 2ch

<span class="tok-c"># Two streams live, cross-brand, in sync — media bytes never touch the model</span></pre>
</div>
</div>
</div>
</section>

<section class="section">
<div class="section__head">
<p class="section__kicker">The Problem</p>

## Three gates stand between AGI and the physical world

<p>They share one root cause: <b>no common language between devices and agents</b>. Without a lingua franca, readiness is impossible.</p>
</div>
<div class="grid3">
<div class="tile">
<p class="tile__num">01 / PERCEPTION</p>
<div class="tile__title">Perception gap · can't read</div>
<p class="tile__desc">Device state and sensor readings are scattered across proprietary formats. No unified self-description exists for agents.</p>
</div>
<div class="tile">
<p class="tile__num">02 / ACTUATION</p>
<div class="tile__title">Actuation gap · can't act</div>
<p class="tile__desc">AGI can plan and decide, yet cannot act in the physical world: Bluetooth, Wi-Fi, IR each speak their own dialect — no unified, agent-facing protocol for hardware.</p>
</div>
<div class="tile">
<p class="tile__num">03 / TRUST</p>
<div class="tile__title">Trust gap · can't delegate</div>
<p class="tile__desc">How is it authorized, where the boundary lies, whether it operates per procedure, whether it leaves a trail — no shared grammar to write it down, only vendor promises.</p>
</div>
</div>
</section>

<section class="section--subtle">
<div class="section__inner section--tight">
<div class="section__head">
<p class="section__kicker">Core Breakthrough</p>

## Natural-Language Orchestration by Agents

<p>
        Existing smart devices make <b>you speak their language</b> — their coverage equals the union of pre-built skills.<br>
        BMAHS makes <b>them speak yours</b> — coverage equals any combination of declared capabilities.
</p>
</div>
<div class="table-wrap">
<table>
<thead>
<tr><th>Dimension</th><th>Existing smart devices (Mi Home / HomeKit / Xiaoai / Alexa)</th><th>BMAHS devices</th></tr>
</thead>
<tbody>
<tr><td>Capability source</td><td>Vendor-built skills / scenes</td><td>Self-declared capability lists, <b>read at runtime</b></td></tr>
<tr><td>Control style</td><td>Fixed voice commands + preset IF-THEN rules</td><td>Natural-language intent, decomposed on the fly</td></tr>
<tr><td>Coverage</td><td>= union of built commands</td><td>= <b>any combination of capabilities</b></td></tr>
<tr><td>Cross-brand</td><td>Closed per ecosystem</td><td>Brand-agnostic; gateway translation makes them interoperate</td></tr>
<tr><td>New devices</td><td>Reconfiguration, vendor adaptation</td><td>Found on power-up; join as soon as capabilities are ready</td></tr>
<tr><td><b>Who orchestrates</b></td><td><b>Vendor</b> (dev time) + <b>user</b> (setup time)</td><td><b>The agent</b> (runtime)</td></tr>
</tbody>
</table>
</div>
<p style="margin:0;font-size:15px;color:var(--text-soft)">
<b>In one sentence</b>: control shifts from "preset" to "orchestrated" — instead of enumerating every possibility in advance, the agent composes on demand.
</p>
</div>
</section>

<section class="section">
<div class="section__head">
<p class="section__kicker">Readiness Stack</p>

## All three layers before you hand AGI the house key

<p>Readiness is the acceptance test of orchestration. Miss one layer, and orchestration either can't happen or shouldn't be trusted.</p>
</div>

<div class="figure" style="background:transparent;border:0;padding:0">
<svg viewBox="0 0 1040 208" role="img" aria-label="Relationship between the readiness stack and natural-language orchestration">
<defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<text class="dg-mk" x="0" y="16">READY STACK</text>
<text class="dg-mk" x="620" y="16">RESULT</text>

<rect class="dg-panel" x="0" y="30" width="1002" height="140" rx="12" style="fill:var(--bg-subtle)"/>
<text class="dg-m" x="20" y="52">All three are required — semantics alone is a readable but immovable manual</text>

<rect class="dg-agent" x="24" y="66" width="212" height="84" rx="10"/>
<text class="dg-l" x="42" y="92">L1 Semantic ready</text>
<text class="dg-s" x="42" y="110">Understandable · no drivers</text>
<text class="dg-m" x="42" y="130">id · type · service · summary · constraint</text>

<line class="dg-line" x1="244" y1="108" x2="272" y2="108" marker-end="url(#ah)"/>

<rect class="dg-agent" x="280" y="66" width="212" height="84" rx="10"/>
<text class="dg-l" x="298" y="92">L2 Action ready</text>
<text class="dg-s" x="298" y="110">Controllable · order from menu</text>
<text class="dg-m" x="298" y="130">operations · endpoints</text>

<line class="dg-line" x1="500" y1="108" x2="528" y2="108" marker-end="url(#ah)"/>

<rect class="dg-agent" x="536" y="66" width="212" height="84" rx="10"/>
<text class="dg-l" x="554" y="92">L3 Trust ready</text>
<text class="dg-s" x="554" y="110">Delegable · bounded, revocable</text>
<text class="dg-m" x="554" y="130">security · occupancy · release</text>

<line class="dg-line--accent" x1="756" y1="108" x2="788" y2="108" marker-end="url(#aha)"/>

<rect class="dg-proto" x="796" y="66" width="222" height="84" rx="10"/>
<text class="dg-l-inv" x="816" y="92">NL orchestration</text>
<text class="dg-s-inv" x="816" y="110">Value emerges · one sentence</text>
<text class="dg-m-inv" x="816" y="130">Generated at runtime, not preset</text>

<text class="dg-m" x="24" y="192">Premise: speak the common language first</text>
<text class="dg-m" x="796" y="192">Result: capability combos &gt; built commands</text>
</svg>
<p class="figure__cap">Fig. 1 · The readiness stack and the orchestration it enables</p>
</div>

<div class="grid3" style="margin-top:24px">
<div class="tile">
<div class="tile__title">L1 Semantic ready · understood</div>
<p class="tile__desc">The device hands over a business card on power-up: <code>id / type / service / summary / constraint</code>. No per-model documentation to memorize.</p>
<p style="margin:10px 0 0"><span class="badge badge--accent">Metaphor: a business card</span></p>
</div>
<div class="tile">
<div class="tile__title">L2 Action ready · controllable</div>
<p class="tile__desc"><code>operations</code> is the remote's button list, <code>endpoints</code> the media ports. Nothing off-list is ever invoked.</p>
<p style="margin:10px 0 0"><span class="badge badge--accent">Metaphor: a remote control</span></p>
</div>
<div class="tile">
<div class="tile__title">L3 Trust ready · delegable</div>
<p class="tile__desc"><code>security</code> (allow / deny / confirm) + occupancy leases + release-when-done. Safety lives in the protocol, not in promises.</p>
<p style="margin:10px 0 0"><span class="badge badge--accent">Metaphor: a written promise</span></p>
</div>
</div>
</section>

<section class="section--subtle">
<div class="section__inner section--tight">
<div class="section__head">
<p class="section__kicker">Protocol Capabilities</p>

## Six mechanisms that make a common language trustworthy

</div>
<div class="grid3">
<a class="card" href="/en/docs/self-description.html">
<div class="card__title">Self-Description <span class="card__tag">L1</span></div>
<div class="card__desc">Introduces itself on power-up; agents read the description instead of matching models.</div>
</a>
<a class="card" href="/en/docs/operations.html">
<div class="card__title">Capabilities & Security <span class="card__tag">L2 · L3</span></div>
<div class="card__desc">The operations list plus the three-color security boundary (allow / deny / confirm).</div>
</a>
<a class="card" href="/en/docs/occupancy.html">
<div class="card__title">Occupancy & Leases <span class="card__tag">L3</span></div>
<div class="card__desc">exclusive with lease tokens, or last-wins — resolving contention for control.</div>
</a>
<a class="card" href="/en/docs/streaming.html">
<div class="card__title">Data Streams: Push & Pull <span class="card__tag">L2</span></div>
<div class="card__desc">The stream_out / stream_in endpoint model; stream.join and stream.accept.</div>
</a>
<a class="card" href="/en/docs/discovery.html">
<div class="card__title">Discovery <span class="card__tag">L1</span></div>
<div class="card__desc">Multicast query + announce + Bonjour; devices burst 3 announces at power-up (~0.3 s apart) and are listed within seconds, zero configuration.</div>
</a>
<a class="card" href="/en/docs/orchestration.html">
<div class="card__title">NL Orchestration <span class="card__tag">Breakthrough</span></div>
<div class="card__desc">What the above enables: one sentence decomposed into a cross-device task with error handling.</div>
</a>
</div>
</div>
</section>

<section class="section">
<div class="section__head">
<p class="section__kicker">Quickstart</p>

## Connect, read, speak

<p>BMAHS is an open protocol: discovery over UDP multicast, control over TCP + JSON-RPC 2.0. Agents connect through any protocol client; for users, it's natural language all the way.</p>
</div>

<div class="cols2" style="align-items:start">
<ol class="steps">
<li><div class="steps__title">Discover (query)</div><div class="card__desc">One multicast query; every device answers with an announce carrying its identity and occupancy.</div></li>
<li><div class="steps__title">Connect (control TCP)</div><div class="card__desc">Connect to <code>control</code>; a <code>hello</code> notification arrives immediately — the full self-description inside.</div></li>
<li><div class="steps__title">Read (describe)</div><div class="card__desc">Fetch the authoritative operations list and security boundary of each device.</div></li>
<li><div class="steps__title">Say one sentence</div><div class="card__desc">The agent decomposes intent, checks boundaries, composes and executes the action sequence.</div></li>
<li><div class="steps__title">Release</div><div class="card__desc">exclusive devices: call <code>release</code> when done (60-second lease by default) — basic etiquette for agents.</div></li>
</ol>

<div class="code" style="margin:0">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Terminal · what the protocol sees</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-c">// 1. Discovery: UDP query → announce (excerpt)</span>
<span class="tok-p">{</span><span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"query"</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"want"</span><span class="tok-p">:</span><span class="tok-s">"*"</span><span class="tok-p">}</span>
<span class="tok-c">// device reply (excerpt):</span>
<span class="tok-p">{</span><span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"announce"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span> <span class="tok-c">/* … */</span> <span class="tok-p">}</span>

<span class="tok-c">// 2. First line after connecting is the hello notification</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"hello"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">,</span> <span class="tok-c">/* … */</span> <span class="tok-p">}}</span>

<span class="tok-c">// 3. Read + call (JSON-RPC, params must be an object)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"describe"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span> <span class="tok-p">}</span> <span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"volume"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"level"</span><span class="tok-p">:</span><span class="tok-n">35</span><span class="tok-p">}}</span>

<span class="tok-c">// 4. Exclusive devices: occupy first, release after</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>
<span class="tok-c">// reply result: token=… (lease until=…)</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span><span class="tok-n">1791000000</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">}}</span></pre>
</div>
</div>

<div class="callout callout--info" style="margin-top:26px">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">Encoding discipline</div>
<code>params</code> must be an <b>object</b> (named parameters) whose names align with
<code>operations.args[].name</code>; positional arrays and batch calls are forbidden.
      Malformed <b>envelopes</b> (the JSON-RPC outer structure: <code>jsonrpc</code> / <code>id</code> / <code>method</code> / <code>params</code>) get <code>-32600</code> — strict validation surfaces errors early instead of failing halfway through the link.
</div>
</div>
</section>

<section class="section--subtle">
<div class="section__inner section--tight">
<div class="section__head">
<p class="section__kicker">Ecosystem & Certification</p>

## AGI-Ready badge: the implicit standard is one question — can this device be orchestrated?

</div>
<div class="grid3">
<div class="tile">
<p class="tile__num">①</p>
<div class="tile__title">BMAHS Compatible</div>
<p class="tile__desc">Discoverable and describable (L1). For legacy devices — via gateway translation.</p>
</div>
<div class="tile tile--accent">
<p class="tile__num">②</p>
<div class="tile__title">BMAHS Ready</div>
<p class="tile__desc">L1 + L2 + L3, verified by the open self-test suite. For new hardware and vendor products.</p>
</div>
<div class="tile">
<p class="tile__num">③</p>
<div class="tile__title">BMAHS Ready+</div>
<p class="tile__desc">Adds multi-device concurrency, streaming, audit logs — i.e. complex orchestration. For flagship and industry devices.</p>
</div>
</div>

<div class="stats" style="margin-top:34px">
<div class="stat"><div class="stat__num">5<span></span></div><div class="stat__label">Universal methods (describe / info / who / occupy / release)</div></div>
<div class="stat"><div class="stat__num">3<span></span></div><div class="stat__label">Layers: UDP discovery · JSON-RPC control · binary data stream</div></div>
<div class="stat"><div class="stat__num">5<span>s</span></div><div class="stat__label">Steady-state announce interval (a floor — you may only lengthen it)</div></div>
<div class="stat"><div class="stat__num">0<span></span></div><div class="stat__label">Lines of user code — natural language throughout</div></div>
</div>
</div>
</section>

<section class="section">
<div class="section__head" style="max-width:34em">

## Start with one page

<p>Understand the position first, then run your first call.</p>
</div>
<div class="cards cards--3">
<a class="card" href="/en/docs/intro.html">
<div class="card__title">① Understand the position</div>
<div class="card__desc">What BMAHS is, what it isn't, and its three-layer architecture.</div>
</a>
<a class="card" href="/en/docs/orchestration.html">
<div class="card__title">② Grasp the breakthrough</div>
<div class="card__desc">Mechanism, four freedoms and the four clarifications of orchestration.</div>
</a>
<a class="card" href="/en/docs/tools.html">
<div class="card__title">③ Make your first call</div>
<div class="card__desc">JSON-RPC envelope, universal methods and error-code mapping.</div>
</a>
</div>
</section>
