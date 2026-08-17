"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BUDGET_BANDS, NEEDS, PROJECT_TYPES, TIMELINES } from "@/lib/hire";
import type { Lang } from "@/lib/hire";
import { hireDict, labelFor } from "@/lib/hire-i18n";

const inputClass =
  "w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 dark:focus:border-amber-400/50 transition-all duration-300 font-light";

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

function ChipGroup({
  options,
  selected,
  onToggle,
  multi,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  multi: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            aria-pressed={active}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
              active
                ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white"
                : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white"
            }`}
          >
            {multi && active ? "✓ " : ""}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function HireForm({
  lang,
  onLangChange,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}) {
  const d = hireDict[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [budgetBand, setBudgetBand] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const toggleNeed = (value: string) => {
    setNeeds((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = d.errors.name;
    if (!EMAIL_RE.test(email.trim())) e.email = d.errors.email;
    if (!projectType) e.projectType = d.errors.projectType;
    if (!budgetBand) e.budgetBand = d.errors.budget;
    if (!timeline) e.timeline = d.errors.timeline;
    if (details.trim().length < 20) e.details = d.errors.details;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          company: company.trim() || undefined,
          projectType,
          needs,
          budgetBand,
          timeline,
          details: details.trim(),
          lang,
          website,
          formStartedAt: startedAtRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.fields
            ? (Object.values(data.fields)[0] as string)
            : (data.error ?? "Something went wrong. Please try again.")
        );
        setStatus("error");
        return;
      }

      setSummary(data.summary ?? null);
      setStatus("success");
    } catch {
      setServerError("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col gap-5">
        <div className="px-5 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm text-emerald-600 dark:text-emerald-400 font-mono">
          {d.successTitle.replace("{email}", email)}
        </div>
        {summary && (
          <div className="px-5 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm whitespace-pre-wrap font-light leading-relaxed">
            {summary}
          </div>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">
          {d.successNote}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label htmlFor="hire-website">Website</label>
        <input
          id="hire-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={d.nameLabel} error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            placeholder={d.namePlaceholder}
            maxLength={60}
            className={inputClass}
            autoComplete="name"
          />
        </Field>
        <Field label={d.emailLabel} error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder={d.emailPlaceholder}
            maxLength={200}
            className={inputClass}
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label={`${d.companyLabel} (${d.optional})`}>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder={d.companyPlaceholder}
          maxLength={80}
          className={inputClass}
          autoComplete="organization"
        />
      </Field>

      <Field label={d.whatNeed} error={errors.projectType}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PROJECT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setProjectType(t);
                setErrors((p) => ({ ...p, projectType: "" }));
              }}
              aria-pressed={projectType === t}
              className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all duration-300 ${
                projectType === t
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white"
                  : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white"
              }`}
            >
              {labelFor(lang, "projectType", t)}
            </button>
          ))}
        </div>
      </Field>

      <Field label={d.whatInclude} hint={d.includeHint}>
        <ChipGroup
          options={NEEDS.map((n) => labelFor(lang, "needs", n))}
          selected={needs.map((n) => labelFor(lang, "needs", n))}
          onToggle={(localized) => {
            // Map the localized label back to the canonical value for storage.
            const canonical = NEEDS.find(
              (n) => labelFor(lang, "needs", n) === localized
            );
            if (canonical) toggleNeed(canonical);
          }}
          multi
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={d.budgetLabel} error={errors.budgetBand}>
          <ChipGroup
            options={BUDGET_BANDS.map((b) => labelFor(lang, "budgetBand", b))}
            selected={
              budgetBand ? [labelFor(lang, "budgetBand", budgetBand)] : []
            }
            onToggle={(localized) => {
              const canonical = BUDGET_BANDS.find(
                (b) => labelFor(lang, "budgetBand", b) === localized
              );
              if (canonical) {
                setBudgetBand(canonical);
                setErrors((p) => ({ ...p, budgetBand: "" }));
              }
            }}
            multi={false}
          />
        </Field>
        <Field label={d.timelineLabel} error={errors.timeline}>
          <ChipGroup
            options={TIMELINES.map((t) => labelFor(lang, "timeline", t))}
            selected={timeline ? [labelFor(lang, "timeline", timeline)] : []}
            onToggle={(localized) => {
              const canonical = TIMELINES.find(
                (t) => labelFor(lang, "timeline", t) === localized
              );
              if (canonical) {
                setTimeline(canonical);
                setErrors((p) => ({ ...p, timeline: "" }));
              }
            }}
            multi={false}
          />
        </Field>
      </div>

      <Field
        label={`${d.detailsLabel} (${details.length}/2000)`}
        error={errors.details}
      >
        <textarea
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            setErrors((p) => ({ ...p, details: "" }));
          }}
          placeholder={d.detailsPlaceholder}
          maxLength={2000}
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </Field>

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

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={status !== "loading" ? { scale: 1.02 } : {}}
        whileTap={status !== "loading" ? { scale: 0.97 } : {}}
        className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 w-full sm:w-auto sm:self-start"
      >
        {status === "loading" ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full"
            />
            {d.sending}
          </>
        ) : (
          <>{d.send}</>
        )}
      </motion.button>

      <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">
        {d.privacyNote}
      </p>

      {/* Language switcher (also available inside the form) */}
      <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">
          Language:
        </span>
        {(["en", "hi"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onLangChange(l)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
              lang === l
                ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white"
                : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-400"
            }`}
          >
            {l === "hi" ? "हिंदी" : "English"}
          </button>
        ))}
      </div>
    </form>
  );
}
