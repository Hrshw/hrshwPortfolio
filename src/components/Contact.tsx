"use client";

import React, { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Dispatch background interaction event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("terminal-command"));
    }

    // Simulate sending message
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <section id="contact">
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
          ESTABLISH_<span className="glow-text">CONNECTION</span>
        </h2>
        <p style={{ color: "var(--color-muted)", marginTop: "0.5rem", fontSize: "1.05rem" }}>
          Drop me a message to discuss cloud migrations, systems architecture, or full-stack software development.
        </p>
      </div>

      <div className="grid-cols-2">
        {/* Contact Info Card */}
        <div
          className="glass"
          style={{
            borderRadius: "8px",
            padding: "1.5rem", // Scaled up (was 1.25rem)
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.25rem" }}>Contact Details</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--color-muted)", display: "block", fontFamily: "var(--font-mono)" }}>EMAIL</span>
                <a href="mailto:rahulsinghpilani7@gmail.com" style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 500 }}>
                  rahulsinghpilani7@gmail.com
                </a>
              </div>

              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--color-muted)", display: "block", fontFamily: "var(--font-mono)" }}>PHONE</span>
                <span style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 500 }}>
                  +91 7082739587
                </span>
              </div>

              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--color-muted)", display: "block", fontFamily: "var(--font-mono)" }}>LOCATION</span>
                <span style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 500 }}>
                  Mumbai, India
                </span>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div style={{ marginTop: "2rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-muted)", display: "block", fontFamily: "var(--font-mono)", marginBottom: "0.75rem" }}>NETWORKS</span>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
              <a
                href="https://github.com/Hrshw"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "1rem", // Scaled up (was 0.85rem)
                  color: "var(--color-primary)",
                  fontWeight: 600,
                }}
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "1rem", // Scaled up (was 0.85rem)
                  color: "var(--color-secondary)",
                  fontWeight: 600,
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="glass"
          style={{
            borderRadius: "8px",
            padding: "1.5rem", // Scaled up (was 1.25rem)
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem", // Scaled up (was 0.7rem)
                color: "var(--color-muted)",
                fontFamily: "var(--font-mono)",
                marginBottom: "0.5rem",
              }}
            >
              YOUR NAME
            </label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-color)",
                padding: "0.65rem 1rem",
                borderRadius: "4px",
                color: "#fff",
                outline: "none",
                fontSize: "1.02rem", // Scaled up (was 0.9rem)
                transition: "var(--transition-smooth)",
              }}
              placeholder="e.g. Elon Musk"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem", // Scaled up
                color: "var(--color-muted)",
                fontFamily: "var(--font-mono)",
                marginBottom: "0.5rem",
              }}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-color)",
                padding: "0.65rem 1rem",
                borderRadius: "4px",
                color: "#fff",
                outline: "none",
                fontSize: "1.02rem", // Scaled up
                transition: "var(--transition-smooth)",
              }}
              placeholder="e.g. elon@spacex.com"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem", // Scaled up
                color: "var(--color-muted)",
                fontFamily: "var(--font-mono)",
                marginBottom: "0.5rem",
              }}
            >
              MESSAGE
            </label>
            <textarea
              required
              rows={3}
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-color)",
                padding: "0.65rem 1rem",
                borderRadius: "4px",
                color: "#fff",
                outline: "none",
                fontSize: "1.02rem", // Scaled up
                resize: "none",
                fontFamily: "inherit",
                transition: "var(--transition-smooth)",
              }}
              placeholder="How can I help you?"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary"
            style={{ width: "fit-content", alignSelf: "flex-start", marginTop: "0.25rem" }}
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p style={{ color: "var(--color-success)", fontSize: "0.9rem", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>
              ✓ Connection request sent successfully! Sparking server logs...
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
