"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SupportConfig } from "@/lib/support";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

/** Mirrors the server-side amount rules so users get instant feedback. */
function validateAmountInput(
  raw: string,
  config: SupportConfig
): { valid: true; amount: number } | { valid: false; error: string } {
  if (!raw.trim()) return { valid: false, error: "Enter an amount." };
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount <= 0)
    return { valid: false, error: "Enter a valid amount." };
  if (amount < config.minAmount)
    return { valid: false, error: `Minimum is ${formatINR(config.minAmount)}.` };
  if (amount > config.maxAmount)
    return { valid: false, error: `Maximum is ${formatINR(config.maxAmount)}.` };
  const cents = Math.round(amount * 100);
  if (Math.abs(cents - amount * 100) > 1e-6)
    return { valid: false, error: "At most 2 decimal places." };
  return { valid: true, amount };
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export default function SupportSection() {
  // The config is fetched at runtime (the homepage is statically prerendered,
  // so env-driven values can't be baked in at build time).
  const [config, setConfig] = useState<SupportConfig | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/support/config");
        if (!res.ok) throw new Error("Failed to load support config");
        const data: SupportConfig = await res.json();
        if (!cancelled) setConfig(data);
      } catch {
        if (!cancelled) setConfig(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // The section mounts AFTER the config fetch, so when someone lands on
  // /#section-support from another page, the browser can't scroll to it on its
  // own — do it here once the section actually exists.
  useEffect(() => {
    if (!config || window.location.hash !== "#section-support") return;
    const t = setTimeout(() => {
      document.getElementById("section-support")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 60);
    return () => clearTimeout(t);
  }, [config]);

  const hasAnyPayment = !!config && (config.upiEnabled || config.polarCheckoutUrl.length > 0);
  const validation = useMemo(
    () => (config ? validateAmountInput(amount, config) : { valid: false as const, error: "" }),
    [amount, config]
  );
  const canSubmit = !!config && config.upiEnabled && status !== "loading" && validation.valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.valid) return;
    setStatus("loading");
    setError(null);
    setGeneratedUrl(null);
    try {
      const res = await fetch("/api/support/upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: validation.amount,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setGeneratedUrl(data.url);
      setStatus("success");
      // Opening a UPI deep link must happen directly from a user gesture.
      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  const copyUpiId = async () => {
    if (!config) return;
    try {
      await navigator.clipboard.writeText(config.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (non-secure context) — select-and-copy fallback.
      setError("Couldn't copy automatically. Long-press the UPI ID to copy it.");
      setStatus("error");
    }
  };

  if (!hasAnyPayment || !config) return null;

  return (
    <section
      id="section-support"
      className="flex flex-col px-8 md:px-24 py-32 relative"
      style={{ zIndex: 10 }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-96 bg-emerald-400/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-4 transition-colors duration-500">
            Support the work.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-500 text-lg md:text-xl font-light tracking-tight transition-colors duration-500">
            If something here helped you, a coffee (or chai ☕) keeps the
            experiments running.
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl p-8 md:p-10 transition-colors duration-500">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            {/* Presets */}
            {config.upiEnabled && (
              <div className="flex flex-wrap gap-3 justify-center">
                {config.presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setAmount(String(p));
                      setError(null);
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
                      Number(amount) === p
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white"
                        : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white"
                    }`}
                  >
                    {formatINR(p).replace(/\.00$/, "")}
                  </button>
                ))}
              </div>
            )}

            {/* Custom amount + note */}
            {config.upiEnabled && (
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="support-amount"
                    className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 tracking-widest uppercase mb-2"
                  >
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 font-medium">
                      ₹
                    </span>
                    <input
                      id="support-amount"
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value.replace(/[^\d.]/g, ""));
                        setError(null);
                      }}
                      placeholder={`${config.minAmount} – ${config.maxAmount}`}
                      maxLength={10}
                      className="w-full pl-8 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400/60 dark:focus:border-emerald-400/50 transition-all duration-300 font-light"
                    />
                  </div>
                  {amount && !validation.valid && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 font-mono mt-1.5">
                      {validation.error}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="support-note"
                    className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 tracking-widest uppercase mb-2"
                  >
                    Note <span className="text-zinc-400 dark:text-zinc-600 normal-case">(optional)</span>
                  </label>
                  <input
                    id="support-note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Loved the AWS article!"
                    maxLength={40}
                    className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400/60 dark:focus:border-emerald-400/50 transition-all duration-300 font-light"
                  />
                </div>
              </div>
            )}

            {/* Errors */}
            <AnimatePresence>
              {status === "error" && error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-rose-500 dark:text-rose-400 font-mono text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              {config.upiEnabled && (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {status === "loading" ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full"
                      />
                      Preparing…
                    </>
                  ) : (
                    <>Pay via UPI</>
                  )}
                </button>
              )}

              {config.polarCheckoutUrl && (
                <a
                  href={config.polarCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-8 py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300 text-center"
                >
                  Donate with Card / Polar
                </a>
              )}
            </div>

            {/* UPI ID fallback */}
            {config.upiEnabled && (
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">
                  UPI ID: {config.upiId}
                </span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            )}

            {status === "success" && generatedUrl && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500 font-mono text-center">
                If your UPI app didn&apos;t open, pay manually to the UPI ID above
                using any UPI app.
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </section>
  );
}
