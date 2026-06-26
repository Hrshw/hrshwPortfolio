"use client";

import React from "react";
import { motion } from "framer-motion";
import FeedbackCard from "./FeedbackCard";
import { FeedbackEntry } from "@/hooks/useFeedback";

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-black/5 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-3xl p-7 flex flex-col gap-4 animate-pulse"
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 bg-zinc-300 dark:bg-zinc-700 rounded" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full w-full" />
        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full w-5/6" />
        <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full w-3/4" />
      </div>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-black/5 dark:border-white/5">
        <div className="w-9 h-9 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full w-28" />
          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20" />
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-3xl text-amber-400 select-none"
      >
        ✦
      </motion.div>
      <p className="text-zinc-500 dark:text-zinc-500 font-light text-base">
        Be the first to leave a note.
      </p>
      <p className="text-zinc-400 dark:text-zinc-600 font-mono text-xs tracking-widest uppercase">
        Your feedback matters
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------
interface FeedbackGridProps {
  feedbacks: FeedbackEntry[];
  isLoading: boolean;
}

export default function FeedbackGrid({ feedbacks, isLoading }: FeedbackGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {feedbacks.map((fb, idx) => (
        <FeedbackCard key={fb.id} feedback={fb} index={idx} />
      ))}
    </div>
  );
}
