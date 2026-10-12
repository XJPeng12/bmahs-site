---
title: "UI Interface"
description: "Binary screen-stream profile for operable displays: declaration, channel isolation, frame format, coordinates, occupancy."
eyebrow: "Specification · Chapter 13"
---

<p class="eyebrow">Specification · Chapter 13</p>

# UI Interface

<p>Applies to devices with an operable display (phones, tablets, screen locks, car units, teach pendants, touch panels, etc.). Devices without an operable interface <b>MUST NOT</b> declare <code>ui</code>.</p>

<p><b>Mandatory rule</b>: a device declaring <code>ui</code> MUST have <code>security.occupancy</code> = <code>exclusive</code>. <code>last-wins</code> <b>MUST NOT</b> be used for the screen stream (two click streams cannot be superimposed on the same screen).</p>

### 13.1 Declaration obligations

<p>A device with an operable display <b>MUST</b>:</p>

<ul>
<li><code>occupancy=exclusive</code>;</li>
<li>include the profile tag <code>ui</code> in <code>announce.capabilities</code> (plus <code>tap</code>, <code>swipe</code> if touch is available);</li>
<li>include <code>ui.start</code>, <code>ui.stop</code> in <code>hello</code> notification <code>params.operations</code>;</li>
<li>provide the <b>logical resolution</b> (<code>width</code> × <code>height</code>, pixels) of the current operable screen;</li>
<li>implement the binary UI stream defined in this chapter.</li>
</ul>

<p>Declaring <code>ui</code> but not implementing the UI stream, or still passing frames via control JSON / base64, is a <b>protocol violation</b>.</p>

### 13.2 Dual-channel isolation

<div class="table-wrap">
<table>
<thead><tr><th>Channel</th><th>Encoding</th><th style="white-space:nowrap">Use</th></tr></thead>
<tbody>
<tr><td>Control TCP</td><td>One JSON-RPC 2.0 message per line + <code>\n</code></td><td><code>occupy</code>, <code>ui.start</code> / <code>ui.stop</code>, <code>screenshot</code>, <code>tap</code> / <code>swipe</code></td></tr>
<tr><td>UI stream</td><td><b>Non-JSON binary frames</b></td><td>Carries the screen only; occupancy token handshake first, then frames</td></tr>
</tbody>
</table>
</div>

<p><code>ui</code> URIs, frame data, and <code>token</code> <b>MUST NOT</b> appear in UDP, Bonjour TXT, <code>hello</code>, <code>who</code>, or <code>describe</code>. The <code>hello</code> notification <b>MUST NOT</b> pre-supply a UI session address.</p>

### 13.3 Control methods (JSON-RPC, require occupy + token)

<div class="table-wrap">
<table>
<thead><tr><th>Method</th><th>Requirement</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>ui.start</code></td><td style="white-space:nowrap">MUST</td><td>Start the UI stream; the success <code>result</code> returns the <code>ui</code> URI plus the actual <code>width</code> / <code>height</code> / <code>codec</code> / <code>fps</code> of this stream</td></tr>
<tr><td><code>ui.stop</code></td><td style="white-space:nowrap">MUST</td><td>Stop the UI stream, disconnect the occupant, invalidate this URI</td></tr>
<tr><td><code>screenshot</code></td><td>SHOULD</td><td>Must not return a full image or base64 in the control JSON</td></tr>
<tr><td><code>tap</code> / <code>swipe</code></td><td>optional</td><td>Same coordinate system as the current frame</td></tr>
</tbody>
</table>
</div>

<p>Example:</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">ui.start request &amp; response</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;ui.start&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;a1b2c3d4e5f60708&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;ui&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tcp://192.168.1.30:9531&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;width&quot;</span><span class="tok-p">:</span><span class="tok-n">390</span><span class="tok-p">,</span><span class="tok-f">&quot;height&quot;</span><span class="tok-p">:</span><span class="tok-n">844</span><span class="tok-p">,</span><span class="tok-f">&quot;codec&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;fps&quot;</span><span class="tok-p">:</span><span class="tok-n">10</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 13.4 UI stream binary protocol

<p>After connecting to the URI returned by <code>ui.start</code>:</p>

<ol>
<li><b>Authentication</b>: the client first sends the occupancy token <code>[u8 token_len][token bytes]</code>. On failure, disconnect; no frames.</li>
<li><b>Reply</b>: the device returns 1 byte: <code>0x00</code> success; any other value fails and disconnects.</li>
<li><b>Frames</b>:</li>
</ol>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">UI stream frame format (binary, not JSON)</span>
<button class="code__copy" type="button">Copy</button></div>

<pre><span class="tok-p">[</span>u<span class="tok-n">32</span> BE payload_len<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">16</span> BE width<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">16</span> BE height<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">8</span> codec<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">8</span> flags<span class="tok-p">]</span><span class="tok-p">[</span>payload<span class="tok-p">]</span></pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th>Field</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>payload_len</code></td><td>Payload byte count (big-endian u32)</td></tr>
<tr><td><code>width</code> / <code>height</code></td><td>This frame's logical size; <b>MUST</b> equal the pixel size of the frame after JPEG decode</td></tr>
<tr><td><code>codec</code></td><td><code>1</code> = JPEG (MUST implement); <code>2</code> = H.264 (optional)</td></tr>
<tr><td><code>flags</code></td><td>bit0 = key frame</td></tr>
<tr><td><code>payload</code></td><td>One frame of encoded data; <b>MUST NOT</b> be wrapped in JSON again</td></tr>
</tbody>
</table>
</div>

<p><b>Recommended parameters</b>: LAN JPEG at about 5–15 fps, long edge ≤ 720; exact bounds go in <code>operations.args</code>.</p>

### 13.5 Resolution, coordinate system and touch

<p>The logical resolution is the <b>only</b> coordinate system for mirroring and clicks. All of the following must hold:</p>

<ol>
<li>the <code>ui.start</code> success response <code>result</code> returns the actual <code>width</code> / <code>height</code> of this stream;</li>
<li>every frame header's width/height <b>MUST</b> equal that frame's JPEG pixel size;</li>
<li>the <code>hello</code> notification <b>SHOULD</b> provide the current screen's logical width/height (still without a <code>ui</code> URI);</li>
<li><code>tap</code> / <code>swipe</code> share the <b>current frame's</b> coordinate system; out-of-bounds → <code>bad-arg</code>.</li>
</ol>

<p>The agent <b>MUST NOT</b> trust stale <code>ui.start</code> dimensions; after rotation or scaling, the new width/height must appear in the next frame header.</p>

### 13.6 Occupancy and session lifecycle

<ul>
<li><code>ui.start</code> / <code>ui.stop</code> / <code>screenshot</code> / <code>tap</code> / <code>swipe</code> <b>MUST</b> be in the occupied state and carry a valid token.</li>
<li><b>Only one UI stream at a time</b>. A repeated <code>ui.start</code> from the same occupant: may refresh the session or return <code>busy</code> (state this in the description); another occupant <b>MUST</b> receive <code>busy</code>.</li>
<li><code>release</code>, lease expiry, <code>goodbye</code>, process exit: <b>MUST</b> stop the UI stream and invalidate the URI (unlike media endpoints, which do not stop by default).</li>
<li>Invalid token on the UI connection: disconnect, no frames.</li>
</ul>

<p><code>status</code> is an optional vendor method and is not a common method.</p>

### 13.7 UI security requirements

<ul>
<li><code>security.allow</code> <b>SHOULD</b> include <code>local-ui-stream</code>; plus <code>local-touch-inject</code> when touch is available;</li>
<li><code>ui.start</code> / <code>tap</code> <b>MAY</b> be listed in <code>confirm</code>;</li>
<li><code>scope</code> <b>SHOULD</b> be <code>lan</code>; the UI port binds to LAN addresses only.</li>
</ul>
