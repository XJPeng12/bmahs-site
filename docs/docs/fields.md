---
title: "字段与消息"
description: "bmahs/1.2 核心字段定义：设备自述、operations 条目、security、endpoints、占用租约与状态字段。"
eyebrow: "规范参考 / 字段"
---

<p class="eyebrow">规范参考 / 字段</p>

# 字段与消息

<p class="lead">
  本节汇总协议里会反复出现的字段。设计原则只有一条：
<b>机器码保持英文标识（id / type / service / method / bmahs_code），供决策的说明必须是完整自然语言</b>。
</p>

## 设备自述字段（hello 通知 / describe）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono">protocol</td><td>string</td><td style="white-space:nowrap">是</td><td>本版写 <code>bmahs/1.2</code>；也用于对端版本识别</td></tr>
<tr><td class="mono" style="white-space:nowrap">id</td><td>string</td><td style="white-space:nowrap">是</td><td>设备唯一标识；仅 <code>A-Za-z0-9-</code>，生命周期内不变，建议固化出厂</td></tr>
<tr><td class="mono" style="white-space:nowrap">name</td><td>string</td><td style="white-space:nowrap">是</td><td>用户可读显示名（如“客厅灯”）；<b>禁止</b>只写型号码 / SKU / 内部代号</td></tr>
<tr><td class="mono" style="white-space:nowrap">type</td><td>string</td><td style="white-space:nowrap">是</td><td>小写英文品类：<code>speaker</code> / <code>bridge</code> / <code>qqmusic</code> / <code>light</code> …</td></tr>
<tr><td class="mono">service</td><td>string</td><td style="white-space:nowrap">是</td><td>协议服务及版本，如 <code>speaker/1</code>；决定可调用的操作集</td></tr>
<tr><td class="mono">summary</td><td>string</td><td style="white-space:nowrap">是</td><td>一两句自述：是什么、能做什么、使用注意（如是否需要占用）</td></tr>
<tr><td class="mono" style="white-space:nowrap">constraint</td><td>string</td><td style="white-space:nowrap">应当</td><td>给模型的使用约束，通常是设备操作的依赖关系：<code>last-wins</code> 写“直接调方法”；<code>exclusive</code> 写“先 occupy，结束必须 release”</td></tr>
<tr><td class="mono">capabilities</td><td>string[]</td><td style="white-space:nowrap">是</td><td>方法名 + 剖面标签（<b>剖面 profile</b> = 设备可选实现的扩展方法集；<code>ui</code> / <code>tap</code> / <code>swipe</code>）；至少含 <code>describe,info,who</code></td></tr>
<tr><td class="mono">operations</td><td>object[]</td><td style="white-space:nowrap">是</td><td>操作清单（见下）</td></tr>
<tr><td class="mono">security</td><td>object</td><td style="white-space:nowrap">是</td><td>安全边界（含 <code>occupancy</code>）</td></tr>
<tr><td class="mono">state</td><td>string</td><td style="white-space:nowrap">是</td><td><code>online</code> / <code>offline</code>（仅此两个值）</td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td style="white-space:nowrap">bool</td><td style="white-space:nowrap">是</td><td>true 当且仅当：exclusive 被占用，或存在活动 UI 流 / 媒体会话</td></tr>
<tr><td class="mono">holder</td><td>string</td><td style="white-space:nowrap">有则必须</td><td>最后控制者（last-wins）或当前占用方（exclusive）；无则省略</td></tr>
<tr><td class="mono">event</td><td>string</td><td style="white-space:nowrap">应当</td><td>状态变化事件：<code>online</code> / <code>offline</code> / <code>occupy</code> / <code>release</code></td></tr>
<tr><td class="mono">control</td><td>string</td><td style="white-space:nowrap">是</td><td><code>tcp://IP:端口</code>（IPv6 加方括号）</td></tr>
<tr><td class="mono" style="white-space:nowrap">hb</td><td>number</td><td style="white-space:nowrap">可以</td><td>announce 稳态间隔（秒），缺省 5；调大时<b>必须</b>在该字段公告。智能体按 <code>clamp(12 × hb, 60 秒, 30 分钟)</code> 判定设备下线</td></tr>
<tr><td class="mono" style="white-space:nowrap">width</td><td>number</td><td style="white-space:nowrap">有 ui 时应当</td><td>屏幕逻辑宽度（像素）；旋转 / 缩放后必须在下一帧头给出新值</td></tr>
<tr><td class="mono" style="white-space:nowrap">height</td><td>number</td><td style="white-space:nowrap">有 ui 时应当</td><td>屏幕逻辑高度（像素）</td></tr>
<tr><td class="mono">endpoints</td><td>object[]</td><td style="white-space:nowrap">有端点时</td><td>完整端点对象（见下）</td></tr>
<tr><td class="mono">notifications</td><td>string[]</td><td style="white-space:nowrap">可选</td><td>声明实现的额外通知（如 <code>["event"]</code>）</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--warn">
<div class="callout__icon">!</div>
<div class="callout__body">
<div class="callout__title">自然语言字段四不准</div>
    ① 不得用 <code>type=light</code> 代替 <code>summary</code>；② 不得塞密码、token、账号、流 URI；
    ③ <code>security.notes</code> 禁止空串；④ 同一设备生命周期内 <code>summary</code> 不得频繁改写以致语义变化 ——
    能力变化<b>应当</b>升 <code>service</code> 或更新 <code>operations</code> 并立即重新 <code>announce</code>。
</div>
</div>

## 发现层字段（UDP <code>announce</code> / <code>query</code>）

<p>发现层是 UDP 组播报文，采用<b>扁平</b>结构、不走 JSON-RPC 2.0 信封；除上表外另有下列字段（完整定义见第 15 章）。</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono">version</td><td>number</td><td style="white-space:nowrap">是</td><td>发现主版本，当前固定 <code>1</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">kind</td><td>string</td><td style="white-space:nowrap">是</td><td><code>announce</code> / <code>query</code> / <code>goodbye</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">timestamp</td><td>number</td><td style="white-space:nowrap">是</td><td>Unix 秒（整数即可）</td></tr>
<tr><td class="mono">model</td><td>string</td><td style="white-space:nowrap">应当</td><td>硬件型号，便于用户识别</td></tr>
<tr><td class="mono">ip</td><td>string</td><td style="white-space:nowrap">应当</td><td>局域网 IPv4 地址；<b>不得</b>用 <code>127.0.0.1</code></td></tr>
<tr><td class="mono">ipv6</td><td>string</td><td style="white-space:nowrap">应当</td><td>局域网 IPv6 地址；不带 <code>%zone</code></td></tr>
<tr><td class="mono">port</td><td>number</td><td style="white-space:nowrap">是</td><td><code>1–65535</code> 整数，与 <code>control</code> 端口一致</td></tr>
<tr><td class="mono">until</td><td>number</td><td style="white-space:nowrap">exclusive 占用中应当</td><td>租约到期 Unix 秒；无限期为 <code>0</code></td></tr>
<tr><td class="mono">want</td><td>string</td><td style="white-space:nowrap">query 必须</td><td><code>*</code> / <code>bmahs</code> / 空 = 全部设备；否则逗号分隔 <code>type</code> 列表，匹配不区分大小写</td></tr>
</tbody>
</table>
</div>

## operations 条目字段

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">name</td><td>string</td><td style="white-space:nowrap">是</td><td>方法名 = JSON-RPC <code>method</code>；小写字母，可含 <code>.</code> 与 <code>_</code>（如 <code>stream.join</code>、<code>playlist_play</code>）</td></tr>
<tr><td class="mono">description</td><td>string</td><td style="white-space:nowrap">是</td><td>自然语言：做什么、何时用；禁止空串或仅重复 name</td></tr>
<tr><td class="mono" style="white-space:nowrap">args</td><td>object[]</td><td style="white-space:nowrap">是</td><td>参数对象列表；无参必须为 <code>[]</code></td></tr>
<tr><td class="mono">any_of</td><td>string[]</td><td style="white-space:nowrap">可以</td><td>这些参数名至少提供一个，否则 <code>bad-arg</code></td></tr>
<tr><td class="mono">result</td><td>string</td><td style="white-space:nowrap">是</td><td>自然语言：成功时模型<b>应当</b>如何理解返回</td></tr>
<tr><td class="mono">returns</td><td>object[]</td><td style="white-space:nowrap">是</td><td>成功 <code>result</code> 对象会出现的字段；无额外字段则为 <code>[]</code></td></tr>
</tbody>
</table>
</div>

### args[] / returns[] 项字段

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">类型</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">name</td><td>string</td><td style="white-space:nowrap">是</td><td><code>params</code>（args）或 <code>result</code>（returns）中的字段名</td></tr>
<tr><td class="mono" style="white-space:nowrap">type</td><td>string</td><td style="white-space:nowrap">是</td><td><code>string</code> / <code>int</code> / <code>number</code> / <code>bool</code>；returns 嵌套可用 <code>object</code> / <code>array</code></td></tr>
<tr><td class="mono">required</td><td style="white-space:nowrap">bool</td><td>仅 args</td><td>args 条目必须写出本字段；returns 不写</td></tr>
<tr><td class="mono">description</td><td>string</td><td style="white-space:nowrap">是</td><td>自然语言：含义、填法、单位、与兄弟参数关系；禁止空串</td></tr>
<tr><td class="mono">min / max</td><td>number</td><td style="white-space:nowrap">数值应当</td><td>闭区间；有上下限就必须写</td></tr>
<tr><td class="mono" style="white-space:nowrap">enum</td><td>string[]</td><td style="white-space:nowrap">枚举应当</td><td>有固定集合就必须写</td></tr>
<tr><td class="mono" style="white-space:nowrap">unit</td><td>string</td><td style="white-space:nowrap">可以</td><td>如 <code>%</code>、<code>K</code>、<code>s</code>、<code>Hz</code></td></tr>
<tr><td class="mono">example</td><td>同 type</td><td style="white-space:nowrap">应当</td><td>一个合法示例</td></tr>
<tr><td class="mono">default</td><td>同 type</td><td style="white-space:nowrap">可以</td><td>省略时设备使用的默认值</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">operations → 工具 schema 的映射纪律</div>
    工具说明只取 <code>description</code>；参数定义<b>只</b>取 <code>args</code>；返回说明<b>只</b>取
<code>result</code> / <code>returns</code> —— <b>不得另编参数</b>。
    清单外的 <code>method</code> 设备必须拒绝（<code>unknown-action</code>）。
</div>
</div>

## security 字段

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono">scope</td><td style="white-space:nowrap">是</td><td>网络范围：<code>lan</code> / <code>wan</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">auth</td><td style="white-space:nowrap">是</td><td>鉴权：<code>none</code> / <code>token</code> / <code>tls</code>（不是占用策略）</td></tr>
<tr><td class="mono">occupancy</td><td style="white-space:nowrap">是</td><td><code>last-wins</code> 或 <code>exclusive</code>；缺省按 exclusive 理解</td></tr>
<tr><td class="mono">allow</td><td style="white-space:nowrap">应当</td><td>明确允许的能力标签</td></tr>
<tr><td class="mono" style="white-space:nowrap">deny</td><td style="white-space:nowrap">是</td><td>建议至少覆盖：任意读盘、任意写盘、执行命令、联网拉取、云上传、摄像头 / 麦克风偷采</td></tr>
<tr><td class="mono">confirm</td><td style="white-space:nowrap">可以</td><td>需本地用户确认的方法名</td></tr>
<tr><td class="mono">confirm_timeout</td><td style="white-space:nowrap">可以</td><td>5–300 秒，缺省 30</td></tr>
<tr><td class="mono">notes</td><td style="white-space:nowrap">是</td><td>自然语言边界说明，禁止空串</td></tr>
</tbody>
</table>
</div>

## endpoints 字段

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">id</td><td style="white-space:nowrap">是</td><td>如 <code>stream_out</code> / <code>a2dp_in</code></td></tr>
<tr><td class="mono" style="white-space:nowrap">dir</td><td style="white-space:nowrap">是</td><td><code>output</code>（提供）/ <code>input</code>（接收）</td></tr>
<tr><td class="mono" style="white-space:nowrap">kind</td><td style="white-space:nowrap">是</td><td><code>audio</code>（常用）/ <code>video</code> / <code>frame</code> / <code>byte</code></td></tr>
<tr><td class="mono">media</td><td style="white-space:nowrap">是</td><td>至少一个 IANA 类型（<code>audio/L16</code>；<code>audio/pcm</code> 为兼容写法）</td></tr>
<tr><td class="mono">access</td><td style="white-space:nowrap">是</td><td>output 用 <code>provide</code>，input 用 <code>consume</code></td></tr>
<tr><td class="mono">max_sessions</td><td style="white-space:nowrap">应当</td><td style="white-space:nowrap">默认 1</td></tr>
<tr><td class="mono">preempt</td><td style="white-space:nowrap">可以</td><td>会话满时是否抢占；缺省 true</td></tr>
<tr><td class="mono">description</td><td style="white-space:nowrap">是</td><td>自然语言：该端点产 / 消费什么、给谁用</td></tr>
<tr><td class="mono">open / close</td><td style="white-space:nowrap">应当</td><td>缺省 output=<code>stream.start</code>，input=<code>stream.accept</code>，关闭=<code>stream.stop</code></td></tr>
<tr><td class="mono">close_on_release</td><td style="white-space:nowrap">可以</td><td>仅 exclusive 有意义；缺省 false：release 不停数据流</td></tr>
</tbody>
</table>
</div>

### format 对象（开流 result 中必须带齐）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">必须</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono" style="white-space:nowrap">mode</td><td style="white-space:nowrap">是</td><td><code>raw</code>（连续字节）或 <code>framed</code>（每包 <code>[u32 BE len][payload]</code>，payload 内禁止再套 JSON）</td></tr>
<tr><td class="mono">media</td><td style="white-space:nowrap">是</td><td><b>必须</b>与端点 <code>media[]</code> 中一项一致</td></tr>
<tr><td class="mono">sample_rate / channels / bits / signed</td><td style="white-space:nowrap">音频必须</td><td>如 48000 / 2 / 16 / true</td></tr>
<tr><td class="mono">endian</td><td>位深 &gt; 8 必须</td><td><code>le</code> / <code>be</code></td></tr>
</tbody>
</table>
</div>

## 占用与租约字段（仅 exclusive）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">字段</th><th style="white-space:nowrap">说明</th></tr></thead>
<tbody>
<tr><td class="mono">token</td><td>占用凭据：≥16 个十六进制字符；与签发时的 <code>agent</code> 绑定；<b>只出现在 TCP</b>，禁止进入 UDP / TXT / hello / who / describe / 模型上下文</td></tr>
<tr><td class="mono">until</td><td>租约到期 <b>Unix 秒</b>；无限期（ttl=9999）时为 <code>0</code></td></tr>
<tr><td class="mono">lease_security</td><td>租约秒数（10–9999）；缺省 60</td></tr>
<tr><td class="mono">holder</td><td>当前占用方；无则省略</td></tr>
<tr><td class="mono">streams[]</td><td>活动端点会话 <code>{id, endpoint, agent, since}</code>，不含 URI</td></tr>
</tbody>
</table>
</div>

## 错误码（bmahs_code → JSON-RPC code）

<div class="table-wrap">
<table>
<thead><tr><th>bmahs_code</th><th style="white-space:nowrap">code</th><th>retryable</th><th style="white-space:nowrap">触发条件</th></tr></thead>
<tbody>
<tr><td class="mono">parse-error</td><td class="mono">-32700</td><td style="white-space:nowrap">否</td><td>行不是合法 JSON</td></tr>
<tr><td class="mono">invalid-request</td><td class="mono">-32600</td><td style="white-space:nowrap">否</td><td>非法 JSON-RPC 信封</td></tr>
<tr><td class="mono">unknown-action</td><td class="mono">-32601</td><td style="white-space:nowrap">否</td><td><code>method</code> 不在 <code>operations</code> 中</td></tr>
<tr><td class="mono">bad-arg</td><td class="mono">-32602</td><td style="white-space:nowrap">否</td><td>参数缺失 / 类型 / 范围 / enum / any_of 不满足；对接 kind / media 不匹配</td></tr>
<tr><td class="mono">internal-error</td><td class="mono">-32603</td><td style="white-space:nowrap">否</td><td>设备内部错误</td></tr>
<tr><td class="mono">occupied</td><td class="mono">-32001</td><td style="white-space:nowrap">是</td><td>仅 exclusive：被他人占用（data 附 holder / until）</td></tr>
<tr><td class="mono">offline</td><td class="mono">-32002</td><td style="white-space:nowrap">是</td><td>设备已离线或即将退出</td></tr>
<tr><td class="mono" style="white-space:nowrap">busy</td><td class="mono">-32003</td><td style="white-space:nowrap">是</td><td>暂时无法执行，或端点会话已满且 preempt=false</td></tr>
<tr><td class="mono">unauthorized</td><td class="mono">-32004</td><td style="white-space:nowrap">否</td><td>token 缺失 / 不匹配 / 与 agent 不绑定</td></tr>
<tr><td class="mono">denied</td><td class="mono">-32005</td><td style="white-space:nowrap">否</td><td>触犯 deny 红线或未过 confirm（confirm 超时为 retryable=true）</td></tr>
<tr><td class="mono">bad-state</td><td class="mono">-32006</td><td style="white-space:nowrap">否</td><td>方法在当前状态下不可用（如未 <code>ui.start</code> 即 <code>tap</code>）</td></tr>
</tbody>
</table>
</div>

<div class="callout callout--info">
<div class="callout__icon">i</div>
<div class="callout__body">
<div class="callout__title">error 对象的三件套</div>
<code>code</code>（整数，映射见上）+ <code>message</code>（<b>自然语言</b>失败原因，不得只回错误码同义词）+
<code>data</code>（必须含 <code>bmahs_code</code> 与 <code>retryable</code>，可附关联字段）。
    错误码 <code>busy</code> 与公告字段 <code>busy</code> 同名不同义。
</div>
</div>

## 下一步

<div class="cards">
<a class="card" href="/docs/ready.html">
<div class="card__title">AGI-Ready 认证 →</div>
<div class="card__desc">把上面的字段落实到可自测的认证标准。</div>
</a>
</div>
