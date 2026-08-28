"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArchitectureTab {
  id: string;
  title: string;
  subtitle: string;
  diagram: React.ReactNode;
  scaling: string[];
  costOpt: string[];
  monitoring: string[];
  cicd: string[];
}

interface SystemDesignSectionProps {
  /** Render the section title as an <h1> when the section is a standalone page (e.g. /system-design). */
  headingLevel?: "h1" | "h2";
}

export default function SystemDesignSection({ headingLevel = "h2" }: SystemDesignSectionProps) {
  const [activeTab, setActiveTab] = useState("pulseguard");

  const tabs: ArchitectureTab[] = [
    {
      id: "pulseguard",
      title: "PulseGuard",
      subtitle: "Event-Driven Global Uptime & SSL Monitoring Engine",
      diagram: (
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/30 dark:bg-black/40 rounded-3xl border border-black/5 dark:border-white/5 font-mono text-xs text-zinc-400 min-h-[300px]">
          <div className="flex flex-col gap-6 w-full max-w-md items-center">
            {/* Top Node */}
            <div className="px-4 py-3 bg-zinc-900/80 border border-zinc-700/60 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-zinc-500 text-[10px] tracking-wider uppercase mb-1">Trigger Scheduler</div>
              <div className="text-white font-semibold">AWS ECS Scheduled Task</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">Cron checks at 30s intervals</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Distributes Checks</div>

            {/* Queue Node */}
            <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-amber-500 text-[10px] tracking-wider uppercase mb-1">Queue Broker</div>
              <div className="text-white font-semibold">Redis Queue (BullMQ)</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Managed task queues</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Polls Jobs (Auto-scales)</div>

            {/* Worker Nodes */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="px-3 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center shadow-md">
                <div className="text-blue-400 text-[10px] uppercase font-semibold mb-0.5">Fargate Node A</div>
                <div className="text-zinc-300 font-light text-[11px]">Async DNS Override</div>
                <div className="text-[9px] text-zinc-500 mt-1">dns.resolve4 resolver</div>
              </div>
              <div className="px-3 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center shadow-md">
                <div className="text-blue-400 text-[10px] uppercase font-semibold mb-0.5">Fargate Node B</div>
                <div className="text-zinc-300 font-light text-[11px]">TLS socket auditor</div>
                <div className="text-[9px] text-zinc-500 mt-1">SNI certificate inspection</div>
              </div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Persists Logs</div>

            {/* Database Node */}
            <div className="px-4 py-3 bg-zinc-900/80 border border-zinc-700/60 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-zinc-500 text-[10px] tracking-wider uppercase mb-1">Telemetry Storage</div>
              <div className="text-white font-semibold">PostgreSQL (TimescaleDB)</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Optimized time-series metrics</div>
            </div>
          </div>
        </div>
      ),
      scaling: [
        "Eliminated libuv thread lock contention on concurrent uptime queries by overriding standard DNS resolution with async UDP-based dns.resolve4.",
        "Scaled task polling clusters dynamically by deploying Fargate instances integrated with BullMQ queue size monitors.",
        "Engineered non-blocking raw socket connection queries for certificate and response monitoring to reduce thread footprint."
      ],
      costOpt: [
        "Enabled Fargate spot pricing models, cutting active worker node costs by 70% in staging and dev environments.",
        "Integrated localized DNS and connection caching logic, reducing API requests and external lookups.",
        "Configured automatic TimescaleDB compression policies for raw records older than 7 days, maximizing storage capacity."
      ],
      monitoring: [
        "Tracks endpoint status (uptime, TLS configurations, SSL expiry warnings, response time).",
        "Applies a moving Z-score latency checker across historical check distributions to suppress noise and filter out network jitter.",
        "Integrates multi-channel notifications (Email, SMS, Slack, Discord webhook hooks) to warn developers of outages."
      ],
      cicd: [
        "GitHub Workflows build multi-platform Docker container packages, pushing to AWS ECR.",
        "Triggers rolling blue-green container service rollouts on ECS via task definition updates."
      ]
    },
    {
      id: "observyze",
      title: "Observyze",
      subtitle: "AI Observability & Agent Safety Platform",
      diagram: (
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/30 dark:bg-black/40 rounded-3xl border border-black/5 dark:border-white/5 font-mono text-xs text-zinc-400 min-h-[300px]">
          <div className="flex flex-col gap-6 w-full max-w-md items-center">
            {/* Top Node */}
            <div className="px-4 py-3 bg-zinc-900/80 border border-zinc-700/60 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-zinc-500 text-[10px] tracking-wider uppercase mb-1">SDK Client</div>
              <div className="text-white font-semibold">1-Line Auto-Instrumentation</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">Traces spans & tool execution</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Async Buffered Ingestion</div>

            {/* Ingestion Node */}
            <div className="px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-indigo-400 text-[10px] tracking-wider uppercase mb-1">API Gateway</div>
              <div className="text-white font-semibold">Authenticated Ingest Endpoint</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">Validates & transforms traces</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Decouples Write Path</div>

            {/* Buffer Node */}
            <div className="px-4 py-3 bg-zinc-900/80 border border-zinc-700/60 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-zinc-500 text-[10px] tracking-wider uppercase mb-1">Message Queue</div>
              <div className="text-white font-semibold">Async Buffer Layer</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Absorbs peak traffic spikes</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Batch Processing</div>

            {/* Consumer Node */}
            <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-purple-400 text-[10px] tracking-wider uppercase mb-1">Evaluation Engine</div>
              <div className="text-white font-semibold">Hallucination Detection</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">4-layer hybrid scoring</div>
            </div>
          </div>
        </div>
      ),
      scaling: [
        "Built the SDK core in a systems language compiled to a native addon, maintaining sub-millisecond overhead per LLM call.",
        "Decoupled ingestion from persistence using an async message buffer to absorb traffic spikes without dropping traces.",
        "Batched trace writes to reduce database connection pressure at high throughput."
      ],
      costOpt: [
        "Deterministic checks (syntax validation, format verification) catch the majority of issues at zero LLM cost.",
        "Local NLI models handle grounding checks without API calls, reserving frontier models for hard cases only.",
        "Cold storage archival keeps the hot database fast while maintaining audit-ready traces for compliance."
      ],
      monitoring: [
        "Visualizes hierarchical parent-child traces mapping LLM prompts, latency, token spend, and tool execution timelines.",
        "Runs hallucination and safety evaluators with a 3-class verdict system (entailed / neutral / contradicted).",
        "Automatic circuit breakers halt affected scopes when persistent issues are detected."
      ],
      cicd: [
        "Monorepo workspace management builds and tests modular packages dynamically on PR checks.",
        "Automated CI/CD pipelines compile TypeScript bundles, verify linting, and deploy containerized services."
      ]
    },
    {
      id: "subtrackhub",
      title: "SubTrackHub",
      subtitle: "Multi-Cloud Billing Aggregator & Gemini AI cost-optimizer",
      diagram: (
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-950/30 dark:bg-black/40 rounded-3xl border border-black/5 dark:border-white/5 font-mono text-xs text-zinc-400 min-h-[300px]">
          <div className="flex flex-col gap-6 w-full max-w-md items-center">
            {/* Top Node */}
            <div className="px-4 py-3 bg-zinc-900/80 border border-zinc-700/60 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-zinc-500 text-[10px] tracking-wider uppercase mb-1">Target Cloud APIs</div>
              <div className="text-white font-semibold">AWS SDK / Azure ARM / GCP APIs</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">Aggregates CPU & Billing JSON</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Scheduled Cron Trigger</div>

            {/* Pipeline Node */}
            <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-purple-400 text-[10px] tracking-wider uppercase mb-1">Aggregation Node</div>
              <div className="text-white font-semibold">Cron Worker (BullMQ + Redis)</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Node-cron fetches hourly metrics</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Normalizes & Context-Frames</div>

            {/* LLM Node */}
            <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-emerald-400 text-[10px] tracking-wider uppercase mb-1">AI Cost Broker</div>
              <div className="text-white font-semibold">Google Gemini API integration</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Rotated GEMINI_API_KEY tokens</div>
            </div>

            {/* Down Arrow */}
            <div className="text-zinc-600 text-lg">↓ Decouples Action</div>

            {/* UI Node */}
            <div className="px-4 py-3 bg-zinc-900/80 border border-zinc-700/60 rounded-xl text-center shadow-lg w-full max-w-[240px]">
              <div className="text-zinc-500 text-[10px] tracking-wider uppercase mb-1">FinOps Portal</div>
              <div className="text-white font-semibold">React client dashboard</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Dev reviews cost roasts & fixes</div>
            </div>
          </div>
        </div>
      ),
      scaling: [
        "Configured distributed task workers using BullMQ and ioredis to pace API requests during cron cost collection sweeps.",
        "Compacts raw 14-day AWS Cost Explorer hourly metrics into structured daily indicators, reducing the LLM context token load."
      ],
      costOpt: [
        "Direct integration with Gemini models (gemini-2.5-flash-lite, gemini-2.5-pro via @google/generative-ai) with fallback rotators across multiple API keys.",
        "Caches AWS/Azure resource states to MongoDB, preventing duplicate Cost Explorer queries and AWS API rate fees."
      ],
      monitoring: [
        "Runs cost-saving analysis triggers (PromptRegistry.INSIGHT_SYNTHESIZER_PROMPT) to generate actionable markdown roadmap scripts.",
        "Employs witty, developer-friendly cost roasts (RoastRegistry) to make optimization and billing reports engaging for engineers."
      ],
      cicd: [
        "CDK-based infrastructure configuration schemas versioned in Git for automated integration testing.",
        "Deployments managed through GitHub Actions pushing microservice image updates."
      ]
    }
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="section-system-design" className="min-h-screen flex flex-col justify-center px-8 md:px-24 py-32 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="mb-20">
          {headingLevel === "h1" ? (
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-4 transition-colors duration-500">
              System Design Blueprint.
            </h1>
          ) : (
            <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-4 transition-colors duration-500">
              System Design Blueprint.
            </h2>
          )}
          <p className="text-zinc-600 dark:text-zinc-500 text-lg md:text-xl font-light tracking-tight max-w-2xl transition-colors duration-500">
            Interactive breakdowns of structural design decisions, cloud scaling models, cost efficiency boundaries, and deployment configurations.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-none border-b border-black/5 dark:border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg"
                  : "bg-black/5 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-zinc-800/60"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Active Tab Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Diagram */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-center"
              >
                <div className="text-zinc-500 font-mono text-xs mb-3 tracking-wider uppercase">{currentTab.subtitle}</div>
                {currentTab.diagram}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: In-depth Technical Specs */}
          <div className="lg:col-span-7 bg-black/5 dark:bg-zinc-900/20 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-colors duration-500">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Scaling */}
                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Scaling Decisions
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {currentTab.scaling.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Cost Optimization */}
                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Cost Optimization
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {currentTab.costOpt.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Monitoring Stack */}
                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Monitoring Stack
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {currentTab.monitoring.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* CI/CD Pipeline */}
                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    CI/CD Pipeline
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {currentTab.cicd.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
