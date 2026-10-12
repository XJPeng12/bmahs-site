---
title: "Transport Layer"
description: "UDP multicast discovery, Bonjour registration, and re-announce rules when the device address changes."
eyebrow: "Specification · Chapter 06"
---

<p class="eyebrow">Specification · Chapter 06</p>

# Transport Layer


### 6.1 Transport scope

<p>This protocol covers wired and wireless physical links, but discovery and control <b>MUST</b> go over IP (IPv4 and/or IPv6). The usage layer is <code>tcp://IP:PORT</code>.</p>

### 6.2 UDP multicast discovery (MUST implement)

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Item</th><th style="white-space:nowrap">IPv4</th><th style="white-space:nowrap">IPv6</th></tr></thead>
<tbody>
<tr><td>Multicast address</td><td><code>239.255.42.42</code></td><td><code>ff02::4242</code> (link-local)</td></tr>
<tr><td style="white-space:nowrap">Port</td><td style="white-space:nowrap"><code>5354</code></td><td style="white-space:nowrap">same</td></tr>
<tr><td>Protocol</td><td style="white-space:nowrap">UDP</td><td style="white-space:nowrap">UDP</td></tr>
<tr><td>TTL / Hop Limit</td><td style="white-space:nowrap"><code>2</code></td><td><code>1</code> (<code>IPV6_MULTICAST_HOPS</code>; link-local scope does not cross routers)</td></tr>
<tr><td>Join group</td><td><code>IP_ADD_MEMBERSHIP</code>, local <code>0.0.0.0</code></td><td><code>IPV6_JOIN_GROUP</code>, specifying ifindex is recommended</td></tr>
<tr><td>Receive bind</td><td><code>0.0.0.0:5354</code></td><td><code>[::]:5354</code> with <code>IPV6_V6ONLY=1</code></td></tr>
</tbody>
</table>
</div>

<p><b>Normative requirements:</b></p>

<ul>
<li>A device <b>MUST</b> join the IPv4 group; a device with an IPv6 stack <b>SHOULD</b> additionally join the IPv6 group; devices without an IPv6 stack <b>MAY</b> skip it and MUST NOT leave the protocol because of it.</li>
<li>A single UDP datagram <b>MUST</b> carry exactly one UTF-8 JSON object.</li>
<li>The total datagram length (including the JSON) <b>MUST NOT</b> exceed <b>1400 bytes</b>, to avoid IP fragmentation.</li>
<li>The socket <b>MUST</b> set <code>SO_REUSEADDR</code>; <b>MAY</b> additionally enable <code>SO_REUSEPORT</code> where the platform supports it.</li>
<li>When an agent discovers, it <b>SHOULD</b> send one <code>query</code> to each of the IPv4 and IPv6 groups.</li>
<li>A device <b>MUST</b> maintain two logical sockets, one for sending and one for receiving (one pair per address family is also acceptable).</li>
</ul>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">Note</div>
    the UDP receive bind's <code>IPV6_V6ONLY=1</code> is the <b>opposite</b> of the value used for the §16.1 TCP dual-stack listen; implementations MUST NOT confuse. Port <code>5354</code> is unrelated to mDNS <code>5353</code>: BMAHS discovery uses its own multicast group and port, while Bonjour / DNS-SD registration is done separately by the system mDNS on <code>5353</code> (see §6.3) the two.
</div>
</div>

### 6.3 Bonjour / DNS-SD (SHOULD implement)

<div class="table-wrap">
<table>
<thead><tr><th style="white-space:nowrap">Item</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Service type</td><td><code>_bmahs._tcp</code></td></tr>
<tr><td>Domain</td><td><code>local.</code></td></tr>
<tr><td>Instance name</td><td>Same as <code>name</code>; UTF-8 free text</td></tr>
<tr><td style="white-space:nowrap">Port</td><td>Same as the TCP port in <code>control</code></td></tr>
<tr><td>Hostname</td><td><code>{id}.local.</code></td></tr>
<tr><td>Address records</td><td>Publish A (IPv4) and AAAA (IPv6) together, whichever are available</td></tr>
</tbody>
</table>
</div>

<p>The TXT record <b>MUST</b> stay aligned with the UDP <code>announce</code> fields (see Chapter 17). When the address or TXT digest changes, the service <b>MUST</b> be re-registered per §6.4.</p>

### 6.4 Announce refresh on address change (MUST implement)

<p>If the device's LAN address changes while online (DHCP renewal, roaming, network switch, interface change, etc.), it <b>MUST</b>:</p>

<div class="table-wrap">
<table>
<thead><tr><th>Requirement</th><th style="white-space:nowrap">Rule</th></tr></thead>
<tbody>
<tr><td>Monitoring</td><td>Continuously know its current LAN IPv4 / IPv6 (check at least every few seconds, or subscribe to system link/address change events)</td></tr>
<tr><td>Trigger</td><td>A change to any of the published <code>ip</code> / <code>ipv6</code> or the host part of the derived <code>control</code> triggers a refresh</td></tr>
<tr><td style="white-space:nowrap">UDP</td><td>Immediately re-send <code>announce</code> per §15.1 (with the new address and new <code>control</code>); the steady-state periodic multicast updates accordingly</td></tr>
<tr><td>Bonjour</td><td>Implementations of §6.3 <b>MUST</b> update/re-register <code>_bmahs._tcp</code>; A / AAAA and TXT MUST match the current <code>announce</code></td></tr>
<tr><td style="white-space:nowrap"><code>id</code></td><td><b>MUST NOT</b> change the <code>id</code> when the IP changes</td></tr>
<tr><td><code>hello</code></td><td>In the <code>hello</code> notification (§8.5) on new connections, address-related fields <b>MUST</b> match the current announcement</td></tr>
<tr><td>Virtual / multi-port</td><td>Multiple <code>control</code> endpoints announced by the same process <b>MUST</b> all be refreshed together</td></tr>
</tbody>
</table>
</div>

<p><b>Not required</b>: sending <code>goodbye</code> on an address change (unless the device is truly about to go offline); invalidating unexpired exclusive <code>token</code>s (the occupancy relationship follows the <code>id</code> and the process, not the IP).</p>
