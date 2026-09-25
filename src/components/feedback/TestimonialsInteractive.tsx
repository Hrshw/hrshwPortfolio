"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackGrid from "@/components/feedback/FeedbackGrid";
import FeedbackSuccess from "@/components/feedback/FeedbackSuccess";
import { useFeedback, type FeedbackEntry } from "@/hooks/useFeedback";

// ---------------------------------------------------------------------------
// Stats Bar
// ---------------------------------------------------------------------------
function StatsBar({ feedbacks }: { feedbacks: FeedbackEntry[] }) {
  const stats = useMemo(() => {
    if (feedbacks.length === 0) return null;
    const avg = feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length;
    const recommend = feedbacks.filter((f) => f.rating >= 4).length;
    const recommendPct = Math.round((recommend / feedbacks.length) * 100);
    return { avg: avg.toFixed(1), count: feedbacks.length, recommendPct };
  }, [feedbacks]);

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 p-6 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl"
    >
      {/* Average rating */}
      <div className="flex items-center gap-3">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.round(Number(stats.avg)) ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{stats.avg}</span>
          <span className="text-zinc-500 dark:text-zinc-400 text-sm ml-1">/ 5</span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-8 bg-black/10 dark:bg-white/10" />

      <div className="text-center sm:text-left">
        <div className="text-xl font-bold text-zinc-900 dark:text-white">{stats.count}</div>
        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
          Verified testimonials
        </div>
      </div>

      <div className="hidden sm:block w-px h-8 bg-black/10 dark:bg-white/10" />

      <div className="text-center sm:text-left">
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.recommendPct}%</div>
        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
          Recommend
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Interactive controls + grid
// ---------------------------------------------------------------------------
interface TestimonialsInteractiveProps {
  /**
   * Approved testimonials rendered on the server. Omit to let the component
   * fetch them from /api/feedback on the client instead.
   */
  initialFeedbacks?: FeedbackEntry[];
}

export default function TestimonialsInteractive({ initialFeedbacks }: TestimonialsInteractiveProps) {
  const { feedbacks, isLoading, submitFeedback, submitStatus, submitError, submittedEntry, resetSubmit } =
    useFeedback(initialFeedbacks);

  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (payload: Parameters<typeof submitFeedback>[0]) => {
    const ok = await submitFeedback(payload);
    if (ok) setFormOpen(false);
    return ok;
  };

  return (
    <>
      {/* Stats bar */}
      {!isLoading && <StatsBar feedbacks={feedbacks} />}

      {/* Form toggle + success */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16"
      >
        <AnimatePresence mode="wait">
          {submitStatus === "success" && submittedEntry ? (
            <motion.div key="success">
              <FeedbackSuccess payload={submittedEntry} onReset={resetSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="form-area"
              className="bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden transition-colors duration-500"
            >
              {/* Toggle header */}
              <button
                onClick={() => setFormOpen((p) => !p)}
                className="w-full flex items-center justify-between px-8 py-6 text-left group"
                aria-expanded={formOpen}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ scale: formOpen ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-amber-400 text-xl select-none"
                  >
                    ✦
                  </motion.span>
                  <div>
                    <p className="text-zinc-900 dark:text-white font-semibold tracking-tight transition-colors duration-500">
                      Leave a note
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-500 text-sm font-light transition-colors duration-500">
                      Share your experience — it takes under a minute.
                    </p>
                  </div>
                </div>
                <motion.svg
                  animate={{ rotate: formOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-5 h-5 text-zinc-500 dark:text-zinc-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Collapsible form */}
              <AnimatePresence>
                {formOpen && (
                  <motion.div
                    key="form"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 border-t border-black/5 dark:border-white/5 pt-6">
                      <FeedbackForm
                        onSubmit={handleSubmit}
                        isLoading={submitStatus === "loading"}
                        serverError={submitError}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Divider with count */}
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
        <span className="text-zinc-400 dark:text-zinc-600 font-mono text-xs tracking-widest uppercase">
          {isLoading ? "Loading…" : `${feedbacks.length} note${feedbacks.length !== 1 ? "s" : ""}`}
        </span>
        <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
      </div>

      {/* Full grid */}
      <FeedbackGrid feedbacks={feedbacks} isLoading={isLoading} />
    </>
  );
}
