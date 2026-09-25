// ---------------------------------------------------------------------------
// Technical focus areas (served at /specialization/[slug])
//
// These pages previously shared a single <h1>, an identical <h2> set, and only
// a few dozen words of unique copy — near-duplicates that Google correctly
// declined to index. Each entry below now carries its own heading, metadata,
// intro, approach, patterns, stack, metrics, and cluster links.
//
// House style for this file:
//  - Technical framing only. No "hire", "freelance", or availability language:
//    the site describes systems that were built, not services for sale.
//  - Every number and technology named here must be traceable to a real project
//    or write-up in this repository. Do not add aspirational claims.
// ---------------------------------------------------------------------------

export interface CapabilitySection {
  heading: string;
  body: string;
}

export interface Capability {
  slug: string;
  /** Short label used in navigation, cards, and the hub page. */
  name: string;
  /** <title> tag for this page. */
  title: string;
  /** Meta description for this page. */
  metaDescription: string;
  /** Unique <h1> lead line. */
  h1: string;
  /** Optional gradient-coloured completion of the <h1>. */
  h1Accent: string;
  /** Small uppercase label above the heading. */
  eyebrow: string;
  /** Hero paragraph. */
  summary: string;
  /** Lead paragraph in the content card. */
  intro: string;
  /** Two to three substantive subsections — the unique body of the page. */
  approach: CapabilitySection[];
  /** Concrete techniques and decisions. */
  patterns: string[];
  /** Tools and services used in this area. */
  stack: string[];
  /** Outcomes from real projects. */
  metrics: { value: string; label: string }[];
  /** Related Engineering Insights slugs — the topic cluster. */
  relatedPosts: string[];
}

export const capabilities: Capability[] = [
  {
    slug: "cloud-engineer",
    name: "Cloud Engineering",
    title: "Cloud Engineering on AWS: Infrastructure & FinOps | Rahul Shekhawat",
    metaDescription:
      "How I design, provision, and operate AWS infrastructure in production — infrastructure as code, reliability engineering, observability, and FinOps work that cut cloud spend by 35%.",
    h1: "Operating production",
    h1Accent: "AWS infrastructure.",
    eyebrow: "//Cloud Engineering",
    summary:
      "Infrastructure as code, reliability engineering, and cost control — the operating side of cloud work, not just the provisioning side.",
    intro:
      "Cloud engineering on AWS is less about picking services and more about the decisions that only surface after launch: where state lives, how failures propagate, and why the bill grows while traffic stays flat. I provision with AWS CDK and Serverless Framework rather than console clicks, instrument what I ship so the next incident is diagnosable in minutes, and treat cost as a metric that is measured continuously instead of reviewed once a quarter.",
    approach: [
      {
        heading: "Infrastructure as code, not console archaeology",
        body: "If a Lambda function, queue, or database is configured by hand in the AWS Console, it cannot be reproduced, reviewed, or rolled back. Every environment I run is defined in version-controlled infrastructure-as-code, so a new region, stage, or teardown is a pull request rather than an afternoon of clicking. Secrets live in Systems Manager Parameter Store or Secrets Manager — never in deployed .env files.",
      },
      {
        heading: "Designing for failure before it happens",
        body: "Reliability on AWS is mostly a decoupling problem. Ingestion is kept separate from processing with SQS so that a slow or unhealthy downstream cannot take the API down with it. Functions get explicit timeouts and reserved concurrency, handlers are written to be idempotent because at-least-once delivery is the reality of every managed queue, and dead-letter queues mean a failed message is recoverable rather than lost.",
      },
      {
        heading: "Treating the bill as a first-class metric",
        body: "Cloud cost work is measurement first. Resource-level usage is aggregated per service, idle and oversized resources are identified, and a health index scores each candidate before anything is touched. On SubTrackHub this pipeline used LLMs to generate safe cleanup recommendations with a rollback path, and the result was an average AWS spend reduction of 35% without a production incident.",
      },
    ],
    patterns: [
      "Reproducible environments: every stack defined in CDK or Serverless Framework and deployed through GitHub Actions",
      "Asynchronous boundaries: API Gateway → SQS → workers, so ingestion latency does not depend on processing throughput",
      "Least-privilege IAM roles per function instead of shared broad policies",
      "DNS, TLS certificate expiry, and uptime modelled as monitored signals rather than surprises",
      "Long-running jobs (DNS inspection, TLS handshakes, persistent connections) moved off Lambda onto ECS Fargate",
      "Schema and query changes for relational workloads reviewed against RDS PostgreSQL rather than forced into DynamoDB",
      "Cost, latency, and error rate reviewed together — an optimisation that hurts reliability is not an optimisation",
    ],
    stack: [
      "AWS CDK",
      "Serverless Framework",
      "Lambda",
      "API Gateway",
      "ECS / Fargate",
      "EC2",
      "S3",
      "CloudFront",
      "Route 53",
      "DynamoDB",
      "RDS PostgreSQL",
      "SQS",
      "CloudWatch",
      "Parameter Store",
      "Secrets Manager",
      "GitHub Actions",
    ],
    metrics: [
      { value: "35%", label: "Average AWS spend reduction" },
      { value: "4+", label: "Production platforms run on AWS" },
      { value: "10M+", label: "Telemetry events processed" },
      { value: "99.9%", label: "Monitoring check success rate" },
    ],
    relatedPosts: [
      "subtrackhub-cloud-cost-optimization",
      "aws-serverless-lambda-best-practices",
      "aws-cloud-migration-startups-guide",
    ],
  },
  {
    slug: "aws-developer",
    name: "AWS & Serverless",
    title: "Serverless on AWS: Lambda & API Gateway | Rahul Shekhawat",
    metaDescription:
      "Production notes on building serverless backends on AWS — choosing Lambda versus containers, cold start mitigation, DynamoDB access patterns, SQS back-pressure, and least-privilege IAM.",
    h1: "Building serverless backends",
    h1Accent: "on AWS.",
    eyebrow: "//AWS & Serverless",
    summary:
      "Event-driven backends on Lambda, API Gateway, SQS, and DynamoDB — with the operational detail that only starts to matter once real traffic arrives.",
    intro:
      "The serverless stack is genuinely cost-efficient at startup scale: it scales to zero when nobody is using it and scales out when they are. What separates a working serverless application from a demo is everything around the handler — where the concurrency limits are, which workloads belong in a container instead, and how a cold start budget is spent. These are the decisions I care about most on AWS.",
    approach: [
      {
        heading: "Choosing Lambda or containers per workload",
        body: "Lambda is the right default for request/response APIs, but it is the wrong tool for long-running work. When PulseGuard's monitoring fleet grew, the check workers moved from Lambda to ECS Fargate: DNS inspections and TLS handshakes are naturally persistent operations, and paying per-invocation for a process that wants to stay alive is wasteful and slower. The API layer stayed on Lambda and still does.",
      },
      {
        heading: "Cold starts, concurrency, and back-pressure",
        body: "Provisioned concurrency is expensive, so it is reserved for endpoints where a cold start is user-visible — on the order of $15/month for a few critical paths rather than across the fleet. Elsewhere, reserved concurrency protects downstream databases from a Lambda fan-out, SQS acts as the shock absorber between ingestion and processing, and every queue has a dead-letter target so failed messages are inspectable instead of silently retried forever.",
      },
      {
        heading: "DynamoDB where access patterns are truly key-value",
        body: "DynamoDB is excellent for session storage, caching, and write-heavy telemetry, and a poor fit for relational data with joins and foreign keys. Observyze uses both on purpose: DynamoDB for trace session storage with key-value access, and MongoDB for aggregated analytics with complex read patterns. Migrating a relational schema into DynamoDB to be \"more cloud-native\" is one of the most expensive mistakes available.",
      },
    ],
    patterns: [
      "One function per responsibility, with its own IAM role and timeout budget",
      "Idempotent handlers and deduplication keys, because every managed queue is at-least-once",
      "DynamoDB single-table design driven by access patterns rather than entity shapes",
      "Provisioned concurrency applied surgically to latency-critical endpoints only",
      "Reserved concurrency to stop one function from exhausting a shared database",
      "Parameter Store and Secrets Manager for configuration instead of deployed environment files",
      "Deployment through CDK or Serverless Framework with GitHub Actions, so no stack is hand-built",
    ],
    stack: [
      "Lambda",
      "API Gateway",
      "DynamoDB",
      "SQS",
      "SNS",
      "S3",
      "RDS PostgreSQL",
      "MongoDB Atlas",
      "CloudWatch",
      "AWS SDK v3",
      "Node.js",
      "TypeScript",
      "Python",
    ],
    metrics: [
      { value: "2M+", label: "Traces ingested per month" },
      { value: "500+", label: "Endpoints monitored in real time" },
      { value: "3–10x", label: "Cheaper than fixed VPS compute at startup scale" },
      { value: "~$15", label: "Monthly cost of surgical provisioned concurrency" },
    ],
    relatedPosts: [
      "aws-serverless-lambda-best-practices",
      "aws-cloud-migration-startups-guide",
      "pulseguard-realtime-monitoring-anomalies",
    ],
  },
  {
    slug: "full-stack-developer",
    name: "Full-Stack Engineering",
    title: "Full-Stack Engineering: Node.js, React, TypeScript | Rahul Shekhawat",
    metaDescription:
      "End-to-end product engineering — Fastify and Express APIs, React and Next.js interfaces, a typed contract between them, and the deployment path that ships it.",
    h1: "Shipping full-stack products",
    h1Accent: "end to end.",
    eyebrow: "//Full-Stack Engineering",
    summary:
      "APIs, interfaces, and the typed contract between them — plus the path from a local branch to something real users are hitting.",
    intro:
      "Full-stack work compounds when the boundaries are typed. A Next.js interface, a Node.js API, and a cloud deployment are three places the same request can be silently mangled, and the cost of a mismatch shows up as an incident rather than a compile error. I keep validation on the server as the source of truth, share types across the wire, and make sure the deployment path is boring enough to run on a Friday.",
    approach: [
      {
        heading: "Backends in Node.js, Fastify, and Express",
        body: "Most of my backend work is Node.js: Fastify where throughput and schema validation matter, Express in older codebases that are still worth improving rather than rewriting. On a production service, restructuring query paths and connection handling improved response performance by 20% without changing the public API contract.",
      },
      {
        heading: "Frontends in React and Next.js",
        body: "On the frontend I build with React and Next.js — server components and streaming where they help, real data fetching boundaries rather than client-side waterfalls, and theming, accessibility, and reduced-motion handled as defaults. This site is itself a Next.js App Router application with its own API routes, admin moderation panel, and a Redis-backed store.",
      },
      {
        heading: "A typed contract both sides can trust",
        body: "Types are shared across the stack, but types are erased at runtime, so every public endpoint re-validates and sanitises on the server anyway. The contact and feedback APIs behind this portfolio apply HTML and control-character stripping, length limits, honeypot and submission-time-trap checks, per-IP rate limits, and daily global caps — before anything reaches storage or email.",
      },
    ],
    patterns: [
      "Server-side validation as the single source of truth, never trusting a client-side check",
      "Shared TypeScript types across API and UI, with runtime validation at the boundary",
      "REST APIs designed around resources and idempotent operations",
      "Distributed background workers on Redis and BullMQ instead of blocking request threads",
      "Progressive enhancement on forms: the page works before hydration, then accelerates",
      "Spam and abuse controls designed into the endpoint rather than bolted on later",
      "Deployment pipelines that fail loudly in CI rather than quietly in production",
    ],
    stack: [
      "Node.js",
      "Fastify",
      "Express",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "REST APIs",
      "Redis",
      "BullMQ",
      "MongoDB",
      "PostgreSQL",
      "DynamoDB",
      "Upstash Redis",
    ],
    metrics: [
      { value: "20%", label: "Backend performance improvement" },
      { value: "4+", label: "Production products shipped" },
      { value: "10+", label: "Client applications delivered" },
      { value: "1,200+", label: "Commits and PRs in 12 months" },
    ],
    relatedPosts: [
      "building-observyze-ai-observability-platform",
      "env-secret-lock-cryptography",
      "pulseguard-realtime-monitoring-anomalies",
    ],
  },
  {
    slug: "node-js-developer",
    name: "Node.js Engineering",
    title: "Node.js Engineering: Fastify, Workers & Tooling | Rahul Shekhawat",
    metaDescription:
      "High-throughput Node.js and Fastify services, Redis-backed worker queues, and developer tooling — including a zero-knowledge AES-256-GCM secret manager published on npm.",
    h1: "High-throughput services",
    h1Accent: "in Node.js.",
    eyebrow: "//Node.js Engineering",
    summary:
      "Fastify endpoints, distributed workers, and the developer tooling that keeps a Node.js codebase honest as it grows.",
    intro:
      "Node.js is at its best when the workload is I/O-bound, the contract is explicit, and background work never blocks a request thread. Most of the interesting engineering is not in the endpoint — it is in what happens when a queue backs up, a retry duplicates, or a process is killed mid-job. That is the layer I spend my time on.",
    approach: [
      {
        heading: "Fastify for throughput, structure for longevity",
        body: "Fastify brings schema-validated routing and a plugin model that keeps encapsulation honest, which matters more as a service grows than raw benchmark numbers. Requests are validated at the edge, serialisation is explicit, and hot paths are measured rather than assumed — restructuring query and connection handling on a production service cut response times by 20%.",
      },
      {
        heading: "Workers, queues, and exactly-once illusions",
        body: "Distributed processing on Redis and BullMQ means accepting that a job can run twice and designing for it: idempotency keys, retries with backoff, dead-letter queues, and workers that shut down gracefully on SIGTERM instead of dropping in-flight work. Observyze's ingestion path relies on this to process millions of events without silently losing spans.",
      },
      {
        heading: "Tooling as engineering: env-secret-lock",
        body: "Secret sprawl is a Node.js problem with a Node.js solution. env-secret-lock derives a key with PBKDF2, encrypts environment files with AES-256-GCM, exposes secrets to a process in memory rather than on disk, and installs a Git pre-commit hook that refuses to commit plaintext credentials. It is published on npm and in use across engineering teams — a small tool that removes an entire class of incident.",
      },
    ],
    patterns: [
      "Schema-validated routes and explicit serialisation on every public endpoint",
      "Idempotency keys plus retry-with-backoff so duplicate deliveries are harmless",
      "Dead-letter queues and structured failure reasons for every worker",
      "Graceful shutdown: stop accepting work, drain in-flight jobs, then exit",
      "Backpressure at the queue boundary instead of unbounded in-process buffering",
      "CLI tooling packaged and versioned like a library, with an npm publishing pipeline",
      "Cryptography through audited primitives (PBKDF2, AES-256-GCM) rather than hand-rolled schemes",
    ],
    stack: [
      "Node.js",
      "Fastify",
      "Express",
      "TypeScript",
      "BullMQ",
      "Redis",
      "MongoDB",
      "PostgreSQL",
      "AWS SDK v3",
      "npm CLI packaging",
      "AES-256-GCM",
      "PBKDF2",
    ],
    metrics: [
      { value: "20%", label: "Faster responses after query restructuring" },
      { value: "5+", label: "Engineering teams using env-secret-lock" },
      { value: "150+", label: "Pre-signed S3 URLs issued per day" },
      { value: "10M+", label: "Events handled by Node.js workers" },
    ],
    relatedPosts: [
      "env-secret-lock-cryptography",
      "pulseguard-realtime-monitoring-anomalies",
      "aws-serverless-lambda-best-practices",
    ],
  },
  {
    slug: "ai-engineer",
    name: "AI Engineering",
    title: "AI Engineering: LLM Pipelines & Observability | Rahul Shekhawat",
    metaDescription:
      "Notes from building production AI systems — LLM pipelines, RAG with vector search, agent trace trees, PII scrubbing, and the real tradeoffs between latency, cost, and safety.",
    h1: "Building production AI systems",
    h1Accent: "with traceable behaviour.",
    eyebrow: "//AI Engineering",
    summary:
      "LLM pipelines, retrieval, and agent observability — treating AI features as systems that need tracing, not prompts that need tweaking.",
    intro:
      "An AI feature is a distributed system with a non-deterministic component in the middle. The hard part is rarely the model call; it is knowing whether the pipeline produced the right answer, why it produced a wrong one, and what data crossed a compliance boundary on the way. I build AI features with the same instrumentation standards as any other backend service, because reasoning chains fail silently in ways traditional logs cannot see.",
    approach: [
      {
        heading: "Retrieval is a retrieval problem first",
        body: "Before a single prompt is written, the question is whether the right context can be found reliably. I work with MongoDB Atlas Vector Search for embedding-based retrieval, and treat chunking strategy, embedding lifecycle, and metadata filtering as the levers that actually move answer quality. A model that hallucinates on missing context is often a retrieval pipeline that returned the wrong three documents.",
      },
      {
        heading: "Why LLM pipelines fail silently",
        body: "A 200 response from a model provider means the API call succeeded — not that the agent worked. That gap is what Observyze was built to close: structured trace trees capture each step of a pipeline as queryable spans, so a failed reasoning path can be inspected instead of guessed at. The result was a roughly 70% reduction in debugging cycles across the traced workloads.",
      },
      {
        heading: "Compliance as architecture",
        body: "Personal data must be handled at the boundary rather than after it. On Observyze, PII scrubbing happens locally in memory before any payload leaves the application's trust boundary, with direct proxy bypass so sensitive content is never routed through an intermediate. That zero-trust posture is what makes an observability platform defensible in a GDPR context, and it has to be designed in from the start.",
      },
    ],
    patterns: [
      "Retrieval quality measured independently from generation quality",
      "Trace trees with structured spans per pipeline step instead of flat log lines",
      "PII detection and scrubbing in memory, before any data leaves the boundary",
      "Token, latency, and cost budgets enforced per request, not monitored after the fact",
      "Grounded answers with source attribution so hallucination is visible to the user",
      "LLMs used for bounded recommendation tasks (cost analysis) with deterministic validation of their output",
      "Deterministic fallbacks for when a model call degrades or times out",
    ],
    stack: [
      "Node.js",
      "TypeScript",
      "Python",
      "MongoDB Atlas Vector Search",
      "RAG pipelines",
      "LLM APIs",
      "Redis",
      "DynamoDB",
      "MongoDB Time-Series",
      "Fastify",
      "AWS",
    ],
    metrics: [
      { value: "70%", label: "Fewer debugging cycles on traced pipelines" },
      { value: "2M+", label: "Traces ingested per month" },
      { value: "10M+", label: "Traces processed in total" },
      { value: "35%", label: "Cost reduction from LLM-driven analysis" },
    ],
    relatedPosts: [
      "observyze-llm-pipeline-audit",
      "building-observyze-ai-observability-platform",
      "ai-reduce-cloud-costs-guide",
    ],
  },
  {
    slug: "serverless-engineer",
    name: "Serverless Architecture",
    title: "Serverless Architecture: Event-Driven AWS Design | Rahul Shekhawat",
    metaDescription:
      "Designing event-driven serverless systems on AWS — decoupling ingestion from processing, SQS back-pressure, Lambda concurrency budgets, and predictable cost at scale.",
    h1: "Designing event-driven",
    h1Accent: "serverless systems.",
    eyebrow: "//Serverless Architecture",
    summary:
      "Decoupled, asynchronous systems that stay affordable when traffic spikes and cost nothing when it does not.",
    intro:
      "Serverless architecture is a set of constraints before it is a set of services: no long-lived state in compute, at-least-once delivery everywhere, and a hard concurrency ceiling on every downstream dependency. Systems designed around those constraints are cheap and resilient. Systems that treat Lambda as \"a server I do not have to patch\" inherit every scaling problem they had before, plus a larger bill.",
    approach: [
      {
        heading: "Decouple ingestion from processing",
        body: "The core pattern is API Gateway accepting and validating a request, writing it to SQS, and returning quickly, while a pool of workers consumes at whatever rate the system can actually sustain. Ingestion latency becomes independent of processing throughput, so a traffic spike fills a queue instead of throwing 429s at users — and a backlog becomes a lag metric you can see rather than an outage you discover.",
      },
      {
        heading: "Concurrency is a budget, not a switch",
        body: "Unbounded concurrency is how a serverless application takes down its own database. Each function gets a reserved concurrency ceiling sized to what its dependencies can absorb, timeouts tuned to the workload instead of the platform default, and handlers that are idempotent because the queue will eventually deliver something twice. Dead-letter queues make those failures recoverable.",
      },
      {
        heading: "Making cost predictable at scale",
        body: "Pay-per-request pricing is only cheaper if requests and idle capacity are both understood. Resource-level usage aggregated per service, a health index per candidate, and LLM-generated cleanup proposals reviewed before application produced an average 35% reduction in AWS spend across the systems I have worked on — with rollback available at every step.",
      },
    ],
    patterns: [
      "Queue-first ingestion so traffic spikes become backlog instead of errors",
      "Reserved concurrency sized to downstream capacity on every worker function",
      "Idempotent handlers with deduplication keys to survive duplicate delivery",
      "Dead-letter queues plus replay tooling, so no message is unrecoverable",
      "Step Functions or chained queues for multi-stage pipelines with visible progress",
      "Automatic scale-to-zero, which is the primary cost advantage at low traffic",
      "FinOps automation that proposes optimisations and validates them against live usage",
    ],
    stack: [
      "Lambda",
      "API Gateway",
      "SQS",
      "SNS",
      "EventBridge",
      "DynamoDB",
      "S3",
      "ECS / Fargate",
      "CloudWatch",
      "AWS CDK",
      "Serverless Framework",
      "Node.js",
    ],
    metrics: [
      { value: "35%", label: "Average AWS spend reduction" },
      { value: "3–10x", label: "Lower cost than fixed compute at low traffic" },
      { value: "99.9%", label: "Monitoring check success rate" },
      { value: "0", label: "Monthly cost when idle" },
    ],
    relatedPosts: [
      "aws-serverless-lambda-best-practices",
      "ai-reduce-cloud-costs-guide",
      "subtrackhub-cloud-cost-optimization",
    ],
  },
];

export function getCapability(slug: string): Capability | undefined {
  return capabilities.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Tag → focus area mapping
//
// Tag archive pages were deliberately not created: with ten posts they would be
// near-empty duplicates of the focus-area pages. Instead a post's tags resolve
// to the focus areas that already cover the topic, which produces the same
// internal links with none of the thin-content risk.
// ---------------------------------------------------------------------------
const TAG_TO_CAPABILITY: Record<string, string> = {
  aws: 'aws-developer',
  'cloud migration': 'cloud-engineer',
  infrastructure: 'cloud-engineer',
  'cloud costs': 'cloud-engineer',
  finops: 'cloud-engineer',
  serverless: 'serverless-engineer',
  lambda: 'aws-developer',
  architecture: 'serverless-engineer',
  'system design': 'serverless-engineer',
  'node.js': 'node-js-developer',
  'developer tools': 'node-js-developer',
  security: 'node-js-developer',
  cryptography: 'node-js-developer',
  ai: 'ai-engineer',
  llm: 'ai-engineer',
  llms: 'ai-engineer',
  'ai engineering': 'ai-engineer',
  'ai observability': 'ai-engineer',
  observability: 'ai-engineer',
  startups: 'full-stack-developer',
  saas: 'full-stack-developer',
  'full-stack': 'full-stack-developer',
  react: 'full-stack-developer',
  'next.js': 'full-stack-developer',
  typescript: 'full-stack-developer',
  mvp: 'full-stack-developer',
  pricing: 'full-stack-developer',
  hiring: 'full-stack-developer',
  india: 'full-stack-developer',
  mongodb: 'full-stack-developer',
  monitoring: 'cloud-engineer',
  redis: 'serverless-engineer',
};

/** Resolve a post's tags to the focus areas that cover the same ground. */
export function capabilitiesForTags(tags: string[] = []): Capability[] {
  const slugs = new Set<string>();
  for (const tag of tags) {
    const slug = TAG_TO_CAPABILITY[tag.toLowerCase()];
    if (slug) slugs.add(slug);
  }
  return capabilities.filter((c) => slugs.has(c.slug));
}
