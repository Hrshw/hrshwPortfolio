"use client";

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface FeedbackEntry {
  id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  createdAt: string;
  linkedinUrl?: string;
  company?: string;
  project?: string;
  isVerifiedCollaborator?: boolean;
}

export interface SubmitPayload {
  name: string;
  role: string;
  rating: number;
  message: string;
  linkedinUrl?: string;
  project?: string;
}

export type SubmitStatus = "idle" | "loading" | "success" | "error";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedEntry, setSubmittedEntry] = useState<SubmitPayload | null>(null);

  // --- Fetch approved feedbacks ---
  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/feedback");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: FeedbackEntry[] = await res.json();
      setFeedbacks(data);
    } catch {
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // --- Submit a new feedback ---
  const submitFeedback = useCallback(async (payload: SubmitPayload) => {
    setSubmitStatus("loading");
    setSubmitError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          linkedinUrl: payload.linkedinUrl?.trim() || undefined,
          project: payload.project || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitStatus("error");
        return false;
      }

      setSubmittedEntry(payload);
      setSubmitStatus("success");
      return true;
    } catch {
      setSubmitError("Network error. Please check your connection.");
      setSubmitStatus("error");
      return false;
    }
  }, []);

  // --- Reset form to idle state ---
  const resetSubmit = useCallback(() => {
    setSubmitStatus("idle");
    setSubmitError(null);
    setSubmittedEntry(null);
  }, []);

  return {
    feedbacks,
    isLoading,
    submitFeedback,
    submitStatus,
    submitError,
    submittedEntry,
    resetSubmit,
  };
}
