---
title: "方法与报文参考"
description: "bmahs/1.2 控制通道采用 JSON-RPC 2.0：通用方法 describe / info / who / occupy / release，错误码映射与默认端口。"
eyebrow: "规范参考 / 方法与报文"
---

<p class="eyebrow">规范参考 / 方法与报文</p>

# 方法与报文参考

<p class="lead">
  bmahs/1.2 的控制通道是 <b>TCP 上的 JSON-RPC 2.0</b>：一行一条 UTF-8 JSON 消息，以 <code>\n</code> 结束。
  设备的通用方法只有 <b>五个</b> —— 能力差异全部由设备自述的 <code>operations</code> 承载，
  而不是靠扩充协议本身。新增品类不需要改协议，只需要设备把能力说清楚。
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">协议客户端接入</div>
    BMAHS 控制通道是标准 <b>JSON-RPC 2.0</b>（协议标识 <code>bmahs/1.2</code>）。
    智能体可以通过任意协议客户端接入 —— 脚本、SDK、智能体运行时均可，接入方式不改变协议语义。
</div>
</div>

## JSON-RPC 信封

<div class="cols2" style="align-items:stretch">
<div class="code" style="margin:0">
<div class="code__head"><span class="code__dot"></span><span class="code__name">请求 →</span>
<button class="code__copy" type="button">复制</button></div>

<pre>{
  <span class="tok-f">"jsonrpc"</span>: <span class="tok-s">"2.0"</span>,
  <span class="tok-f">"id"</span>: <span class="tok-n">1</span>,
  <span class="tok-f">"method"</span>: <span class="tok-s">"brightness"</span>,
  <span class="tok-f">"params"</span>: { <span class="tok-f">"agent"</span>: <span class="tok-s">"alice"</span>, <span class="tok-f">"level"</span>: <span class="tok-n">40</span> }
}</pre>
</div>
<div class="code" style="margin:0">
<div class="code__head"><span class="code__dot"></span><span class="code__name">← 成功响应</span>
<button class="code__copy" type="button">复制</button></div>

<pre>{
  <span class="tok-f">"jsonrpc"</span>: <span class="tok-s">"2.0"</span>,
  <span class="tok-f">"id"</span>: <span class="tok-n">1</span>,
  <span class="tok-f">"result"</span>: { <span class="tok-f">"state"</span>: <span class="tok-s">"online"</span>, <span class="tok-f">"holder"</span>: <span class="tok-s">"alice"</span>, <span class="tok-f">"level"</span>: <span class="tok-n">40</span> }
}</pre>
</div>
</div>

### 信封规则（必须）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">规则</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td>一行一消息</td><td>UTF-8 JSON + <code>\n</code>，不得含 BOM，行内不得内嵌换行</td></tr>
<tr><td><code>params</code> 必须是对象</td><td>命名参数（Named Params）；<b>禁止位置参数数组</b>。业务参数名必须与 <code>operations.args[].name</code> 对齐</td></tr>
<tr><td>禁止批量调用</td><td>JSON-RPC 批量数组 <code>[...]</code> 不得使用 —— 便于嵌入式设备解析</td></tr>
<tr><td>支持流水线</td><td>响应顺序可与请求顺序不同，按 <code>id</code> 关联；同一连接内 <code>id</code> 唯一</td></tr>
<tr><td style="white-space:nowrap">公共参数</td><td>控制类<b>应当</b>带 <code>agent</code>（智能体稳定标识）；<code>exclusive</code> 受管后必须带 <code>token</code></td></tr>
<tr><td>通知不回响应</td><td><code>hello</code> / <code>event</code> 为无 <code>id</code> 的通知；客户端收到未知通知必须忽略</td></tr>
<tr><td>发现层不是 RPC</td><td>UDP 发现报文（<a href="/docs/discovery.html">announce / query / goodbye</a>）是普通 JSON，<b>不套</b> JSON-RPC 信封</td></tr>
</tbody>
</table>
</div>

## 五个通用方法

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">方法</th><th style="white-space:nowrap">必须性</th><th style="white-space:nowrap">一句话</th><th>需要 token</th></tr></thead>
<tbody>
<tr><td class="mono">describe</td><td>所有设备必须</td><td><b>权威</b>操作清单与安全边界</td><td style="white-space:nowrap">否</td></tr>
<tr><td class="mono" style="white-space:nowrap">info</td><td>所有设备必须</td><td>精简身份：是什么、什么状态</td><td style="white-space:nowrap">否</td></tr>
<tr><td class="mono" style="white-space:nowrap">who</td><td>所有设备必须</td><td>谁在用：最后控制者与活动流</td><td style="white-space:nowrap">否</td></tr>
<tr><td class="mono">occupy</td><td>仅 exclusive 必须</td><td>取得独占权并签发 token</td><td>—（签发方）</td></tr>
<tr><td class="mono">release</td><td>仅 exclusive 必须</td><td>归还独占权、作废 token</td><td style="white-space:nowrap"><b>是</b></td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">三个只读方法的边界，不要混用</div>
<b>describe</b> 是唯一保证返回<b>完整</b> <code>operations</code> / <code>security</code> 的方法；
<b>info</b> 可以精简；<b>who</b> 不含清单，但含 <code>holder</code> 与活动 <code>streams</code>。
    问“谁在调音量”看 <code>holder</code>，问“谁在拉这条流”看 <code>streams</code>。
</div>
</div>

### describe · 权威档案

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">describe → result（节选）</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">"result"</span><span class="tok-p">:{</span>
  <span class="tok-f">"id"</span><span class="tok-p">:</span> <span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"type"</span><span class="tok-p">:</span> <span class="tok-s">"speaker"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span> <span class="tok-s">"speaker/1"</span><span class="tok-p">,</span>
  <span class="tok-f">"name"</span><span class="tok-p">:</span> <span class="tok-s">"电脑音箱"</span><span class="tok-p">,</span> <span class="tok-f">"summary"</span><span class="tok-p">:</span> <span class="tok-s">"电脑音箱，可拉取音频流并独立调节音量"</span><span class="tok-p">,</span>
  <span class="tok-f">"occupancy"</span><span class="tok-p">:</span> <span class="tok-s">"last-wins"</span><span class="tok-p">,</span> <span class="tok-f">"state"</span><span class="tok-p">:</span> <span class="tok-s">"online"</span><span class="tok-p">,</span>
  <span class="tok-f">"operations"</span><span class="tok-p">:</span> <span class="tok-p">[</span> <span class="tok-c">/* name / description / args / result / returns 完整清单 */</span> <span class="tok-p">],</span>
  <span class="tok-f">"security"</span><span class="tok-p">:</span> <span class="tok-p">{</span> <span class="tok-f">"scope"</span><span class="tok-p">:</span><span class="tok-s">"lan"</span><span class="tok-p">,</span> <span class="tok-f">"auth"</span><span class="tok-p">:</span><span class="tok-s">"none"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">,</span>
                 <span class="tok-f">"deny"</span><span class="tok-p">:[</span><span class="tok-s">"exec"</span><span class="tok-p">,</span><span class="tok-s">"write-filesystem"</span><span class="tok-p">,</span><span class="tok-s">"cloud-upload"</span><span class="tok-p">],</span> <span class="tok-f">"notes"</span><span class="tok-p">:</span><span class="tok-s">"…"</span> <span class="tok-p">},</span>
  <span class="tok-f">"endpoints"</span><span class="tok-p">:</span> <span class="tok-p">[</span> <span class="tok-p">{</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"stream_in"</span><span class="tok-p">,</span><span class="tok-f">"dir"</span><span class="tok-p">:</span><span class="tok-s">"input"</span><span class="tok-p">,</span><span class="tok-f">"access"</span><span class="tok-p">:</span><span class="tok-s">"consume"</span><span class="tok-p">,</span> <span class="tok-f">"media"</span><span class="tok-p">:[</span><span class="tok-s">"audio/L16"</span><span class="tok-p">]}</span> <span class="tok-p">]</span>
<span class="tok-p">}}</span></pre>
</div>

### who · 谁在用

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">who → result（节选）</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">"result"</span><span class="tok-p">:{</span>
  <span class="tok-f">"state"</span><span class="tok-p">:</span> <span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"occupancy"</span><span class="tok-p">:</span> <span class="tok-s">"exclusive"</span><span class="tok-p">,</span>
  <span class="tok-f">"holder"</span><span class="tok-p">:</span> <span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span> <span class="tok-n">1791000060</span><span class="tok-p">,</span> <span class="tok-f">"lease_security"</span><span class="tok-p">:</span> <span class="tok-n">60</span><span class="tok-p">,</span>
  <span class="tok-f">"streams"</span><span class="tok-p">:</span> <span class="tok-p">[</span> <span class="tok-p">{</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"s1"</span><span class="tok-p">,</span><span class="tok-f">"endpoint"</span><span class="tok-p">:</span><span class="tok-s">"stream_out"</span><span class="tok-p">,</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span><span class="tok-f">"since"</span><span class="tok-p">:</span><span class="tok-n">1790999700</span><span class="tok-p">}</span> <span class="tok-p">]</span>
<span class="tok-p">}}</span>
<span class="tok-c">// until 为 Unix 秒；无限期租约（ttl=9999）时 until=0、lease_security=9999</span></pre>
</div>

### occupy / release · 仅 exclusive

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">占用 → 控制 → 释放</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-c">// 1) 占用（ttl 可选 10–9999，缺省租约 60 秒）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span><span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span><span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span><span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span><span class="tok-f">"event"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span><span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">,</span>
  <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span> <span class="tok-n">1791000060</span><span class="tok-p">,</span> <span class="tok-f">"lease_security"</span><span class="tok-p">:</span> <span class="tok-n">60</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span> <span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>

<span class="tok-c">// 2) 被他人占用时的错误响应（retryable=true，data 附 holder/until，不含 token）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span><span class="tok-f">"error"</span><span class="tok-p">:{</span><span class="tok-f">"code"</span><span class="tok-p">:</span><span class="tok-n">-32001</span><span class="tok-p">,</span>
  <span class="tok-f">"message"</span><span class="tok-p">:</span><span class="tok-s">"书房手机正被 alice 占用，租约约 42 秒后到期"</span><span class="tok-p">,</span>
  <span class="tok-f">"data"</span><span class="tok-p">:{</span><span class="tok-f">"bmahs_code"</span><span class="tok-p">:</span><span class="tok-s">"occupied"</span><span class="tok-p">,</span> <span class="tok-f">"retryable"</span><span class="tok-p">:</span><span class="tok-n">true</span><span class="tok-p">,</span> <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"until"</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">}}}</span>

<span class="tok-c">// 3) 释放（token 与签发时的 agent 必须匹配）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">5</span><span class="tok-p">,</span><span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span><span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"alice"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2c3d4e5f60708"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span><span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">5</span><span class="tok-p">,</span><span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"event"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">false</span><span class="tok-p">}}</span></pre>
</div>

## 错误码映射（bmahs_code → JSON-RPC）

<div class="table-wrap">
<table>
<thead><tr><th><code>error.data.bmahs_code</code></th><th>JSON-RPC <code>code</code></th><th>retryable</th><th style="white-space:nowrap">触发条件</th></tr></thead>
<tbody>
<tr><td class="mono">parse-error</td><td class="mono">-32700</td><td style="white-space:nowrap">否</td><td>行不是合法 JSON</td></tr>
<tr><td class="mono">invalid-request</td><td class="mono">-32600</td><td style="white-space:nowrap">否</td><td>非法 JSON-RPC 信封（缺 <code>jsonrpc</code> 等）</td></tr>
<tr><td class="mono">unknown-action</td><td class="mono">-32601</td><td style="white-space:nowrap">否</td><td><code>method</code> 不在 <code>operations</code> 中</td></tr>
<tr><td class="mono">bad-arg</td><td class="mono">-32602</td><td style="white-space:nowrap">否</td><td>参数缺失、类型或范围错误；对接时 kind/media 不匹配</td></tr>
<tr><td class="mono">internal-error</td><td class="mono">-32603</td><td style="white-space:nowrap">否</td><td>设备内部错误</td></tr>
<tr><td class="mono">occupied</td><td class="mono">-32001</td><td style="white-space:nowrap"><b>是</b></td><td><b>仅 exclusive</b>：已被他人占用；<code>last-wins</code> 不得使用</td></tr>
<tr><td class="mono">offline</td><td class="mono">-32002</td><td style="white-space:nowrap">是</td><td>设备已离线或即将退出</td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td class="mono">-32003</td><td style="white-space:nowrap">是</td><td>暂时无法执行，或端点会话已满且 <code>preempt=false</code></td></tr>
<tr><td class="mono">unauthorized</td><td class="mono">-32004</td><td style="white-space:nowrap">否</td><td><code>token</code> 缺失或不匹配（或与 agent 不绑定）</td></tr>
<tr><td class="mono">denied</td><td class="mono">-32005</td><td style="white-space:nowrap">否</td><td>触犯 <code>security.deny</code>，或未通过 <code>confirm</code>；默认不可重试，仅确认超时时 <code>data.retryable=true</code></td></tr>
<tr><td class="mono">bad-state</td><td class="mono">-32006</td><td style="white-space:nowrap">否</td><td>方法在当前状态下不可用（如未 <code>ui.start</code> 即 <code>tap</code>）</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">以 bmahs_code 为稳定判据</div>
    客户端<b>应当</b>按 <code>error.data.bmahs_code</code>（而非裸整数）判定错误类别；
<code>retryable=false</code> 的错误<b>不得自动重试</b>。
    注意：错误码 <code>busy</code> 与公告字段 <code>busy</code> 同名不同义。
</div>
</div>

## 剖面方法（声明则必须实现）

<p><b>剖面（profile）</b>是设备<b>可选实现</b>的扩展方法集：设备在自述里声明某个剖面，就必须实现该剖面下的全部方法；未声明则不必实现。当前定义 <code>UI接口</code> 与 <code>端点与数据流接口</code> 两个可选剖面。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">剖面</th><th style="white-space:nowrap">方法</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr>
<td rowspan="4">UI接口<br><small style="color:var(--text-muted)">必须 exclusive</small></td>
<td class="mono">ui.start / ui.stop</td><td>启动 / 停止画面流；<code>ui.start</code> 返回 UI URI 与实际宽高</td>
</tr>
<tr><td class="mono">screenshot</td><td>抓帧（不在控制 JSON 里传整图）</td></tr>
<tr><td class="mono">tap / swipe</td><td>触控注入，与当前帧同坐标系</td></tr>
<tr><td colspan="2">画面走<b>二进制帧</b>（JPEG，占用 token 握手），不走 JSON-RPC</td></tr>
<tr>
<td rowspan="3">端点与数据流<br><small style="color:var(--text-muted)">声明 endpoints</small></td>
<td class="mono">stream.start / stream.accept</td><td>开流（output / input 缺省方法），返回 <code>stream</code> URI 与 <code>format</code></td>
</tr>
<tr><td class="mono">stream.join</td><td>Sink 自连方式：让本端去拉取对端（有 input 端点的真实设备应当实现）</td></tr>
<tr><td class="mono">stream.stop</td><td>拆除本端会话</td></tr>
</tbody>
</table>
</div>

<p>详见 <a href="/docs/streaming.html">数据流：推与拉</a>；UI接口细节见规范第 13 章。</p>

## 默认端口

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">用途</th><th style="white-space:nowrap">默认端口</th><th style="white-space:nowrap">编码</th></tr></thead>
<tbody>
<tr><td>发现（UDP 组播）</td><td class="mono" style="white-space:nowrap">5354</td><td>普通 JSON（非 RPC），≤1400 字节</td></tr>
<tr><td><code>control</code>（TCP）</td><td class="mono" style="white-space:nowrap">9527</td><td>JSON-RPC 2.0，一行一消息</td></tr>
<tr><td>UI 流（TCP）</td><td class="mono" style="white-space:nowrap">9531</td><td>二进制帧 + token 握手</td></tr>
<tr><td>数据流（TCP）</td><td class="mono" style="white-space:nowrap">9532</td><td>按 <code>format</code> 载荷，无握手</td></tr>
</tbody>
</table>
</div>

## 典型调用顺序

<ol class="steps">
<li><div class="steps__title">发现</div>组播 <code>query</code> → 收 <code>announce</code>，按 <code>name</code> + <code>summary</code> 选型。</li>
<li><div class="steps__title">连接</div>TCP 连上 <code>control</code>，立刻收到 <code>hello</code> 通知（无 <code>id</code>）。</li>
<li><div class="steps__title">describe</div>读参与设备的权威档案：能力、边界、端点。</li>
<li><div class="steps__title">occupy（仅 exclusive）</div>先查 <code>who</code>，再取 token，保存好。</li>
<li><div class="steps__title">业务方法 × N</div>按编排序列执行；<code>confirm</code> 级动作交给人，等待期不重复请求。</li>
<li><div class="steps__title">release</div>任务结束（含失败/取消）必做 —— 这一步最容易被漏掉，也最容易阻塞他人。</li>
</ol>

## 下一步

<div class="cards">
<a class="card" href="/docs/fields.html">
<div class="card__title">字段与消息 →</div>
<div class="card__desc">自述、操作、安全、端点的完整字段定义。</div>
</a>
</div>
