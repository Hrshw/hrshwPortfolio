"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitPayload } from "@/hooks/useFeedback";

const PROJECTS = [
  { value: "", label: "— Select a project (optional)" },
  { value: "PulseGuard", label: "PulseGuard — AI Uptime Monitoring" },
  { value: "Observyze", label: "Observyze — AI Observability Platform" },
  { value: "SubTrackHub", label: "SubTrackHub — Subscription Manager" },
  { value: "env-secret-lock", label: "env-secret-lock — CLI Secret Tool" },
  { value: "Envint Work", label: "Envint Services — Work Collaboration" },
  { value: "Other", label: "Other / General" },
];

// ---------------------------------------------------------------------------
// Star Picker
// ---------------------------------------------------------------------------
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < (hovered || value);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
            aria-label={`Rate ${i + 1} star${i > 0 ? "s" : ""}`}
          >
            <motion.svg
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`w-7 h-7 transition-colors duration-150 ${
                filled
                  ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                  : "text-zinc-600 dark:text-zinc-700"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </motion.svg>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field wrapper
// ---------------------------------------------------------------------------
function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
          {label}
        </label>
        {hint && (
          <span className="text-xs text-zinc-400 dark:text-zinc-600 font-light">{hint}</span>
        )}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-rose-500 dark:text-rose-400 font-mono"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 dark:focus:border-amber-400/50 transition-all duration-300 font-light";

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------
interface FeedbackFormProps {
  onSubmit: (payload: SubmitPayload) => Promise<boolean>;
  isLoading: boolean;
  serverError: string | null;
}

export default function FeedbackForm({
  onSubmit,
  isLoading,
  serverError,
}: FeedbackFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [project, setProject] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "At least 2 characters required.";
    if (!message.trim() || message.trim().length < 10) e.message = "At least 10 characters required.";
    if (rating < 1) e.rating = "Please select a rating.";
    if (linkedinUrl && !linkedinUrl.startsWith("https://www.linkedin.com/")) {
      e.linkedinUrl = "Must be a valid linkedin.com URL.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: name.trim(),
      role: role.trim(),
      rating,
      message: message.trim(),
      linkedinUrl: linkedinUrl.trim() || undefined,
      project: project || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Name + Role row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Name *" error={errors.name}>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder="Jane Doe"
            maxLength={60}
            className={`${inputClass} ${errors.name ? "border-rose-400/60 dark:border-rose-500/50" : ""}`}
            autoComplete="name"
          />
        </Field>
        <Field label="Role / Company (optional)">
          <input
            id="feedback-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Engineer @ Acme"
            maxLength={80}
            className={inputClass}
            autoComplete="organization-title"
          />
        </Field>
      </div>

      {/* LinkedIn URL + Project row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="LinkedIn Profile" hint="optional" error={errors.linkedinUrl}>
          <input
            id="feedback-linkedin"
            type="url"
            value={linkedinUrl}
            onChange={(e) => { setLinkedinUrl(e.target.value); setErrors((p) => ({ ...p, linkedinUrl: "" })); }}
            placeholder="https://www.linkedin.com/in/..."
            maxLength={200}
            className={`${inputClass} ${errors.linkedinUrl ? "border-rose-400/60 dark:border-rose-500/50" : ""}`}
            autoComplete="off"
          />
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono">
            Your name will link to your profile on the testimonials page.
          </p>
        </Field>
        <Field label="Project Context" hint="optional">
          <select
            id="feedback-project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            {PROJECTS.map((p) => (
              <option key={p.value} value={p.value} className="bg-zinc-900 text-zinc-100">
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono">
            What project or context did we work on together?
          </p>
        </Field>
      </div>

      {/* Rating */}
      <Field label="Rating *" error={errors.rating}>
        <StarPicker value={rating} onChange={(v) => { setRating(v); setErrors((p) => ({ ...p, rating: "" })); }} />
      </Field>

      {/* Message */}
      <Field label={`Message * (${message.length}/500)`} error={errors.message}>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: "" })); }}
          placeholder="Share your experience working with Rahul or what impressed you most..."
          maxLength={500}
          rows={4}
          className={`${inputClass} resize-none ${errors.message ? "border-rose-400/60 dark:border-rose-500/50" : ""}`}
        />
      </Field>

      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-500 dark:text-rose-400 font-mono"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.97 } : {}}
        className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 w-full sm:w-auto sm:self-start"
      >
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full"
            />
            Submitting…
          </>
        ) : (
          <>
            Submit Feedback
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </motion.button>
    </form>
  );
}
