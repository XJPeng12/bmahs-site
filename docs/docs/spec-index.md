---
title: "规范总览"
description: "BMAHS 正式规范全文（bmahs/1.2，2026-09-25 发布）：20 章 + 附录，实现与互操作测试的权威文本。"
eyebrow: "规范全文"
---

<p class="eyebrow">规范全文</p>

# 规范总览

<p class="lead">
  本规范是 <b>BMAHS 正式规范的全文</b>（协议标识 <code>bmahs/1.2</code>，2026-09-25 发布），
  共 20 章加一个附录，是协议实现与互操作测试的<b>权威文本</b>。
  “规范参考”组（方法与报文参考、字段与消息）是全文的精选，如有出入以全文为准。
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">本规范状态</div>
    本规范是 BMAHS 协议的正式发布版本，是设备实现、智能体接入与互操作测试的唯一权威依据。
</div>
</div>

## 目录

<ol class="steps" style="counter-reset:none">
<li><a href="/docs/spec-scope.html">01 · 范围</a> —— 本规范规定的内容：设备发布、发现、控制机制与 JSON-RPC 2.0 控制报文编码。</li>
<li><a href="/docs/spec-refs.html">02 · 规范性引用</a> —— RFC 2119、RFC 3986、mDNS / DNS-SD、JSON-RPC 2.0 等规范性引用文件。</li>
<li><a href="/docs/spec-terms.html">03 · 术语与约定</a> —— BMAHS 设备、智能体、协议客户端、发现层、使用层、数据流层等核心术语定义。</li>
<li><a href="/docs/spec-keywords.html">04 · 需求关键词</a> —— MUST / SHOULD / MAY 需求关键词按 RFC 2119 解释。</li>
<li><a href="/docs/spec-arch.html">05 · 协议总体架构</a> —— 发现层 / 使用层 / 数据流层的分层模型、角色约束、交互总览与新硬件类型接入要求。</li>
<li><a href="/docs/spec-transport.html">06 · 传输层规范</a> —— UDP 组播发现参数、Bonjour 注册与地址变化时的发布刷新规则。</li>
<li><a href="/docs/spec-udp.html">07 · 公共编码规则</a> —— 发现层 UDP 报文的 JSON 编码、公共头、设备标识 id 与关键机器字段规则。</li>
<li><a href="/docs/spec-jsonrpc.html">08 · 消息编码规范</a> —— TCP 控制通道的 JSON-RPC 2.0 信封：请求、成功响应、错误响应、通知（hello / event）与禁止批量调用。</li>
<li><a href="/docs/spec-errors.html">09 · 错误码规范</a> —— BMAHS bmahs_code 到 JSON-RPC 错误码的映射表与 retryable 语义。</li>
<li><a href="/docs/spec-desc.html">10 · 设备描述与自述规范</a> —— 自然语言自述、操作清单 operations 与安全边界 security 三份必备描述，以及可选的使用约束 constraint 与用户确认机制。</li>
<li><a href="/docs/spec-occ.html">11 · 占用策略与状态机</a> —— last-wins 与 exclusive 两种控制模型、token 与租约规则、存活检测与脱网。</li>
<li><a href="/docs/spec-agent.html">12 · 智能体与协议客户端义务</a> —— 实现 BMAHS 的智能体 / 协议客户端必须遵守的十二条义务。</li>
<li><a href="/docs/spec-ui.html">13 · UI接口</a> —— 有可操作画面设备的二进制画面流规范：声明义务、双通道隔离、帧格式、坐标系与占用联动。<b>（剖面 profile = 设备可选实现的扩展方法集）</b></li>
<li><a href="/docs/spec-endpoint.html">14 · 端点与数据流接口</a> —— 端点对象定义、开流对接规程（join / 中继）、format 格式、会话生命周期与抢占规则。</li>
<li><a href="/docs/spec-msg.html">15 · 发现报文定义</a> —— announce / query / goodbye 三种 UDP 报文的字段表与发送时机规范。</li>
<li><a href="/docs/spec-flow.html">16 · 连接后使用流程</a> —— TCP 连接建立三步、业务通道约定与典型时序。</li>
<li><a href="/docs/spec-bonjour.html">17 · Bonjour TXT 记录规范</a> —— TXT 记录键与 UDP 字段的映射表，以及 dns-sd 验证命令。</li>
<li><a href="/docs/spec-conform.html">18 · 一致性要求与实现清单</a> —— 设备一致性清单、建议默认端口、联调验收要点与禁止行为清单。</li>
<li><a href="/docs/spec-compat.html">19 · 互操作规范</a> —— 对端行为矩阵、编码识别与传输安全（TLS 引入方式）说明。</li>
<li><a href="/docs/spec-sec.html">20 · 安全性考虑</a> —— 发现层保密边界、采集类端点、危险能力默认拒绝等安全要求。</li>
<li><a href="/docs/spec-appendix.html">附录 A · 索引</a> —— 章节、报文与方法、字段、错误码四张索引表。</li>
</ol>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">怎么读</div>
    实现设备：按第 6 章（传输层）→ 第 8 章（消息编码）→ 第 10 章（自述）→ 第 11 章（占用）的顺序读，以第 18 章一致性清单为验收依据。智能体侧接入设备：读第 12 章（义务）→ 第 15 章（发现报文）→ 第 16 章（使用流程），重试判定查第 9 章（错误码）。
</div>
</div>
