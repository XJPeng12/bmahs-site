---
title: "Security Considerations"
description: "Discovery-layer confidentiality, capture endpoints, default-deny for dangerous capabilities."
eyebrow: "Specification · Chapter 20"
---

<p class="eyebrow">Specification · Chapter 20</p>

# Security Considerations

<ol>
<li><b>Discovery-layer confidentiality boundary</b>: UDP / Bonjour TXT are plaintext multicast and <b>MUST NOT</b> carry any sensitive information (tokens, stream URIs, accounts, screen content, business data).</li>
<li><b>JSON-RPC layer note</b>: <code>id</code> can be used for correlation probing; the device <b>MUST NOT</b> leak internal paths, stacks, or firmware version details (except the <code>model</code> field) in <code>hello</code> / error responses; the error <code>message</code> is user-facing and <b>MUST NOT</b> contain debug stacks.</li>
<li><b>Capture endpoints</b>: microphone/camera opens <b>SHOULD</b> be listed in <code>confirm</code>, confirmed by the local user; the request is not answered during the wait.</li>
<li><b>Dangerous capabilities denied by default</b>: <code>security.deny</code> <b>SHOULD</b> cover at least arbitrary disk read, arbitrary disk write, command execution, network fetch, cloud upload, and covert camera/mic capture.</li>
<li><b>Network scope</b>: <code>scope=lan</code> devices should bind to LAN addresses only (same for UI and media ports); opening <code>wan</code> requires separate documentation plus transport-layer security.</li>
<li><b>Mass-production hardening path</b>: when anti-impersonation control is needed, add TLS and introduce it via a <code>service</code> revision.</li>
</ol>
