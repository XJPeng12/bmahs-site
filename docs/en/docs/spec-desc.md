---
title: "Device Description & Self-Description"
description: "The three required descriptions — natural-language self-description, operations, security — plus the optional constraint and the confirm mechanism."
eyebrow: "Specification · Chapter 10"
---

<p class="eyebrow">Specification · Chapter 10</p>

# Device Description & Self-Description


### 10.1 The three required descriptions

<p>Every BMAHS device <b>MUST</b> provide the following three descriptions so the agent can understand the device in natural language before invoking it:</p>

<ol>
<li><b>Natural-language self-description</b> (<code>name</code> / <code>summary</code> / <code>constraint</code>);</li>
<li><b>Operation list</b> (<code>operations</code>);</li>
<li><b>Security boundary</b> (<code>security</code>).</li>
</ol>

<p>The UDP <code>announce</code> carries only a summary (constrained by the 1400-byte limit); the full content goes into the <code>hello</code> notification parameters and can be re-fetched via the <code>describe</code> method.</p>

<p>Beyond those three <b>required</b> descriptions, a device <b>MAY</b> also provide <b>usage constraints</b> <code>constraint</code> (§10.6) — one natural-language sentence declaring "how to use it right". It is an optional fourth description; omitting it does not make the device non-conformant.</p>

### 10.2 Natural-language self-description (MUST)

<p><b>Principle</b>: the big model selects devices and fills parameters by semantics; stable machine codes (<code>id</code> / <code>type</code> / <code>service</code> / <code>method</code> / <code>bmahs_code</code>) remain English identifiers; <b>any explanatory text used for selection, decisions, parameter filling, or reading results MUST be complete natural-language sentences</b> (recommend the same language as the user interface; the examples in this specification use English).</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Location</th><th>Required</th><th>Writing requirement</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>announce / hello / TXT</td><td style="white-space:nowrap">yes</td><td>User-readable display name (e.g. &quot;Living Room Lamp&quot;); <b>MUST NOT</b> be just a model number, SKU, or meaningless internal code</td></tr>
<tr><td><code>summary</code></td><td>announce (SHOULD) / hello (MUST)</td><td>see left</td><td>One or two sentences: what the device is, what it mainly does, usage caveats (e.g. whether occupancy is required). UDP recommended ≤ 120 characters</td></tr>
<tr><td style="white-space:nowrap"><code>constraint</code></td><td>hello / describe</td><td>SHOULD</td><td><b>Usage constraints</b>: one natural-language sentence stating the operational dependencies (whether <code>occupy</code> is needed first, paired calls, multi-step ordering); see §10.6</td></tr>
<tr><td><code>security.notes</code></td><td>hello / describe</td><td style="white-space:nowrap">yes</td><td>Natural-language boundary description; <b>MUST NOT</b> be empty</td></tr>
<tr><td><code>error.message</code></td><td>Error response</td><td style="white-space:nowrap">yes</td><td>Short failure reason for humans/the model; <b>MUST NOT</b> just repeat the uninformative error code word</td></tr>
</tbody>
</table>
</div>

<p><b>Additional rules</b>:</p>

<ol>
<li><b>Announce is self-description</b>: <code>name</code> + <code>summary</code> in <code>announce</code> should let the agent decide &quot;should I connect to this one&quot; without connecting <code>control</code>.</li>
<li><b>Machine codes ≠ descriptions</b>: do not use <code>type=light</code> in place of <code>summary</code>; do not use <code>method=on</code> in place of <code>operations[].description</code>.</li>
<li><b>Actionable</b>: descriptions should state preconditions (<code>last-wins</code> needs no occupy; <code>exclusive</code> requires occupy with token), mutually exclusive parameters, and common failures.</li>
<li><b>No secrets</b>: natural-language fields <b>MUST NOT</b> contain passwords, <code>token</code>, accounts, or stream URIs.</li>
<li><b>Language stability</b>: within one device lifetime, <code>summary</code> / primary <code>description</code> must not be frequently rewritten in a way that changes semantics; capability changes should bump <code>service</code> or update <code>operations</code> and immediately re-<code>announce</code>.</li>
</ol>

<p>If <code>summary</code> is placed in Bonjour TXT, it <b>SHOULD</b> be truncated (recommended ≤ 80 characters); the full semantics are authoritative in the <code>hello</code> notification.</p>

### 10.3 Operation list <code>operations</code> (MUST)

<p><code>operations</code> is the <b>complete</b> set of methods the agent may invoke. Normative rules:</p>

<ul>
<li>a <code>method</code> not appearing in the list MUST be rejected by the device (<code>unknown-action</code>, JSON-RPC <code>-32601</code>);</li>
<li>the agent runtime <b>MUST</b> convert <code>operations</code> into tool schemas: the tool description comes from <code>description</code>, parameter definitions <b>only</b> from <code>args</code>, return descriptions <b>only</b> from <code>result</code> / <code>returns</code>;</li>
<li>new devices <b>MUST</b> use object arrays; for legacy string-array forms of <code>args</code> / <code>returns</code>, the agent interprets them for compatibility only (<code>type=string</code>, <code>required=false</code>, <code>description=&quot;&quot;</code>) and <b>SHOULD</b> call <code>describe</code> again to request the full list.</li>
</ul>

<p><b>operations item fields</b> (<code>name</code> is the JSON-RPC <code>method</code>):</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>Method name, same as request <code>method</code> (machine code), lowercase, may contain <code>.</code></td></tr>
<tr><td><code>description</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><b>Natural language</b>: what it does, when to use it; empty string or merely repeating <code>name</code> is forbidden</td></tr>
<tr><td style="white-space:nowrap"><code>args</code></td><td>object[]</td><td style="white-space:nowrap">yes</td><td>List of parameter objects; <code>[]</code> when there are no parameters</td></tr>
<tr><td><code>any_of</code></td><td>string[]</td><td style="white-space:nowrap">MAY</td><td>Provide at least one of these parameter names; if none is provided → <code>bad-arg</code></td></tr>
<tr><td><code>result</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><b>Natural language</b>: how the model should understand the return on success</td></tr>
<tr><td><code>returns</code></td><td>object[]</td><td style="white-space:nowrap">yes</td><td>Fields that appear in the success <code>result</code> object; <code>[]</code> when there are none</td></tr>
</tbody>
</table>
</div>

<p><b>args[] / returns[] item fields</b>:</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>Field name in <code>params</code> (args) or <code>result</code> (returns)</td></tr>
<tr><td style="white-space:nowrap"><code>type</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><code>string</code> / <code>int</code> / <code>number</code> / <code>bool</code>; <code>returns</code> may use <code>object</code> / <code>array</code> for nested JSON, details in <code>description</code></td></tr>
<tr><td><code>required</code></td><td style="white-space:nowrap">bool</td><td>yes (args only)</td><td>Every args entry must write this field; do not write for <code>returns</code></td></tr>
<tr><td><code>description</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><b>Natural language</b>: meaning, how to fill, unit, relation to sibling parameters; empty string forbidden</td></tr>
<tr><td><code>min</code> / <code>max</code></td><td>number</td><td>SHOULD for numbers</td><td>Closed interval; must be written when bounds exist</td></tr>
<tr><td style="white-space:nowrap"><code>enum</code></td><td>string[]</td><td>SHOULD for enums</td><td>Must be written when a fixed set exists</td></tr>
<tr><td style="white-space:nowrap"><code>unit</code></td><td>string</td><td style="white-space:nowrap">MAY</td><td>e.g. <code>%</code>, <code>K</code>, <code>s</code>, <code>Hz</code></td></tr>
<tr><td><code>example</code></td><td>same as type</td><td>SHOULD</td><td>One legal example</td></tr>
<tr><td><code>default</code></td><td>same as type</td><td style="white-space:nowrap">MAY</td><td>The default value the device uses when omitted</td></tr>
</tbody>
</table>
</div>

<p><b>operations → tool schema mapping</b> (do not invent parameters):</p>

<div class="table-wrap">
<table>
<thead><tr><th><code>operations</code></th><th>Tool schema</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>Function / tool / JSON-RPC method name</td></tr>
<tr><td><code>description</code></td><td>Tool description</td></tr>
<tr><td><code>args[].name</code> + <code>type</code> / <code>min</code> / <code>max</code> / <code>enum</code> / <code>description</code> / <code>example</code> / <code>unit</code></td><td>Parameter / JSON Schema properties</td></tr>
<tr><td><code>name</code>s with <code>required=true</code> in <code>args</code></td><td>Required-parameter list</td></tr>
<tr><td><code>any_of</code></td><td>Written into the tool description and checked before sending the request</td></tr>
<tr><td><code>result</code> + <code>returns</code></td><td>Not inputs; after the call, read the response by the <code>result</code> object fields</td></tr>
</tbody>
</table>
</div>

<p><b>Business action example</b> (<code>last-wins</code> lamp — do <b>NOT</b> write &quot;must occupy first&quot;):</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Business method call example</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Set the lamp's brightness to the given percentage; use it when dimming is needed (e.g. watching a movie). A later setting immediately overrides the earlier one.&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;args&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span>
    <span class="tok-p">{</span>
      <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;level&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;int&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;required&quot;</span><span class="tok-p">:</span> true<span class="tok-p">,</span>
      <span class="tok-f">&quot;min&quot;</span><span class="tok-p">:</span> <span class="tok-n">0</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;max&quot;</span><span class="tok-p">:</span> <span class="tok-n">100</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;unit&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;%&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;example&quot;</span><span class="tok-p">:</span> <span class="tok-n">40</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Brightness: 0 is dimmest, 100 is brightest&quot;</span>
    <span class="tok-p">}</span>
  <span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;On success the result object contains the switch state and current brightness&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;returns&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span>
    <span class="tok-p">{</span><span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;state&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;string&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;enum&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span><span class="tok-s">&quot;on&quot;</span><span class="tok-p">,</span> <span class="tok-s">&quot;off&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span> <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Whether the lamp is on&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;example&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;on&quot;</span><span class="tok-p">}</span><span class="tok-p">,</span>
    <span class="tok-p">{</span><span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;level&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;int&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;min&quot;</span><span class="tok-p">:</span> <span class="tok-n">0</span><span class="tok-p">,</span> <span class="tok-f">&quot;max&quot;</span><span class="tok-p">:</span> <span class="tok-n">100</span><span class="tok-p">,</span> <span class="tok-f">&quot;unit&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;%&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;Current brightness&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;example&quot;</span><span class="tok-p">:</span> <span class="tok-n">40</span><span class="tok-p">}</span>
  <span class="tok-p">]</span>
<span class="tok-p">}</span></pre>
</div>

### 10.4 Common methods

#### 10.4.1 Mandatory scope

<div class="table-wrap">
<table>
<thead><tr><th>Method</th><th>All devices</th><th><code>exclusive</code> adds</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>describe</code></td><td style="white-space:nowrap"><b>MUST</b></td><td style="white-space:nowrap">—</td><td>Authoritative operations / security / self-description</td></tr>
<tr><td style="white-space:nowrap"><code>info</code></td><td style="white-space:nowrap"><b>MUST</b></td><td style="white-space:nowrap">—</td><td>Concise identity</td></tr>
<tr><td style="white-space:nowrap"><code>who</code></td><td style="white-space:nowrap"><b>MUST</b></td><td style="white-space:nowrap">—</td><td>Last controller and active streams; <code>exclusive</code> additionally includes the lease</td></tr>
<tr><td><code>occupy</code></td><td>not required</td><td style="white-space:nowrap"><b>MUST</b></td><td>Only the exclusive policy issues tokens</td></tr>
<tr><td><code>release</code></td><td>not required</td><td style="white-space:nowrap"><b>MUST</b></td><td>Only the exclusive policy returns exclusivity</td></tr>
<tr><td><code>register</code></td><td><b>not required</b></td><td><b>not required</b></td><td>No longer a required implementation</td></tr>
</tbody>
</table>
</div>

<ul>
<li>A <code>last-wins</code> device <b>MAY</b> implement <code>occupy</code> / <code>release</code> no-ops that do not issue a <code>token</code> (only update/clear <code>holder</code>); it <b>MUST NOT</b> therefore require the agent to call them first.</li>
<li>When <code>occupy</code> / <code>release</code> / <code>register</code> are not implemented, the corresponding request <b>MUST</b> receive <code>unknown-action</code>.</li>
<li>A device with <code>input</code> endpoints <b>SHOULD</b> additionally implement <code>stream.join</code> (§14.3); every device declaring <code>endpoints</code> <b>MUST</b> implement the methods its endpoints' <code>open</code> / <code>close</code> point to (defaults <code>stream.start</code> / <code>stream.accept</code> / <code>stream.stop</code>).</li>
</ul>

#### 10.4.2 Standard shape definitions

<div class="table-wrap">
<table>
<thead><tr><th>Method</th><th>Purpose</th><th><code>params</code> (besides common <code>agent</code> / <code>token</code>)</th><th>Success <code>result</code></th></tr></thead>
<tbody>
<tr><td><code>describe</code></td><td><b>Authoritative source</b>: full operation list and security boundary</td><td style="white-space:nowrap"><code>{}</code></td><td><code>operations</code>, <code>security</code>, <code>id</code>, <code>type</code>, <code>service</code>, <code>name</code>, <code>summary</code>, <code>constraint</code>, <code>state</code>, <code>occupancy</code>, <code>holder</code> (if any), <code>streams</code> (if any)</td></tr>
<tr><td style="white-space:nowrap"><code>info</code></td><td><b>Concise</b> description: what it is, what state</td><td style="white-space:nowrap"><code>{}</code></td><td><code>id</code>, <code>type</code>, <code>service</code>, <code>name</code>, <code>summary</code>, <code>model</code>, <code>state</code>, <code>occupancy</code>, <code>holder</code> (if any)</td></tr>
<tr><td style="white-space:nowrap"><code>who</code></td><td><b>Who is using it</b>: last controller and active media sessions</td><td style="white-space:nowrap"><code>{}</code></td><td><code>id</code>, <code>name</code>, <code>type</code>, <code>service</code>, <code>state</code>, <code>occupancy</code>, <code>holder</code> (if any), <code>until</code> / <code>lease_security</code> (exclusive while occupied), <code>streams</code> (SHOULD)</td></tr>
<tr><td><code>occupy</code></td><td>Acquire exclusivity and issue a token (exclusive only)</td><td><code>ttl</code> (optional, 10–9999, see §11.3)</td><td><code>state</code>, <code>event</code>, <code>busy</code>, <code>holder</code>, <code>until</code>, <code>lease_security</code>, <code>token</code></td></tr>
<tr><td><code>release</code></td><td>Return exclusivity, invalidate the token (exclusive only)</td><td style="white-space:nowrap"><code>{}</code></td><td><code>state</code> (<code>online</code>), <code>event</code> (<code>release</code>), <code>busy</code></td></tr>
</tbody>
</table>
</div>

#### 10.4.3 Read-only method semantics (MUST distinguish)

<div class="table-wrap">
<table>
<thead><tr><th>Method</th><th>Difference from other methods</th><th>Requires token</th><th>Changes occupancy / holder</th></tr></thead>
<tbody>
<tr><td><code>describe</code></td><td>The only one guaranteed to return the <b>complete</b> <code>operations</code> / <code>security</code></td><td style="white-space:nowrap">no</td><td style="white-space:nowrap">no</td></tr>
<tr><td style="white-space:nowrap"><code>info</code></td><td><b>MAY</b> omit the complete <code>operations</code> / <code>security</code></td><td style="white-space:nowrap">no</td><td style="white-space:nowrap">no</td></tr>
<tr><td style="white-space:nowrap"><code>who</code></td><td>Does not return <code>operations</code> / <code>security</code>; an absent <code>holder</code> means nobody has controlled it recently (last-wins) or nobody is currently occupying it (exclusive)</td><td style="white-space:nowrap">no</td><td style="white-space:nowrap">no</td></tr>
</tbody>
</table>
</div>

<p><b><code>holder</code> and <code>streams</code> definitions</b>:</p>

<ul>
<li><code>holder</code>: the <code>agent</code> of the last <b>control</b> call (last-wins), or the current occupant (exclusive); omit when none.</li>
<li><code>streams</code>: active endpoint sessions <code>[{id, endpoint, agent, since}]</code>, <b>without</b> URIs.</li>
<li>To ask &quot;who is adjusting the volume&quot;, look at <code>holder</code>; to ask &quot;who is pulling this endpoint&quot;, look at <code>streams</code>.</li>
</ul>

<p><code>announce.capabilities</code> <b>SHOULD</b> include the common method names the device actually implements (at least <code>describe,info,who</code>).</p>

### 10.5 Security boundary <code>security</code> (MUST)

<p><code>security</code> is the capability ceiling the device commits to. The agent <b>MUST NOT</b> request capabilities in <code>deny</code>; the device <b>MUST</b> reject an out-of-bounds request and return <code>denied</code> (<code>-32005</code>).</p>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th style="white-space:nowrap">Type</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>scope</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>Network scope: <code>lan</code> / <code>wan</code> (opening <code>wan</code> requires separate documentation)</td></tr>
<tr><td style="white-space:nowrap"><code>auth</code></td><td>string</td><td style="white-space:nowrap">yes</td><td>Transport/identity authentication: <code>none</code> / <code>token</code> / <code>tls</code>. <b>Not</b> the occupancy policy</td></tr>
<tr><td><code>occupancy</code></td><td>string</td><td>yes (1.2)</td><td><code>last-wins</code> or <code>exclusive</code>. <b>MUST</b> appear in UDP / hello / describe. Absence is interpreted as <code>exclusive</code></td></tr>
<tr><td><code>allow</code></td><td>string[]</td><td>SHOULD</td><td>Explicitly allowed capability tags</td></tr>
<tr><td style="white-space:nowrap"><code>deny</code></td><td>string[]</td><td style="white-space:nowrap">yes</td><td>Explicitly forbidden capabilities. <b>Recommended</b> to cover at least: arbitrary disk read, arbitrary disk write, command execution, network fetch, cloud upload, covert camera/mic capture</td></tr>
<tr><td><code>confirm</code></td><td>string[]</td><td style="white-space:nowrap">MAY</td><td>Method names that require user confirmation before execution</td></tr>
<tr><td><code>confirm_timeout</code></td><td style="white-space:nowrap">int</td><td style="white-space:nowrap">MAY</td><td>Max wait seconds for confirm-required actions, range <b>5–300</b>, default <b>30</b></td></tr>
<tr><td><code>notes</code></td><td>string</td><td style="white-space:nowrap">yes</td><td><b>Natural-language</b> boundary description; empty string forbidden</td></tr>
</tbody>
</table>
</div>

<p><b>Normative constraints</b>:</p>

<ul>
<li><code>auth</code> and <code>occupancy</code> <b>MUST NOT</b> substitute for each other: an <code>auth=none</code> device can still be <code>exclusive</code> (mutual exclusion by occupancy token only, no TLS); a <code>last-wins</code> device <b>MUST NOT</b> require control calls to carry an occupancy token.</li>
<li><code>announce.security</code> / Bonjour <code>security</code> carry only the summary object; TXT written as <code>security=lan,none,last-wins</code>.</li>
<li>UDP / TXT <b>MUST NOT</b> carry occupancy tokens or stream URIs.</li>
</ul>

### 10.6 Usage constraints <code>constraint</code> (optional)

<p><code>constraint</code> is the device's <b>natural-language</b> declaration of <b>usage constraints</b> — that is, "which operating discipline must be observed to use this device correctly and safely". It differs from <code>security</code>: <code>security</code> declares the <b>capability ceiling</b> (what may or may not be done), whereas <code>constraint</code> declares <b>usage constraints</b> (how to do it right). The two <b>MUST NOT</b> substitute for each other.</p>

<p><code>constraint</code> appears in two places: the <code>hello</code> notification <code>params</code> (SHOULD) and the <code>describe</code> success <code>result</code> (SHOULD); the two <b>SHOULD</b> be consistent. A device <b>MAY</b> omit <code>constraint</code>; when provided, it is the constraint declaration described in this section.</p>

<div class="table-wrap">
<table>
<thead><tr><th>Item</th><th>Location</th><th>Required</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>constraint</code></td><td><code>hello</code> notification <code>params</code>; <code>describe</code> success <code>result</code></td><td style="white-space:nowrap">SHOULD</td><td><b>One</b> natural-language sentence stating the device-specific operational dependencies and discipline; empty string forbidden</td></tr>
</tbody>
</table>
</div>

<p><b>Writing requirements</b>:</p>

<ol>
<li><b>State the dependency in one sentence.</b> <code>constraint</code> is neither a capability list nor a security statement; it is "the rule most easily got wrong when calling this device". Typical content: whether <code>occupy</code> must come first, the ordering of multi-step operations, methods that must be called in pairs, empirical bounds on error-prone parameters.</li>
<li><b>Write it according to <code>security.occupancy</code></b> (the core purpose of <code>constraint</code>): <code>last-wins</code> → "call business methods directly; no <code>occupy</code> needed"; <code>exclusive</code> → "<code>occupy</code> first to get a token; on task end (including failure/cancel) you <b>MUST</b> <code>release</code>".</li>
<li><b>Empirical advice is allowed.</b> <code>constraint</code> may contain vendor-empirical values (e.g. "keep brightness ≤ 30 at night", "confirm the source <code>state=playing</code> before opening a stream"). Such advice is not a mandatory requirement, but it <b>SHOULD</b> be truthful and unambiguous.</li>
<li><b>Constraints only, never secrets.</b> <b>MUST NOT</b> contain passwords, <code>token</code>, accounts, or stream URIs (same as §10.2 additional rule 4).</li>
<li><b>MUST NOT conflict with <code>operations</code> / <code>security</code>.</b> If <code>constraint</code> contradicts <code>operations[].description</code>, <code>security.deny</code> / <code>confirm</code> / <code>occupancy</code>, the latter prevail; a misleading <code>constraint</code> counts as a <b>protocol violation</b>.</li>
</ol>

<p><b>Normative constraints</b>:</p>

<ul>
<li><code>constraint</code> <b>MUST NOT</b> be used to grant or relax permissions — it <b>MUST NOT</b> declare capabilities outside <code>security.deny</code>, nor offset the hard constraints of <code>security.confirm</code> and <code>occupancy</code>.</li>
<li>The <code>constraint</code> returned by <code>describe</code> <b>SHOULD</b> match the one in the <code>hello</code> notification; when constraints change, the device <b>SHOULD</b> update it and re-<code>announce</code> immediately (same as §10.2 additional rule 5).</li>
<li>After receiving <code>hello</code> / <code>describe</code>, the agent <b>MUST</b> hand <code>constraint</code> to the model (§12 item 1); the model <b>SHOULD</b> treat <code>constraint</code> as calling discipline it ought to follow during orchestration, but <b>MUST NOT</b> use it to override hard <code>security</code> constraints.</li>
<li>Division of labour between <code>constraint</code> and <code>summary</code>: <code>summary</code> answers "what is this, and what does it mainly do", <code>constraint</code> answers "how to use it right". <b>MUST NOT</b> copy <code>summary</code> verbatim into <code>constraint</code>.</li>
</ul>

<p><b>Examples</b> — a <code>last-wins</code> lamp (dependency: no occupancy needed):</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">constraint of a last-wins lamp</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-f">&quot;constraint&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;Call on, off, brightness directly. No occupy needed.&quot;</span></pre>
</div>

<p>An <code>exclusive</code> speaker (dependency: occupy → control → release, with a precondition on streaming):</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">constraint of an exclusive speaker</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-f">&quot;constraint&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;Confirm source state=playing before opening a stream; occupy first to get a token, and release when the task ends. Volume 0–100.&quot;</span></pre>
</div>

### 10.7 User confirmation mechanism (<code>security.confirm</code>, optional)

<p>For methods listed in <code>security.confirm</code>, the device <b>MUST</b> obtain <b>local</b> user confirmation before this execution:</p>

<ol>
<li><b>The confirmation channel is provided locally by the device</b> (physical button, on-device dialog, vendor's official app, etc.); this protocol does <b>not</b> define its form and does <b>not</b> add any control method.</li>
<li>After receiving a confirm-required call, the device <b>waits at most <code>confirm_timeout</code></b> (default 30 s, configurable 5–300 s) and does <b>not</b> reply to that request during the wait (i.e. sends no response for the corresponding <code>id</code>).</li>
<li>Local confirmation completed within the wait → execute normally; timeout or user rejection → error response <code>denied</code> (<code>-32005</code>). <code>denied</code> defaults to <code>retryable=false</code>; only a <b>confirmation timeout</b> (not a user veto) sets <code>data.retryable=true</code>, and retries must not be rapid.</li>
<li>The device <b>SHOULD</b> give a local prompt during the wait.</li>
<li>The agent <b>SHOULD</b> tell the user what it is about to do before calling; it <b>MUST NOT</b> retry at high frequency because the user has not responded.</li>
<li>The agent's wait timeout <b>MUST NOT</b> be shorter than the <code>confirm_timeout</code> announced by the device.</li>
<li>Stream-opening methods of capture endpoints (microphone, camera) <b>SHOULD</b> be listed in <code>confirm</code> even if the device is <code>last-wins</code>. Pushing a stream into a speaker need not be confirmed.</li>
</ol>
