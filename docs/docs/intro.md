---
title: "BMAHS 是什么？"
description: "BMAHS（大模型智能体硬件规范，bmahs/1.2）是智能体与硬件设备之间的“普通话”：JSON-RPC 2.0 控制通道，为 AGI 就绪，支持一句话现场编排。"
eyebrow: "开始 / 简介"
---

<p class="eyebrow">开始 / 简介</p>

# BMAHS 是什么？

<p class="lead">
<b>BMAHS</b>（Big Model Agent Hardware Specification，大模型智能体硬件规范）
  是智能体与硬件设备之间的<b>普通话</b>：它规定设备如何自我介绍、能做什么、绝不可以做什么，
  以及多个智能体争用同一台设备时该怎么办。控制通道是 TCP 上的 <b>JSON-RPC 2.0</b>，协议标识 <code>bmahs/1.2</code>。
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">一句话定位</div>
<b>BMAHS 让硬件说“普通话”，为 AGI 就绪</b> —— 然后，一句话就能现场编排它们。
</div>
</div>

## 把它讲清楚：三个层次

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">序</th><th>一句话描述</th><th style="white-space:nowrap">回答</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">①</td><td>BMAHS 是智能体与硬件之间的<b>普通话</b></td><td style="white-space:nowrap">是什么</td></tr>
<tr><td style="white-space:nowrap">②</td><td>说好这门普通话，硬件才能<b>为 AGI 就绪</b>（能被懂 / 能指挥 / 敢授权）</td><td style="white-space:nowrap">为了什么</td></tr>
<tr><td style="white-space:nowrap">③</td><td>就绪之后，<b>自然语言编排</b>成为可能</td><td style="white-space:nowrap">做到什么</td></tr>
</tbody>
</table>
</div>

## 它是什么，不是什么

<p>把边界讲清楚，比讲能力更重要 —— 这决定了别人会不会误判你在做什么。</p>

<div class="cols2">
<div class="compare compare--b">
<div class="compare__head">BMAHS 是</div>
<div class="compare__body">
<ul>
<li>一份<b>独立的协议规范</b>：发现层 UDP 组播 + Bonjour，使用层 TCP + JSON-RPC 2.0</li>
<li>面向<b>智能体语义</b>：让 AI 读懂能力、边界与意图</li>
<li>一个<b>翻译层</b>：把存量硬件翻译给智能体听</li>
<li><b>品牌中立</b>：不绑定任何一家厂商或一个智能体</li>
<li>智能体可经<b>任意协议客户端</b>接入（脚本、SDK、智能体运行时均可实现）</li>
</ul>
</div>
</div>
<div class="compare compare--a">
<div class="compare__head">BMAHS 不是</div>
<div class="compare__body">
<ul>
<li>不是新的蓝牙 / Wi-Fi / 红外，<b>不发明物理层</b></li>
<li>不是要求更换设备 —— 存量设备经网关即可接入</li>
<li>不是闭源黑盒，也不是某家云 AI 的接入协议</li>
<li>不依附任何既有协议生态 —— 独立规范、自主演进的平行体系</li>
<li>不是场景联动：那种做法在开发期写死 IF-THEN 规则，BMAHS 在运行时按需生成</li>
</ul>
</div>
</div>
</div>

## 四大核心能力

<div class="grid4">
<div class="tile">
<p class="tile__num">L1</p>
<div class="tile__title">设备自述</div>
<p class="tile__desc">上电递名片：<code>id / type / service / summary / constraint</code>。</p>
</div>
<div class="tile">
<p class="tile__num">L2</p>
<div class="tile__title">能力清单</div>
<p class="tile__desc"><code>operations</code>：能做哪些动作，照单点菜。</p>
</div>
<div class="tile">
<p class="tile__num">L3</p>
<div class="tile__title">安全边界</div>
<p class="tile__desc"><code>security</code>：allow / deny / confirm 三色承诺书。</p>
</div>
<div class="tile">
<p class="tile__num">L2</p>
<div class="tile__title">控制与媒体通道</div>
<p class="tile__desc"><code>endpoints</code> + 业务方法调用：控制指令与音频流。</p>
</div>
</div>

<p style="color:var(--text-muted);font-size:13.5px;margin:14px 0 0;line-height:1.7">
  就绪层级：<b>L1</b> 设备自述 → <b>L2</b> 能力清单与业务方法 → <b>L3</b> 安全边界。
  第四张磁贴（控制与媒体通道）同属 <b>L2</b> —— 它由 <code>endpoints</code> 声明，是 L2 能力清单的一部分。
</p>

## 下一步

<div class="cards">
<a class="card" href="/docs/architecture.html">
<div class="card__title">架构与生态位 →</div>
<div class="card__desc">三层架构（发现 / 控制 / 数据流层）、四种角色与数据流层边界。</div>
</a>
<a class="card" href="/docs/quickstart.html">
<div class="card__title">快速开始 →</div>
<div class="card__desc">六步跑通“一句话播放音乐”，含真实排错记录。</div>
</a>
</div>
