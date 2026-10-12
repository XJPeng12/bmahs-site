---
title: "Bonjour / DNS-SD TXT Records"
description: "TXT record keys mapped to UDP fields, plus dns-sd verification commands."
eyebrow: "Specification · Chapter 17"
---

<p class="eyebrow">Specification · Chapter 17</p>

# Bonjour / DNS-SD TXT Records

<p>All values are strings; <code>capabilities</code> is comma-separated; <b>no</b> <code>token</code> or stream-URI keys. Keep the whole record under 400 bytes.</p>

<div class="table-wrap">
<table>
<thead><tr><th>TXT key</th><th>Mapped UDP field</th><th>Required</th></tr></thead>
<tbody>
<tr><td><code>txtvers</code></td><td>Fixed <code>1</code></td><td style="white-space:nowrap">yes</td></tr>
<tr><td><code>protocol</code></td><td><code>protocol</code></td><td>yes (<code>bmahs/1.2</code>)</td></tr>
<tr><td><code>type</code> / <code>service</code> / <code>id</code> / <code>name</code></td><td>Same names</td><td style="white-space:nowrap">yes</td></tr>
<tr><td><code>summary</code> / <code>model</code></td><td>Same names</td><td>SHOULD</td></tr>
<tr><td><code>capabilities</code></td><td><code>capabilities</code></td><td style="white-space:nowrap">yes</td></tr>
<tr><td><code>security</code></td><td><code>scope,auth,occupancy</code></td><td style="white-space:nowrap">yes</td></tr>
<tr><td><code>ip</code> / <code>ipv6</code></td><td>Same names</td><td>SHOULD / SHOULD when present</td></tr>
<tr><td><code>state</code></td><td><code>state</code></td><td>yes (<code>online</code>)</td></tr>
<tr><td><code>event</code></td><td><code>event</code></td><td>SHOULD</td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td style="white-space:nowrap"><code>busy</code></td><td>yes (<code>0</code> / <code>1</code>)</td></tr>
<tr><td><code>holder</code></td><td><code>holder</code></td><td>SHOULD when present</td></tr>
<tr><td style="white-space:nowrap"><code>hb</code></td><td style="white-space:nowrap"><code>hb</code></td><td>MUST when the interval is increased</td></tr>
</tbody>
</table>
</div>

<p>Verification commands:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">Verification command</span>
<button class="code__copy" type="button">Copy</button></div>

<pre>dns-sd -B _bmahs._tcp local
dns-sd -L &quot;Living Room Lamp&quot; _bmahs._tcp local</pre>
</div>
