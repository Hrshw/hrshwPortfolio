"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Feedback } from "@/app/api/feedback/route";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
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
        if (res.status === 401) {
          setAuthenticated(false);
          setError("Invalid passcode.");
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    fetchFeedbacks(passcode);
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
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

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-[#030303] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Admin Access</h1>
          <p className="text-zinc-500 mb-6 text-sm">Enter passcode to manage feedbacks.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
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

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 pt-32 pb-24 px-8 md:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Feedback Admin</h1>
            <p className="text-zinc-500">Manage your portfolio testimonials.</p>
          </div>
          <button
            onClick={() => {
              setAuthenticated(false);
              setPasscode("");
            }}
            className="text-sm px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {isLoading ? (
          <p>Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
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
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-lg">{fb.name}</span>
                    {fb.role && <span className="text-sm text-zinc-500">({fb.role})</span>}
                    <span className="text-amber-500 text-sm flex items-center">
                      ★ {fb.rating}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">"{fb.message}"</p>
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
                    onClick={() => handleDelete(fb.id)}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-rose-600 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
