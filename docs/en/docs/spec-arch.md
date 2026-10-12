---
title: "Protocol Architecture"
description: "Layered model (discovery / usage / data stream layer), roles, interaction overview, and onboarding new hardware types."
eyebrow: "Specification · Chapter 05"
---

<p class="eyebrow">Specification · Chapter 05</p>

# Protocol Architecture


### 5.1 Layered model

<div class="figure">
<svg viewBox="0 0 680 340" role="img" aria-label="BMAHS layered model: discovery, control, and the two optional data stream layer profiles">
<rect class="dg-agent" x="20" y="10" width="640" height="62" rx="10"/>
<rect x="36" y="24" width="26" height="26" rx="7" style="fill:var(--accent)"/>
<text x="49" y="41" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:#fff">01</text>
<text class="dg-t" x="74" y="38">Discovery</text>
<text class="dg-m" x="74" y="56">identity broadcast</text>
<rect class="dg-chip" x="150" y="24" width="204" height="24" rx="6"/>
<text class="dg-m" x="158" y="40">UDP multicast + Bonjour (not RPC)</text>
<text class="dg-m" x="150" y="62">plain JSON, one object per datagram, ≤1400 B</text>
<text class="dg-m" x="654" y="40" text-anchor="end">Ch. 6, 15</text>

<line class="dg-tick" x1="340" y1="74" x2="340" y2="82"/>

<rect class="dg-proto" x="20" y="84" width="640" height="62" rx="10"/>
<rect x="36" y="98" width="26" height="26" rx="7" style="fill:rgba(255,255,255,.92)"/>
<text x="49" y="115" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px;font-weight:700;fill:var(--accent-text)">02</text>
<text class="dg-t-inv" x="74" y="108">Control</text>
<text class="dg-m-inv" x="74" y="126">requests &amp; responses</text>
<rect x="150" y="98" width="238" height="24" rx="6" style="fill:rgba(255,255,255,.14);stroke:rgba(255,255,255,.38)"/>
<text class="dg-m-inv" x="158" y="114">JSON-RPC 2.0 over TCP (line-delimited)</text>
<text class="dg-m-inv" x="150" y="136">occupancy + operations constraints span this layer and the data stream layer</text>
<text class="dg-m-inv" x="654" y="110" text-anchor="end">Ch. 8, 9, 16</text>
<text class="dg-m-inv" x="654" y="126" text-anchor="end">Ch. 10, 11</text>

<line class="dg-tick" x1="340" y1="148" x2="340" y2="156"/>

<rect x="20" y="158" width="640" height="166" rx="12" style="fill:none;stroke:var(--border-strong);stroke-dasharray:5 4"/>
<text class="dg-t" x="34" y="180">Data stream layer · binary frames</text>
<text class="dg-s" x="34" y="196">never JSON-RPC · optional profiles, declared by the device</text>

<rect class="dg-dev" x="34" y="204" width="612" height="52" rx="8"/>
<text class="dg-l" x="50" y="234">UI interface (optional)</text>
<rect class="dg-chip" x="210" y="214" width="176" height="24" rx="6"/>
<text class="dg-m" x="218" y="230">exclusive + token handshake</text>
<rect class="dg-chip" x="394" y="214" width="90" height="24" rx="6"/>
<text class="dg-m" x="402" y="230">JPEG frames</text>
<text class="dg-m" x="654" y="234" text-anchor="end">Ch. 13</text>

<rect class="dg-dev" x="34" y="264" width="612" height="52" rx="8"/>
<text class="dg-l" x="50" y="294">Endpoint &amp; Data Stream (optional)</text>
<rect class="dg-chip" x="248" y="274" width="200" height="24" rx="6"/>
<text class="dg-m" x="256" y="290">sessions orthogonal to occupancy</text>
<rect class="dg-chip" x="456" y="274" width="128" height="24" rx="6"/>
<text class="dg-m" x="464" y="290">join / relay pairing</text>
<text class="dg-m" x="654" y="294" text-anchor="end">Ch. 14</text>
</svg>
<p class="figure__cap">Fig. 5-1 · Layered model: discovery multicasts identity, control carries commands; the data stream layer offers two optional profiles</p>
</div>

### 5.2 Roles and data stream layer boundary

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Role</th><th>Responsibility</th><th>Constraint</th></tr></thead>
<tbody>
<tr><td>BMAHS device</td><td>Announce itself, respond to discovery, send the <code>hello</code> notification, accept JSON-RPC control per occupancy, provide UI/endpoint streams per its declarations</td><td>Virtual devices and real devices are isomorphic</td></tr>
<tr><td>Agent</td><td>Initiates discovery, selects devices, issues control method calls</td><td><b>MUST NOT</b> touch the data stream layer (MUST NOT handle PCM, frames, or stream URIs)</td></tr>
<tr><td>Protocol client</td><td>Executes JSON-RPC call sequences; when interconnecting two endpoints, copies bytes or drives the Sink to self-connect</td><td>Uses the same protocol rules as the agent</td></tr>
<tr><td>Forwarder</td><td>Any client capable of completing the §14.3 interconnection procedure</td><td>Not a special device type; no registration required</td></tr>
</tbody>
</table>
</div>

### 5.3 Interaction overview

<div class="figure">
<svg viewBox="0 0 680 366" role="img" aria-label="BMAHS interaction overview: discovery, connection, hello notification, bidirectional JSON-RPC, and the optional data stream layer">
<defs>
<marker id="sa1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--border-strong)"/>
</marker>
<marker id="saA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--accent)"/>
</marker>
<marker id="saG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" style="fill:var(--green)"/>
</marker>
</defs>

<rect class="dg-dev" x="20" y="16" width="170" height="44" rx="10"/>
<text class="dg-t" x="105" y="34" text-anchor="middle">BMAHS device</text>
<text class="dg-s" x="105" y="50" text-anchor="middle">self-describes · serves streams</text>

<rect class="dg-agent" x="490" y="16" width="170" height="44" rx="10"/>
<text class="dg-t" x="575" y="34" text-anchor="middle">Agent / protocol client</text>
<text class="dg-s" x="575" y="50" text-anchor="middle">discovers · issues control</text>

<line x1="105" y1="60" x2="105" y2="344" style="stroke:var(--border-strong);stroke-dasharray:4 4;fill:none"/>
<line x1="575" y1="60" x2="575" y2="344" style="stroke:var(--border-strong);stroke-dasharray:4 4;fill:none"/>

<text class="dg-m" x="340" y="84" text-anchor="middle">announce / goodbye — discovery multicast (UDP)</text>
<line class="dg-line" x1="109" y1="92" x2="571" y2="92" marker-end="url(#sa1)"/>

<text class="dg-m" x="340" y="114" text-anchor="middle">query — on demand (UDP)</text>
<line class="dg-line" x1="571" y1="122" x2="109" y2="122" marker-end="url(#sa1)"/>

<text class="dg-m" x="340" y="154" text-anchor="middle">open the control connection (tcp://IP:PORT)</text>
<line class="dg-line--accent" x1="571" y1="162" x2="109" y2="162" marker-end="url(#saA)"/>

<text class="dg-m" x="340" y="184" text-anchor="middle">device pushes hello immediately (JSON-RPC notification)</text>
<line class="dg-line--accent" x1="109" y1="192" x2="571" y2="192" marker-end="url(#saA)"/>

<text class="dg-m" x="340" y="220" text-anchor="middle">JSON-RPC 2.0, both ways · line-delimited: request / response / error</text>
<line class="dg-line--accent" x1="109" y1="228" x2="571" y2="228" marker-start="url(#saA)" marker-end="url(#saA)"/>

<rect x="54" y="250" width="572" height="96" rx="10" style="fill:none;stroke:var(--border-strong);stroke-dasharray:5 4"/>
<text class="dg-mk" x="70" y="266">optional · data stream layer (declared in hello)</text>

<text class="dg-m" x="340" y="282" text-anchor="middle">ui declared: separate UI stream (9531) — frames never via JSON-RPC</text>
<line x1="109" y1="290" x2="571" y2="290" style="stroke:var(--green);stroke-width:1.6;fill:none" marker-end="url(#saG)"/>

<text class="dg-m" x="340" y="314" text-anchor="middle">endpoints declared: pair per Ch. 14 — media never via JSON-RPC</text>
<line x1="109" y1="322" x2="571" y2="322" style="stroke:var(--green);stroke-width:1.6;fill:none" marker-start="url(#saG)" marker-end="url(#saG)"/>
</svg>
<p class="figure__cap">Fig. 5-2 · Interaction overview: discover, connect, hello first, then bidirectional RPC; data streams open only if declared</p>
</div>

### 5.4 Onboarding requirements for new hardware types

<p>When onboarding new hardware to this protocol, it <b>SHOULD</b>:</p>

<ol>
<li>choose a lowercase English <code>type</code> (e.g. <code>light</code>, <code>display</code>, <code>lock</code>, <code>phone</code>);</li>
<li>define <code>service = {type}/{major-version}</code>;</li>
<li>provide a complete <code>operations</code> (operation list), <code>constraint</code> (usage constraints, §10.6) and <code>security</code> (security boundary, including <code>occupancy</code>);</li>
<li>summarize via <code>capabilities</code> / <code>security</code> in <code>announce</code>;</li>
<li>implement announcement and <code>control</code> per Chapters 15 and 16;</li>
<li>if it has an operable display: <code>occupancy</code> <b>MUST</b> be <code>exclusive</code>, <code>capabilities</code> MUST include <code>ui</code> (plus <code>tap</code> / <code>swipe</code> if touch is available), and Chapter 13 MUST be implemented;</li>
<li>if it can produce/consume media: declare <code>endpoints</code> in the <code>hello</code> notification parameters and implement Chapter 14.</li>
</ol>

<p>New hardware <b>MUST NOT</b> change the discovery multicast address and port.</p>
