---
title: "Building Observyze: The Engineering Behind an AI Observability Platform That Catches Hallucinations"
date: "2026-08-29"
summary: "How I built a production AI observability platform from scratch — a monorepo with 7 microservices, a Rust-core SDK, a 4-layer hallucination detection engine, and real-time circuit breakers."
slug: "building-observyze-ai-observability-platform"
tags: [AI Observability, LLM, System Design, Architecture, TypeScript, Python]
---

Two years ago, I had a problem. I was building AI-powered features into SaaS products and every time something went wrong in production, I was flying blind. The API returned HTTP 200 OK. The logs showed success. But the model hallucinated a function that does not exist, or looped through the same tool call 400 times burning 50 dollars in tokens.

Standard monitoring tools treat LLMs like slow databases. They track latency, token usage, and uptime. But they cannot tell you why the model made a specific decision, whether its output is actually grounded in reality, or whether the reasoning chain is about to spiral into an infinite loop.

I built Observyze to solve this. Not as a side project - as a production platform that real teams use to monitor, evaluate, and govern their AI systems. Here is the full engineering story.


---

## The Architecture: A Monorepo with 7 Microservices

Observyze is not a single server. It is a distributed system designed for scale, reliability, and separation of concerns. The codebase is a Turborepo monorepo with 7 microservices: web (Next.js 16), api-gateway (Fastify), ingestion-service, eval-service (Python/FastAPI), cost-service, streaming-service, and worker (BullMQ). Plus shared packages for the SDK, database schemas, types, auth, and UI components.

The key architectural decision: observability should never slow down your application. Every component is designed around this constraint.

---

## The SDK: 1-Line Auto-Instrumentation

The developer experience had to be dead simple. One line of code, zero refactoring:

    import { ObservyzeClient } from "@observyze/sdk"
    import OpenAI from "openai"
    const nw = new ObservyzeClient({ apiKey: process.env.OBSERVYZE_API_KEY! })
    const openai = nw.wrap(new OpenAI())
    // Every call is now automatically traced

The wrap() method intercepts the OpenAI client, captures input/output/latency/tokens/cost, and ships the trace asynchronously. It supports OpenAI, Anthropic, Google Gemini, Vercel AI SDK, LangChain, and any OpenAI-compatible endpoint.

### The Rust Core

The critical performance constraint: the SDK must add less than 1ms of overhead per LLM call. The core buffering and serialization layer is written in Rust, compiled to a native Node.js addon via NAPI-RS. The Rust layer handles trace serialization (binary format), batched buffering, exponential backoff with jitter, and memory-mapped ring buffer for zero-copy handoff.

### Execution Budgets

For multi-agent workflows (ReAct loops, tool-calling chains), the SDK provides execution budgets that cap calls, tokens, and wall-clock duration. This prevents the infinite-loop problem that plagues production agent systems.

---

## The Proxy Architecture: Security Without Compromise

When you wrap an OpenAI client with Observyze, traffic can optionally route through our gateway. This enables pre-dispatch safety checks, cost circuit breakers, and input policy enforcement.

### Credential Sharding

1. Token Swapping: The SDK replaces your OpenAI key with an Observyze API key
2. Credential Sharding: Your original key moves to a separate x-provider-key header
3. Gateway Forwarding: The gateway validates your token and forwards to OpenAI
4. No Persistence: The provider key is used in-memory only and never stored

### Compliance Mode

For enterprise teams with strict data governance, the proxy can be bypassed entirely. LLM traffic goes directly from your server to OpenAI/Anthropic. The SDK performs deterministic PII redaction locally. No raw prompts or completions leave your VPC.

---

## The Hallucination Detection Engine

This is where Observyze gets genuinely different. Most platforms show you dashboards. Observyze evaluates whether the AI output is actually correct.

### The Problem with LLM-as-a-Judge

The industry standard is to use GPT-4 to grade GPT-4 output. This has three fatal flaws:

1. The Implementation Detail Paradox: In code generation, introducing valid implementation details not present in the prompt is NOT a hallucination - it is the entire point.
2. Cost and Latency: Running GPT-4 to evaluate every trace doubles your token bill.
3. Prompt Injection: Adversaries can craft outputs that manipulate the judge model.

### The 4-Layer Hybrid Engine

Observyze replaces single-model judging with a multi-tiered pipeline:

Layer 1: Deterministic Static Analysis (ast.parse, import resolution, fabricated package detection) - less than 5ms, zero cost
Layer 2: DeBERTa-v3 NLI (local cross-encoder for RAG/prose claims) - less than 60ms, zero cost
Layer 3: SSRF-Guarded Evidence Crawler (resolves citations, fetches live evidence)
Layer 4: Multi-Model Consensus Panel (GPT-4o + Claude 3.5 Sonnet + Gemini 1.5 Pro)

### The 3-Class Mathematical Verdict

| Verdict | Meaning | Penalty |
|---|---|---|
| Entailed | Claim confirmed by evidence | 0.0 |
| Neutral | Source lacks information - NOT hallucination | 0.5 |
| Contradicted | Output contradicts source documents | 1.0 |

The neutral class is critical. In RAG systems, a correct answer not present in retrieved documents is not a hallucination - it is missing evidence.

### Circuit Breakers

When the engine detects persistent problems, it automatically trips a circuit breaker: subsequent requests are rejected, alerts are sent to Slack/Discord, and the circuit resets after cooldown.

---

## The Ingestion Pipeline

At scale, Observyze processes millions of traces per day. SDK batches traces via Rust buffer, ships to API Gateway, which validates and pushes to Redis queue. Worker processes persist to MongoDB Time-Series collections (40 percent storage reduction vs standard collections). After 30 days, raw payloads archive to S3 cold storage.

---

## Real-Time Dashboard

The frontend is Next.js 16 with React 19 and Tailwind CSS. Features include trace timeline (visual waterfall of every LLM call), cost attribution (per-request, per-model, per-user), evaluation scores with reason codes, circuit breaker status, and PII redaction preview.

---

## The Compliance Architecture

1. Client-side PII redaction (deterministic regex pipeline)
2. Server-side gatekeeping (secondary regex parser)
3. Zero-Data-Leak Mode (no raw data leaves your VPC)
4. Cold storage encryption (AES-256 at rest)
5. RBAC with SSO/SAML 2.0
6. Full audit trail (every score reproducible from stored inputs)

---

## What I Learned Building This

1. Observability is Not Just Logging - real observability answers why did the model make this decision
2. Deterministic Checks First, Always - syntax validation catches 60 percent of code hallucinations at zero cost
3. Security is a Feature - credential sharding emerged from an enterprise constraint
4. The SDK is the Product - every architectural decision serves the 2-minute integration goal

---

## Try It

Observyze is live at observyze.com. The Node.js SDK is open-source: npm install @observyze/sdk

Built as a full-stack project: TypeScript API gateway, Python evaluation engine, Rust-core SDK, Next.js dashboard, all on AWS.
