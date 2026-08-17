"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import HireForm from "@/components/hire/HireForm";
import { HIRE_RATES, PROJECT_BUNDLES } from "@/lib/hire";
import type { Lang } from "@/lib/hire";
import { hireDict } from "@/lib/hire-i18n";

// ---------------------------------------------------------------------------
// /hire — private project-inquiry page (EN + हिंदी).
//
// Deliberately NOT linked in the nav and NOINDEXED (robots.txt + meta robots),
// so it never surfaces in search engines or crawls. Share the URL directly
// with potential clients. Rates/pricing live in src/lib/hire.ts; translations
// in src/lib/hire-i18n.ts. Data is always stored in canonical English.
// ---------------------------------------------------------------------------
export default function HirePage() {
  const [lang, setLang] = useState<Lang>("en");
  const d = hireDict[lang];

  // Auto-switch to Hindi for Hindi browsers. Deferred a tick so the page's
  // first paint stays English (avoids a hydration mismatch on the static
  // HTML), then swaps to Hindi seamlessly.
  useEffect(() => {
    const nl = (typeof navigator !== "undefined" && navigator.language) || "";
    if (!nl.toLowerCase().startsWith("hi")) return;
    const t = setTimeout(() => setLang("hi"), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="w-full bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-400/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-24 pt-32 pb-24">
        <div className="flex items-start justify-between gap-4 mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            {d.backHome}
          </Link>

          {/* Language toggle */}
          <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full p-1">
            {(["en", "hi"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  lang === l
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {l === "hi" ? "हिंदी" : "EN"}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-5 transition-colors duration-500">
            {d.heading}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-light tracking-tight transition-colors duration-500">
            {d.intro}
          </p>
        </div>

        {/* Services + pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
          <div className="p-8 md:p-10 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              {d.whatIDoTitle}
            </h2>
            <ul className="flex flex-col gap-4 text-sm">
              {d.services.map((item) => (
                <li key={item} className="flex gap-3 text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
                  <span className="text-emerald-500 dark:text-emerald-400 select-none">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 md:p-10 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              {d.costsTitle}
            </h2>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{d.hourlyIndia}</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  ₹{HIRE_RATES.inr.min.toLocaleString("en-IN")} – ₹{HIRE_RATES.inr.max.toLocaleString("en-IN")} {d.perHour}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{d.hourlyIntl}</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  ${HIRE_RATES.usd.min} – ${HIRE_RATES.usd.max} {d.perHour}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-5 border-t border-black/5 dark:border-white/5">
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mb-1">
                {d.typicalRanges}
              </p>
              {PROJECT_BUNDLES.map((b, idx) => (
                <div key={b.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300 font-light">
                    {d.bundles[idx]}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{b.range}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono mt-5">
              {d.quoteNote}
            </p>
          </div>
        </div>

        {/* Brief form */}
        <div className="p-8 md:p-10 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500 max-w-4xl">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
            {d.briefTitle}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light mb-8">
            {d.briefSub}
          </p>
          <HireForm lang={lang} onLangChange={setLang} />
        </div>
      </div>
    </main>
  );
}
