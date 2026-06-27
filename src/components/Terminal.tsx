"use client";

import React, { useState, useRef, useEffect } from "react";

interface LogEntry {
  type: "input" | "output" | "error";
  text: string;
}

export default function Terminal() {
  const [history, setHistory] = useState<LogEntry[]>([
    { type: "output", text: "Welcome to Rahul Singh's Interactive Terminal OS v1.0.0" },
    { type: "output", text: "Type 'help' or 'ls' to see list of available commands." },
    { type: "output", text: "--------------------------------------------------------" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: "input" as const, text: `guest@rahulsingh:~$ ${cmd}` }];

    // Dispatch background interaction event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("terminal-command"));
    }

    switch (cleanCmd) {
      case "help":
      case "?":
        setHistory([
          ...newHistory,
          {
            type: "output",
            text: "Available commands: help | about | skills | projects | experience | contact | hack | clear",
          },
        ]);
        break;
      case "clear":
      case "cls":
        setHistory([]);
        break;
      case "about":
        setHistory([
          ...newHistory,
          {
            type: "output",
            text: "Rahul Singh Shekhawat - Full-Stack & Cloud Engineer based in Mumbai, India.",
          },
          {
            type: "output",
            text: "Experienced cloud developer with 3+ years of designing, developing, and deploying scalable web apps and cloud architectures (AWS stack: EC2, Lambda, S3, RDS, Athena, etc.).",
          },
        ]);
        break;
      case "skills":
        setHistory([
          ...newHistory,
          { type: "output", text: "► LANGUAGES: JavaScript, TypeScript, Python, PHP" },
          { type: "output", text: "► FRONTEND: React.js, Next.js, Redux, TailwindCSS, HTML/CSS" },
          { type: "output", text: "► BACKEND & DATABASES: Node.js, Express.js, MongoDB, PostgreSQL, DynamoDB" },
          { type: "output", text: "► CLOUD & DEVOPS: AWS (EC2, S3, Lambda, CloudWatch, QuickSight), Docker, CI/CD" },
          { type: "output", text: "► EMERGING TECH: LLM Integration, RAG (Retrieval-Augmented Generation), Agentic AI" },
        ]);
        break;
      case "projects":
        setHistory([
          ...newHistory,
          { type: "output", text: "⭐ Observyze - Real-time Operations & Analytics Platform. Demo: https://observyze.com" },
          { type: "output", text: "⭐ Env Secret Lock - Developer Environment Secret Manager (CLI). Code: https://github.com/Hrshw/env-secret-lock" },
          { type: "output", text: "⭐ PulseGuard - AI-Powered server & website health monitoring SaaS." },
          { type: "output", text: "⭐ SubTrackHub - Cloud & SaaS infrastructure cost optimization analyzer." },
          { type: "output", text: "⭐ VidVerbalize - AI platform for converting long YouTube videos into captions & shorts." },
          { type: "output", text: "⭐ NFT Showcase - Scalable static showcase hosted on S3 and Route 53." },
        ]);
        break;
      case "experience":
        setHistory([
          ...newHistory,
          { type: "output", text: "💼 Full-Stack Developer Intern | Envint Services LLP (Nov 2023 - Present)" },
          { type: "output", text: "💼 Software Engineer Intern | Finquant Technologies Pvt Ltd (2 Months)" },
          { type: "output", text: "💼 Web Developer Intern | PIEDS BITS Pilani (2023)" },
          { type: "output", text: "💼 Full-Stack Freelancer | Self-Employed (2022 - 2024)" },
        ]);
        break;
      case "contact":
        setHistory([
          ...newHistory,
          { type: "output", text: "📧 Email: rahulsinghpilani7@gmail.com" },
          { type: "output", text: "📞 Phone: +91 7082739587" },
          { type: "output", text: "🔗 GitHub: github.com/rahulsinghpilani7" },
          { type: "output", text: "🔗 LinkedIn: linkedin.com/in/rahul-singh-shekhawat" },
        ]);
        break;
      case "hack":
        setHistory([
          ...newHistory,
          { type: "output", text: "⚡ STACK OVERFLOW SIMULATION INITIALIZED..." },
          { type: "output", text: "⚡ INJECTING MALWARE IN MEMORY RANGE 0x7FFA... JUST KIDDING! :-)" },
          { type: "output", text: "⚡ EXECUTING PARTICLE ACCELERATOR... SEE BACKGROUND!" },
        ]);
        // Trigger extra explosions
        if (typeof window !== "undefined") {
          setTimeout(() => window.dispatchEvent(new Event("terminal-command")), 200);
          setTimeout(() => window.dispatchEvent(new Event("terminal-command")), 400);
          setTimeout(() => window.dispatchEvent(new Event("terminal-command")), 600);
        }
        break;
      default:
        setHistory([
          ...newHistory,
          {
            type: "error",
            text: `Command not found: '${cmd}'. Type 'help' to see list of valid commands.`,
          },
        ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
      setInputVal("");
    }
  };

  return (
    <div
      onClick={focusInput}
      className="glass"
      style={{
        borderRadius: "8px",
        height: "380px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
        cursor: "text",
        backgroundColor: "var(--bg-terminal)",
      }}
    >
      {/* Terminal Title Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.75rem 1rem",
          background: "rgba(3, 7, 18, 0.8)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div style={{ display: "flex", gap: "6px", marginRight: "1rem" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }} />
        </div>
        <div style={{ color: "var(--color-muted)", fontSize: "0.8rem", userSelect: "none" }}>
          guest@rahulsingh: ~ (next-sh)
        </div>
      </div>

      {/* Terminal Output Logs */}
      <div
        ref={logsContainerRef}
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          color: "#a7f3d0", // Light emerald terminal text
        }}
      >
        {history.map((entry, idx) => (
          <div
            key={idx}
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color:
                entry.type === "input"
                  ? "#38bdf8" // Cyan user input
                  : entry.type === "error"
                  ? "#fda4af" // Light rose error
                  : "#a7f3d0", // Emerald command outputs
            }}
          >
            {entry.text}
          </div>
        ))}
      </div>

      {/* Input Prompt */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.75rem 1rem",
          background: "rgba(3, 7, 18, 0.5)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <span style={{ color: "#38bdf8", marginRight: "8px" }}>guest@rahulsingh:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "#fff",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
          }}
          placeholder="Type a command..."
        />
      </div>
    </div>
  );
}
