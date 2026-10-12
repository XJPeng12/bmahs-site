---
title: "端点与数据流接口"
description: "端点对象定义、开流对接规程（join / 中继）、format 格式、会话生命周期与抢占规则。"
eyebrow: "规范全文 · 第 14 章"
---

<p class="eyebrow">规范全文 · 第 14 章</p>

# 端点与数据流接口

<p>适用于可向其它设备<b>提供或消费</b>连续媒体的设备。不参与媒体对接的设备<b>不得</b>声明 <code>endpoints</code>。</p>

<p>本接口的规范：<b>协议客户端如何把一个 <code>dir=output</code> 端点接到一个 <code>dir=input</code> 端点</b>。</p>

<ul>
<li><b>真实 BMAHS 两端</b>：智能体 / 协议客户端按本章对接，<b>不必</b>经网关。</li>
<li><b>一端为网关虚拟设备</b>：对该虚拟设备的 <code>control</code> 发同一套对接；字节进入网关是因为该端点实现运行于网关进程。</li>
<li><code>occupancy</code> 只约束<b>控制方法</b>；端点上的活动流是<b>独立会话</b>：切歌、调音量、更换 last-wins 的 <code>holder</code> <b>不得</b>拆流。</li>
<li>仅仅声明 <code>endpoints</code> <b>不</b>使设备变为 <code>exclusive</code>。</li>
</ul>

### 14.1 声明义务

<ul>
<li>在 <code>hello</code> 通知 params / <code>describe</code> 的 <code>result</code> 中提供 <code>endpoints[]</code>（完整对象，含 <code>description</code>）；</li>
<li><code>capabilities</code> 含开流方法名；有 <code>input</code> 时<b>应当</b>含 <code>stream.join</code>；</li>
<li>开流成功后才返回 <code>stream</code> URI（<b>不得</b>出现在 UDP / TXT / 未开流的 <code>hello</code> / <code>who</code> / <code>describe</code>）。</li>
</ul>

### 14.2 端点对象定义

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>id</code></td><td>string</td><td style="white-space:nowrap">是</td><td>如 <code>stream_out</code>、<code>a2dp_in</code></td></tr>
<tr><td style="white-space:nowrap"><code>dir</code></td><td>string</td><td style="white-space:nowrap">是</td><td><code>output</code> 或 <code>input</code></td></tr>
<tr><td style="white-space:nowrap"><code>kind</code></td><td>string</td><td style="white-space:nowrap">是</td><td>本版常用 <code>audio</code>；亦可 <code>video</code> / <code>frame</code> / <code>byte</code></td></tr>
<tr><td><code>media</code></td><td>string[]</td><td style="white-space:nowrap">是</td><td>至少 1 个 IANA 类型（如 <code>audio/L16</code>；<code>audio/pcm</code> 为兼容事实写法）</td></tr>
<tr><td><code>access</code></td><td>string</td><td style="white-space:nowrap">是</td><td>output 用 <code>provide</code>，input 用 <code>consume</code></td></tr>
<tr><td><code>max_sessions</code></td><td style="white-space:nowrap">int</td><td style="white-space:nowrap">应当</td><td style="white-space:nowrap">默认 1</td></tr>
<tr><td><code>preempt</code></td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">可以</td><td>会话已满时新开流是否抢占旧流。缺省 <code>true</code>（家用投播）；会议录制等可 <code>false</code>（回 <code>busy</code>）</td></tr>
<tr><td><code>description</code></td><td>string</td><td style="white-space:nowrap">是</td><td><b>自然语言</b>：该端点产/消费什么、给谁用</td></tr>
<tr><td><code>open</code> / <code>close</code></td><td>string</td><td style="white-space:nowrap">应当</td><td>缺省 output=<code>stream.start</code>，input=<code>stream.accept</code>，关闭=<code>stream.stop</code></td></tr>
<tr><td><code>close_on_release</code></td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">可以</td><td><b>仅 exclusive 有意义</b>。缺省 <code>false</code>：<code>release</code> 不停数据流。UI 不适用本字段</td></tr>
</tbody>
</table>
</div>

<p>示例：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">端点对象示例</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream_out&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;dir&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;output&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;kind&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;audio&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;media&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span><span class="tok-s">&quot;audio/L16&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;access&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;provide&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;max_sessions&quot;</span><span class="tok-p">:</span> <span class="tok-n">1</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;preempt&quot;</span><span class="tok-p">:</span> true<span class="tok-p">,</span>
  <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;正在播放的音乐音频输出，可供其它设备或协议客户端拉取。&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;open&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream.start&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;close&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream.stop&quot;</span>
<span class="tok-p">}</span></pre>
</div>

### 14.3 对接规程（必须）

<p>一次对接 = 将<b>一个 output</b> 接到<b>一个 input</b>，直到停止或被抢占。</p>

<p><b>前置条件</b>（不满足则不得开流）：两端 <code>kind</code> 相同；<code>media[]</code> 有交集（选定一项作为 <code>format.media</code>）；各端按该设备 <code>occupancy</code> 取得开流权；采集端点若在 <code>confirm</code> 中则先取得确认。</p>

<p><b>开流权</b>：</p>

<div class="table-wrap">
<table>
<thead><tr><th>设备 occupancy</th><th><code>stream.start</code> / <code>accept</code> / <code>join</code></th></tr></thead>
<tbody>
<tr><td><code>last-wins</code></td><td>任何能发控制的 agent 可开；不要求 occupy、不带 token</td></tr>
<tr><td><code>exclusive</code></td><td>仅当前占用方，<b>必须</b>带有效 token</td></tr>
</tbody>
</table>
</div>

<p><b>方式 A：Sink 自连（真实设备默认应当采用）</b></p>

<p>Sink 作为 BMAHS 客户端去拉取 Source。智能体不经手 URI。</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示例</span>
<button class="code__copy" type="button">复制</button></div>

<pre>协议客户端 → Sink:   stream.join  { params: { peer: {...}, media } }
Sink     → Source: stream.start （Sink 的 agent）
Source   → Sink:   result 含 stream URI + format
Sink 连接到 URI，按 format 拉取字节</pre>
</div>

<p><code>stream.join</code> 请求示例：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">stream.join 请求</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-n">7</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream.join&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span> <span class="tok-p">{</span>
    <span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;alice-runtime&quot;</span><span class="tok-p">,</span>
    <span class="tok-f">&quot;endpoint&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;a2dp_in&quot;</span><span class="tok-p">,</span>
    <span class="tok-f">&quot;peer&quot;</span><span class="tok-p">:</span> <span class="tok-p">{</span>
      <span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;bmahs-qqmusicstream-01&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;control&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;tcp://192.168.1.20:9527&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;endpoint&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;stream_out&quot;</span>
    <span class="tok-p">}</span><span class="tok-p">,</span>
    <span class="tok-f">&quot;media&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;audio/L16&quot;</span>
  <span class="tok-p">}</span>
<span class="tok-p">}</span></pre>
</div>

<p>成功响应 <code>result</code> 只含 <code>format</code> 摘要、公开 <code>streams</code> 项，<b>不含</b> URI。Source 侧 <code>streams[].agent</code> <b>应当</b>为 Sink 的设备 <code>id</code>。</p>

<p>有 <code>input</code> 端点的真实设备<b>应当</b>实现 <code>stream.join</code>；MCU 做不到则不得声明 <code>join</code>，客户端改走方式 B。虚拟 Sink 的 <code>stream.join</code> 由网关代码实现。</p>

<p><b>方式 B：协议客户端中继（必须总能走通）</b></p>

<p>两台设备均不能当 TCP 客户端、或需在客户端转码时：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示例</span>
<button class="code__copy" type="button">复制</button></div>

<pre>客户端 → Source: stream.start  → result 得到 URI，拉取
客户端 → Sink:   stream.accept → result 得到 URI，灌入
客户端进程拷贝字节（仍不是模型）</pre>
</div>

<p>对端若声明了 <code>stream.join</code>，客户端<b>应当</b>优先方式 A。</p>

<p><b>禁止事项</b>：</p>

<ul>
<li>模型返回值中出现 PCM、流 URI、占用 token；</li>
<li>规定真实设备对接必须先占用某网关再 <code>route</code>；</li>
<li>把占用 token 当作长期凭据转交第三方。</li>
</ul>

<p>转码、1 拉 N 推流、显示名路由表<b>不是</b>发现层对象。客户端可本地复制 PCM；Source 的 <code>max_sessions</code> 只约束该设备愿开几路 TCP。</p>

### 14.4 开流、格式与媒体 TCP

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">方法</th><th style="white-space:nowrap">规范</th></tr></thead>
<tbody>
<tr><td><code>stream.start</code>（output）</td><td>成功 <code>result</code> 含 <code>stream</code> URI 与 <code>format</code>。端口与 <code>control</code> 分开，建议默认 <b>9532</b>；<b>每次开流应当换端口或确保旧 URI 立即作废</b></td></tr>
<tr><td><code>stream.accept</code>（input，方式 B）</td><td>成功 <code>result</code> 含供对端灌入的 URI 与 <code>format</code></td></tr>
<tr><td><code>stream.stop</code></td><td>拆除本端该会话</td></tr>
<tr><td style="white-space:nowrap">超时</td><td>开流后 <b>10 秒内</b>无 TCP 连入：设备<b>必须</b>作废该 URI 并停止监听</td></tr>
</tbody>
</table>
</div>

<p><b><code>format</code> 对象（必须带齐）</b>：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>mode</code></td><td>string</td><td style="white-space:nowrap">是</td><td><code>raw</code> 或 <code>framed</code></td></tr>
<tr><td><code>media</code></td><td>string</td><td style="white-space:nowrap">是</td><td><b>必须</b>与端点 <code>media[]</code> 中一项一致</td></tr>
<tr><td><code>sample_rate</code> / <code>channels</code> / <code>bits</code> / <code>signed</code></td><td>int / bool</td><td style="white-space:nowrap">音频必须</td><td>取值由 <code>media</code> 类型决定（如 <code>audio/L16</code>：48000 / 2 / 16 / true）</td></tr>
<tr><td><code>endian</code></td><td>string</td><td>位深 &gt; 8 必须</td><td><code>le</code> / <code>be</code>（本规范以 <code>format.endian</code> 为准；RFC 3551 的 L16 默认网络字节序，特此注明偏离）</td></tr>
</tbody>
</table>
</div>

<p><code>framed</code> 模式：每包 <code>[u32 BE payload_len][payload]</code>；<b>禁止</b>在 payload 内再套 JSON。</p>

<p><b>数据流 TCP</b>：客户端连接到未公开的 <code>stream</code> URI 后<b>立即</b>按 <code>format</code> 传输数据，<b>不做</b>占用 token / 流票握手。URI 本身不得出现在发现层；能拿到 URI 即视为已通过开流授权。</p>

<p><b>例外</b>：UI 流仍按 §13.4 做占用 token 握手。</p>

<p><b>禁止</b>把连续媒体塞进 JSON-RPC 控制消息。</p>

### 14.5 会话生命周期、抢占与停流

<p>设备为每条活动流记录：<code>id</code>、<code>endpoint</code>、开流者 <code>agent</code>、<code>since</code>。<code>who</code> / <code>describe</code> 的 <code>result</code> <b>应当</b>含 <code>streams[]</code>（无 URI）。<code>announce.busy</code> 在存在活动流、UI 流或 exclusive 占用时为 <code>true</code>。</p>

<p><b>不得</b>因下列原因自动拆数据流：</p>

<ul>
<li>last-wins 更换 <code>holder</code>；</li>
<li>exclusive 的 <code>release</code> / 有限租约到期（除非该端点 <code>close_on_release=true</code>）；</li>
<li>控制 TCP 断开。</li>
</ul>

<p><b>必须</b>拆流的情形：</p>

<ul>
<li><code>stream.stop</code>；</li>
<li>对端 TCP 断开；</li>
<li><code>goodbye</code> / 进程退出；</li>
<li>同一 endpoint 上合法的抢占；</li>
<li>开流后无人连入超时。</li>
</ul>

<p><b>停流合法者</b>：</p>

<ol>
<li>对该会话发 <code>stream.stop</code> 的开流者（方式 A 即 Sink；方式 B 即协议客户端）；</li>
<li>同一 endpoint 新的开流 / <code>join</code>，且 <code>preempt=true</code>（或缺省 true）：新流成功，旧 TCP 断开，旧 URI 作废；</li>
<li>设备自身：<code>goodbye</code>、超时、硬件拔除。</li>
</ol>

<p><code>preempt=false</code> 且会话已满：新开流回 <code>busy</code>（<code>-32003</code>），旧流不动。</p>

<p>旧流被抢或对端消失的<b>唯一</b>信号是 TCP 断开；转发者<b>必须</b>拆除这一侧，不得保持半开连接继续灌流。协议<b>不</b>在数据流层上另发 JSON 通知。</p>

<p><code>max_sessions&gt;1</code> 时先用满会话，再按抢占规则处理。</p>

<p><b>失败情形</b>：Source <code>goodbye</code> 或无心跳删除 → 流 URI 作废，对端<b>应当</b>看到 TCP 断开；kind / media 无交集 → <code>bad-arg</code>。</p>

### 14.6 端点安全要求

<ul>
<li><code>security.allow</code> <b>应当</b>含相应标签（如 <code>local-audio-stream</code>）；</li>
<li>采集开流<b>应当</b>列入 <code>confirm</code>；</li>
<li><code>stream</code> URI <b>禁止</b>写入 UDP / TXT / 未开流的 <code>hello</code> / <code>who</code> / <code>describe</code>。</li>
</ul>
