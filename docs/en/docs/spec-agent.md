---
title: "Agent & Client Obligations"
description: "Twelve obligations every BMAHS agent / protocol client implementation must follow."
eyebrow: "Specification · Chapter 12"
---

<p class="eyebrow">Specification · Chapter 12</p>

# Agent & Client Obligations

<p>An agent runtime / protocol client implementing BMAHS <b>MUST</b> comply with:</p>

<ol>
<li>After receiving the <code>hello</code> notification, register only <code>operations</code> as the available methods; <b>MUST</b> hand <code>name</code> / <code>summary</code> / <code>constraint</code> / each <code>description</code> / <code>result</code> / <code>security.notes</code> to the model. Parameter schemas <b>MUST</b> come from <code>args</code>. Treat <code>security.deny</code> / <code>confirm</code> / <code>occupancy</code> as hard constraints.</li>
<li>Prefer <code>name</code> + <code>summary</code> when selecting from the discovery list.</li>
<li><b>Read <code>security.occupancy</code> first</b> (and the announce summary):<ul>
<li><code>last-wins</code>: send business method calls directly, with <code>agent</code> in <code>params</code>; do <b>not</b> go occupy-token-release; do not refuse control just because the list lacks <code>occupy</code>. In multi-step tasks, call <code>who</code> before each step; stop when <code>holder</code> changes.</li>
<li><code>exclusive</code>: first check whether it is already occupied; <code>occupy</code> before use and save the <code>token</code>; subsequent control and <code>release</code> carry the same <code>token</code> and <code>agent</code>; on task end (including failure/cancellation) <b>MUST</b> <code>release</code>. The default 60 s lease is the backstop; only a stuck <code>ttl=9999</code> requires restarting the device.</li>
</ul></li>
<li>A gateway using devices southbound is an ordinary <code>agent</code>, <b>following the same protocol</b>; it MUST NOT open a privileged control port: for <code>last-wins</code> it <b>MUST NOT</b> auto-occupy; for <code>exclusive</code> it may occupy on the agent's behalf, but the token stays in the runtime and <b>MUST NOT</b> be handed to the model.</li>
<li>On receiving <code>goodbye</code>, or when the removal deadline passes without an <code>announce</code> update, remove the <code>id</code> from the list and drop the corresponding token.</li>
<li>For an unknown <code>service</code>, only display (<code>describe</code> / <code>info</code> / <code>who</code>); <b>MUST NOT</b> guess undeclared <code>method</code>s.</li>
<li><b>MUST NOT</b> write <code>token</code> or stream URIs into multicast, log aggregation, or telemetry leaving the local machine; <b>MUST NOT</b> put them in the model context.</li>
<li>Without <code>ui</code>, <b>MUST NOT</b> guess a screen channel; with <code>ui</code>, receive frames only per Chapter 13; <code>tap</code> / <code>swipe</code> map onto the <b>current frame's</b> logical resolution.</li>
<li>Without <code>endpoints</code>, <b>MUST NOT</b> guess a media channel; with them, the <b>protocol client</b> interconnects the two endpoints per Chapter 14: prefer <code>stream.join</code> (Sink self-connects), otherwise the client relays. <b>The model only decides &quot;who connects to whom&quot;; it does not move bytes.</b> Two real BMAHS ends need not go through a gateway product's <code>route</code>; when one end is a gateway virtual device, issue the same interconnection to that virtual device's <code>control</code>.</li>
<li><b>MUST NOT</b> require the agent to understand private protocols (Bluetooth / GATT, etc.) behind virtual devices.</li>
<li><b>MUST NOT</b> use JSON-RPC batch arrays (§8.6); the response correlated to a request by <code>id</code> must match on the same TCP connection.</li>
<li>On receiving an error response, <b>SHOULD</b> determine the error class and retry strategy from <code>error.data.bmahs_code</code> (errors with <code>retryable=false</code> must not be auto-retried).</li>
</ol>
