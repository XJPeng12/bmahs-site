---
title: "数据流：推与拉"
description: "端点模型 stream_out / stream_in，以及 stream.join（拉）与 stream.accept（推）两种传输方式。"
eyebrow: "核心概念 / L2"
---

<p class="eyebrow">核心概念 / L2</p>

# 数据流：推与拉

<p class="lead">
  这是 BMAHS 设备传输各类数据流的基础，也是多房间同播（一源多路分发）的前提；多设备间的播放时钟同步需设备侧另行保证。用一句话记住：
<code>stream_out</code> 是<b>水龙头</b>，<code>stream_in</code> 是<b>水杯</b>；
<code>stream.join</code> 是自己去接水，<code>stream.accept</code> 是让别人倒水。
</p>

## 端点对象

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">id</td><td>string</td><td>端点标识，如 <code>stream_out</code> / <code>a2dp_in</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">dir</td><td style="white-space:nowrap">enum</td><td><code>output</code>（可提供流，<b>水龙头</b>）或 <code>input</code>（可接收流，<b>水杯</b>）</td></tr>
<tr><td class="mono" style="white-space:nowrap">kind</td><td>string</td><td>常用 <code>audio</code>；亦可 <code>video</code> / <code>frame</code> / <code>byte</code></td></tr>
<tr><td class="mono">media</td><td>string[]</td><td>至少一个 IANA 媒体类型，如 <code>audio/L16</code>（<code>audio/pcm</code> 为兼容事实写法）</td></tr>
<tr><td class="mono">access</td><td style="white-space:nowrap">enum</td><td>output 用 <code>provide</code>，input 用 <code>consume</code></td></tr>
<tr><td class="mono">max_sessions</td><td style="white-space:nowrap">int</td><td>同播上限，<b>默认 1</b></td></tr>
<tr><td class="mono">preempt</td><td style="white-space:nowrap">bool</td><td>会话已满时新流是否抢占旧流，<b>缺省 true</b>（家用投播）；会议录制等可 <code>false</code>（回 <code>busy</code>）</td></tr>
<tr><td class="mono">open / close</td><td>string</td><td>开 / 关流方法名；缺省 output=<code>stream.start</code>，input=<code>stream.accept</code>，关闭=<code>stream.stop</code></td></tr>
<tr><td class="mono">close_on_release</td><td style="white-space:nowrap">bool</td><td>仅 exclusive 有意义；缺省 <code>false</code>：release 不停数据流</td></tr>
<tr><td class="mono">description</td><td>string</td><td>自然语言：该端点产 / 消费什么、给谁用</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">URI 只在开流后出现</div>
<code>stream</code> URI 仅在开流方法的 <code>result</code> 中返回，<b>不得</b>出现在 UDP、Bonjour TXT、
    未开流的 <code>hello</code> / <code>who</code> / <code>describe</code>。能拿到 URI 即视为已通过开流授权。
</div>
</div>

<div class="figure">
<svg viewBox="0 0 680 268" role="img" aria-label="推与拉两种音频流传输方式">
<text class="dg-mk" x="20" y="16">方式 A · stream.join（拉）</text>
<text class="dg-mk" x="20" y="156">方式 B · stream.accept（推）</text>

<rect class="dg-dev" x="20" y="30" width="150" height="66" rx="10"/>
<text class="dg-l" x="38" y="56">音源</text>
<text class="dg-m" x="38" y="76">stream_out · provide</text>

<line class="dg-line--accent" x1="174" y1="63" x2="266" y2="63"/>
<polygon points="266,63 256,58 256,68" style="fill:var(--accent)"/>
<text class="dg-m" x="180" y="55">四要素请求</text>

<rect class="dg-agent" x="272" y="30" width="150" height="66" rx="10"/>
<text class="dg-l" x="290" y="56">音箱</text>
<text class="dg-m" x="290" y="76">stream_in · consume</text>

<line class="dg-line" x1="266" y1="112" x2="174" y2="112"/>
<polygon points="174,112 184,107 184,117" style="fill:var(--border-strong)"/>
<text class="dg-m" x="180" y="130">PCM 流回到音箱</text>

<text class="dg-s" x="440" y="52">音箱主动去拉：找谁 / 在哪 /</text>
<text class="dg-s" x="440" y="70">接哪个口 / 什么格式</text>
<text class="dg-m" x="440" y="90">最适合：音箱能主动出网</text>

<rect class="dg-agent" x="20" y="170" width="150" height="66" rx="10"/>
<text class="dg-l" x="38" y="196">音箱</text>
<text class="dg-m" x="38" y="216">stream_in · consume</text>

<line class="dg-line--accent" x1="272" y1="203" x2="174" y2="203"/>
<polygon points="174,203 184,198 184,208" style="fill:var(--accent)"/>
<text class="dg-m" x="186" y="195">音源推流进来</text>

<rect class="dg-dev" x="272" y="170" width="150" height="66" rx="10"/>
<text class="dg-l" x="290" y="196">音源</text>
<text class="dg-m" x="290" y="216">stream_out · provide</text>

<text class="dg-s" x="440" y="192">让对端把流推过来</text>
<text class="dg-s" x="440" y="210">最适合：音箱不方便出网</text>
</svg>
<p class="figure__cap">图 1 · 拉（join）由使用方发起，推（accept）由提供方发起 —— 按网络条件选</p>
</div>

## stream.join：Sink 自己去拉

<p>本页 <b>Sink</b> 指接收端 / 拉流方（<code>dir=input</code> 端点），与提供端 <b>Source</b> 相对。</p>

<p>有 <code>input</code> 端点的真实设备<b>应当</b>实现 <code>stream.join</code>（方式 A，默认首选）；
MCU 做不到则不得声明 <code>join</code>，客户端改走方式 B（中继）。</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">音箱向音源拉流（stream.join）</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">7</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"stream.join"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span>
  <span class="tok-f">"agent"</span><span class="tok-p">:</span> <span class="tok-s">"alice-runtime"</span><span class="tok-p">,</span>          <span class="tok-c">// ① 谁在发起</span>
  <span class="tok-f">"endpoint"</span><span class="tok-p">:</span> <span class="tok-s">"stream_in"</span><span class="tok-p">,</span>            <span class="tok-c">// ② 接本端哪个口</span>
  <span class="tok-f">"peer"</span><span class="tok-p">:</span> <span class="tok-p">{</span>                        <span class="tok-c">// ③ 找谁拉（对端档案）</span>
    <span class="tok-f">"id"</span><span class="tok-p">:</span> <span class="tok-s">"bmahs-qqmusicstream-01"</span><span class="tok-p">,</span>
    <span class="tok-f">"control"</span><span class="tok-p">:</span> <span class="tok-s">"tcp://192.168.1.20:9527"</span><span class="tok-p">,</span>
    <span class="tok-f">"endpoint"</span><span class="tok-p">:</span> <span class="tok-s">"stream_out"</span>
  <span class="tok-p">},</span>
  <span class="tok-f">"media"</span><span class="tok-p">:</span> <span class="tok-s">"audio/L16"</span>                  <span class="tok-c">// ④ 什么格式</span>
<span class="tok-p">}}</span>

<span class="tok-c">// 成功 result 只含 format 摘要与公开 streams 项 —— URI 不进模型上下文</span></pre>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">模型只决定“把谁接到谁”</div>
    智能体发出的是 <code>stream.join</code> 这样的<b>控制指令</b>；字节由 Sink 设备自连拉取。
    若两端都不能当 TCP 客户端（或需转码），协议客户端以方式 B 中继 —— 拷贝字节的仍然是客户端进程，<b>不是模型</b>。
</div>
</div>

## format：格式必须带齐

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">开流 result 中的 format 对象</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-f">"format"</span><span class="tok-p">:</span> <span class="tok-p">{</span>
  <span class="tok-f">"mode"</span><span class="tok-p">:</span> <span class="tok-s">"raw"</span><span class="tok-p">,</span>            <span class="tok-c">// raw 或 framed（framed：每包 [u32 BE len][payload]）</span>
  <span class="tok-f">"media"</span><span class="tok-p">:</span> <span class="tok-s">"audio/L16"</span><span class="tok-p">,</span>     <span class="tok-c">// 必须与端点 media[] 中一项一致</span>
  <span class="tok-f">"sample_rate"</span><span class="tok-p">:</span> <span class="tok-n">48000</span><span class="tok-p">,</span>      <span class="tok-c">// 音频必须</span>
  <span class="tok-f">"channels"</span><span class="tok-p">:</span> <span class="tok-n">2</span><span class="tok-p">,</span>
  <span class="tok-f">"bits"</span><span class="tok-p">:</span> <span class="tok-n">16</span><span class="tok-p">,</span>
  <span class="tok-f">"signed"</span><span class="tok-p">:</span> <span class="tok-n">true</span><span class="tok-p">,</span>
  <span class="tok-f">"endian"</span><span class="tok-p">:</span> <span class="tok-s">"le"</span>           <span class="tok-c">// 位深 >8 必须（le / be）</span>
<span class="tok-p">}</span></pre>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">为什么要校验格式</div>
    两端 <code>kind</code> 必须相同、<code>media[]</code> 必须有交集（选定一项作为 <code>format.media</code>），否则开流回 <code>bad-arg</code>。
<b>媒体 TCP 上不做任何握手</b>（与 UI 流不同）—— 连上 URI 就按 <code>format</code> 传输数据，
    所以格式校验必须发生在开流阶段。
</div>
</div>

## 多路同播与抢占

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">含义</th></tr></thead>
<tbody>
<tr><td class="mono">max_sessions</td><td>同端点可同时承载的流路数上限，<b>默认 1</b></td></tr>
<tr><td class="mono">streams[]</td><td>活动会话记录 <code>{id, endpoint, agent, since}</code>，不含 URI（<code>who</code> 可见）</td></tr>
<tr><td class="mono">preempt</td><td>会话已满时新流是否<b>抢占</b>旧流。写入端点声明，<b>缺省 true</b>；<code>false</code> 时回 <code>busy</code>（-32003）</td></tr>
</tbody>
</table>
</div>

<div class="figure">
<svg viewBox="0 0 680 168" role="img" aria-label="一源多流：同一首歌同时送到多台音箱">
<rect class="dg-dev" x="20" y="44" width="150" height="76" rx="10"/>
<text class="dg-l" x="38" y="70">音源</text>
<text class="dg-m" x="38" y="90">stream_out</text>
<text class="dg-m" x="38" y="106">max_sessions=3</text>

<path class="dg-line--accent" d="M174 82 C 220 82, 230 34, 286 34"/>
<polygon points="286,34 275,29 277,39" style="fill:var(--accent)"/>
<path class="dg-line--accent" d="M174 82 L 286 82"/>
<polygon points="286,82 276,77 276,87" style="fill:var(--accent)"/>
<path class="dg-line--accent" d="M174 82 C 220 82, 230 130, 286 130"/>
<polygon points="286,130 275,125 277,135" style="fill:var(--accent)"/>

<rect class="dg-agent" x="292" y="12" width="180" height="44" rx="8"/>
<text class="dg-s" x="308" y="39">电脑音箱 · stream.join</text>

<rect class="dg-agent" x="292" y="60" width="180" height="44" rx="8"/>
<text class="dg-s" x="308" y="87">华为音箱 · stream.join</text>

<rect class="dg-agent" x="292" y="108" width="180" height="44" rx="8"/>
<text class="dg-s" x="308" y="135">第三台 · 可能触发 preempt</text>

<text class="dg-m" x="496" y="86">同一首歌</text>
<text class="dg-m" x="496" y="104">分送多路</text>
<text class="dg-m" x="496" y="122">= 多房间协同</text>
</svg>
<p class="figure__cap">图 2 · 一源多流：同一首歌最多同时送多路，是多房间同播的分发前提</p>
</div>

## 停止流的纪律

<div class="callout callout--danger">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">只停自己开的流</div>
    不要对<b>非本端开启</b>的流发 <code>stream.stop</code> —— 那会中断他人的播放。
    另外，媒体会话与占用<b>正交</b>：last-wins 更换 <code>holder</code>、exclusive 的 <code>release</code> / 租约到期，
    都<b>不得</b>自动拆掉已建立的流（除非该端点声明了 <code>close_on_release=true</code>）。
    旧流被抢占或对端消失的唯一信号是 <b>TCP 断开</b> —— 转发者必须拆除这一侧，不得保持半开连接继续灌流。
</div>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">常见误区</div>
    换曲、暂停要在<b>音源</b>上做，音箱只负责出声。
    对音箱发“下一首”是不会生效的 —— 因为它没这个能力（见 <code>operations</code>）。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/tools.html">
<div class="card__title">方法与报文参考 →</div>
<div class="card__desc">describe / who 的参数与返回结构。</div>
</a>
<a class="card" href="/docs/fields.html">
<div class="card__title">字段与消息 →</div>
<div class="card__desc">端点的完整字段定义与状态机。</div>
</a>
</div>
