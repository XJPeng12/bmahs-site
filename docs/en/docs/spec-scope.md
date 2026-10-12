---
title: "Scope"
description: "What the specification covers: announce, query, control, and the JSON-RPC 2.0 control messaging."
eyebrow: "Specification · Chapter 01"
---

<p class="eyebrow">Specification · Chapter 01</p>

# Scope


### 1.1 What this specification covers

<p>This specification defines the standardized protocol <b>BMAHS (Big Model Agent Hardware Specification, bmahs/1.2)</b> by which big-model agents discover, connect to, interact with, and control external hardware devices. It covers:</p>

<ul>
<li>the mechanism for a device to <b>announce</b> itself on the network and to signal <b>goodbye</b> (going offline);</li>
<li>the mechanism by which an agent <b>queries</b> for devices;</li>
<li>establishment and handshake of the device's <b>control</b> entry point;</li>
<li>control messaging encoded as <b>JSON-RPC 2.0</b>: method calls, parameters, results and errors;</li>
<li>the declaration rules for a device's <b>natural-language self-description, operation list (operations), usage constraints (constraint) and security boundary (security)</b>;</li>
<li><b>occupancy policy (occupancy)</b>: the <code>last-wins</code> and <code>exclusive</code> control models;</li>
<li>the <b>optional UI interface</b>: binary screen-stream rules for devices with an operable display;</li>
<li>the <b>optional endpoint &amp; data stream</b>: endpoint interconnections and the declaration of continuous data-stream endpoints.</li>
</ul>

<p>The business command semantics of a specific hardware category (e.g. <code>light/1</code>, <code>speaker/1</code>) are defined by the corresponding category document and are out of scope for this specification.</p>
