"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Feedback } from "@/app/api/feedback/route";
import { ContactMessage } from "@/app/api/contact/route";
import { INQUIRY_STATUSES } from "@/lib/hire";
import type { Inquiry, InquiryStatus } from "@/lib/hire";

type Tab = "feedbacks" | "messages" | "inquiries";

type Donations = { count: number; totalAmount: number };

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

// ---------------------------------------------------------------------------
// Login gate
// ---------------------------------------------------------------------------
function LoginGate({
  onLogin,
  isLoading,
  error,
}: {
  onLogin: (passcode: string) => void;
  isLoading: boolean;
  error: string | null;
}) {
  const [passcode, setPasscode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    onLogin(passcode);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[#030303] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Admin Access</h1>
        <p className="text-zinc-500 mb-6 text-sm">
          Enter passcode to manage feedbacks and messages.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            autoComplete="current-password"
            className="w-full px-4 py-3 bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl outline-none focus:border-amber-400 text-zinc-900 dark:text-white"
          />
          {error && <p className="text-rose-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Login"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<Tab>("feedbacks");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [donations, setDonations] = useState<Donations | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 429) {
          setAuthenticated(false);
          setError(res.status === 429 ? "Too many attempts. Wait a few minutes." : "Invalid passcode.");
        } else {
          setError("Failed to fetch feedbacks.");
        }
        return;
      }
      const data = await res.json();
      setFeedbacks(data);
      setAuthenticated(true);
    } catch {
      setError("Network error.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/contact/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // Non-fatal — keep whatever we have.
    }
  }, []);

  const fetchDonations = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } catch {
      // Non-fatal.
    }
  }, []);

  const fetchInquiries = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/inquiries/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch {
      // Non-fatal.
    }
  }, []);

  const fetchEmailConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/hire/config");
      if (res.ok) {
        const data = await res.json();
        setEmailConfigured(data.emailConfigured);
      }
    } catch {
      // Non-fatal.
    }
  }, []);

  const handleLogin = (code: string) => {
    setPasscode(code);
    fetchFeedbacks(code);
    fetchMessages(code);
    fetchDonations(code);
    fetchInquiries(code);
    fetchEmailConfig();
  };

  // --- Donation actions ---
  const handleRecordDonation = async () => {
    let amount: number | undefined;
    if (donationAmount.trim()) {
      amount = Number(donationAmount);
      if (!Number.isFinite(amount) || amount < 1 || amount > 1000000) {
        alert("Enter a valid amount between 1 and 1000000 (max 2 decimals).");
        return;
      }
    }
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${passcode}`,
        },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
        setDonationAmount("");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to record donation.");
      }
    } catch {
      alert("Network error.");
    }
  };

  const handleResetDonations = async () => {
    if (!confirm("Reset the donation counter to zero?")) return;
    try {
      const res = await fetch("/api/donations", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${passcode}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } catch {
      alert("Network error.");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPasscode("");
    setFeedbacks([]);
    setMessages([]);
    setDonations(null);
    setDonationAmount("");
    setInquiries([]);
    setEmailConfigured(null);
  };

  // --- Inquiry actions ---
  const handleInquiryChange = async (
    id: string,
    patch: { status?: InquiryStatus; read?: boolean }
  ) => {
    try {
      const res = await fetch("/api/inquiries/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${passcode}`,
        },
        body: JSON.stringify({ id, ...patch }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
        );
      } else {
        alert("Failed to update inquiry.");
      }
    } catch {
      alert("Network error.");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    try {
      const res = await fetch(`/api/inquiries/admin?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${passcode}` },
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((q) => q.id !== id));
      } else {
        alert("Failed to delete inquiry.");
      }
    } catch {
      alert("Network error.");
    }
  };

  // --- Feedback actions ---
  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/feedback/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${passcode}`,
        },
        body: JSON.stringify({ id, approved: !currentStatus }),
      });
      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((fb) => (fb.id === id ? { ...fb, approved: !currentStatus } : fb))
        );
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Network error.");
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Delete this feedback permanently?")) return;
    try {
      const res = await fetch(`/api/feedback/admin?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${passcode}` },
      });
      if (res.ok) {
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
      } else {
        alert("Failed to delete feedback.");
      }
    } catch {
      alert("Network error.");
    }
  };

  // --- Message actions ---
  const handleToggleRead = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/contact/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${passcode}`,
        },
        body: JSON.stringify({ id, read: !current }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !current } : m))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    try {
      const res = await fetch(`/api/contact/admin?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${passcode}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete message.");
      }
    } catch {
      alert("Network error.");
    }
  };

  if (!authenticated) {
    return <LoginGate onLogin={handleLogin} isLoading={isLoading} error={error} />;
  }

  const unreadCount = messages.filter((m) => !m.read).length;
  const pendingCount = feedbacks.filter((f) => !f.approved).length;
  const newInquiryCount = inquiries.filter((q) => q.status === "new").length;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 pt-32 pb-24 px-8 md:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Admin</h1>
            <p className="text-zinc-500">Manage testimonials and inbox messages.</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Donations tracker — manual tick after each UPI payment */}
        <div className="mb-8 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold tracking-tight">
                  {donations?.count ?? "—"}
                </div>
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Donations
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {donations ? INR.format(donations.totalAmount) : "—"}
                </div>
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Total received
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">₹</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value.replace(/[^\d.]/g, ""))}
                  placeholder="Amount (optional)"
                  maxLength={10}
                  className="w-40 pl-7 pr-3 py-2 text-sm bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-emerald-400 text-zinc-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleRecordDonation}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                +1 Donation
              </button>
              <button
                onClick={handleResetDonations}
                className="px-4 py-2 text-sm font-medium rounded-lg border text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-black/5 dark:bg-white/5 rounded-full p-1.5 w-fit border border-black/10 dark:border-white/10">
          {(
            [
              { id: "feedbacks", label: "Feedbacks", count: pendingCount },
              { id: "messages", label: "Messages", count: unreadCount },
              { id: "inquiries", label: "Inquiries", count: newInquiryCount },
            ] as { id: Tab; label: string; count: number }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                tab === t.id
                  ? "text-white dark:text-black"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="adminTab"
                  className="absolute inset-0 bg-zinc-900 dark:bg-white rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {t.label}
              {t.count > 0 && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading && tab === "feedbacks" ? (
          <p>Loading feedbacks...</p>
        ) : tab === "feedbacks" ? (
          feedbacks.length === 0 ? (
            <p className="text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center rounded-3xl">
              No feedbacks found.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-semibold text-lg">{fb.name}</span>
                      {fb.role && <span className="text-sm text-zinc-500">({fb.role})</span>}
                      <span className="text-amber-500 text-sm flex items-center">★ {fb.rating}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">&ldquo;{fb.message}&rdquo;</p>
                    <div className="text-xs font-mono text-zinc-400">
                      {new Date(fb.createdAt).toLocaleString()} • IP Hash: {fb.ipHash.slice(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleToggleApprove(fb.id, fb.approved)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                        fb.approved
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                      }`}
                    >
                      {fb.approved ? "Approved (Live)" : "Pending (Hidden)"}
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(fb.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-rose-600 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === "messages" ? (
          messages.length === 0 ? (
            <p className="text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center rounded-3xl">
              No messages yet.
            </p>
          ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-6 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm transition-colors ${
                  m.read
                    ? "border-zinc-200 dark:border-zinc-800"
                    : "border-amber-400/40 dark:border-amber-400/30"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold">{m.name}</span>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {m.email}
                    </a>
                    {!m.read && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm whitespace-pre-wrap mb-4">
                  {m.message}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleRead(m.id, m.read)}
                    className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    {m.read ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-rose-600 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
        ) : (
          <div className="flex flex-col gap-4">
            {emailConfigured === false && (
              <div className="px-5 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-sm text-amber-600 dark:text-amber-400 font-mono">
                ⚠ Email notifications aren&apos;t configured — clients won&apos;t get
                confirmations and you won&apos;t get notified. Set SMTP_USER +
                SMTP_PASS (Gmail App Password) or RESEND_API_KEY to enable
                (notifications go to rahulsinghpilani7@gmail.com).
              </div>
            )}

            {inquiries.length === 0 ? (
              <p className="text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center rounded-3xl">
                No inquiries yet.
              </p>
            ) : (
              inquiries.map((q) => (
                <div
                  key={q.id}
                  className={`p-6 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm transition-colors ${
                    q.status === "new"
                      ? "border-emerald-400/40 dark:border-emerald-400/30"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold">{q.name}</span>
                      {q.company && (
                        <span className="text-sm text-zinc-500">({q.company})</span>
                      )}
                      <a
                        href={`mailto:${q.email}`}
                        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        {q.email}
                      </a>
                      {q.status === "new" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                          New
                        </span>
                      )}
                      {q.lang === "hi" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-medium">
                          हिंदी
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      {new Date(q.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {q.projectType}
                    </span>
                    {q.needs.map((n) => (
                      <span
                        key={n}
                        className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                      >
                        {n}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {q.budgetBand}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {q.timeline}
                    </span>
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-400 text-sm whitespace-pre-wrap mb-4">
                    {q.details}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={q.status}
                      onChange={(e) =>
                        handleInquiryChange(q.id, {
                          status: e.target.value as InquiryStatus,
                        })
                      }
                      className="px-3 py-2 text-sm font-medium rounded-lg border bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 outline-none focus:border-emerald-400"
                    >
                      {INQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <a
                      href={`mailto:${q.email}?subject=${encodeURIComponent(
                        `Re: your project inquiry — ${q.projectType}`
                      )}`}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => handleDeleteInquiry(q.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-rose-600 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
