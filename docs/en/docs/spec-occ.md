---
title: "Occupancy & State Machine"
description: "The last-wins and exclusive control models, tokens and leases, liveness detection, and going offline."
eyebrow: "Specification · Chapter 11"
---

<p class="eyebrow">Specification · Chapter 11</p>

# Occupancy & State Machine

<p>The device <b>MUST</b> maintain lifecycle and occupancy state in its local process memory; it <b>MUST NOT</b> persist it to disk or any external system. After a state change it <b>SHOULD</b> immediately re-send <code>announce</code> (or send <code>goodbye</code>). Address changes are handled per §6.4; <code>id</code> is unchanged, and an unexpired exclusive <code>token</code> is not invalidated by an IP change.</p>

### 11.1 Online state machine (all devices)

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Diagram</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>  offline ──start announcing──► online ──goodbye / process exit──► offline</pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>State</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>offline</code></td><td>Not on the network or about to exit; sends <code>goodbye</code></td></tr>
<tr><td><code>online</code></td><td>Announcing; discoverable and controllable</td></tr>
</tbody>
</table>
</div>

<p>1.2 <b>deprecates</b> the <code>registered</code> / <code>managed</code> state values.</p>

<p><b>Public state fields</b>:</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Location</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>state</code></td><td>announce / hello / TXT / goodbye</td><td><code>online</code> / <code>offline</code></td></tr>
<tr><td><code>event</code></td><td>SHOULD</td><td>Most recent transition: <code>online</code> / <code>offline</code>; exclusive may additionally use <code>occupy</code> / <code>release</code></td></tr>
<tr><td><code>occupancy</code></td><td>hello / describe MUST; announce SHOULD</td><td>Consistent with <code>security.occupancy</code></td></tr>
<tr><td><code>holder</code></td><td>MUST when a last controller or occupant exists</td><td>last-wins: <code>agent</code> of the last control; exclusive: current occupant</td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td style="white-space:nowrap">MUST</td><td><code>true</code> if and only if: exclusive currently occupied, <b>or</b> an active UI stream / active <code>streams</code> exists</td></tr>
<tr><td><code>until</code> / <code>lease_security</code></td><td>SHOULD while exclusively occupied</td><td>Same as §11.3; last-wins <b>MUST NOT</b> use them to block control</td></tr>
<tr><td><code>agent</code></td><td>SHOULD in control calls</td><td>Stable agent identifier (recommended <code>[a-z0-9-]</code>). Missing on read-only methods must not be rejected; when missing on last-wins control the device <b>SHOULD</b> still execute, recording <code>holder</code> as <code>anonymous</code></td></tr>
<tr><td><code>token</code></td><td><b>TCP only</b>, exclusive only</td><td>Successful occupy and the occupant's subsequent control / <code>release</code> / UI stream handshake</td></tr>
</tbody>
</table>
</div>

<p><b>Normative note</b>: <code>release</code> is a <b>method</b> of exclusive, not a persistent state — after success, <code>state</code> remains <code>online</code>, <code>event=release</code>, and <code>holder</code> is omitted (unless an active stream remains, which only affects <code>busy</code>/<code>streams</code>).</p>

### 11.2 <code>last-wins</code> (last control wins)

<p>Suitable for momentary-state control such as home lamps, switches, and volume/song change on most speakers. Protocol clients (including a gateway's southbound side) and other agents follow the <b>same</b> rules; there is no privileged channel.</p>

<p><b>Normative requirements</b>:</p>

<ol>
<li><code>occupy</code> is <b>not required</b>; no occupancy <code>token</code> is <b>issued or validated</b>.</li>
<li>Any business control with (or without) <code>agent</code> <b>executes immediately</b> and updates <code>holder</code>; later callers override earlier ones. The device <b>MUST NOT</b> return <code>occupied</code> for control.</li>
<li>Concurrent controls are serialized in arrival order; later writes override earlier writes.</li>
<li><code>holder</code> is informational only. In multi-step tasks the agent <b>SHOULD</b> call <code>who</code> before each subsequent step; if <code>holder</code> is no longer itself, it <b>SHOULD stop</b> the remaining steps. The device itself does not reject the next call from a stale agent.</li>
<li><code>occupy</code> / <code>release</code> are not required. If implemented: <code>occupy</code> only sets <code>holder</code> and returns no <code>token</code>; <code>release</code> only clears <code>holder</code> when the caller is the current <code>holder</code>.</li>
<li>A control-layer <code>holder</code> change <b>MUST NOT</b> tear down established media endpoint sessions (§14.5).</li>
<li>A device declaring <code>ui</code> <b>MUST NOT</b> use this policy.</li>
</ol>

<p><b>Example</b>:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Example sequence</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bob&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">80</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bob&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">80</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;who&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;occupancy&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;last-wins&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bob&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;streams&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-p">]</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 11.3 <code>exclusive</code> (exclusivity + token)

<p>Suitable for devices with <code>ui</code>, locks, and entries that require mutually exclusive orchestration (e.g. a gateway's own announcement/pairing).</p>

<p><b>State machine</b>:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Diagram</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>  online (idle) ── occupy / first control while idle ──► online (busy, holding token)
       ▲                                                  │
       └──────────── release / finite lease expires ──────┘</pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Item</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Default lease</td><td><b>60 seconds</b>: an <code>occupy</code> without <code>ttl</code> gets <code>until = now + 60</code></td></tr>
<tr><td>Legal <code>ttl</code> range</td><td><b>10–9999</b>; <code>9999</code> = indefinite; out of range → <code>bad-arg</code></td></tr>
<tr><td>Finite lease</td><td>Auto-reverts to idle on expiry; the old <code>token</code> is invalidated</td></tr>
<tr><td>Indefinite</td><td><code>lease_security=9999</code>, <code>until=0</code>; requires an explicit <code>release</code></td></tr>
<tr><td>Refresh</td><td>Under a finite lease, the occupant's subsequent <b>token-bearing</b> calls refresh <code>until</code></td></tr>
<tr><td>Stuck recovery</td><td>Default 60 s expiry is the automatic backstop; only when <code>ttl=9999</code> and the token is lost, restart the device process</td></tr>
</tbody>
</table>
</div>

<p><b>Occupancy token <code>token</code> rules</b>:</p>

<ol>
<li>Issued on successful <code>occupy</code> (or automatic management on the first control while idle); <b>SHOULD</b> be ≥ 16 hex characters.</li>
<li>Subsequent control, <code>release</code>, and UI stream handshakes <b>MUST</b> carry the same <code>token</code>; missing or mismatched → <code>unauthorized</code> (<code>-32004</code>).</li>
<li>The same <code>holder</code> calling <code>occupy</code> again with the correct token: the lease is refreshed and the same <code>token</code> is returned.</li>
<li>After <code>release</code> or finite-lease expiry, the old token is <b>immediately invalidated</b>.</li>
<li>Writing the <code>token</code> into UDP / TXT / <code>hello</code> / <code>who</code> / <code>describe</code> is <b>forbidden</b>.</li>
<li>The <code>token</code> is <b>bound</b> to the <code>agent</code> at issuance; any mismatch is <code>unauthorized</code>.</li>
<li>The device <b>MUST</b> support at least <b>2</b> concurrent TCP connections (occupant control + other read-only); read-only methods are callable on any connection.</li>
<li>Control by other <code>agent</code>s while managed: error response <code>occupied</code> (<code>-32001</code>), <code>data</code> includes <code>holder</code> / <code>until</code>, no token.</li>
<li>The protocol layer <b>MUST NOT</b> provide arbitrary seizure by any agent; the standard way to force-clear an occupancy is to <b>restart the device</b>. Media endpoint preemption is in §14.5 and does not go through the occupancy lock.</li>
</ol>

<p><b>Example</b>:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Example sequence</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupy&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupy&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>true<span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;until&quot;</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">,</span><span class="tok-f">&quot;lease_security&quot;</span><span class="tok-p">:</span><span class="tok-n">60</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;a1b2c3d4e5f60708&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tap&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;eve&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;x&quot;</span><span class="tok-p">:</span><span class="tok-n">10</span><span class="tok-p">,</span><span class="tok-f">&quot;y&quot;</span><span class="tok-p">:</span><span class="tok-n">20</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;error&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;code&quot;</span><span class="tok-p">:</span><span class="tok-n">-32001</span><span class="tok-p">,</span><span class="tok-f">&quot;message&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;Study-room phone is occupied by alice; lease expires in ~42 s&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;data&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;bmahs_code&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupied&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;retryable&quot;</span><span class="tok-p">:</span>true<span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;until&quot;</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">}</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;release&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;a1b2c3d4e5f60708&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;release&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>false<span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 11.4 Liveness detection and going offline

<p>This version defines <b>no</b> separate heartbeat message; the discovery layer's periodic <code>announce</code> serves as the liveness signal.</p>

<div class="table-wrap">
<table>
<thead><tr><th>Parameter</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr><td>Steady-state <code>announce</code> interval</td><td><b>5 seconds</b></td><td>Hard lower bound; must not be decreased</td></tr>
<tr><td>No-heartbeat removal deadline</td><td><code>clamp(12 × hb, 60 s, 30 min)</code></td><td>Remove from the list on timeout</td></tr>
<tr><td>Removal deadline cap</td><td><b>30 minutes</b></td><td>The cap when low-power devices increase the interval</td></tr>
</tbody>
</table>
</div>

<p>Factory default interval is 5 s; <b>only increases are allowed</b>, and an increase <b>MUST</b> be announced via the <code>hb</code> field. Agents <b>MUST NOT</b> require each device to open a separate TCP heartbeat.</p>

<div class="table-wrap">
<table>
<thead><tr><th>Channel</th><th>Mechanism</th><th>Behavior</th></tr></thead>
<tbody>
<tr><td>Discovery layer</td><td>Steady-state <code>announce</code></td><td>Past the removal deadline → remove the <code>id</code> from the list and drop the exclusive token</td></tr>
<tr><td>Discovery layer</td><td><code>goodbye</code></td><td>Remove immediately</td></tr>
<tr><td>Control layer exclusive</td><td>Finite lease</td><td>Expires to idle; old token invalidated</td></tr>
<tr><td>Control layer exclusive</td><td><code>ttl=9999</code></td><td>Never auto-expires</td></tr>
<tr><td>Control layer</td><td>TCP disconnect</td><td><b>Does not equal</b> offline / <code>release</code> / stopping data streams</td></tr>
<tr><td>Media TCP</td><td>Disconnect</td><td>That endpoint session terminates (§14.5)</td></tr>
</tbody>
</table>
</div>

<p><code>last-wins</code> has no lease that can wedge control; when an exclusive indefinite occupancy loses its token, recovery is still restarting that BMAHS device.</p>
