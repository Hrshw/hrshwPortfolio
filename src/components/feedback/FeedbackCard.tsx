"use client";

import React from "react";
import { motion } from "framer-motion";
import { FeedbackEntry } from "@/hooks/useFeedback";

// ---------------------------------------------------------------------------
// Avatar color derived from name (deterministic)
// ---------------------------------------------------------------------------
const AVATAR_COLORS = [
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-500",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Star display
// ---------------------------------------------------------------------------
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 transition-colors ${i < rating ? "text-amber-400" : "text-zinc-700 dark:text-zinc-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Project color map for subtle distinction
const PROJECT_COLORS: Record<string, string> = {
  PulseGuard: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  Observyze: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  SubTrackHub: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "env-secret-lock": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "Envint Work": "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Other: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
interface FeedbackCardProps {
  feedback: FeedbackEntry;
  index: number;
}

export default function FeedbackCard({ feedback, index }: FeedbackCardProps) {
  const avatarColor = getAvatarColor(feedback.name);
  const initials = getInitials(feedback.name);
  const projectColor = feedback.project ? (PROJECT_COLORS[feedback.project] ?? PROJECT_COLORS.Other) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl p-7 flex flex-col gap-5 overflow-hidden transition-colors duration-500 hover:border-black/10 dark:hover:border-white/10"
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-700 pointer-events-none rounded-3xl" />

      {/* Quote decoration */}
      <div className="absolute top-5 right-6 text-5xl font-serif text-zinc-900/5 dark:text-white/5 leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      {/* Top row: stars + verified badge */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <StarDisplay rating={feedback.rating} />
        {feedback.isVerifiedCollaborator && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified Collaborator
          </span>
        )}
      </div>

      {/* Message */}
      <p className="text-zinc-700 dark:text-zinc-300 font-light leading-relaxed text-sm flex-grow transition-colors duration-500 relative z-10">
        &ldquo;{feedback.message}&rdquo;
      </p>

      {/* Project tag */}
      {feedback.project && (
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-1 rounded-full border ${projectColor}`}>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            {feedback.project}
          </span>
        </div>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-black/5 dark:border-white/5">
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {feedback.linkedinUrl ? (
              <a
                href={feedback.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 truncate flex items-center gap-1 group/name"
                aria-label={`${feedback.name} on LinkedIn`}
              >
                {feedback.name}
                <svg className="w-3 h-3 opacity-0 group-hover/name:opacity-100 transition-opacity flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            ) : (
              <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate transition-colors duration-500">
                {feedback.name}
              </span>
            )}
          </div>
          {feedback.role && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate transition-colors duration-500 flex items-center gap-1.5 mt-0.5">
              <span>{feedback.role}</span>
              {feedback.company && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[9px] font-mono text-zinc-700 dark:text-zinc-300 font-semibold uppercase tracking-wider flex-shrink-0">
                  {feedback.company}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
