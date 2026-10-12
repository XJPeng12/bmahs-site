---
title: "传输层规范"
description: "UDP 组播发现参数、Bonjour 注册与地址变化时的发布刷新规则。"
eyebrow: "规范全文 · 第 6 章"
---

<p class="eyebrow">规范全文 · 第 6 章</p>

# 传输层规范


### 6.1 传输范围

<p>本协议覆盖有线与无线物理链路，但发现与控制<b>必须</b>通过 IP 进行（IPv4 和/或 IPv6）。使用层为 <code>tcp://IP:PORT</code>。</p>

### 6.2 UDP 组播发现（必须实现）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项</th><th style="white-space:nowrap">IPv4</th><th style="white-space:nowrap">IPv6</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">组播地址</td><td><code>239.255.42.42</code></td><td><code>ff02::4242</code>（链路本地）</td></tr>
<tr><td style="white-space:nowrap">端口</td><td style="white-space:nowrap"><code>5354</code></td><td style="white-space:nowrap">同左</td></tr>
<tr><td style="white-space:nowrap">协议</td><td style="white-space:nowrap">UDP</td><td style="white-space:nowrap">UDP</td></tr>
<tr><td>TTL / Hop Limit</td><td style="white-space:nowrap"><code>2</code></td><td><code>1</code>（<code>IPV6_MULTICAST_HOPS</code>；链路本地作用域不跨路由器）</td></tr>
<tr><td style="white-space:nowrap">加入组播</td><td><code>IP_ADD_MEMBERSHIP</code>，本机 <code>0.0.0.0</code></td><td><code>IPV6_JOIN_GROUP</code>，建议指定 ifindex</td></tr>
<tr><td style="white-space:nowrap">接收绑定</td><td><code>0.0.0.0:5354</code></td><td><code>[::]:5354</code>，且 <code>IPV6_V6ONLY=1</code></td></tr>
</tbody>
</table>
</div>

<p><b>规范性要求：</b></p>

<ul>
<li>设备<b>必须</b>加入 IPv4 组；有 IPv6 栈的设备<b>应当</b>再加入 IPv6 组，无 IPv6 栈时<b>可以</b>跳过，不得因此退出协议。</li>
<li>一个 UDP 数据报<b>必须</b>且只能承载一个 UTF-8 JSON 对象。</li>
<li>数据报总长（含 JSON）<b>不得</b>超过 <b>1400 字节</b>，以避免 IP 分片。</li>
<li>套接字<b>必须</b>设置 <code>SO_REUSEADDR</code>；平台支持时<b>可以</b>再开 <code>SO_REUSEPORT</code>。</li>
<li>智能体发现时<b>应当</b>对 IPv4 与 IPv6 两个组各发一次 <code>query</code>。</li>
<li>设备<b>必须</b>维护发送与接收两个逻辑套接字（每个地址族各一对亦可）。</li>
</ul>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">注意</div>
    UDP 接收绑定的 <code>IPV6_V6ONLY=1</code> 与 §16.1 TCP 双栈监听的取值<b>相反</b>，实现时不得混淆。本端口 <code>5354</code> 与 mDNS 的 <code>5353</code> 无关：BMAHS 发现使用自有组播组与端口，Bonjour / DNS-SD 注册由系统 mDNS 在 <code>5353</code> 上另行完成（见 §6.3）。
</div>
</div>

### 6.3 Bonjour / DNS-SD（应当实现）

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">项</th><th style="white-space:nowrap">值</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">服务类型</td><td><code>_bmahs._tcp</code></td></tr>
<tr><td style="white-space:nowrap">域</td><td><code>local.</code></td></tr>
<tr><td style="white-space:nowrap">实例名</td><td>与 <code>name</code> 相同；UTF-8 自由文本</td></tr>
<tr><td style="white-space:nowrap">端口</td><td>与 <code>control</code> 中的 TCP 端口一致</td></tr>
<tr><td style="white-space:nowrap">主机名</td><td><code>{id}.local.</code></td></tr>
<tr><td style="white-space:nowrap">地址记录</td><td>同时发布 A（IPv4）与 AAAA（IPv6），有则发布</td></tr>
</tbody>
</table>
</div>

<p>TXT 记录<b>必须</b>与 UDP <code>announce</code> 字段对齐（见第 17 章）。地址或 TXT 摘要变化时，<b>必须</b>按 §6.4 重新注册服务。</p>

### 6.4 地址变化时的发布刷新（必须实现）

<p>设备在线期间局域网地址发生变化（DHCP 续租、漫游、换网、接口切换等）时，<b>必须</b>：</p>

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">要求</th><th style="white-space:nowrap">规范</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">监视</td><td>持续获知本机当前局域网 IPv4 / IPv6（建议至少每数秒检测一次，或订阅系统链路/地址变更事件）</td></tr>
<tr><td style="white-space:nowrap">判定条件</td><td>发布用 <code>ip</code> / <code>ipv6</code> 或由其生成的 <code>control</code> 主机部分任一变化，即触发刷新</td></tr>
<tr><td style="white-space:nowrap">UDP</td><td>立即按 §15.1 重发 <code>announce</code>（写入新地址与新 <code>control</code>），稳态周期组播随之更新</td></tr>
<tr><td>Bonjour</td><td>已实现 §6.3 者<b>必须</b>更新/重注册 <code>_bmahs._tcp</code>，A / AAAA 与 TXT 与当前 <code>announce</code> 一致</td></tr>
<tr><td style="white-space:nowrap"><code>id</code></td><td><b>不得</b>因换 IP 更换 <code>id</code></td></tr>
<tr><td><code>hello</code></td><td>新连接上的 <code>hello</code> 通知（§8.5）中地址相关字段<b>必须</b>与当前发布一致</td></tr>
<tr><td>虚拟/多端口</td><td>同一进程发布的多个 <code>control</code> <b>必须</b>一并刷新</td></tr>
</tbody>
</table>
</div>

<p><b>不要求</b>：换址时发送 <code>goodbye</code>（除非设备真正即将离线）；不要求作废未过期的 exclusive <code>token</code>（占用关系跟 <code>id</code> 与进程，不跟 IP）。</p>
