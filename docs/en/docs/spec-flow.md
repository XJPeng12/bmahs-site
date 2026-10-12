---
title: "Post-Connect Usage Flow"
description: "TCP connection setup, channel conventions, and the typical call sequence."
eyebrow: "Specification · Chapter 16"
---

<p class="eyebrow">Specification · Chapter 16</p>

# Post-Connect Usage Flow


### 16.1 Connection establishment

<ol>
<li>Parse <code>control</code>; a dual-stack device prefers connecting to <code>ip</code> (IPv4).</li>
<li>The device <b>MUST</b> already be listening on that port (TCP: recommend <code>::</code> + <code>IPV6_V6ONLY=0</code>; the opposite of the §6.2 UDP value).</li>
<li>After the connection succeeds, the device <b>immediately</b> sends one line of <code>hello</code> notification (JSON-RPC notification, §8.5), then waits for commands.</li>
</ol>

### 16.2 Business channel conventions

<ul>
<li>TCP, one JSON-RPC 2.0 message per line, terminated by <code>\n</code>.</li>
<li>The request <code>method</code> is the action name; <code>params</code> must satisfy at least that action's <code>args</code>; control calls <b>SHOULD</b> include <code>agent</code>. After exclusive management they also carry <code>token</code>; <code>last-wins</code> <b>MUST NOT</b> require a <code>token</code>.</li>
<li>Success → <code>result</code> object (content per <code>returns</code>); failure → <code>error</code> object (Chapter 9).</li>
<li><code>describe</code> / <code>info</code> / <code>who</code> per §10.4; not providing <code>register</code> is acceptable.</li>
<li><b>Screen and continuous media must not go through this channel</b>; <code>params</code> field names align with <code>operations.args[].name</code>.</li>
</ul>

<p>Request examples:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Example sequence</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">40</span><span class="tok-p">,</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tap&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;x&quot;</span><span class="tok-p">:</span><span class="tok-n">10</span><span class="tok-p">,</span><span class="tok-f">&quot;y&quot;</span><span class="tok-p">:</span><span class="tok-n">20</span><span class="tok-p">,</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;...&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 16.3 Typical sequence

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Diagram</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>Client                                Device
  │ ── TCP connect ─────────────────►  │
  │ ◄─ hello notification (no id) ───  │
  │ ── describe {id:1} ─────────────►  │
  │ ◄─ result: operations+security ──  │
  │ (exclusive device)                 │
  │ ── occupy {agent, ttl?} ────────►  │
  │ ◄─ result: token, until ─────────  │
  │ ── business method {token, ...} ─► │
  │ ◄─ result / error ───────────────  │
  │ ── release {agent, token} ──────►  │
  │ ◄─ result ───────────────────────  │</pre>
</div>
