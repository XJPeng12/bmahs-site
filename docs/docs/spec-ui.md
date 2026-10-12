---
title: "UI接口"
description: "有可操作画面设备的二进制画面流规范：声明义务、双通道隔离、帧格式、坐标系与占用联动。"
eyebrow: "规范全文 · 第 13 章"
---

<p class="eyebrow">规范全文 · 第 13 章</p>

# UI接口

<p>适用于有可操作画面的设备（手机、平板、带屏锁、车机、示教器、触摸面板等）。无操作界面的设备<b>不得</b>声明 <code>ui</code>。</p>

<p><b>强制规则</b>：声明 <code>ui</code> 的设备，<code>security.occupancy</code> <b>必须</b>为 <code>exclusive</code>。<b>不得</b>对画面流使用 <code>last-wins</code>（两路点击不能叠加在同一块屏上）。</p>

### 13.1 声明义务

<p>有可操作画面的设备<b>必须</b>：</p>

<ul>
<li><code>occupancy=exclusive</code>；</li>
<li><code>announce.capabilities</code> 含剖面标签 <code>ui</code>（有触控再加 <code>tap</code>、<code>swipe</code>）；</li>
<li><code>hello</code> 通知 <code>params.operations</code> 含 <code>ui.start</code>、<code>ui.stop</code>；</li>
<li>给出当前可操作画面的<b>逻辑分辨率</b>（<code>width</code> × <code>height</code>，像素）；</li>
<li>实现本章规定的二进制 UI 流。</li>
</ul>

<p>声明 <code>ui</code> 却未实现 UI 流，或仍以控制 JSON / base64 传帧，视为<b>违反协议</b>。</p>

### 13.2 双通道隔离

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">通道</th><th style="white-space:nowrap">编码</th><th style="white-space:nowrap">用途</th></tr></thead>
<tbody>
<tr><td>控制 TCP</td><td>一行一个 JSON-RPC 2.0 消息 + <code>\n</code></td><td><code>occupy</code>、<code>ui.start</code> / <code>ui.stop</code>、<code>screenshot</code>、<code>tap</code> / <code>swipe</code></td></tr>
<tr><td style="white-space:nowrap">UI 流</td><td><b>非 JSON 二进制帧</b></td><td>只传画面；先做占用 token 握手再出帧</td></tr>
</tbody>
</table>
</div>

<p><code>ui</code> URI、帧数据、<code>token</code> <b>不得</b>出现在 UDP、Bonjour TXT、<code>hello</code>、<code>who</code>、<code>describe</code>。<code>hello</code> 通知<b>不得</b>预先给出 UI 会话地址。</p>

### 13.3 控制方法（JSON-RPC，必须 occupy + token）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">方法</th><th style="white-space:nowrap">必须性</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>ui.start</code></td><td style="white-space:nowrap">必须</td><td>启动 UI 流；成功 <code>result</code> 中返回 <code>ui</code> URI 与本次出流实际 <code>width</code> / <code>height</code> / <code>codec</code> / <code>fps</code></td></tr>
<tr><td><code>ui.stop</code></td><td style="white-space:nowrap">必须</td><td>停止 UI 流，断开占用方，作废本次 URI</td></tr>
<tr><td><code>screenshot</code></td><td style="white-space:nowrap">应当</td><td>不得在控制 JSON 里回传整图或 base64</td></tr>
<tr><td><code>tap</code> / <code>swipe</code></td><td style="white-space:nowrap">可选</td><td>与当前帧同一坐标系</td></tr>
</tbody>
</table>
</div>

<p>示例：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">ui.start 请求与响应</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;ui.start&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;a1b2c3d4e5f60708&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;ui&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tcp://192.168.1.30:9531&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;width&quot;</span><span class="tok-p">:</span><span class="tok-n">390</span><span class="tok-p">,</span><span class="tok-f">&quot;height&quot;</span><span class="tok-p">:</span><span class="tok-n">844</span><span class="tok-p">,</span><span class="tok-f">&quot;codec&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;fps&quot;</span><span class="tok-p">:</span><span class="tok-n">10</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 13.4 UI 流二进制协议

<p>连接 <code>ui.start</code> 返回的 URI 后：</p>

<ol>
<li><b>鉴权</b>：客户端先发占用令牌 <code>[u8 token_len][token 字节]</code>。失败则断开，不出帧。</li>
<li><b>应答</b>：设备回 1 字节：<code>0x00</code> 成功；其它值失败并断开。</li>
<li><b>出帧</b>：</li>
</ol>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">UI 流帧格式（二进制，非 JSON）</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">[</span>u<span class="tok-n">32</span> BE payload_len<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">16</span> BE width<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">16</span> BE height<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">8</span> codec<span class="tok-p">]</span><span class="tok-p">[</span>u<span class="tok-n">8</span> flags<span class="tok-p">]</span><span class="tok-p">[</span>payload<span class="tok-p">]</span></pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>payload_len</code></td><td>载荷字节数（大端 u32）</td></tr>
<tr><td><code>width</code> / <code>height</code></td><td>本帧逻辑宽高，<b>必须</b>等于该帧图像解码后的像素宽高（<code>codec=2</code> 时为视频分辨率）</td></tr>
<tr><td><code>codec</code></td><td><code>1</code> = JPEG（必须实现）；<code>2</code> = H.264（可选）</td></tr>
<tr><td><code>flags</code></td><td>bit0 = 关键帧</td></tr>
<tr><td><code>payload</code></td><td>一帧编码数据；<b>禁止</b>再套 JSON</td></tr>
</tbody>
</table>
</div>

<p><b>建议参数</b>：局域网 JPEG 约 5–15 fps、长边 ≤ 720；具体上下限写在 <code>operations.args</code>。</p>

### 13.5 分辨率、坐标系与触控

<p>逻辑分辨率是镜像与点击的<b>唯一</b>坐标系。必须同时满足：</p>

<ol>
<li><code>ui.start</code> 成功响应 <code>result</code> 带回本次实际 <code>width</code> / <code>height</code>；</li>
<li>每一帧帧头宽高<b>必须</b>等于该帧 JPEG 像素尺寸；</li>
<li><code>hello</code> 通知<b>应当</b>给出当前屏幕逻辑宽高（仍不得带 <code>ui</code> URI）；</li>
<li><code>tap</code> / <code>swipe</code> 与<b>当前帧</b>同坐标系；越界回 <code>bad-arg</code>。</li>
</ol>

<p>智能体<b>不得</b>只信过期的 <code>ui.start</code> 宽高；旋转或缩放后<b>必须</b>在下一帧头给出新宽高。</p>

### 13.6 占用与会话生命周期

<ul>
<li><code>ui.start</code> / <code>ui.stop</code> / <code>screenshot</code> / <code>tap</code> / <code>swipe</code> <b>必须</b>处于占用态且带有效 token。</li>
<li><b>同时只允许一路 UI 流</b>。同一占用方重复 <code>ui.start</code>：可以刷新会话或回 <code>busy</code>（<b>必须</b>在 description 写明）；其它占用方<b>必须</b>回 <code>busy</code>。</li>
<li><code>release</code>、租约到期、<code>goodbye</code>、进程退出：<b>必须</b>停止 UI 流并作废 URI（与媒体端点默认不停流不同）。</li>
<li>UI 连接 token 无效：断开，不出帧。</li>
</ul>

<p><code>status</code> 为可选厂商方法，不属于通用方法。</p>

### 13.7 UI 安全要求

<ul>
<li><code>security.allow</code> <b>应当</b>含 <code>local-ui-stream</code>；有触控再加 <code>local-touch-inject</code>；</li>
<li><code>ui.start</code> / <code>tap</code> <b>可以</b>列入 <code>confirm</code>；</li>
<li><code>scope</code> <b>应当</b>为 <code>lan</code>；UI 端口只绑局域网地址。</li>
</ul>
