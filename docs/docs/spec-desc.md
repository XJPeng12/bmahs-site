---
title: "设备描述与自述规范"
description: "自然语言自述、操作清单 operations 与安全边界 security 三份必备描述，以及可选的使用约束 constraint 与用户确认机制。"
eyebrow: "规范全文 · 第 10 章"
---

<p class="eyebrow">规范全文 · 第 10 章</p>

# 设备描述与自述规范


### 10.1 三份必备描述

<p>每台 BMAHS 设备<b>必须</b>提供以下三份描述，供智能体在调用前以自然语言理解设备：</p>

<ol>
<li><b>自然语言自述</b>（<code>name</code> / <code>summary</code> / <code>constraint</code>）；</li>
<li><b>操作清单</b>（<code>operations</code>）；</li>
<li><b>安全边界</b>（<code>security</code>）。</li>
</ol>

<p>UDP <code>announce</code> 仅携带摘要（受 1400 字节限制）；完整内容置于 <code>hello</code> 通知参数，并可通过 <code>describe</code> 方法再次获取。</p>

<p>除上述三份<b>必备</b>描述外，设备<b>可以</b>另提供<b>使用约束</b> <code>constraint</code>（§10.6）——用一句自然语言声明“怎么用才对”，是可选的第四份说明，不实现不构成不符合本规范。</p>

### 10.2 自然语言自述（必须）

<p><b>原则</b>：大模型按语义选设备与填参数；稳定机器码（<code>id</code> / <code>type</code> / <code>service</code> / <code>method</code> / <code>bmahs_code</code>）保持英文标识；<b>凡供选型、决策、填参、读结果的说明文字，必须是完整自然语言句子</b>（建议与用户界面同一语言；本规范示例使用简体中文）。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">位置</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">写作要求</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>announce / hello / TXT</td><td style="white-space:nowrap">是</td><td>用户可读显示名（如“客厅灯”）；<b>禁止</b>仅写型号码、SKU 或无语义内部代号</td></tr>
<tr><td><code>summary</code></td><td>announce（应当）/ hello（必须）</td><td style="white-space:nowrap">见左</td><td>一两句自述：是什么设备、主要能做什么、使用注意（如是否需要占用）。UDP 建议 ≤ 120 字</td></tr>
<tr><td style="white-space:nowrap"><code>constraint</code></td><td>hello / describe</td><td style="white-space:nowrap">应当</td><td><b>使用约束</b>：一条自然语言短句，写清操作依赖（如是否需先 occupy、成对调用、多步次序）；详见 §10.6</td></tr>
<tr><td><code>security.notes</code></td><td>hello / describe</td><td style="white-space:nowrap">是</td><td>边界自然语言说明；<b>禁止</b>空串</td></tr>
<tr><td><code>error.message</code></td><td style="white-space:nowrap">错误响应</td><td style="white-space:nowrap">是</td><td>给人/模型看的失败原因短句；<b>不得</b>只回与错误码相同的无信息词</td></tr>
</tbody>
</table>
</div>

<p><b>附加规则</b>：</p>

<ol>
<li><b>发布即自述</b>：<code>announce</code> 的 <code>name</code> + <code>summary</code> <b>应当</b>使智能体未连 <code>control</code> 即可判断“要不要连这台”。</li>
<li><b>机器码 ≠ 说明</b>：不得以 <code>type=light</code> 代替 <code>summary</code>；不得以 <code>method=on</code> 代替 <code>operations[].description</code>。</li>
<li><b>可执行</b>：说明<b>应当</b>写清前置条件（<code>last-wins</code> 不必 occupy；<code>exclusive</code> <b>必须</b> occupy 并带 token）、互斥参数、常见失败。</li>
<li><b>勿塞密钥</b>：自然语言字段<b>禁止</b>写入密码、<code>token</code>、账号、流 URI。</li>
<li><b>语言稳定</b>：同一设备生命周期内 <code>summary</code> / 主要 <code>description</code> 不得频繁改写以致语义变化；能力变化<b>应当</b>升 <code>service</code> 或更新 <code>operations</code> 并立即重新 <code>announce</code>。</li>
</ol>

<p>Bonjour TXT 中的 <code>summary</code> 若放入<b>应当</b>截断（建议 ≤ 80 字），完整语义以 <code>hello</code> 通知为准。</p>

### 10.3 操作清单 <code>operations</code>（必须）

<p><code>operations</code> 为智能体可调用的<b>全部</b>方法。规范要求：</p>

<ul>
<li>未出现在清单中的 <code>method</code>，设备<b>必须</b>拒绝（<code>unknown-action</code>，JSON-RPC <code>-32601</code>）；</li>
<li>智能体运行时<b>必须</b>把 <code>operations</code> 转换为工具 schema：工具说明取自 <code>description</code>，参数定义<b>只</b>取自 <code>args</code>，返回说明<b>只</b>取自 <code>result</code> / <code>returns</code>；</li>
<li>新设备<b>必须</b>使用对象数组；对遗留字符串数组形式的 <code>args</code> / <code>returns</code>，智能体仅作兼容理解（<code>type=string</code>、<code>required=false</code>、<code>description=&quot;&quot;</code>），并<b>应当</b>再调 <code>describe</code> 要求完整清单。</li>
</ul>

<p><b>operations 项字段</b>（<code>name</code> 即 JSON-RPC <code>method</code>）：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>string</td><td style="white-space:nowrap">是</td><td>方法名，与请求 <code>method</code> 相同（机器码），小写，可含 <code>.</code></td></tr>
<tr><td><code>description</code></td><td>string</td><td style="white-space:nowrap">是</td><td><b>自然语言</b>：做什么、何时用；禁止空串或仅重复 <code>name</code></td></tr>
<tr><td style="white-space:nowrap"><code>args</code></td><td>object[]</td><td style="white-space:nowrap">是</td><td>参数对象列表；无参必须为 <code>[]</code></td></tr>
<tr><td><code>any_of</code></td><td>string[]</td><td style="white-space:nowrap">可以</td><td>这些参数名至少提供一个；都未提供则 <code>bad-arg</code></td></tr>
<tr><td><code>result</code></td><td>string</td><td style="white-space:nowrap">是</td><td><b>自然语言</b>：成功时模型<b>应当</b>如何理解返回</td></tr>
<tr><td><code>returns</code></td><td>object[]</td><td style="white-space:nowrap">是</td><td>成功响应 <code>result</code> 对象会出现的字段；无额外字段则为 <code>[]</code></td></tr>
</tbody>
</table>
</div>

<p><b>args[] / returns[] 项字段</b>：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>string</td><td style="white-space:nowrap">是</td><td><code>params</code>（args）或 <code>result</code>（returns）中的字段名</td></tr>
<tr><td style="white-space:nowrap"><code>type</code></td><td>string</td><td style="white-space:nowrap">是</td><td><code>string</code> / <code>int</code> / <code>number</code> / <code>bool</code>；<code>returns</code> 嵌套 JSON 可用 <code>object</code> / <code>array</code>，细节写 <code>description</code></td></tr>
<tr><td><code>required</code></td><td style="white-space:nowrap">bool</td><td>是（仅 args）</td><td>args 条目必须写出本字段；<code>returns</code> 不写</td></tr>
<tr><td><code>description</code></td><td>string</td><td style="white-space:nowrap">是</td><td><b>自然语言</b>：含义、填法、单位、与兄弟参数关系；禁止空串</td></tr>
<tr><td><code>min</code> / <code>max</code></td><td>number</td><td style="white-space:nowrap">数值应当</td><td>闭区间；有上下限就必须写</td></tr>
<tr><td style="white-space:nowrap"><code>enum</code></td><td>string[]</td><td style="white-space:nowrap">枚举应当</td><td>有固定集合就必须写</td></tr>
<tr><td style="white-space:nowrap"><code>unit</code></td><td>string</td><td style="white-space:nowrap">可以</td><td>如 <code>%</code>、<code>K</code>、<code>s</code>、<code>Hz</code></td></tr>
<tr><td><code>example</code></td><td>与 type 一致</td><td style="white-space:nowrap">应当</td><td>一个合法示例</td></tr>
<tr><td><code>default</code></td><td>与 type 一致</td><td style="white-space:nowrap">可以</td><td>省略时设备使用的默认值</td></tr>
</tbody>
</table>
</div>

<p><b>operations → JSON Schema / 工具 schema 映射</b>（不得另编参数）：</p>

<div class="table-wrap">
<table>
<thead><tr><th><code>operations</code></th><th>工具 schema</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap"><code>name</code></td><td>函数 / tool / JSON-RPC method 名</td></tr>
<tr><td><code>description</code></td><td style="white-space:nowrap">工具说明</td></tr>
<tr><td><code>args[].name</code> + <code>type</code> / <code>min</code> / <code>max</code> / <code>enum</code> / <code>description</code> / <code>example</code> / <code>unit</code></td><td>参数属性 / JSON Schema 属性</td></tr>
<tr><td><code>args</code> 中 <code>required=true</code> 的 <code>name</code></td><td>必填参数列表</td></tr>
<tr><td><code>any_of</code></td><td>写入工具说明，并在发请求前检查</td></tr>
<tr><td><code>result</code> + <code>returns</code></td><td>不作入参；调用后按 <code>result</code> 对象字段读响应</td></tr>
</tbody>
</table>
</div>

<p><b>业务动作示例</b>（<code>last-wins</code> 灯，<b>不要</b>再写“必须先 occupy”）：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">业务方法调用示例</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-p">{</span>
  <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;brightness&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;把灯的亮度调到指定百分比；看电影等需要调暗时使用。后来的设置立即覆盖先前的。&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;args&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span>
    <span class="tok-p">{</span>
      <span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;level&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;int&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;required&quot;</span><span class="tok-p">:</span> true<span class="tok-p">,</span>
      <span class="tok-f">&quot;min&quot;</span><span class="tok-p">:</span> <span class="tok-n">0</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;max&quot;</span><span class="tok-p">:</span> <span class="tok-n">100</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;unit&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;%&quot;</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;example&quot;</span><span class="tok-p">:</span> <span class="tok-n">40</span><span class="tok-p">,</span>
      <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;亮度，0 最暗、100 最亮&quot;</span>
    <span class="tok-p">}</span>
  <span class="tok-p">]</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;result&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;成功时 result 对象含开关状态与当前亮度&quot;</span><span class="tok-p">,</span>
  <span class="tok-f">&quot;returns&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span>
    <span class="tok-p">{</span><span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;state&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;string&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;enum&quot;</span><span class="tok-p">:</span> <span class="tok-p">[</span><span class="tok-s">&quot;on&quot;</span><span class="tok-p">,</span> <span class="tok-s">&quot;off&quot;</span><span class="tok-p">]</span><span class="tok-p">,</span> <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;灯是否亮着&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;example&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;on&quot;</span><span class="tok-p">}</span><span class="tok-p">,</span>
    <span class="tok-p">{</span><span class="tok-f">&quot;name&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;level&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;type&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;int&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;min&quot;</span><span class="tok-p">:</span> <span class="tok-n">0</span><span class="tok-p">,</span> <span class="tok-f">&quot;max&quot;</span><span class="tok-p">:</span> <span class="tok-n">100</span><span class="tok-p">,</span> <span class="tok-f">&quot;unit&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;%&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;description&quot;</span><span class="tok-p">:</span> <span class="tok-s">&quot;当前亮度&quot;</span><span class="tok-p">,</span> <span class="tok-f">&quot;example&quot;</span><span class="tok-p">:</span> <span class="tok-n">40</span><span class="tok-p">}</span>
  <span class="tok-p">]</span>
<span class="tok-p">}</span></pre>
</div>

### 10.4 通用方法

#### 10.4.1 必选范围

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">方法</th><th style="white-space:nowrap">所有设备</th><th><code>exclusive</code> 另加</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>describe</code></td><td style="white-space:nowrap"><b>必须</b></td><td style="white-space:nowrap">—</td><td>权威 operations / security / 自述</td></tr>
<tr><td style="white-space:nowrap"><code>info</code></td><td style="white-space:nowrap"><b>必须</b></td><td style="white-space:nowrap">—</td><td style="white-space:nowrap">精简身份</td></tr>
<tr><td style="white-space:nowrap"><code>who</code></td><td style="white-space:nowrap"><b>必须</b></td><td style="white-space:nowrap">—</td><td>最后控制者与活动流；<code>exclusive</code> 另含租约</td></tr>
<tr><td><code>occupy</code></td><td style="white-space:nowrap">不必须</td><td style="white-space:nowrap"><b>必须</b></td><td>仅独占策略签发 token</td></tr>
<tr><td><code>release</code></td><td style="white-space:nowrap">不必须</td><td style="white-space:nowrap"><b>必须</b></td><td>仅独占策略归还独占</td></tr>
<tr><td><code>register</code></td><td style="white-space:nowrap"><b>不必须</b></td><td style="white-space:nowrap"><b>不必须</b></td><td>不再作为必要实现</td></tr>
</tbody>
</table>
</div>

<ul>
<li><code>last-wins</code> 设备<b>可以</b>实现不签发 <code>token</code> 的 <code>occupy</code> / <code>release</code> 空操作（仅更新/清除 <code>holder</code>）；<b>不得</b>因此要求智能体先调用它们。</li>
<li>未实现 <code>occupy</code> / <code>release</code> / <code>register</code> 时，对相应请求<b>必须</b>回 <code>unknown-action</code>。</li>
<li>有 <code>input</code> 端点的设备<b>应当</b>另实现 <code>stream.join</code>（§14.3）；所有声明 <code>endpoints</code> 的设备<b>必须</b>实现该端点 <code>open</code> / <code>close</code> 所指方法（缺省 <code>stream.start</code> / <code>stream.accept</code> / <code>stream.stop</code>）。</li>
</ul>

#### 10.4.2 标准形状定义

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">方法</th><th style="white-space:nowrap">作用</th><th><code>params</code>（公共 <code>agent</code> / <code>token</code> 除外）</th><th>成功 <code>result</code></th></tr></thead>
<tbody>
<tr><td><code>describe</code></td><td><b>权威来源</b>：完整操作清单与安全边界</td><td style="white-space:nowrap"><code>{}</code></td><td><code>operations</code>、<code>security</code>、<code>id</code>、<code>type</code>、<code>service</code>、<code>name</code>、<code>summary</code>、<code>constraint</code>、<code>state</code>、<code>occupancy</code>、<code>holder</code>（若有）、<code>streams</code>（若有）</td></tr>
<tr><td style="white-space:nowrap"><code>info</code></td><td><b>精简</b>描述：是什么、什么状态</td><td style="white-space:nowrap"><code>{}</code></td><td><code>id</code>、<code>type</code>、<code>service</code>、<code>name</code>、<code>summary</code>、<code>model</code>、<code>state</code>、<code>occupancy</code>、<code>holder</code>（若有）</td></tr>
<tr><td style="white-space:nowrap"><code>who</code></td><td><b>谁在用</b>：最后控制者与活动媒体会话</td><td style="white-space:nowrap"><code>{}</code></td><td><code>id</code>、<code>name</code>、<code>type</code>、<code>service</code>、<code>state</code>、<code>occupancy</code>、<code>holder</code>（若有）、<code>until</code> / <code>lease_security</code>（仅 exclusive 占用中）、<code>streams</code>（应当）</td></tr>
<tr><td><code>occupy</code></td><td>取得独占权并签发 token（仅 exclusive）</td><td><code>ttl</code>（可选，10–9999，见 §11.3）</td><td><code>state</code>、<code>event</code>、<code>busy</code>、<code>holder</code>、<code>until</code>、<code>lease_security</code>、<code>token</code></td></tr>
<tr><td><code>release</code></td><td>归还独占权、作废 token（仅 exclusive）</td><td style="white-space:nowrap"><code>{}</code></td><td><code>state</code>（<code>online</code>）、<code>event</code>（<code>release</code>）、<code>busy</code></td></tr>
</tbody>
</table>
</div>

#### 10.4.3 只读方法语义边界（必须区分）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">方法</th><th>与其它方法的差异</th><th>需要 token</th><th>改变占用 / holder</th></tr></thead>
<tbody>
<tr><td><code>describe</code></td><td>唯一保证返回<b>完整</b> <code>operations</code> / <code>security</code></td><td style="white-space:nowrap">否</td><td style="white-space:nowrap">否</td></tr>
<tr><td style="white-space:nowrap"><code>info</code></td><td><b>可以</b>不含完整 <code>operations</code> / <code>security</code></td><td style="white-space:nowrap">否</td><td style="white-space:nowrap">否</td></tr>
<tr><td style="white-space:nowrap"><code>who</code></td><td>不返回 <code>operations</code> / <code>security</code>；<code>holder</code> 缺省表示最近无人控制（last-wins）或当前无人占用（exclusive）</td><td style="white-space:nowrap">否</td><td style="white-space:nowrap">否</td></tr>
</tbody>
</table>
</div>

<p><b><code>holder</code> 与 <code>streams</code> 定义</b>：</p>

<ul>
<li><code>holder</code>：最后一条<b>控制</b>调用的 <code>agent</code>（last-wins），或当前占用方（exclusive）；无则省略。</li>
<li><code>streams</code>：活动端点会话 <code>[{id, endpoint, agent, since}]</code>，<b>不含</b> URI。</li>
<li>问“谁在调音量”看 <code>holder</code>；问“谁在拉这条端点”看 <code>streams</code>。</li>
</ul>

<p><code>announce.capabilities</code> <b>应当</b>包含设备实际实现的通用方法名（至少 <code>describe,info,who</code>）。</p>

### 10.5 安全边界 <code>security</code>（必须）

<p><code>security</code> 是设备承诺的能力上限。智能体<b>不得</b>请求 <code>deny</code> 中的能力；设备收到越界请求<b>必须</b>拒绝并回 <code>denied</code>（<code>-32005</code>）。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td><code>scope</code></td><td>string</td><td style="white-space:nowrap">是</td><td>网络范围：<code>lan</code> / <code>wan</code>（开放 <code>wan</code> <b>必须</b>另在文档说明）</td></tr>
<tr><td style="white-space:nowrap"><code>auth</code></td><td>string</td><td style="white-space:nowrap">是</td><td>传输/身份鉴权：<code>none</code> / <code>token</code> / <code>tls</code>。<b>不是</b>占用策略</td></tr>
<tr><td><code>occupancy</code></td><td>string</td><td>是（1.2）</td><td><code>last-wins</code> 或 <code>exclusive</code>。UDP / hello / describe <b>必须</b>出现。缺省按 <code>exclusive</code> 理解</td></tr>
<tr><td><code>allow</code></td><td>string[]</td><td style="white-space:nowrap">应当</td><td>明确允许的能力标签</td></tr>
<tr><td style="white-space:nowrap"><code>deny</code></td><td>string[]</td><td style="white-space:nowrap">是</td><td>明确禁止的能力。<b>建议</b>至少覆盖：任意读盘、任意写盘、执行命令、联网拉取、云上传、摄像头/麦克风偷采</td></tr>
<tr><td><code>confirm</code></td><td>string[]</td><td style="white-space:nowrap">可以</td><td>需用户确认后才执行的方法名</td></tr>
<tr><td><code>confirm_timeout</code></td><td style="white-space:nowrap">int</td><td style="white-space:nowrap">可以</td><td>需确认动作的最长等待秒数，范围 <b>5–300</b>，缺省 <b>30</b></td></tr>
<tr><td><code>notes</code></td><td>string</td><td style="white-space:nowrap">是</td><td><b>自然语言</b>边界说明；禁止空串</td></tr>
</tbody>
</table>
</div>

<p><b>规范约束</b>：</p>

<ul>
<li><code>auth</code> 与 <code>occupancy</code> <b>不得</b>互相替代：<code>auth=none</code> 的设备仍可为 <code>exclusive</code>（仅靠占用 token 互斥，无 TLS）；<code>last-wins</code> 设备<b>不得</b>再要求控制调用携带占用 token。</li>
<li><code>announce.security</code> / Bonjour <code>security</code> 仅带摘要对象；TXT 写为 <code>security=lan,none,last-wins</code>。</li>
<li>UDP / TXT <b>不得</b>携带占用令牌或流 URI。</li>
</ul>

### 10.6 使用约束 <code>constraint</code>（可选）

<p><code>constraint</code> 是设备用<b>自然语言</b>给出的<b>使用约束</b>声明——即“要正确、安全地使用这台设备，必须遵守哪些操作纪律”。它与 <code>security</code> 不同：<code>security</code> 声明的是<b>能力上限</b>（能做/不能做），<code>constraint</code> 声明的是<b>用法约束</b>（怎么做才对）。二者<b>不得</b>互相替代。</p>

<p><code>constraint</code> 出现在两处：<code>hello</code> 通知的 <code>params</code>（应当），以及 <code>describe</code> 成功 <code>result</code>（应当）；两处<b>应当</b>一致。设备<b>可以</b>不提供 <code>constraint</code>；提供时即为本节的约束声明。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项</th><th>位置</th><th style="white-space:nowrap">必须</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>constraint</code></td><td><code>hello</code> 通知 <code>params</code>；<code>describe</code> 成功 <code>result</code></td><td style="white-space:nowrap">应当</td><td><b>一条</b>自然语言短句，写清本设备特有的操作依赖与使用纪律；<b>禁止</b>空串</td></tr>
</tbody>
</table>
</div>

<p><b>写作要求</b>：</p>

<ol>
<li><b>一句话说清依赖关系</b>。<code>constraint</code> 不是能力清单、不是安全声明，而是“调用这台设备时最容易出错的那条纪律”。典型内容：是否需要先 <code>occupy</code>、多步操作的先后次序、必须成对调用的方法、易错参数的经验边界。</li>
<li><b>按 <code>security.occupancy</code> 区分写法</b>（这是 <code>constraint</code> 最核心的用途）：<code>last-wins</code> 写“直接调用业务方法，不必 <code>occupy</code>”；<code>exclusive</code> 写“先 <code>occupy</code> 取得 token，任务结束（含失败/取消）<b>必须</b> <code>release</code>”。</li>
<li><b>可以写经验性建议</b>。<code>constraint</code> 允许包含厂商经验值（如“建议夜间亮度不超过 30”“拉流前先确认音源 <code>state=playing</code>”）。这类建议不构成强制要求，但<b>应当</b>真实、无歧义。</li>
<li><b>只写约束，不写密钥</b>。<b>禁止</b>写入密码、<code>token</code>、账号、流 URI（同 §10.2 附加规则 4）。</li>
<li><b>不得与 <code>operations</code> / <code>security</code> 冲突</b>。<code>constraint</code> 若与 <code>operations[].description</code>、<code>security.deny</code> / <code>confirm</code> / <code>occupancy</code> 矛盾，以后者为准；误导性的 <code>constraint</code> 视为<b>违反协议</b>。</li>
</ol>

<p><b>规范约束</b>：</p>

<ul>
<li><code>constraint</code> <b>不得</b>用来授予或放宽权限——它<b>不得</b>声明 <code>security.deny</code> 之外的能力，也<b>不得</b>抵消 <code>security.confirm</code> 与 <code>occupancy</code> 的硬约束。</li>
<li>设备在 <code>describe</code> 返回的 <code>constraint</code> <b>应当</b>与 <code>hello</code> 通知中的一致；能力约束变化时<b>应当</b>更新并立即重新 <code>announce</code>（同 §10.2 附加规则 5）。</li>
<li>智能体收到 <code>hello</code> / <code>describe</code> 后<b>必须</b>把 <code>constraint</code> 交给模型（§12 第 1 项）；模型<b>应当</b>在编排时把 <code>constraint</code> 当作<b>应当</b>遵守的调用纪律，但<b>不得</b>以其覆盖 <code>security</code> 硬约束。</li>
<li><code>constraint</code> 与 <code>summary</code> 分工：<code>summary</code> 回答“这是什么、主要能做什么”，<code>constraint</code> 回答“怎么用才对”。<b>不得</b>把 <code>summary</code> 的内容原样复制为 <code>constraint</code>。</li>
</ul>

<p><b>示例</b>——<code>last-wins</code> 灯（依赖关系：无需占用）：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">last-wins 灯的 constraint</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-f">&quot;constraint&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;直接调用 on、off、brightness。不必 occupy。&quot;</span></pre>
</div>

<p><code>exclusive</code> 音箱（依赖关系：占用 → 控制 → 归还，且拉流有前置条件）：</p>

<div class="code">
<div class="code__head"><span class="code__dot"></span><span class="code__name">exclusive 音箱的 constraint</span>
<button class="code__copy" type="button">复制</button></div>

<pre><span class="tok-f">&quot;constraint&quot;</span><span class="tok-p">:</span><span class="tok-s">&quot;拉流前先确认音源 state=playing；先 occupy 取得 token，任务结束必须 release。音量 0–100。&quot;</span></pre>
</div>

### 10.7 用户确认机制（<code>security.confirm</code>，可选）

<p><code>security.confirm</code> 列出的方法，设备<b>必须</b>在本次执行前取得<b>本地</b>用户确认：</p>

<ol>
<li><b>确认通道由设备本地提供</b>（物理按键、设备屏幕弹窗、厂商官方 App 等）；本协议<b>不</b>规定其形态，也<b>不</b>新增控制方法。</li>
<li>设备收到需确认调用后<b>最多等待 <code>confirm_timeout</code></b>（缺省 30 秒，可配置 5–300 秒），等待期间<b>不回复</b>该请求（即不发送对应 <code>id</code> 的响应）。</li>
<li>等待期内完成本地确认 → 正常执行；超时或用户否决 → 错误响应 <code>denied</code>（<code>-32005</code>）。<code>denied</code> 默认 <code>retryable=false</code>；仅<b>确认超时</b>（非用户否决）时 <code>data.retryable=true</code>，且不得高频重试。</li>
<li>设备<b>应当</b>在等待期间给出本地提示。</li>
<li>智能体<b>应当</b>在调用前向用户说明将要做什么；<b>不得</b>因用户未响应而高频重试。</li>
<li>智能体的等待超时<b>不得</b>短于设备公告的 <code>confirm_timeout</code>。</li>
<li>采集类端点（麦克风、摄像头）的开流方法即使设备为 <code>last-wins</code>，也<b>应当</b>列入 <code>confirm</code>。音箱被灌流不必确认。</li>
</ol>
