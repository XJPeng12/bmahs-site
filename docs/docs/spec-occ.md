---
title: "占用策略与状态机"
description: "last-wins 与 exclusive 两种控制模型、token 与租约规则、存活检测与脱网。"
eyebrow: "规范全文 · 第 11 章"
---

<p class="eyebrow">规范全文 · 第 11 章</p>

# 占用策略与状态机

<p>设备<b>必须</b>在本机进程内存中维护生命周期与占用状态；<b>不得</b>持久化到磁盘或外部系统。状态变化后<b>应当</b>立即重发 <code>announce</code>（或发 <code>goodbye</code>）。地址变化按 §6.4 处理；<code>id</code> 不变，未过期的 exclusive <code>token</code> 不因换 IP 作废。</p>

### 11.1 在线状态机（所有设备）

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示意图</span>
<button class="code__copy" type="button">复制</button></div>

<pre>  offline ──开始 announce──► online ──goodbye / 进程退出──► offline</pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">状态</th><th style="white-space:nowrap">含义</th></tr></thead>
<tbody>
<tr><td><code>offline</code></td><td>未入网或即将退出；发 <code>goodbye</code></td></tr>
<tr><td><code>online</code></td><td>正在发布，可被发现、可被控制</td></tr>
</tbody>
</table>
</div>

<p>1.2 <b>废止</b> <code>registered</code> / <code>managed</code> 两个状态值。</p>

<p><b>公开状态字段</b>：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">位置与要求</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>state</code></td><td>announce / hello / TXT / goodbye</td><td><code>online</code> / <code>offline</code></td></tr>
<tr><td><code>event</code></td><td style="white-space:nowrap">应当</td><td>最近一次变迁：<code>online</code> / <code>offline</code>；exclusive 另可 <code>occupy</code> / <code>release</code></td></tr>
<tr><td><code>occupancy</code></td><td>hello / describe 必须；announce 应当</td><td>与 <code>security.occupancy</code> 一致</td></tr>
<tr><td><code>holder</code></td><td>有最后控制者或占用方时必须</td><td>last-wins：最后一条控制的 <code>agent</code>；exclusive：当前占用方</td></tr>
<tr><td style="white-space:nowrap"><code>busy</code></td><td style="white-space:nowrap">必须</td><td><code>true</code> 当且仅当：exclusive 当前被占用，<b>或</b>存在活动 UI 流 / 活动 <code>streams</code></td></tr>
<tr><td><code>until</code> / <code>lease_security</code></td><td>exclusive 占用中应当</td><td>同 §11.3（<code>lease_security</code> 为租约秒数，命名沿自 1.x，历史保留）；last-wins <b>不得</b>用它们挡控制</td></tr>
<tr><td><code>agent</code></td><td>控制调用应当</td><td>智能体稳定标识（建议 <code>[a-z0-9-]</code>）。只读方法缺失不得拒绝；last-wins 控制缺失时设备<b>应当</b>仍执行，<code>holder</code> 记为 <code>anonymous</code></td></tr>
<tr><td><code>token</code></td><td><b>仅 TCP</b>，仅 exclusive</td><td>occupy 成功及占用方后续控制 / <code>release</code> / UI 流握手</td></tr>
</tbody>
</table>
</div>

<p><b>规范性说明</b>：<code>release</code> 是 exclusive 的<b>方法</b>而非常驻状态——成功后 <code>state</code> 仍为 <code>online</code>，<code>event=release</code>，<code>holder</code> 省略（除非仍有活动流，仅影响 <code>busy</code>/<code>streams</code>）。</p>

### 11.2 <code>last-wins</code>（最后控制生效）

<p>适用于家用灯、开关、多数音箱的音量/切歌等瞬时状态控制。协议客户端（含网关南向，即网关面向存量设备的一侧）与其他智能体走<b>同一套</b>规则，无特权通道。</p>

<p><b>规范性要求</b>：</p>

<ol>
<li><b>不要求</b> <code>occupy</code>；<b>不签发、不校验</b>占用 <code>token</code>。</li>
<li>任何带（或缺省）<code>agent</code> 的业务控制<b>立即执行</b>，并更新 <code>holder</code>；后来者覆盖先来者。设备对控制<b>不得</b>回 <code>occupied</code>。</li>
<li>并发控制按到达顺序串行；后写覆盖先写。</li>
<li><code>holder</code> 仅为公示。多步任务中智能体<b>应当</b>在后续步骤前调用 <code>who</code>；若 <code>holder</code> 已不是自己，<b>应当停止</b>后续步骤。设备本身不拒绝旧 agent 的下一条调用。</li>
<li><code>occupy</code> / <code>release</code> 非必须。若实现：<code>occupy</code> 仅设 <code>holder</code>、不回 <code>token</code>；<code>release</code> 仅当调用方为当前 <code>holder</code> 时清除 <code>holder</code>。</li>
<li>控制面更换 <code>holder</code> <b>不得</b>拆除已建立的媒体端点会话（§14.5）。</li>
<li>声明了 <code>ui</code> 的设备<b>不得</b>使用本策略。</li>
</ol>

<p><b>示例</b>：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示例序列</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bob&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">80</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bob&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">80</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;who&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;occupancy&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;last-wins&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;bob&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;streams&quot;</span><span class="tok-p">:</span><span class="tok-p">[</span><span class="tok-p">]</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 11.3 <code>exclusive</code>（独占 + token）

<p>适用于带 <code>ui</code> 的设备、锁、以及需要互斥编排的入口（如网关本体的发布/配对）。</p>

<p><b>状态机</b>：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示意图</span>
<button class="code__copy" type="button">复制</button></div>

<pre>  online（空闲）── occupy / 空闲时第一条控制 ──► online（busy，持有 token）
       ▲                                              │
       └──────── release / 有限租约到期 ─────────────────┘</pre>
</div>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项</th><th style="white-space:nowrap">值</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">默认租约</td><td><b>60 秒</b>：未带 <code>ttl</code> 的 <code>occupy</code>，<code>until = now + 60</code></td></tr>
<tr><td><code>ttl</code> 合法范围</td><td><b>10–9999</b>；<code>9999</code> = 无限期；越界回 <code>bad-arg</code></td></tr>
<tr><td style="white-space:nowrap">有限租约</td><td>到期自动空闲，旧 <code>token</code> 作废</td></tr>
<tr><td style="white-space:nowrap">无限期</td><td><code>lease_security=9999</code>，<code>until=0</code>，<b>必须</b>显式 <code>release</code></td></tr>
<tr><td style="white-space:nowrap">刷新</td><td>有限租约下，占用方后续<b>带 token</b> 的调用刷新 <code>until</code></td></tr>
<tr><td style="white-space:nowrap">卡住恢复</td><td>默认 60 s 到期自动兜底；仅 <code>ttl=9999</code> 且丢失 token 时，重启设备进程</td></tr>
</tbody>
</table>
</div>

<p><b>占用令牌 <code>token</code> 规范</b>：</p>

<ol>
<li><code>occupy</code> 成功（或空闲时第一条控制自动受管）时签发；<b>应当</b> ≥ 16 个十六进制字符。</li>
<li>此后控制、<code>release</code>、UI 流握手<b>必须</b>携带同一 <code>token</code>；缺失或不匹配：<code>unauthorized</code>（<code>-32004</code>）。</li>
<li>同一 <code>holder</code> 再次 <code>occupy</code> 且 token 正确：刷新租约，返回同一 <code>token</code>。</li>
<li><code>release</code> 或有限租约到期后旧 token <b>立即作废</b>。</li>
<li><b>禁止</b>把 <code>token</code> 写入 UDP / TXT / <code>hello</code> / <code>who</code> / <code>describe</code>。</li>
<li><code>token</code> 与签发时的 <code>agent</code> <b>绑定</b>；不一致一律 <code>unauthorized</code>。</li>
<li>设备<b>必须</b>至少支持 <b>2 路</b>并发 TCP（占用方控制 + 其它方只读）；只读方法在任何连接上可调用。</li>
<li>受管期间其它 <code>agent</code> 的控制：错误响应 <code>occupied</code>（<code>-32001</code>），<code>data</code> 附 <code>holder</code> / <code>until</code>，不含 token。</li>
<li>协议层<b>不得</b>提供任意智能体强夺；强清占用的标准手段是<b>重启设备</b>。媒体端点的抢占见 §14.5，不经过占用锁。</li>
</ol>

<p><b>示例</b>：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示例序列</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupy&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupy&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>true<span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;until&quot;</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">,</span><span class="tok-f">&quot;lease_security&quot;</span><span class="tok-p">:</span><span class="tok-n">60</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;a1b2c3d4e5f60708&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tap&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;eve&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;x&quot;</span><span class="tok-p">:</span><span class="tok-n">10</span><span class="tok-p">,</span><span class="tok-f">&quot;y&quot;</span><span class="tok-p">:</span><span class="tok-n">20</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;error&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;code&quot;</span><span class="tok-p">:</span><span class="tok-n">-32001</span><span class="tok-p">,</span><span class="tok-f">&quot;message&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;书房手机正被 alice 占用，租约约 42 秒后到期&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;data&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;bmahs_code&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;occupied&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;retryable&quot;</span><span class="tok-p">:</span>true<span class="tok-p">,</span><span class="tok-f">&quot;holder&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;until&quot;</span><span class="tok-p">:</span><span class="tok-n">1791000060</span><span class="tok-p">}</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;release&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;a1b2c3d4e5f60708&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span><span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;state&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;online&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;event&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;release&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;busy&quot;</span><span class="tok-p">:</span>false<span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 11.4 存活检测与脱网

<p>本版<b>不</b>设独立心跳报文；发现层以周期 <code>announce</code> 充当存活信号。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">参数</th><th style="white-space:nowrap">默认值</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td>稳态 <code>announce</code> 间隔</td><td style="white-space:nowrap"><b>5 秒</b></td><td>硬性下限，不得调小</td></tr>
<tr><td>无心跳删除时限</td><td><code>clamp(12 × hb, 60 秒, 30 分钟)</code></td><td>超时从列表删除</td></tr>
<tr><td>删除时限上限</td><td style="white-space:nowrap"><b>30 分钟</b></td><td>低功耗调大间隔时的封顶</td></tr>
</tbody>
</table>
</div>

<p>出厂默认间隔 5 秒；<b>只允许调大</b>，调大时<b>必须</b>以 <code>hb</code> 字段公告。智能体<b>不得</b>要求每台设备另开 TCP 心跳。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">通道</th><th style="white-space:nowrap">机制</th><th style="white-space:nowrap">行为</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">发现层</td><td>稳态 <code>announce</code></td><td>超过删除时限 → 从列表删除该 <code>id</code>，丢弃 exclusive token</td></tr>
<tr><td style="white-space:nowrap">发现层</td><td><code>goodbye</code></td><td style="white-space:nowrap">立刻删除</td></tr>
<tr><td>控制层 exclusive</td><td style="white-space:nowrap">有限租约</td><td>到期空闲，旧 token 作废</td></tr>
<tr><td>控制层 exclusive</td><td><code>ttl=9999</code></td><td>不自动到期</td></tr>
<tr><td style="white-space:nowrap">控制层</td><td>TCP 断开</td><td><b>不等于</b>离线 / <code>release</code> / 停数据流</td></tr>
<tr><td>媒体 TCP</td><td style="white-space:nowrap">断开</td><td>该端点会话终止（§14.5）</td></tr>
</tbody>
</table>
</div>

<p><code>last-wins</code> 无租约可卡死控制权；exclusive 无限期占用丢失 token 时，恢复办法仍是重启该 BMAHS 设备。</p>
