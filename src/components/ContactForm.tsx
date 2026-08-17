"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME_MAX = 60;
const MESSAGE_MAX = 1000;

const inputClass =
  "w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 dark:focus:border-amber-400/50 transition-all duration-300 font-light";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
        {label}
      </label>
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — humans never see it
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Please enter your name (min 2 characters).";
    if (!EMAIL_RE.test(email.trim())) e.email = "Please enter a valid email address.";
    if (!message.trim() || message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
          website, // honeypot
          formStartedAt: startedAtRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.fields
            ? Object.values(data.fields)[0] as string
            : (data.error ?? "Something went wrong. Please try again.")
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setServerError("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — hidden from humans, irresistible to bots */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Name *" error={errors.name}>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            placeholder="e.g. Elon Musk"
            maxLength={NAME_MAX}
            className={inputClass}
            autoComplete="name"
          />
        </Field>

        <Field label="Email Address *" error={errors.email}>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="e.g. elon@spacex.com"
            maxLength={200}
            className={inputClass}
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label={`Message * (${message.length}/${MESSAGE_MAX})`} error={errors.message}>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setErrors((p) => ({ ...p, message: "" }));
          }}
          placeholder="Tell me about your project, question, or idea..."
          maxLength={MESSAGE_MAX}
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

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 font-mono"
          >
            ✓ Message sent! I&apos;ll get back to you soon.
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
            Sending…
          </>
        ) : (
          <>Send Message</>
        )}
      </motion.button>
    </form>
  );
}
