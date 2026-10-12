---
title: "公共编码规则"
description: "发现层 UDP 报文的 JSON 编码、公共头、设备标识 id 与关键机器字段规则。"
eyebrow: "规范全文 · 第 7 章"
---

<p class="eyebrow">规范全文 · 第 7 章</p>

# 公共编码规则


### 7.1 JSON 编码

<ul>
<li>所有 UDP 报文<b>必须</b>是 JSON 对象，UTF-8 编码，<b>不得</b>含 BOM。</li>
<li>字段名<b>必须</b>全小写，区分大小写。</li>
<li>接收方<b>必须</b>忽略未知字段（保证前向可扩展）。</li>
<li>接收方<b>必须</b>丢弃满足任一条件的报文：非 JSON 对象；<code>kind</code> 非法；<code>version</code> 不为 <code>1</code>；<code>protocol</code> 不以 <code>bmahs</code> 开头。</li>
</ul>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">边界说明</div>
    UDP 发现报文是单向组播数据报，<b>不采用</b> JSON-RPC 2.0 信封（无请求/响应关联语义）。JSON-RPC 2.0 仅适用于第 8 章定义的 TCP 控制通道。
</div>
</div>

### 7.2 公共头（所有 UDP 报文）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>version</code></td><td>number</td><td style="white-space:nowrap">是</td><td>发现主版本，当前固定 <code>1</code></td></tr>
<tr><td><code>protocol</code></td><td>string</td><td style="white-space:nowrap">是</td><td>本版写 <code>bmahs/1.2</code></td></tr>
<tr><td style="white-space:nowrap"><code>kind</code></td><td>string</td><td style="white-space:nowrap">是</td><td><code>announce</code> / <code>query</code> / <code>goodbye</code></td></tr>
<tr><td><code>timestamp</code></td><td>number</td><td style="white-space:nowrap">是</td><td>Unix 秒（整数即可）</td></tr>
<tr><td style="white-space:nowrap"><code>id</code></td><td>string</td><td style="white-space:nowrap">是</td><td>稳定设备（或客户端）标识</td></tr>
</tbody>
</table>
</div>

### 7.3 设备标识 <code>id</code> 规则

<ul>
<li><code>id</code> 在设备生命周期内<b>必须</b>保持不变。</li>
<li>仅允许字符 <code>A-Z</code>、<code>a-z</code>、<code>0-9</code>、<code>-</code>；推荐全小写。</li>
<li>由显示名生成时：<b>先转小写</b>，再把不允许的字符替换为 <code>-</code>，去掉首尾 <code>-</code>；结果为空则用 <code>bmahs-device</code>。</li>
<li><b>应当</b>写入出厂配置或 Flash 固化。</li>
<li>示例：<code>ACME-Lamp-00A1</code> → <code>acme-lamp-00a1</code>。</li>
<li><b>不得</b>超过 <b>63 字节</b>（<code>id</code> 会被用作 DNS 标签 <code>{id}.local.</code>）；超出时截断并附加短哈希。</li>
</ul>

### 7.4 关键机器字段规则

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">规则</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>type</code></td><td>小写英文单词；由厂商自报，智能体按字符串匹配</td></tr>
<tr><td><code>service</code></td><td><code>{type}/{主版本}</code>，如 <code>light/1</code>；同 <code>type</code> 可演进为 <code>light/2</code></td></tr>
<tr><td style="white-space:nowrap"><code>want</code></td><td>仅 <code>query</code>。<code>*</code> / <code>bmahs</code> / 空 = 全部设备；否则逗号分隔 <code>type</code> 列表，匹配不区分大小写</td></tr>
<tr><td><code>control</code></td><td>URI。IPv4：<code>tcp://&lt;ipv4&gt;:&lt;port&gt;</code>；IPv6 必须加方括号：<code>tcp://[&lt;ipv6&gt;]:&lt;port&gt;</code>；双栈时优先写 IPv4</td></tr>
<tr><td><code>capabilities</code></td><td>能力标签数组：方法名 + 剖面标签（<code>ui</code> / <code>tap</code> / <code>swipe</code>）；剖面标签仅声明用，可调用面以 <code>operations</code> 为准</td></tr>
<tr><td><code>security</code></td><td>安全边界摘要对象：<code>{&quot;scope&quot;:&quot;lan&quot;,&quot;auth&quot;:&quot;none&quot;,&quot;occupancy&quot;:&quot;last-wins&quot;}</code></td></tr>
<tr><td style="white-space:nowrap"><code>port</code></td><td>1–65535 整数，与 <code>control</code> 端口一致</td></tr>
</tbody>
</table>
</div>

<p><b><code>query</code> 匹配算法（设备侧）</b>：</p>

<ol>
<li>将 <code>want</code> 按逗号拆分、去空白、转小写；</li>
<li>列表为空，或含 <code>*</code> / <code>bmahs</code> → 应答；</li>
<li>否则仅当本机 <code>type</code> 出现在列表中时应答。</li>
</ol>
