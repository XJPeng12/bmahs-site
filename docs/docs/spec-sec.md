---
title: "安全性考虑"
description: "发现层保密边界、采集类端点、危险能力默认拒绝等安全要求。"
eyebrow: "规范全文 · 第 20 章"
---

<p class="eyebrow">规范全文 · 第 20 章</p>

# 安全性考虑

<ol>
<li><b>发现层保密边界</b>：UDP / Bonjour TXT 为明文组播，<b>不得</b>承载任何敏感信息（token、流 URI、账号、画面、业务数据）。</li>
<li><b>JSON-RPC 层注意</b>：<code>id</code> 可被用于关联探测；设备<b>不得</b>在 <code>hello</code> / 错误响应中泄露内部路径、堆栈或固件版本细节（<code>model</code> 字段除外）；错误 <code>message</code> 面向用户，<b>不得</b>包含调试堆栈。</li>
<li><b>采集类端点</b>：麦克风、摄像头开流<b>应当</b>列入 <code>confirm</code>，由本地用户确认；等待期内不回复请求。</li>
<li><b>危险能力默认拒绝</b>：<code>security.deny</code> <b>建议</b>至少覆盖任意读盘、任意写盘、执行命令、联网拉取、云上传、摄像头/麦克风偷采。</li>
<li><b>网络范围</b>：<code>scope=lan</code> 设备<b>应当</b>只绑定局域网地址（UI 端口、媒体端口同理）；开放 <code>wan</code> <b>必须</b>另行文档说明并叠加传输层安全。</li>
<li><b>量产加固路径</b>：需防伪造控制时<b>应当</b>叠加 TLS，并以 <code>service</code> 修订形式引入。</li>
</ol>
