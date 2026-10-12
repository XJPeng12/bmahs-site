---
title: "关于与许可"
description: "BMAHS 的定位、版本状态、许可条款（规范文本 CC BY 4.0、示例代码 CC0）与反馈渠道。"
eyebrow: "生态 / 说明"
---

<p class="eyebrow">生态 / 说明</p>

# 关于与许可

<p class="lead">
  BMAHS（Big Model Agent Hardware Specification）是一份<b>面向大模型智能体的硬件交互协议规范</b>：
  把设备的自述、能力清单与安全边界写成机器可读、模型可理解的统一格式，
  让设备被<b>发现、读懂、指挥、安全授权</b>这四件事不必逐家适配。
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">一句话</div>
    硬件说“普通话”，大模型才编排得动它。BMAHS 就是这套普通话的语法书。
</div>
</div>

## 定位与边界

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">维度</th><th>说明</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">是什么</td><td>局域网内“智能体 ↔ 硬件”的交互协议：发现、自述、控制、占用、数据流、UI 六件事的语义与报文规范</td></tr>
<tr><td style="white-space:nowrap">不是什么</td><td>不是云平台、不是固件方案、不是某个 App 的私有协议；不规定硬件品类语义，也不规定模型本身</td></tr>
<tr><td style="white-space:nowrap">面向谁</td><td>硬件厂商（让设备自带说明）、智能体/应用开发者（一次接入通吃多品类）、集成商（降适配成本）</td></tr>
<tr><td style="white-space:nowrap">中立性</td><td>规范由维护方公开，认证依据开源自测套件；不绑定任何单一厂商的生态</td></tr>
</tbody>
</table>
</div>

## 版本与状态

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项</th><th>当前值</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">协议版本</td><td><code>bmahs/1.2</code>（主版本 1，向后兼容 <code>1.x</code> 需按第 19 章判定）</td></tr>
<tr><td style="white-space:nowrap">规范文本</td><td>随本站持续修订；报文示例取自真机实操记录</td></tr>
<tr><td style="white-space:nowrap">自测套件</td><td>筹备中，尚未公开发布</td></tr>
</tbody>
</table>
</div>

## 许可

<p>我们希望协议文本可以被自由引用、实现与转述，同时不希望出现“伪认证”式的品牌混淆。据此分三类授权：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">对象</th><th style="white-space:nowrap">许可</th><th>你能做什么</th></tr></thead>
<tbody>
<tr>
<td>规范文本</td>
<td style="white-space:nowrap"><b>CC BY 4.0</b></td>
<td>自由复制、分发、改编、商用；<b>必须</b>署名并标注是否修改。建议署名格式见下“如何引用”</td>
</tr>
<tr>
<td>示例代码片段</td>
<td style="white-space:nowrap"><b>CC0 1.0</b></td>
<td>视同公有领域，可无条件写入产品与文档，无需署名</td>
</tr>
<tr>
<td>名称与标志</td>
<td style="white-space:nowrap">保留</td>
<td>“BMAHS”名称与标志为维护方标识。<b>可以</b>如实声明“实现 BMAHS 协议”；<b>不得</b>暗示获得官方认证或背书，认证状态只以自测套件结果与徽标授权为准</td>
</tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">实现是免费的</div>
    实现本协议<b>不收取任何许可费或版税</b>（royalty-free）。合规的唯一门槛是第 18 章的一致性清单，而不是商务授权。
</div>
</div>

## 如何引用

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__dot"></span><span class="code__dot"></span><span class="code__name">citation.txt</span></div>

<pre>BMAHS —— 大模型智能体硬件规范（Big Model Agent Hardware Specification），版本 bmahs/1.2。
本站内容依 CC BY 4.0 授权。</pre>
</div>

## 维护与反馈

<p>维护方与反馈渠道将在公开发布时于本页公布。在此之前，需要协议澄清、勘误或实现答疑，请通过后续公布的联系方式提出。</p>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">勘误与澄清</div>
    规范文本中的错误、歧义与缺失，欢迎直接指出。<b>以规范正文为准</b>：本站在页面上给出的摘要若与规范正文冲突，以规范章节为准，并会把冲突视为缺陷修掉。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/intro.html">
<div class="card__title">BMAHS 是什么 →</div>
<div class="card__desc">三个层次讲清协议要解决的问题。</div>
</a>
<a class="card" href="/docs/spec-index.html">
<div class="card__title">规范总览 →</div>
<div class="card__desc">20 章全文与附录索引。</div>
</a>
<a class="card" href="/docs/ready.html">
<div class="card__title">AGI-Ready 认证 →</div>
<div class="card__desc">就绪度三层与自测套件。</div>
</a>
</div>
