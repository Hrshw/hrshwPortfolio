"use client";

import React from "react";

interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export default function Projects() {
  const projects: Project[] = [
    {
      title: "Observyze",
      category: "Real-time Operations & Analytics Platform",
      description:
        "An enterprise monitoring and coverage analytics platform built to automate performance tracking and code coverage insights. Integrates cloud pipelines and telemetry dashboard reporting.",
      technologies: ["React.js", "Node.js", "AWS", "Analytics Engine", "SaaS"],
      liveUrl: "https://observyze.com",
    },
    {
      title: "Env Secret Lock",
      category: "Developer Environment Secret Manager",
      description:
        "A developer environment secret manager and CLI tool designed to prevent secret sprawl. Secures API credentials, environment variables, and system configurations with encrypted access protocols.",
      technologies: ["Node.js", "TypeScript", "CLI", "Cryptography", "Security"],
      githubUrl: "https://github.com/Hrshw/env-secret-lock",
    },
    {
      title: "PulseGuard",
      category: "AI Server & Website Monitoring Platform",
      description:
        "A real-time monitoring SaaS that tracks website uptime, DNS modifications, SSL expirations, and server health. Uses AI-driven insights to detect traffic anomalies and includes an AWS EC2 controls integration to manage hosts.",
      technologies: ["Node.js", "React", "Python", "Redis", "AWS EC2", "AWS Route 53", "PayU"],
      liveUrl: "#",
    },
    {
      title: "SubTrackHub",
      category: "SaaS Cost Optimization Analyzer",
      description:
        "An enterprise SaaS analysis tool that hooks into cloud setups, maps active and idle instances, and calculates potential monthly/yearly savings. Uses LLMs to generate efficiency scores and automated reports.",
      technologies: ["Node.js", "React", "MongoDB", "AWS", "LLM APIs", "RAG"],
      liveUrl: "#",
    },
    {
      title: "VidVerbalize",
      category: "AI Short-Form Video Generator",
      description:
        "An AI system that transcribes YouTube/local media, analyzes key moments, overlays auto-generated subtitles, trims video ratios, and produces ready-to-share social media clips.",
      technologies: ["Node.js", "Python", "Whisper AI", "FFmpeg", "Social APIs"],
      githubUrl: "https://github.com/rahulsinghpilani7",
    },
    {
      title: "NFT Showcase Platform",
      category: "Crypto Asset Web Application",
      description:
        "A fully responsive Web3 showcase gallery hosting curated NFT collections. Configured static asset hosting on AWS S3 with Route 53 domain routing for highly optimized content delivery.",
      technologies: ["HTML5", "CSS3", "JavaScript", "AWS S3", "AWS Route 53"],
      githubUrl: "https://github.com/rahulsinghpilani7",
    },
  ];

  const triggerHighlight = (nodeName: string, active: boolean) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("node-highlight", { detail: { name: nodeName, active } })
      );
    }
  };

  return (
    <section id="projects">
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
          FEATURED_<span className="glow-text">PROJECTS</span>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {projects.map((project, index) => {
          // Map project instances to 3D background server nodes
          const targetNode = project.title === "PulseGuard"
            ? "Compute_EC2_Primary"
            : project.title === "SubTrackHub"
            ? "Orchestrator_EKS"
            : project.title === "VidVerbalize"
            ? "API_Gateway"
            : project.title === "Observyze"
            ? "Orchestrator_EKS"
            : project.title === "Env Secret Lock"
            ? "Compute_EC2_Backup"
            : "Database_RDS";

          return (
            <div
              key={index}
              className="glass-interactive"
              onMouseEnter={() => triggerHighlight(targetNode, true)}
              onMouseLeave={() => triggerHighlight(targetNode, false)}
              style={{
                borderRadius: "8px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Hover glow background card accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "80px",
                  height: "80px",
                  background: index % 2 === 0 ? "radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div>
                {/* Category */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  {project.category}
                </span>

                {/* Title */}
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: "var(--color-muted)",
                    fontSize: "1.02rem",
                    lineHeight: 1.5,
                    marginBottom: "1.25rem",
                  }}
                >
                  {project.description}
                </p>
              </div>

              <div>
                {/* Technologies */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    marginBottom: "1.25rem",
                  }}
                >
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        background: "rgba(255, 255, 255, 0.02)",
                        color: "var(--color-text)",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-secondary)",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Code ↗
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-primary)",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
