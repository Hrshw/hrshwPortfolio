import React from "react";
import Link from "next/link";
import TestimonialsInteractive from "@/components/feedback/TestimonialsInteractive";
import { getApprovedFeedback } from "@/lib/feedback";
import { hasRedis } from "@/lib/store";

// ---------------------------------------------------------------------------
// /testimonials
//
// This page used to be a client component that fetched testimonials after
// hydration, so the HTML a crawler received contained an empty grid. The
// approved quotes are now read on the server and passed in as initial data,
// which puts the real content in the response.
//
// Revalidated rather than purely static so newly approved testimonials appear
// without a redeploy.
//
// NOTE: the server-side read below only works when the store is external
// (Upstash Redis), because Next renders pages in a different worker from the one
// that handles API routes — the in-memory fallback is per-process and therefore
// invisible here. Production already requires KV_REST_API_*, so that is the
// normal path. Without Redis we pass `undefined` and the client fetches from
// /api/feedback exactly as it did before, which keeps local development working.
// ---------------------------------------------------------------------------
export const revalidate = 120;

export default async function TestimonialsPage() {
  const initialFeedbacks = hasRedis ? await getApprovedFeedback() : undefined;

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-400/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-24 pt-32 pb-24">
        {/* Back link */}
        <div className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Back home
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-5 transition-colors duration-500">
            What collaborators say.
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-light tracking-tight max-w-2xl transition-colors duration-500">
            Feedback from engineers, founders, and colleagues on building software together — the
            AWS and Node.js work, the architecture decisions, and what it was like to collaborate.
            Every note is read and genuinely appreciated.
          </p>
        </div>

        <TestimonialsInteractive initialFeedbacks={initialFeedbacks} />
      </div>
    </main>
  );
}
