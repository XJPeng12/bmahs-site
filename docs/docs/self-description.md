---
title: "设备自述"
description: "设备上电即自我描述：id / type / service / summary / constraint —— 智能体读自述即可正确调用，不必为型号背文档。"
eyebrow: "核心概念 / L1 语义就绪"
---

<p class="eyebrow">核心概念 / L1 语义就绪</p>

# 设备自述

<p class="lead">
  设备上电的第一件事，是主动递上一张<b>名片</b>：我是谁、我属于哪个品类、我说哪种话、我能干什么、用我有什么讲究。
  智能体照着名片就能正确调用 —— 这就是<b>语义就绪</b>。
</p>

## 五个字段

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">含义</th><th style="white-space:nowrap">比喻</th><th style="white-space:nowrap">示例</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">id</td><td>设备唯一标识</td><td style="white-space:nowrap">身份证号</td><td><code>"bmahs-speaker-01"</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">type</td><td style="white-space:nowrap">品类</td><td style="white-space:nowrap">职业</td><td><code>"speaker"</code></td></tr>
<tr><td class="mono">service</td><td>说哪种“话”（协议服务及版本）</td><td>说什么语言</td><td><code>"speaker/1"</code></td></tr>
<tr><td class="mono">summary</td><td>一句话自我介绍</td><td style="white-space:nowrap">自我评价</td><td><code>"电脑音箱，可拉取音频流并独立调节音量"</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">constraint</td><td>使用约束</td><td>使用纪律备注</td><td><code>"音量范围为 0–100，建议夜间不超过 30"</code></td></tr>
</tbody>
</table>
</div>

## 为什么用自然语言字段

<p>
  传统设备描述是给<b>开发者</b>看的：寄存器地址、枚举值、SDK 文档。
  智能体不吃这一套 —— 它需要的是可以被<b>理解</b>的描述。
  因此 <code>summary</code> 与 <code>constraint</code> 刻意使用自然语言，允许模糊、允许包含经验性建议。
</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">hello 通知 / describe → 自述部分</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">"id"</span>:      <span class="tok-s">"bmahs-speaker-01"</span>,
  <span class="tok-f">"type"</span>:    <span class="tok-s">"speaker"</span>,
  <span class="tok-f">"service"</span>: <span class="tok-s">"speaker/1"</span>,
  <span class="tok-f">"name"</span>:    <span class="tok-s">"电脑音箱"</span>,
  <span class="tok-f">"summary"</span>: <span class="tok-s">"电脑音箱，可作为 BMAHS 音频输出端点，支持拉流与独立音量"</span>,
  <span class="tok-f">"constraint"</span>:    <span class="tok-s">"拉流前先确认音源 state=playing；音量 0–100"</span>
<span class="tok-p">}</span></pre>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">“先读详情页，再下单”</div>
    自述把设备变成了一张<b>商品详情页</b>。智能体不必为每个型号背一份私有文档，
    流程从“匹配型号 → 查手册 → 拼指令”简化为“读自述 → 调用”。
    这也是“让一台设备被 AGI 安全使用”的成本能从<b>定制开发</b>降到<b>一次声明</b>的原因。
</div>
</div>

## 发现与自述的关系

<p>
  自述不是被动的 —— 设备发现与自述是同一条链路的两端：
  智能体发一条组播 <code>query</code>（谁在线？），设备逐台用 <code>announce</code> 应答（我是谁、我会什么）。
  详见 <a href="/docs/discovery.html">设备发现</a>。
</p>

## 自述的边界

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">原则</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td>自述只描述能力，不授予权限</td><td>能做什么写在 <code>operations</code>，绝不能做什么写在 <code>security</code> —— 二者不可混淆</td></tr>
<tr><td>自述不替代安全校验</td><td>即便自述说自己“能写盘”，<code>deny</code> 清单仍然生效</td></tr>
<tr><td>自述要真实</td><td>误导性的 <code>constraint</code>（如写错使用建议）会直接导致智能体误用，属协议违规</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">换句话说</div>
    自述是<b>向内</b>描述自己，不是<b>向外</b>索取信任。信任由 <a href="/docs/operations.html">安全边界</a> 与
<a href="/docs/occupancy.html">占用租约</a> 负责。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/operations.html">
<div class="card__title">能力清单与安全边界 →</div>
<div class="card__desc">L2 动作就绪：<code>operations</code> 与 <code>security</code> 三色承诺书。</div>
</a>
<a class="card" href="/docs/discovery.html">
<div class="card__title">设备发现 →</div>
<div class="card__desc">上电即发现：组播 query + announce 自述 + Bonjour。</div>
</a>
</div>
