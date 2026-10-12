---
title: "连接后使用流程"
description: "TCP 连接建立三步、业务通道约定与典型时序。"
eyebrow: "规范全文 · 第 16 章"
---

<p class="eyebrow">规范全文 · 第 16 章</p>

# 连接后使用流程


### 16.1 连接建立

<ol>
<li>解析 <code>control</code>；双栈设备优先连 <code>ip</code>（IPv4）。</li>
<li>设备<b>必须</b>已在该端口监听（TCP 建议 <code>::</code> + <code>IPV6_V6ONLY=0</code>；与 §6.2 UDP 的取值相反）。</li>
<li>连接成功后，设备<b>立刻</b>发送一行 <code>hello</code> 通知（JSON-RPC notification，§8.5），再等待命令。</li>
</ol>

### 16.2 业务通道约定

<ul>
<li>TCP，一行一个 JSON-RPC 2.0 消息，以 <code>\n</code> 结束。</li>
<li>请求 <code>method</code> 为动作名；<code>params</code> 至少满足该动作 <code>args</code>；控制类<b>应当</b>含 <code>agent</code>。<code>exclusive</code> 受管后还含 <code>token</code>；<code>last-wins</code> <b>不得</b>要求 <code>token</code>。</li>
<li>成功 → <code>result</code> 对象（内容按 <code>returns</code>）；失败 → <code>error</code> 对象（第 9 章）。</li>
<li><code>describe</code> / <code>info</code> / <code>who</code> 见 §10.4；不提供 <code>register</code> 亦可。</li>
<li><b>画面与连续媒体不得走本通道</b>；<code>params</code> 字段名与 <code>operations.args[].name</code> 对齐。</li>
</ul>

<p>请求示例：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示例序列</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;level&quot;</span><span class="tok-p">:</span><span class="tok-n">40</span><span class="tok-p">,</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span>
<span class="tok-p">{</span><span class="tok-f">&quot;jsonrpc&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;2.0&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;id&quot;</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span><span class="tok-f">&quot;method&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;tap&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;params&quot;</span><span class="tok-p">:</span><span class="tok-p">{</span><span class="tok-f">&quot;x&quot;</span><span class="tok-p">:</span><span class="tok-n">10</span><span class="tok-p">,</span><span class="tok-f">&quot;y&quot;</span><span class="tok-p">:</span><span class="tok-n">20</span><span class="tok-p">,</span><span class="tok-f">&quot;agent&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;alice&quot;</span><span class="tok-p">,</span><span class="tok-f">&quot;token&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;...&quot;</span><span class="tok-p">}</span><span class="tok-p">}</span></pre>
</div>

### 16.3 典型时序

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">示意图</span>
<button class="code__copy" type="button">复制</button></div>

<pre>客户端                                设备
  │ ── TCP connect ─────────────────►  │
  │ ◄─ hello 通知（无 id）────────────  │
  │ ── describe {id:1} ─────────────►  │
  │ ◄─ result: operations+security ──  │
  │（exclusive 设备）                   │
  │ ── occupy {agent, ttl?} ────────►  │
  │ ◄─ result: token, until ─────────  │
  │ ── 业务方法 {token, ...} ────────►  │
  │ ◄─ result / error ───────────────  │
  │ ── release {agent, token} ──────►  │
  │ ◄─ result ───────────────────────  │</pre>
</div>
