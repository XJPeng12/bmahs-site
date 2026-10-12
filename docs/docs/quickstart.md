---
title: "快速开始"
description: "六步跑通 bmahs/1.2：发现设备、连接 control、读 hello 通知、describe、（exclusive 时）occupy、业务调用与 release。"
eyebrow: "开始 / 快速开始"
---

<p class="eyebrow">开始 / 快速开始</p>

# 快速开始

<p class="lead">
  目标：从零把一台 BMAHS 设备跑起来 —— 发现、连接、读懂它、（必要时）占用、调用、释放。
  全程只用到 TCP 上的 <b>JSON-RPC 2.0</b> 与 UDP 组播发现，不依赖任何特定智能体。
</p>

## 第 0 步：安装与启动

<p>
  BMAHS 是<b>线协议</b>，不是某个软件包 —— 只要能收发 TCP + JSON 与 UDP 组播，任何语言都能实现。
  本页以下报文取自<b>真机实操记录</b>，对端是一台已支持 BMAHS 的设备或网关。
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">参考实现与自测套件筹备中</div>
    官方参考实现与开源自测套件<b>尚未公开发布</b>；发布后本页会补上下载地址与启动命令。
</div>
</div>

<p>在此之前，按你手上的条件选一条路：</p>

<ul>
<li><b>已有 BMAHS 设备或网关</b>：直接进入下面的“六个步骤”，报文可逐条照抄。</li>
<li><b>只有存量设备</b>（蓝牙 / AirPlay / 红外）：先用网关把它翻译成 BMAHS 自述再接入 —— 见<a href="/docs/architecture.html">架构与生态位</a>。</li>
<li><b>想自己实现一台</b>：按<a href="/docs/spec-index.html">规范全文</a>第 5–18 章实现，再拿<a href="/docs/spec-conform.html">第 18 章一致性清单</a>逐项自测。</li>
</ul>

## 前置条件

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项目</th><th style="white-space:nowrap">要求</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">网络</td><td>客户端与设备在同一局域网（发现走 UDP 组播，控制走局域网 TCP）</td></tr>
<tr><td style="white-space:nowrap">客户端</td><td>任何能发 TCP + JSON 的<b>协议客户端</b>：脚本、SDK 或智能体运行时</td></tr>
<tr><td style="white-space:nowrap">桥接</td><td>存量设备（蓝牙 / AirPlay 等）需一台 BMAHS 网关做翻译发布</td></tr>
<tr><td style="white-space:nowrap">账号</td><td>部分设备（如音乐音源）需扫码登录，登录会话会过期 —— 这是音源服务自身的账号机制，与 BMAHS 协议无关</td></tr>
</tbody>
</table>
</div>

## 六个步骤

<ol class="steps">
<li>
<div class="steps__title">发现：组播 query</div>
    向 <code>239.255.42.42:5354</code> 发一条 <code>query</code>（IPv6 为 <code>ff02::4242</code>）。
    匹配的设备各回一个 <code>announce</code>：我是谁、说什么 <code>service</code>、<code>control</code> 在哪、<code>occupancy</code> 是什么。
    选型优先看 <code>name</code> + <code>summary</code>。
</li>
<li>
<div class="steps__title">连接：TCP 到 control</div>
    连接 <code>announce.control</code> 指向的 <code>tcp://IP:端口</code>（默认 9527）。
    连接成功后设备<b>立刻</b>推送一行 <code>hello</code> 通知 —— 这是<b>连接时的自述快照</b>，字段与 <code>announce</code> 一致；需要<b>实时权威清单</b>（能力可能已变化）时，再调 <code>describe</code>。
</li>
<li>
<div class="steps__title">读懂：hello 通知</div>
<code>hello</code> 是无 <code>id</code> 的 JSON-RPC 通知，不要回复它。
    从中登记 <code>operations</code> 为可调用方法，把 <code>summary</code> / <code>constraint</code> / 各 <code>description</code> 交给模型。
    需要权威完整清单时再调 <code>describe</code>。
</li>
<li>
<div class="steps__title">占用（仅 exclusive）</div>
    先看 <code>security.occupancy</code>：<code>last-wins</code>（后到优先）直接发业务方法，<b>不要</b>走 occupy；
<code>exclusive</code> 先调 <code>who</code> 查占用，再 <code>occupy</code> 取 token。
</li>
<li>
<div class="steps__title">调用：业务方法</div>
    按 <code>operations</code> 清单发 JSON-RPC 请求，<code>params</code> 用<b>对象形式</b>，业务参数名与 <code>args[].name</code> 对齐。
<code>confirm</code> 级动作由设备本地等用户确认，等待期不要重发。
</li>
<li>
<div class="steps__title">释放（仅 exclusive）</div>
    任务结束 —— <b>含失败与取消</b> —— 必须 <code>release</code> 并作废 token。
    默认租约 60 秒会兜底，但别依赖它。
</li>
</ol>

## 完整调用链（终端视角）

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">快速开始 · 全部报文</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-c">// 1) 发现：UDP 组播 query（239.255.42.42:5354）</span>
<span class="tok-p">{</span><span class="tok-f">"version"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"query"</span><span class="tok-p">,</span>
 <span class="tok-f">"timestamp"</span><span class="tok-p">:</span><span class="tok-n">1791000000</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"want"</span><span class="tok-p">:</span><span class="tok-s">"*"</span><span class="tok-p">}</span>

<span class="tok-c">// 设备应答 announce（节选）</span>
<span class="tok-p">{</span><span class="tok-f">"kind"</span><span class="tok-p">:</span><span class="tok-s">"announce"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"type"</span><span class="tok-p">:</span><span class="tok-s">"speaker"</span><span class="tok-p">,</span>
 <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span> <span class="tok-f">"name"</span><span class="tok-p">:</span><span class="tok-s">"电脑音箱"</span><span class="tok-p">,</span> <span class="tok-f">"port"</span><span class="tok-p">:</span><span class="tok-n">9527</span><span class="tok-p">,</span>
 <span class="tok-f">"control"</span><span class="tok-p">:</span><span class="tok-s">"tcp://192.168.1.42:9527"</span><span class="tok-p">,</span>
 <span class="tok-f">"security"</span><span class="tok-p">:{</span><span class="tok-f">"scope"</span><span class="tok-p">:</span><span class="tok-s">"lan"</span><span class="tok-p">,</span><span class="tok-f">"auth"</span><span class="tok-p">:</span><span class="tok-s">"none"</span><span class="tok-p">,</span><span class="tok-f">"occupancy"</span><span class="tok-p">:</span><span class="tok-s">"last-wins"</span><span class="tok-p">},</span>
 <span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"busy"</span><span class="tok-p">:</span><span class="tok-n">false</span><span class="tok-p">}</span>

<span class="tok-c">// 2) 连接 control TCP 后，设备立刻推送 hello 通知（无 id，勿回复）</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"hello"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span>
  <span class="tok-f">"protocol"</span><span class="tok-p">:</span><span class="tok-s">"bmahs/1.2"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-s">"bmahs-speaker-01"</span><span class="tok-p">,</span> <span class="tok-f">"service"</span><span class="tok-p">:</span><span class="tok-s">"speaker/1"</span><span class="tok-p">,</span>
  <span class="tok-f">"operations"</span><span class="tok-p">:[</span><span class="tok-c">/* 完整清单 */</span><span class="tok-p">],</span> <span class="tok-f">"security"</span><span class="tok-p">:{</span><span class="tok-c">/* 含 occupancy */</span><span class="tok-p">},</span> <span class="tok-c">/* … */</span> <span class="tok-p">}}</span>

<span class="tok-c">// 3) last-wins 设备：直接调业务方法，params 必须是对象</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"volume"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"level"</span><span class="tok-p">:</span><span class="tok-n">35</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">1</span><span class="tok-p">,</span> <span class="tok-f">"result"</span><span class="tok-p">:{</span><span class="tok-f">"state"</span><span class="tok-p">:</span><span class="tok-s">"online"</span><span class="tok-p">,</span> <span class="tok-f">"holder"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"level"</span><span class="tok-p">:</span><span class="tok-n">35</span><span class="tok-p">}}</span>

<span class="tok-c">// 4) exclusive 设备（如网关）：occupy → 控制（带 token）→ release</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">2</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"occupy"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">3</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"bt.scan"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">}}</span>
<span class="tok-p">{</span><span class="tok-f">"jsonrpc"</span><span class="tok-p">:</span><span class="tok-s">"2.0"</span><span class="tok-p">,</span> <span class="tok-f">"id"</span><span class="tok-p">:</span><span class="tok-n">4</span><span class="tok-p">,</span> <span class="tok-f">"method"</span><span class="tok-p">:</span><span class="tok-s">"release"</span><span class="tok-p">,</span> <span class="tok-f">"params"</span><span class="tok-p">:{</span><span class="tok-f">"agent"</span><span class="tok-p">:</span><span class="tok-s">"my-agent"</span><span class="tok-p">,</span> <span class="tok-f">"token"</span><span class="tok-p">:</span><span class="tok-s">"a1b2…"</span><span class="tok-p">}}</span></pre>
</div>

## 成功判据

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">观察点</th><th style="white-space:nowrap">期望值</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">发现应答</td><td>打印 <code>id</code> / <code>occupancy</code> / <code>control</code> / <code>state=online</code></td></tr>
<tr><td>连接后首行</td><td>立刻收到 <code>hello</code> 通知（含 <code>jsonrpc:"2.0"</code>、无 <code>id</code>）</td></tr>
<tr><td style="white-space:nowrap">响应关联</td><td>响应 <code>id</code> 与请求 <code>id</code> 一一对应（顺序可乱）</td></tr>
<tr><td>last-wins 控制</td><td>不 occupy 即可调用业务方法，<code>result.holder</code> 更新为自己</td></tr>
<tr><td style="white-space:nowrap">端点开流</td><td><code>result</code> 含 <code>stream</code> URI 与 <code>format</code>；两端 <code>kind</code> 相同、<code>media</code> 有交集</td></tr>
</tbody>
</table>
</div>

## 常见报错与处置

<div class="table-wrap">
<table>
<thead><tr><th>错误（bmahs_code / code）</th><th style="white-space:nowrap">原因</th><th style="white-space:nowrap">处置</th></tr></thead>
<tbody>
<tr>
<td><code>invalid-request</code> / <code>-32600</code></td>
<td>信封缺 <code>jsonrpc</code> 字段、用了位置参数或批量数组</td>
<td><code>params</code> 改对象形式；不用批量</td>
</tr>
<tr>
<td><code>unknown-action</code> / <code>-32601</code></td>
<td><code>method</code> 不在该设备 <code>operations</code> 清单里</td>
<td>重新 <code>describe</code>，只调清单内的方法</td>
</tr>
<tr>
<td><code>bad-arg</code> / <code>-32602</code></td>
<td>参数缺失、类型 / <code>min</code>-<code>max</code> 越界、不在 <code>enum</code></td>
<td>按 <code>args</code> 声明修正；对接场景检查 kind / media 交集</td>
</tr>
<tr>
<td><code>occupied</code> / <code>-32001</code></td>
<td>exclusive 设备被他人占用（<code>data</code> 附 <code>holder</code> / <code>until</code>）</td>
<td>按 <code>until</code> 等待，或改期；不要强行抢占</td>
</tr>
<tr>
<td><code>unauthorized</code> / <code>-32004</code></td>
<td><code>token</code> 缺失 / 过期 / 与 <code>agent</code> 不绑定</td>
<td>重新 <code>occupy</code> 取新 token</td>
</tr>
<tr>
<td><code>denied</code> / <code>-32005</code></td>
<td>触犯 <code>deny</code> 红线，或 <code>confirm</code> 超时 / 被否决</td>
<td><b>停止并如实告知</b>，不得尝试绕过</td>
</tr>
<tr>
<td>设备从列表消失</td>
<td>超过删除时限未收到 <code>announce</code>，或发了 <code>goodbye</code></td>
<td>重发 <code>query</code>：要么找回，要么确认下线</td>
</tr>
<tr>
<td>音源报“登录凭证已过期”</td>
<td>设备侧账号会话过期（正常现象）</td>
<td>重新扫码登录后重试</td>
</tr>
<tr>
<td>音源报 <code>no play permission</code></td>
<td>曲目版权 / 会员权限不足</td>
<td><b>这是版权边界，不是故障</b> —— 换自有歌单，不作绕过</td>
</tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">给演示者的建议</div>
    对外演示请优先选“<b>预置场景做不到</b>”的例子 —— 跨品牌、多设备、未预设组合。
    三个特征同时出现时，观众才会真正意识到差异。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/orchestration.html">
<div class="card__title">看懂突破点 →</div>
<div class="card__desc">自然语言编排：为什么不是“又一个智能音箱”。</div>
</a>
<a class="card" href="/docs/tools.html">
<div class="card__title">方法与报文参考 →</div>
<div class="card__desc">五个通用方法、错误码映射与默认端口。</div>
</a>
<a class="card" href="/docs/architecture.html">
<div class="card__title">接入你自己的设备 →</div>
<div class="card__desc">网关如何把存量硬件发布成 BMAHS 设备，以及四种角色与边界。</div>
</a>
</div>
