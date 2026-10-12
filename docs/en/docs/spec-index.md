---
title: "Specification Overview"
description: "Full text of the BMAHS formal specification (bmahs/1.2, released 2026-09-25): 20 chapters + appendix."
eyebrow: "Specification Full Text"
---

<p class="eyebrow">Specification Full Text</p>

# Specification Overview

<p class="lead">
  This specification is the <b>full text of the BMAHS formal specification</b> (protocol identifier <code>bmahs/1.2</code>, released 2026-09-25),
  organized into 20 chapters plus an appendix. It is the authoritative text for implementation
  and interoperability testing; the "Spec Reference" pages (Methods &amp; Messages, Fields &amp; Messages)
  are extracts — in case of conflict, the full text prevails.
</p>

<div class="callout callout--info">
<div class="callout__icon">◆</div>
<div class="callout__body">
<div class="callout__title">Status of this document</div>
    This is the formally published version of the BMAHS protocol. The full text is the single authoritative basis for device implementation, agent integration, and interoperability testing.
</div>
</div>

## Table of Contents

<ol class="steps" style="counter-reset:none">
<li><a href="/en/docs/spec-scope.html">01 · Scope</a> —— What the specification covers: announce, query, control, and the JSON-RPC 2.0 control messaging.</li>
<li><a href="/en/docs/spec-refs.html">02 · Normative References</a> —— RFC 2119, RFC 3986, mDNS / DNS-SD, JSON-RPC 2.0 and other normative references.</li>
<li><a href="/en/docs/spec-terms.html">03 · Terms &amp; Conventions</a> —— Core terms: BMAHS device, agent, protocol client, discovery layer, usage layer, data stream layer.</li>
<li><a href="/en/docs/spec-keywords.html">04 · Requirement Keywords</a> —— MUST / SHOULD / MAY keywords interpreted per RFC 2119.</li>
<li><a href="/en/docs/spec-arch.html">05 · Protocol Architecture</a> —— Layered model (discovery / usage / data stream layer), roles, interaction overview, and onboarding new hardware types.</li>
<li><a href="/en/docs/spec-transport.html">06 · Transport Layer</a> —— UDP multicast discovery, Bonjour registration, and re-announce rules when the device address changes.</li>
<li><a href="/en/docs/spec-udp.html">07 · Discovery Encoding</a> —— JSON encoding, common header, device id rules, and key machine fields for UDP discovery messages.</li>
<li><a href="/en/docs/spec-jsonrpc.html">08 · Control Messaging: JSON-RPC 2.0</a> —— The JSON-RPC 2.0 envelope on the TCP control channel: requests, results, errors, notifications (hello / event), no batch.</li>
<li><a href="/en/docs/spec-errors.html">09 · Error Codes</a> —— Mapping from BMAHS bmahs_code to JSON-RPC error codes, and retryable semantics.</li>
<li><a href="/en/docs/spec-desc.html">10 · Device Description &amp; Self-Description</a> —— The three required descriptions — natural-language self-description, operations, security — plus the optional constraint and the confirm mechanism.</li>
<li><a href="/en/docs/spec-occ.html">11 · Occupancy &amp; State Machine</a> —— The last-wins and exclusive control models, tokens and leases, liveness detection, and going offline.</li>
<li><a href="/en/docs/spec-agent.html">12 · Agent &amp; Client Obligations</a> —— Twelve obligations every BMAHS agent / protocol client implementation must follow.</li>
<li><a href="/en/docs/spec-ui.html">13 · UI Interface</a> —— Binary screen-stream profile for operable displays: declaration, channel isolation, frame format, coordinates, occupancy.</li>
<li><a href="/en/docs/spec-endpoint.html">14 · Endpoint &amp; Data Stream Interface</a> —— Endpoint objects, stream joining / relay procedures, format, session lifecycle, and preemption.</li>
<li><a href="/en/docs/spec-msg.html">15 · Discovery Messages</a> —— Field tables and send-timing rules for the announce / query / goodbye UDP messages.</li>
<li><a href="/en/docs/spec-flow.html">16 · Post-Connect Usage Flow</a> —— TCP connection setup, channel conventions, and the typical call sequence.</li>
<li><a href="/en/docs/spec-bonjour.html">17 · Bonjour / DNS-SD TXT Records</a> —— TXT record keys mapped to UDP fields, plus dns-sd verification commands.</li>
<li><a href="/en/docs/spec-conform.html">18 · Conformance Checklist</a> —— Device conformance checklist, default ports, integration acceptance points, and the prohibition list.</li>
<li><a href="/en/docs/spec-compat.html">19 · Interoperability</a> —— Peer behavior matrix, encoding recognition, and transport-security notes.</li>
<li><a href="/en/docs/spec-sec.html">20 · Security Considerations</a> —— Discovery-layer confidentiality, capture endpoints, default-deny for dangerous capabilities.</li>
<li><a href="/en/docs/spec-appendix.html">Appendix A. Index</a> —— Indexes for chapters, messages &amp; methods, fields, and error codes.</li>
</ol>

<div class="callout callout--tip">
<div class="callout__icon">✓</div>
<div class="callout__body">
<div class="callout__title">How to read</div>
    Implementing a device? Read Chapter 6 (Transport) → 8 (Messaging) → 10 (Self-description) → 11 (Occupancy), then use the Chapter 18 conformance checklist as acceptance criteria. Integrating a device on the agent side? Read Chapter 12 (Obligations) → 15 (Discovery messages) → 16 (Usage flow), and consult Chapter 9 (Error codes) for retry decisions.
</div>
</div>
