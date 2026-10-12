---
title: "范围"
description: "本规范规定的内容：设备发布、发现、控制机制与 JSON-RPC 2.0 控制报文编码。"
eyebrow: "规范全文 · 第 1 章"
---

<p class="eyebrow">规范全文 · 第 1 章</p>

# 范围


### 1.1 本规范规定的内容

<p>本规范定义大模型智能体（Big Model Agent）发现、连接、交互和控制外部硬件设备的标准化协议 <b>BMAHS（Big Model Agent Hardware Specification，bmahs/1.2）</b>，具体包括：</p>

<ul>
<li>设备在网络中的<b>发布（announce）与下线（goodbye）</b>机制；</li>
<li>智能体对设备的<b>发现（query）</b>机制；</li>
<li>设备<b>连接入口（control）</b>的建立与握手；</li>
<li>基于 <b>JSON-RPC 2.0</b> 的控制报文编码：方法调用、参数、结果与错误；</li>
<li>设备<b>自然语言自述、操作清单（operations）、使用约束（constraint）与安全边界（security）</b>的声明规范；</li>
<li><b>占用策略（occupancy）</b>：<code>last-wins</code> 与 <code>exclusive</code> 两种控制权模型；</li>
<li><b>可选 UI接口</b>：可操作画面设备的二进制画面流规范；</li>
<li><b>可选端点与数据流</b>：端点对接规范与连续数据流端点的声明。</li>
</ul>

<p>具体硬件品类的业务命令语义（如 <code>light/1</code>、<code>speaker/1</code>）由相应品类文档定义，不在本规范范围内。</p>
