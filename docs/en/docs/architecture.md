---
title: "Architecture & Ecosystem"
description: "BMAHS's three-layer architecture (discovery / control / data stream layer), four roles, and the boundary that agents never carry bytes across."
eyebrow: "Core Concepts / Architecture"
---

<p class="eyebrow">Core Concepts / Architecture</p>

# Architecture & Ecosystem

<p class="lead">
  BMAHS is an <b>open protocol specification</b>: discovery over UDP multicast + Bonjour,
  control over TCP with JSON-RPC 2.0, data over binary UI and data streams.
  Three layers, each with its own job — <b>the agent decides, it never carries bytes</b>.
</p>

## Three-layer architecture

<div class="figure">
<svg viewBox="0 0 680 486" role="img" aria-label="BMAHS three-layer architecture: discovery, control and data stream layer, with role boundaries">
<defs>
<marker id="ar1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="arA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<rect class="dg-agent" x="20" y="10" width="296" height="54" rx="10"/>
<text class="dg-t" x="38" y="32">Agent (LLM)</text>
<text class="dg-s" x="38" y="51">decides only · never carries bytes</text>

<rect class="dg-gray" x="364" y="10" width="296" height="54" rx="10"/>
<text class="dg-t" x="382" y="32">Protocol client / forwarder</text>
<text class="dg-s" x="382" y="51">executes calls · may carry bytes</text>

<line class="dg-line--accent" x1="320" y1="37" x2="358" y2="37" marker-end="url(#arA)"/>

<line class="dg-line" x1="340" y1="66" x2="340" y2="86" marker-start="url(#ar1)" marker-end="url(#ar1)"/>
<text class="dg-mk" x="352" y="80">discovery · control</text>

<rect class="dg-agent" x="20" y="88" width="640" height="92" rx="10"/>
<rect x="36" y="102" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="119" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">01</text>
<text class="dg-t" x="74" y="117">Discovery</text>
<text class="dg-m" x="74" y="135">identity multicast</text>
<rect class="dg-chip" x="170" y="102" width="140" height="24" rx="6"/>
<text class="dg-m" x="178" y="118">UDP multicast + Bonjour</text>
<rect class="dg-chip" x="318" y="102" width="150" height="24" rx="6"/>
<text class="dg-m" x="326" y="118">plain JSON ≤ 1400 B</text>
<rect class="dg-chip" x="482" y="102" width="162" height="24" rx="12"/>
<text class="dg-m" x="563" y="118" text-anchor="middle">multicast · no RPC</text>
<rect class="dg-chip" x="170" y="132" width="170" height="24" rx="6"/>
<text class="dg-m" x="178" y="148">announce / query / goodbye</text>
<rect class="dg-chip" x="348" y="132" width="110" height="24" rx="6"/>
<text class="dg-m" x="356" y="148">1 obj per datagram</text>
<text class="dg-m" x="170" y="168">no token · no stream URI · no account · no frames</text>

<line class="dg-tick" x1="340" y1="178" x2="340" y2="188"/>

<rect class="dg-proto" x="20" y="186" width="640" height="92" rx="10"/>
<rect x="36" y="200" width="26" height="26" rx="7" style="fill:rgba(255,255,255,.92)"/>
<text x="49" y="217" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:var(--accent-text)">02</text>
<text class="dg-t-inv" x="74" y="215">Control</text>
<text class="dg-m-inv" x="74" y="233">requests &amp; responses</text>
<rect x="170" y="200" width="136" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="178" y="216">TCP · default 9527</text>
<rect x="314" y="200" width="88" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="322" y="216">JSON-RPC 2.0</text>
<rect x="482" y="200" width="162" height="24" rx="12" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="563" y="216" text-anchor="middle">request / response</text>
<rect x="170" y="230" width="186" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="178" y="246">hello · describe · info / who</text>
<rect x="364" y="230" width="110" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="372" y="246">occupy / release</text>
<text class="dg-m-inv" x="170" y="266">occupancy + operations constraints span control &amp; the data stream layer</text>

<line class="dg-tick" x1="340" y1="276" x2="340" y2="286"/>

<rect class="dg-dev" x="20" y="284" width="640" height="92" rx="10"/>
<rect x="36" y="298" width="26" height="26" rx="7" style="fill:var(--green)"/>
<text x="49" y="315" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">03</text>
<text class="dg-t" x="74" y="313">Data stream</text>
<text class="dg-m" x="74" y="331">frames &amp; media</text>
<rect class="dg-chip" x="170" y="298" width="140" height="24" rx="6"/>
<text class="dg-m" x="178" y="314">UI stream 9531 · JPEG</text>
<rect class="dg-chip" x="318" y="298" width="92" height="24" rx="6"/>
<text class="dg-m" x="326" y="314">binary frames</text>
<rect class="dg-chip" x="482" y="298" width="162" height="24" rx="12"/>
<text class="dg-m" x="563" y="314" text-anchor="middle">one-way stream · binary</text>
<rect class="dg-chip" x="170" y="328" width="158" height="24" rx="6"/>
<text class="dg-m" x="178" y="344">data stream 9532 · format</text>
<text class="dg-m" x="170" y="364">UI: exclusive + token handshake · Endpoint: sessions orthogonal to occupancy</text>

<line class="dg-line" x1="340" y1="378" x2="340" y2="398" marker-start="url(#ar1)" marker-end="url(#ar1)"/>
<text class="dg-mk" x="352" y="392">UI · data streams</text>

<rect class="dg-dev" x="20" y="400" width="640" height="54" rx="10"/>
<text class="dg-t" x="38" y="422">BMAHS device</text>
<text class="dg-s" x="38" y="440">native or via gateway · self-describing · control per occupancy</text>
<rect class="dg-chip" x="482" y="414" width="162" height="24" rx="12"/>
<text class="dg-m" x="563" y="430" text-anchor="middle">virtual = physical</text>

<text class="dg-m" x="20" y="474">Agent walks discovery &amp; control only — data bytes flow client ↔ device directly; PCM never reaches the model.</text>
</svg>
<p class="figure__cap">Fig. 1 · Three-layer architecture: discovery multicasts identity, control carries commands, data carries only frames and media — the agent decides, it never carries bytes</p>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>Layer</th><th>Carrier</th><th>Encoding</th><th>Never allowed here</th></tr></thead>
<tbody>
<tr><td><b>Discovery</b></td><td>UDP multicast (239.255.42.42:5354 / ff02::4242) + Bonjour <code>_bmahs._tcp</code></td><td>Plain JSON / TXT</td><td><code>token</code>, stream URIs, accounts, frames</td></tr>
<tr><td><b>Control</b></td><td>TCP (default 9527)</td><td>JSON-RPC 2.0, one message per line</td><td>Full-frame images, continuous media payloads</td></tr>
<tr><td style="white-space:nowrap"><b>Data</b></td><td>UI stream (9531) / data stream (9532)</td><td>Binary frames / <code>format</code> payloads</td><td>JSON envelopes</td></tr>
</tbody>
</table>
</div>

## Four roles and the data-stream-layer boundary

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Role</th><th>Responsibility</th><th>Constraint</th></tr></thead>
<tbody>
<tr><td><b>BMAHS device</b></td><td>Announces itself, answers discovery, sends <code>hello</code>, accepts control per occupancy, provides UI / endpoint streams as declared</td><td>Virtual and physical devices are <b>isomorphic</b></td></tr>
<tr><td><b>Agent</b></td><td>Initiates discovery, selects devices, issues control calls</td><td><b>Must not carry the data stream layer</b>: no PCM, frames or stream URIs in its hands</td></tr>
<tr><td><b>Protocol client</b></td><td>Executes JSON-RPC call sequences; copies bytes or drives Sink self-connect when pairing endpoints</td><td>Uses <b>the same</b> protocol rules as the agent</td></tr>
<tr><td><b>Forwarder</b></td><td>Any client that can execute the endpoint pairing procedure</td><td>Not a special device type; no registration</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">The model decides "who connects to whom" — it never moves bytes</div>
    This is BMAHS's most important data-stream-layer boundary: orchestration is <b>decision</b>, transport is <b>execution</b>.
    Wiring a music source to two speakers means issuing control instructions like <code>stream.join</code>;
    the bytes flow through the protocol client or the Sink device itself — PCM never appears in the model's context.
</div>
</div>

## Where the gateway sits: southbound is also just an agent

<p>
  A gateway translates legacy hardware (Bluetooth, AirPlay, IR …) into unified BMAHS self-descriptions.
  The key point: when driving southbound devices, the gateway follows <b>the same protocol rules</b> — no privileged channel.
  It must not auto-occupy <code>last-wins</code> devices; for <code>exclusive</code> devices it may occupy on behalf of the user,
  but the token stays in the runtime and <b>never reaches the model</b>.
</p>

<div class="figure">
<svg viewBox="0 0 680 404" role="img" aria-label="Three-tier deployment: agent tier, BMAHS device tier (native devices and gateway on the same tier), legacy device tier (Bluetooth / Wi-Fi / other legacy devices)">
<defs>
<marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="aA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
</defs>

<rect class="dg-agent" x="20" y="10" width="640" height="54" rx="10"/>
<rect x="36" y="24" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="41" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">01</text>
<text class="dg-t" x="74" y="34">Agent tier</text>
<text class="dg-s" x="74" y="52">any protocol client · discovers, selects · issues control</text>
<rect class="dg-chip" x="458" y="24" width="186" height="24" rx="12"/>
<text class="dg-m" x="551" y="40" text-anchor="middle">same rules · no privilege</text>

<line class="dg-line--accent" x1="340" y1="66" x2="340" y2="90" marker-start="url(#aA)" marker-end="url(#aA)"/>
<text class="dg-mk" x="352" y="82">BMAHS protocol · discovery / control / data stream layer</text>

<rect x="20" y="96" width="640" height="124" rx="12" style="fill:var(--bg);stroke:var(--border-strong);stroke-width:1.2"/>
<rect x="36" y="110" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="127" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">02</text>
<text class="dg-t" x="74" y="124">BMAHS device tier</text>
<text class="dg-s" x="74" y="142">native devices and gateway are isomorphic — one BMAHS self-description</text>

<rect class="dg-dev" x="34" y="152" width="296" height="56" rx="8"/>
<text class="dg-l" x="50" y="174">Native BMAHS device</text>
<text class="dg-m" x="50" y="192">speaker/1 · self-describes · occupancy-aware</text>

<rect class="dg-proto" x="346" y="152" width="300" height="56" rx="8"/>
<text class="dg-l-inv" x="362" y="174">BMAHS gateway</text>
<rect x="456" y="160" width="174" height="24" rx="12" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="543" y="176" text-anchor="middle">south side: just an agent</text>
<text class="dg-m-inv" x="362" y="192">legacy HW → unified BMAHS self-description</text>

<line class="dg-line" x1="496" y1="220" x2="496" y2="244"/>
<line class="dg-line" x1="134" y1="244" x2="546" y2="244"/>
<line class="dg-line" x1="134" y1="244" x2="134" y2="268" marker-end="url(#a3)"/>
<line class="dg-line" x1="340" y1="244" x2="340" y2="268" marker-end="url(#a3)"/>
<line class="dg-line" x1="546" y1="244" x2="546" y2="268" marker-end="url(#a3)"/>
<text class="dg-mk" x="340" y="238" text-anchor="middle">southbound · legacy PHY (Bluetooth / Wi-Fi / IR)</text>

<rect x="20" y="272" width="640" height="96" rx="12" style="fill:var(--bg);stroke:var(--border-strong);stroke-width:1.2"/>
<rect x="36" y="284" width="26" height="26" rx="7" style="fill:var(--green)"/>
<text x="49" y="301" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">03</text>
<text class="dg-t" x="74" y="298">Legacy device tier</text>
<text class="dg-s" x="74" y="316">invisible to the agent · differences absorbed in the gateway</text>

<rect class="dg-dev" x="34" y="324" width="196" height="40" rx="8"/>
<text class="dg-l" x="50" y="341">Legacy Bluetooth speaker</text>
<text class="dg-m" x="50" y="356">Bluetooth · hot-plug, kept</text>

<rect class="dg-dev" x="242" y="324" width="196" height="40" rx="8"/>
<text class="dg-l" x="258" y="341">AirPlay / network speaker</text>
<text class="dg-m" x="258" y="356">Wi-Fi · exposed as speaker/1</text>

<rect class="dg-dev" x="450" y="324" width="196" height="40" rx="8"/>
<text class="dg-l" x="466" y="341">IR / other legacy hardware</text>
<text class="dg-m" x="466" y="356">legacy PHY · in-gateway</text>

<text class="dg-m" x="20" y="392">Native devices speak BMAHS directly; legacy devices stay invisible — differences absorbed in the gateway</text>
</svg>
<p class="figure__cap">Fig. 2 · Three tiers: gateway and native devices share the BMAHS device tier; the legacy tier is invisible to the agent — differences absorbed in the gateway</p>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">Design orientation</div>
    Brand and protocol differences are <b>concentrated inside the gateway</b>; the higher you go, the more uniform it gets.
    The agent always faces one semantics — which is the precondition for cross-brand capability composition.
</div>
</div>

## Ecosystem coordinates

<div class="table-wrap">
<table>
<thead><tr><th>Compared with</th><th>What it solves</th><th>BMAHS's differentiation</th></tr></thead>
<tbody>
<tr><td>Matter / HomeKit</td><td>Device ↔ device interop (control commands)</td><td>Built for <b>agent semantics</b>: NL self-description, operations, protocol-level security, occupancy leases, task orchestration</td></tr>
<tr><td>Vendor ecosystems (Mi Home etc.)</td><td>Single-brand closure</td><td><b>Brand-agnostic</b>; legacy devices join via a gateway</td></tr>
<tr><td>Home Assistant</td><td>Platform software</td><td>BMAHS is a protocol spec, platform-neutral; HA can be one integrator</td></tr>
<tr><td>Voice assistants (Xiaoai / Alexa)</td><td>Matching commands in preset skill sets</td><td><b>Runtime composition from capability lists</b>: coverage = capability combinations, not built commands</td></tr>
<tr><td>"AI-Ready" marketing labels</td><td>Usually "connects to a vendor cloud AI"</td><td><b>BMAHS Ready</b> is self-testable, verifiable, brand-neutral and open</td></tr>
</tbody>
</table>
</div>

## Next steps

<div class="cards">
<a class="card" href="/en/docs/orchestration.html">
<div class="card__title">NL Orchestration ★ →</div>
<div class="card__desc">Where value emerges once the three layers are ready.</div>
</a>
<a class="card" href="/en/docs/self-description.html">
<div class="card__title">Self-Description →</div>
<div class="card__desc">L1: the business card a device hands over on power-up.</div>
</a>
</div>
