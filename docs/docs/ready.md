---
title: "AGI-Ready 认证"
description: "就绪度三层（Ready Stack）与 BMAHS AGI-Ready 徽标（BMAHS Compatible / BMAHS Ready / BMAHS Ready+） —— 标准只有一句，这台设备能不能被编排。"
eyebrow: "生态 / 标准"
---

<p class="eyebrow">生态 / 标准</p>

# AGI-Ready 认证

<p class="lead">
  AGI 时代的瓶颈不是智能，而是<b>就绪度</b>：模型能力按季度迭代，成本按年下降，
  但一台 2016 年的音箱不会因为模型变强就自动被读懂。
<b>谁能把物理世界的就绪成本降到接近零，谁就掌握了 AGI 时代的最后一公里。</b>
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">BMAHS 的工程目标</div>
    把“让一台设备被 AGI 安全使用”的成本，从<b>定制开发</b>降到<b>一次声明</b>。
</div>
</div>

## 就绪度三层（Ready Stack）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">层</th><th style="white-space:nowrap">就绪维度</th><th>BMAHS 机制</th><th style="white-space:nowrap">就绪标志</th><th style="white-space:nowrap">通俗比喻</th></tr></thead>
<tbody>
<tr>
<td><b>L3 信任就绪</b></td>
<td style="white-space:nowrap">敢授权</td>
<td><code>security</code>（allow / deny / confirm）· <code>occupancy</code> 租约 · <code>release</code></td>
<td>有边界、可撤销、可审计</td>
<td>承诺书 + 礼貌守则</td>
</tr>
<tr>
<td><b>L2 动作就绪</b></td>
<td style="white-space:nowrap">能指挥</td>
<td><code>operations</code> 能力清单 · <code>endpoints</code> 媒体端点 · <code>call</code></td>
<td>照单点菜，不瞎猜</td>
<td>遥控器按键</td>
</tr>
<tr>
<td><b>L1 语义就绪</b></td>
<td style="white-space:nowrap">能被懂</td>
<td><code>id</code> · <code>type</code> · <code>service</code> · <code>summary</code> · <code>constraint</code></td>
<td>无需预置驱动</td>
<td>名片 / 商品详情页</td>
</tr>
</tbody>
</table>
</div>

<p>
  三层缺一不可：只有语义就绪，等于一本<b>读得懂但动不了的产品说明书</b>；
  加上动作就绪，是一个<b>听话的遥控器</b>；
  三者齐备，才敢把家门钥匙交给 AGI，让它<a href="/docs/orchestration.html">现场编排</a>。
</p>

<div class="figure">
<svg viewBox="0 0 680 200" role="img" aria-label="就绪度三层缺一层会导致什么">
<rect class="dg-gray" x="14" y="20" width="204" height="160" rx="10"/>
<text class="dg-l" x="32" y="48" style="fill:var(--text-muted)">只有 L1</text>
<text class="dg-s" x="32" y="70">读得懂，动不了</text>
<text class="dg-m" x="32" y="100">= 产品说明书</text>
<line class="dg-tick" x1="32" y1="116" x2="200" y2="116"/>
<text class="dg-m" x="32" y="138">能描述，不能执行</text>
<text class="dg-m" x="32" y="158">编排无从发生</text>

<rect class="dg-gray" x="238" y="20" width="204" height="160" rx="10"/>
<text class="dg-l" x="256" y="48" style="fill:var(--text-muted)">L1 + L2</text>
<text class="dg-s" x="256" y="70">动得了，不敢放权</text>
<text class="dg-m" x="256" y="100">= 听话的遥控器</text>
<line class="dg-tick" x1="256" y1="116" x2="424" y2="116"/>
<text class="dg-m" x="256" y="138">单步可控，不敢组合</text>
<text class="dg-m" x="256" y="158">编排不敢放手</text>

<rect class="dg-proto" x="462" y="20" width="204" height="160" rx="10"/>
<text class="dg-l-inv" x="480" y="48">L1 + L2 + L3</text>
<text class="dg-s-inv" x="480" y="70">能被懂 · 能指挥 · 敢授权</text>
<text class="dg-m-inv" x="480" y="100">= 就绪（Ready）</text>
<line x1="480" y1="116" x2="648" y2="116" style="stroke:rgba(255,255,255,.35);stroke-width:1"/>
<text class="dg-m-inv" x="480" y="138">跨设备 · 多步 · 现场编排</text>
<text class="dg-m-inv" x="480" y="158">自然语言编排成为可能</text>
</svg>
<p class="figure__cap">图 1 · 三层齐备才叫“就绪”，也才敢把编排权交给 AGI</p>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">三级徽标背后，标准只有一句</div>
<b>这台设备能不能被编排。</b>能被读懂、能被调用、能被放权 —— 就能进入编排。
</div>
</div>

## 自测套件

<p>认证不靠送检，靠<b>自测</b>。套件开源，任何厂商都能跑，结果可复现。<b>（套件尚在筹备中，未公开发布；发布后此处将提供仓库地址与运行说明。）</b></p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">检查项</th><th style="white-space:nowrap">层级</th><th style="white-space:nowrap">通过条件</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">可发现性</td><td style="white-space:nowrap">L1</td><td>上电后能被组播 query 发现并出现在设备列表</td></tr>
<tr><td>自述完整性</td><td style="white-space:nowrap">L1</td><td><code>id / type / service / summary</code> 齐备，<code>summary</code> 可理解</td></tr>
<tr><td>能力清单一致性</td><td style="white-space:nowrap">L2</td><td><code>operations</code> 中声明的能力全部可调用；清单外操作被拒绝</td></tr>
<tr><td style="white-space:nowrap">参数校验</td><td style="white-space:nowrap">L2</td><td>类型错误被明确拒绝并回 <code>bad-arg</code>（如 <code>device</code> 参数传入对象）</td></tr>
<tr><td style="white-space:nowrap">安全边界</td><td style="white-space:nowrap">L3</td><td><code>deny</code> 条目全部不可执行；<code>confirm</code> 条目在等待期内不回复该请求，本地确认完成后回 <code>result</code>，超时或被否决回 <code>denied</code></td></tr>
<tr><td style="white-space:nowrap">占用语义</td><td style="white-space:nowrap">L3</td><td><code>exclusive</code> 设备占用互斥、租约到期自动归还、<code>release</code> 生效</td></tr>
<tr><td>并发与流（Ready+）</td><td style="white-space:nowrap">L2</td><td>多路流按 <code>max_sessions</code> / <code>preempt</code> 声明行为一致</td></tr>
<tr><td>审计留痕（Ready+）</td><td style="white-space:nowrap">L3</td><td>关键操作可导出自证记录</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--danger">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">口径纪律：说“就绪”，不说“兼容”</div>
<b>兼容</b>只保证能被发现、能被读懂（L1）；<b>就绪</b>意味着“能被理解 + 能被指挥 + 敢于授权”三层齐备。
    对外表述混用会直接抹平差异化 —— 这是执行中最容易走偏的一条。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/orchestration.html">
<div class="card__title">自然语言编排 →</div>
<div class="card__desc">就绪度三层的价值在哪里涌现。</div>
</a>
</div>
