---
title: "术语与约定"
description: "BMAHS 设备、智能体、协议客户端、发现层、使用层、数据流层等核心术语定义。"
eyebrow: "规范全文 · 第 3 章"
---

<p class="eyebrow">规范全文 · 第 3 章</p>

# 术语与约定

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">术语</th><th style="white-space:nowrap">定义</th></tr></thead>
<tbody>
<tr><td><b>BMAHS 设备</b></td><td>按本规范实现发布与控制的真实硬件，或网关虚拟化出来的节点</td></tr>
<tr><td><b>智能体（Agent）</b></td><td>携带大模型、负责设备选型与任务编排的软件实体</td></tr>
<tr><td><b>协议客户端（Protocol Client）</b></td><td>智能体运行时、SDK、Sink 设备自身或网关进程；执行控制序列与媒体对接，<b>不</b>是大模型</td></tr>
<tr><td style="white-space:nowrap"><b>转发者</b></td><td>同时持有两路端点会话的任意协议客户端；不是特殊设备类型</td></tr>
<tr><td><b>control</b></td><td>设备的控制入口 TCP 端点，URI 形如 <code>tcp://IP:PORT</code>，承载 JSON-RPC 2.0 消息</td></tr>
<tr><td><b>hello</b></td><td>TCP 连接建立后设备立即发送的 JSON-RPC <b>通知</b>（notification），<code>method=&quot;hello&quot;</code></td></tr>
<tr><td><b>occupancy</b></td><td>占用策略声明：<code>last-wins</code> 或 <code>exclusive</code></td></tr>
<tr><td><b>holder</b></td><td>最后一条控制命令的 <code>agent</code>（last-wins）或当前占用方（exclusive）</td></tr>
<tr><td><b>token</b></td><td><code>exclusive</code> 设备签发的占用令牌；禁止出现在发现层</td></tr>
<tr><td><b>端点（endpoint）</b></td><td>设备声明可提供（output）或消费（input）连续媒体的通道</td></tr>
<tr><td style="white-space:nowrap"><b>发现层</b></td><td>UDP 组播 + Bonjour 组成的设备发布与发现层（<b>非</b> JSON-RPC）</td></tr>
<tr><td style="white-space:nowrap"><b>使用层</b></td><td>TCP 上的 JSON-RPC 2.0 控制层</td></tr>
<tr><td style="white-space:nowrap"><b>数据流层</b></td><td>UI 流与数据流所在的二进制传输层</td></tr>
</tbody>
</table>
</div>
