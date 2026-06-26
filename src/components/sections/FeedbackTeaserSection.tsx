"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FeedbackCard from "@/components/feedback/FeedbackCard";
import { useFeedback } from "@/hooks/useFeedback";

// ---------------------------------------------------------------------------
// Homepage teaser — shows up to 3 latest approved feedbacks + CTA to full page
// ---------------------------------------------------------------------------
export default function FeedbackTeaserSection() {
  const { feedbacks, isLoading } = useFeedback();

  const preview = feedbacks.slice(0, 3);

  return (
    <section
      id="section-testimonials"
      className="flex flex-col px-8 md:px-24 py-32 relative"
      style={{ zIndex: 10 }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-96 bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-4 transition-colors duration-500">
              What people say.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-500 text-lg md:text-xl font-light tracking-tight max-w-xl transition-colors duration-500">
              Honest words from colleagues, collaborators, and clients.
            </p>
          </div>

          <Link href="/testimonials">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-sm rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              View All & Leave a Note
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.span>
          </Link>
        </div>

        {/* Preview grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-black/5 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-3xl p-7 flex flex-col gap-4 animate-pulse"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-zinc-300 dark:bg-zinc-700 rounded" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full w-full" />
                  <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full w-4/5" />
                </div>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="w-9 h-9 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full w-24" />
                    <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : preview.length === 0 ? (
          /* Empty teaser — subtle CTA */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl"
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl text-amber-400"
            >
              ✦
            </motion.span>
            <p className="text-zinc-500 dark:text-zinc-500 font-light text-sm text-center">
              No testimonials yet. Be the first!
            </p>
            <Link href="/testimonials">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full cursor-pointer"
              >
                Leave a Note
              </motion.span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {preview.map((fb, idx) => (
              <FeedbackCard key={fb.id} feedback={fb} index={idx} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
