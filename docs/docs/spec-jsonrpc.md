---
title: "消息编码规范"
description: "TCP 控制通道的 JSON-RPC 2.0 信封：请求、成功响应、错误响应、通知（hello / event）与禁止批量调用。"
eyebrow: "规范全文 · 第 8 章"
---

<p class="eyebrow">规范全文 · 第 8 章</p>

# 消息编码规范


### 8.1 总则

<ul>
<li>控制通道为 TCP；<b>一行一个 UTF-8 JSON 消息，以 <code>\n</code> 结束</b>；<b>不得</b>含 BOM；一行<b>不得</b>内嵌换行符。</li>
<li>所有控制消息<b>必须</b>是合法的 JSON-RPC 2.0 对象，包含 <code>&quot;jsonrpc&quot;:&quot;2.0&quot;</code> 字段。</li>
<li>消息分四类：<ul>
<li><b>请求（Request）</b>：含 <code>id</code>，<code>method</code>，<code>params</code>（对象形式）——智能体/客户端 → 设备；</li>
<li><b>成功响应（Result）</b>：含与请求相同的 <code>id</code> 与 <code>result</code> 对象——设备 → 调用方；</li>
<li><b>错误响应（Error）</b>：含与请求相同的 <code>id</code> 与 <code>error</code> 对象——设备 → 调用方；</li>
<li><b>通知（Notification）</b>：无 <code>id</code>——设备 → 客户端的单向推送（<code>hello</code>、<code>event</code>）。</li>
</ul></li>
<li><code>method</code>（方法名）与 BMAHS 动作名一致：小写，可含 <code>.</code>（如 <code>ui.start</code>、<code>stream.join</code>）——JSON-RPC 2.0 允许。</li>
<li><code>params</code> <b>必须</b>使用<b>对象形式</b>（Named Params），<b>不得</b>使用数组位置参数。</li>
<li>非法输入的处理：<b>行不是合法 JSON</b> 时，设备<b>必须</b>回错误响应 <code>code=-32700</code>（Parse error）；<b>JSON 合法但信封非法</b>（缺 <code>jsonrpc</code> 字段、<code>jsonrpc</code> 不为 <code>&quot;2.0&quot;</code>、<code>method</code> 非字符串等）时，回 <code>code=-32600</code>（Invalid Request）；两种情况无法解析出 <code>id</code> 时 <code>id=null</code>。</li>
<li>客户端<b>必须</b>忽略来自设备的未知 <code>method</code> 通知。</li>
<li>同一 TCP 连接上<b>必须</b>支持请求流水线（pipelining）：响应顺序不必与请求顺序一致，按 <code>id</code> 关联。</li>
</ul>

### 8.2 请求（智能体/协议客户端 → 设备）

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">请求报文示例</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">40</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>jsonrpc</code></td><td style="white-space:nowrap">是</td><td>固定 <code>&quot;2.0&quot;</code></td></tr>
<tr><td style="white-space:nowrap"><code>id</code></td><td style="white-space:nowrap">是</td><td>字符串或整数；<b>不得</b>为 <code>null</code>；同一连接内发起方保证唯一</td></tr>
<tr><td><code>method</code></td><td style="white-space:nowrap">是</td><td>BMAHS 动作名（见 §10.4 通用方法、品类文档业务方法、§13.3 UI 方法、§14.4 端点方法）</td></tr>
<tr><td><code>params</code></td><td style="white-space:nowrap">是</td><td><b>对象</b>。公共参数 + 该动作 <code>operations[].args</code> 声明的业务参数</td></tr>
</tbody>
</table>
</div>

<p><b>公共 <code>params</code> 字段</b>：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>agent</code></td><td>控制类应当</td><td>智能体稳定标识（建议 <code>[a-z0-9-]</code>）。只读方法缺失不得拒绝</td></tr>
<tr><td><code>token</code></td><td>仅 exclusive 受管时必须</td><td><code>occupy</code> 成功返回的占用令牌（§11.3）</td></tr>
</tbody>
</table>
</div>

<p><b>参数校验规范</b>：<code>params</code> 中出现 <code>operations</code> 未声明的业务参数名，设备<b>应当</b>忽略或回 <code>bad-arg</code>；<code>required</code> 缺失、类型不符、越出 <code>min</code>/<code>max</code>、不在 <code>enum</code>、不满足 <code>any_of</code>：<b>必须</b>回错误响应，<code>error.data.bmahs_code=&quot;bad-arg&quot;</code>（JSON-RPC <code>code=-32602</code>，见第 9 章）。</p>

### 8.3 成功响应（设备 → 调用方）

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">成功响应示例</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">40</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<ul>
<li><code>result</code> <b>必须</b>是对象；原 BMAHS 1.x 报文中的 <code>ok:true</code> / <code>action</code> 字段<b>废止</b>（由 JSON-RPC 信封的 <code>result</code> 与请求 <code>method</code>/<code>id</code> 隐含）。</li>
<li><code>result</code> 内容 = 该方法 <code>operations[].returns</code> 声明的字段（见 §10.3）。</li>
<li>exclusive 占用方控制成功时<b>应当</b>在 <code>result</code> 中回显 <code>token</code>；<code>last-wins</code> <b>不得</b>回传占用 <code>token</code>。</li>
</ul>

### 8.4 错误响应（设备 → 调用方）

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">错误响应示例</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;error&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;code&quot;</span><span class="tok-p">:</span><span class="tok-n">-32001</span><span class="tok-p">,</span><span class="tok-f">&quot;message&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;书房手机正被 alice 占用，租约约 42 秒后到期&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;data&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;bmahs_code&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupied&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;retryable&quot;</span><span class="tok-p">:</span>true<span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;until&quot;</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">}</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>error.code</code></td><td style="white-space:nowrap">是</td><td><b>整数</b>，JSON-RPC 错误码（映射见第 9 章）</td></tr>
<tr><td><code>error.message</code></td><td style="white-space:nowrap">是</td><td><b>自然语言</b>失败原因短句；<b>不得</b>只回与错误码相同的无信息词</td></tr>
<tr><td><code>error.data</code></td><td style="white-space:nowrap">是</td><td>对象，<b>必须</b>含 <code>bmahs_code</code>（字符串）与 <code>retryable</code>（bool）；<b>可以</b>附加该错误码的关联字段（如 <code>holder</code> / <code>until</code>）</td></tr>
</tbody>
</table>
</div>

### 8.5 通知（设备 → 客户端）

<p><b><code>hello</code> 通知（必须）</b>——TCP 连接建立后设备<b>立刻</b>发送的第一行，取代 1.x 的普通 JSON <code>hello</code>：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">hello 通知</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;hello&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span>
  <span class="tok-f">&quot;protocol&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bmahs/1.2&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;light&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;service&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;light/1&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;acme-lamp-00a1&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;客厅灯&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;summary&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;这是客厅的吸顶灯。智能体可开关灯光、把亮度设到 0–100%。本灯为 last-wins：直接发命令即可。&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;constraint&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;直接调用 on、off、brightness。不必 occupy。&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;capabilities&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-s">&quot;on&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;off&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;describe&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;info&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;who&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;operations&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;security&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;scope&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;lan&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;auth&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;none&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;occupancy&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;last-wins&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;allow&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-s">&quot;local-light-control&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span><span class="tok-f">&quot;deny&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-s">&quot;exec&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;network-fetch&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;cloud-upload&quot;</span><span class="tok-p">,</span><span class="tok-s">&quot;write-filesystem&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span><span class="tok-f">&quot;confirm&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-p">]</span><span class="tok-p">,</span><span class="tok-f">&quot;notes&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;只控制本灯的开关与亮度。后来的控制立即生效。&quot;</span><span class="tok-p">}</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>false<span class="tok-p">,</span>
  <span class="tok-f">&quot;control&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tcp://192.168.1.42:9527&quot;</span>
<span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<ul>
<li>通知<b>不得</b>包含 <code>id</code>；客户端收到后<b>不得</b>回任何响应。</li>
<li><code>params</code> 字段集与 1.x <code>hello</code> 完全一致（<code>protocol</code> / <code>type</code> / <code>service</code> / <code>id</code> / <code>name</code> / <code>summary</code> / <code>constraint</code> / <code>capabilities</code> / <code>operations</code> / <code>security</code>（含 occupancy）/ <code>endpoints</code>（有端点时）/ <code>state</code> / <code>busy</code> / <code>event</code>（应当）/ <code>holder</code>（有则必须）/ <code>control</code> / <code>hb</code> / <code>width</code>、<code>height</code>（有 ui 时应当））。</li>
<li><code>params</code> <b>不得</b>包含 <code>token</code> 或未开流的 <code>stream</code> / <code>ui</code> URI。</li>
</ul>

<p><b><code>event</code> 通知（可选）</b>——设备状态变化推送（如租约到期、被动拆流）：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">event 通知</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;event&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupy&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>true<span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

<p>声明实现 <code>event</code> 通知的设备<b>应当</b>在 <code>hello</code> 通知 <code>params</code> 中以 <code>notifications:[&quot;event&quot;]</code> 声明；客户端<b>不得</b>依赖 <code>event</code> 通知实现正确性（<b>应当</b>以轮询 <code>who</code> / <code>describe</code> 为准）。</p>

### 8.6 批量调用

<p>JSON-RPC 2.0 批量数组（<code>[...]</code>）<b>不得</b>使用——控制通道为逐行单消息语义，便于嵌入式设备解析。</p>
